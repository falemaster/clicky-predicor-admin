import type { CompanyFullData } from '@/types/api';
import { calculateFallbackScore } from './fallbackScoreCalculator';

export interface HybridScoreResult {
  globalScore: number; // Score global sur 100
  subScores: {
    economic: { score: number; weight: number; reliability: number };
    legal: { score: number; weight: number; reliability: number };
    financial: { score: number; weight: number; reliability: number };
    risk: { score: number; weight: number; reliability: number };
  };
  reliability: {
    overall: number; // 0-100% fiabilité globale
    sources: string[];
    hasRecentFinancialData: boolean;
    hasPremiumData: boolean;
  };
  recommendations: {
    needsPremiumAnalysis: boolean;
    suggestedEndpoints: string[];
    potentialImprovement: number; // Points supplémentaires estimés
  };
  isFallback: boolean;
  explanation: string;
}

/**
 * Calcule un score hybride sur 100 points combinant toutes les sources disponibles
 */
export function calculateHybridScore(companyData: CompanyFullData): HybridScoreResult {
  // Poids des sous-scores (doivent sommer à 100%)
  const weights = {
    economic: 0.40,
    legal: 0.25,
    financial: 0.20,
    risk: 0.15
  };

  // Calcul des sous-scores
  const economicScore = calculateEconomicScore(companyData);
  const legalScore = calculateLegalScore(companyData);
  const financialScore = calculateFinancialScore(companyData);
  const riskScore = calculateRiskScore(companyData);

  // Score global pondéré
  const globalScore = Math.round(
    economicScore.score * weights.economic +
    legalScore.score * weights.legal +
    financialScore.score * weights.financial +
    riskScore.score * weights.risk
  );

  // Évaluation de la fiabilité
  const reliability = calculateReliability(companyData);

  // Recommandations
  const recommendations = generateRecommendations(companyData, globalScore, reliability);

  // Explication du scoring
  const explanation = generateExplanation(globalScore, reliability, recommendations);

  return {
    globalScore,
    subScores: {
      economic: { ...economicScore, weight: weights.economic },
      legal: { ...legalScore, weight: weights.legal },
      financial: { ...financialScore, weight: weights.financial },
      risk: { ...riskScore, weight: weights.risk }
    },
    reliability,
    recommendations,
    isFallback: !reliability.hasRecentFinancialData,
    explanation
  };
}

/**
 * Score économique basé sur les indicateurs d'activité (40% du score final)
 */
function calculateEconomicScore(companyData: CompanyFullData): { score: number; reliability: number } {
  let score = 50; // Base neutre
  let reliability = 30; // Base faible

  // Analyse du chiffre d'affaires et de la croissance
  if (companyData.pappers?.bilans?.length > 0) {
    const bilans = companyData.pappers.bilans.sort((a, b) => b.annee - a.annee);
    const latest = bilans[0];
    reliability += 40;

    // Évaluation du CA
    if (latest.chiffreAffaires > 10000000) score += 25; // >10M€
    else if (latest.chiffreAffaires > 1000000) score += 20; // >1M€
    else if (latest.chiffreAffaires > 100000) score += 10; // >100k€
    else if (latest.chiffreAffaires < 10000) score -= 15; // <10k€

    // Croissance si plusieurs années
    if (bilans.length > 1) {
      const previous = bilans[1];
      const growth = (latest.chiffreAffaires - previous.chiffreAffaires) / previous.chiffreAffaires;
      if (growth > 0.2) score += 15; // +20%
      else if (growth > 0.1) score += 10; // +10%
      else if (growth > 0) score += 5; // Positif
      else if (growth < -0.2) score -= 20; // -20%
      else if (growth < -0.1) score -= 10; // -10%
      
      reliability += 20;
    }

    // Effectifs
    if (latest.effectifs > 50) score += 15;
    else if (latest.effectifs > 10) score += 10;
    else if (latest.effectifs > 0) score += 5;
    else score -= 10; // Pas d'employés

    // Rentabilité
    if (latest.resultatNet > 0) {
      const marge = latest.resultatNet / latest.chiffreAffaires;
      if (marge > 0.15) score += 20; // >15%
      else if (marge > 0.05) score += 10; // >5%
      else if (marge > 0) score += 5; // Positif
    } else {
      score -= 15; // Perte
    }
  } else {
    // Fallback vers SIRENE
    if (companyData.sirene?.effectifs && companyData.sirene.effectifs !== 'NN') {
      const effectifs = parseInt(companyData.sirene.effectifs);
      if (effectifs > 10) score += 10;
      else if (effectifs > 0) score += 5;
      reliability += 15;
    }
  }

  // Secteur d'activité (codes NAF à risque)
  if (companyData.sirene?.naf) {
    const naf = companyData.sirene.naf;
    // Secteurs à risque élevé
    if (naf.startsWith('56') || naf.startsWith('47') || naf.startsWith('41')) {
      score -= 10; // Restauration, commerce, construction
    }
    // Secteurs stables
    else if (naf.startsWith('62') || naf.startsWith('71') || naf.startsWith('86')) {
      score += 5; // Tech, ingénierie, santé
    }
    reliability += 10;
  }

  return { 
    score: Math.max(0, Math.min(100, score)), 
    reliability: Math.min(100, reliability) 
  };
}

/**
 * Score légal basé sur la conformité et les procédures (25% du score final)
 */
function calculateLegalScore(companyData: CompanyFullData): { score: number; reliability: number } {
  let score = 80; // Base optimiste (absence de problème = bon)
  let reliability = 60; // Données souvent disponibles

  // Utilise la logique du fallback calculator pour la cohérence
  const fallbackResult = calculateFallbackScore(companyData);
  
  // Procédures collectives
  if (fallbackResult.breakdown.proceduresLegales.penalite > 0) {
    score -= fallbackResult.breakdown.proceduresLegales.penalite;
    reliability += 30; // Information importante confirmée
  }

  // Obligations légales
  if (fallbackResult.breakdown.obligationsLegales.penalite > 0) {
    score -= Math.min(30, fallbackResult.breakdown.obligationsLegales.penalite);
  }

  // Forme juridique et complexité
  if (companyData.pappers?.formeJuridique) {
    const forme = companyData.pappers.formeJuridique;
    if (forme.includes('SA') || forme.includes('SAS')) {
      score += 5; // Structures plus formalisées
    }
    reliability += 10;
  }

  return { 
    score: Math.max(0, Math.min(100, score)), 
    reliability: Math.min(100, reliability) 
  };
}

/**
 * Score financier basé sur les bilans et ratios (20% du score final)
 */
function calculateFinancialScore(companyData: CompanyFullData): { score: number; reliability: number } {
  let score = 50; // Base neutre
  let reliability = 20; // Données souvent manquantes

  // Scores Infogreffe premium (haute fiabilité)
  if (companyData.infogreffe?.notapmeScores) {
    const notapme = companyData.infogreffe.notapmeScores;
    score = (notapme.indicePerformanceFinanciere / 20) * 100; // Convert to 0-100
    reliability = 95;
    return { score: Math.max(0, Math.min(100, score)), reliability };
  }

  // Fallback vers bilans Pappers
  if (companyData.pappers?.bilans?.length > 0) {
    const latest = companyData.pappers.bilans[0];
    reliability = 70;

    // Ratios financiers basiques
    if (latest.chiffreAffaires > 0) {
      // Rentabilité
      const marge = latest.resultatNet / latest.chiffreAffaires;
      if (marge > 0.15) score += 30;
      else if (marge > 0.05) score += 20;
      else if (marge > 0) score += 10;
      else if (marge < -0.1) score -= 20;

      // Endettement vs fonds propres
      if (latest.fondsPropresBruts > 0) {
        const ratioEndettement = latest.dettes / latest.fondsPropresBruts;
        if (ratioEndettement < 0.5) score += 15;
        else if (ratioEndettement < 1) score += 10;
        else if (ratioEndettement > 3) score -= 20;
        else if (ratioEndettement > 2) score -= 10;
      }

      // Taille économique
      if (latest.chiffreAffaires > 1000000) score += 10;
      else if (latest.chiffreAffaires < 50000) score -= 10;
    }
  }

  return { 
    score: Math.max(0, Math.min(100, score)), 
    reliability: Math.min(100, reliability) 
  };
}

/**
 * Score de risque basé sur les incidents et prédictions (15% du score final)
 */
function calculateRiskScore(companyData: CompanyFullData): { score: number; reliability: number } {
  let score = 80; // Base optimiste
  let reliability = 40;

  // Score AFDCC Infogreffe (premium)
  if (companyData.infogreffe?.afdccScore) {
    // AFDCC donne une note de risque - on inverse pour score positif
    const afdccNote = parseFloat(companyData.infogreffe.afdccScore.note);
    if (!isNaN(afdccNote)) {
      score = Math.max(0, 100 - (afdccNote * 5)); // Conversion approximative
      reliability = 95;
      return { score, reliability };
    }
  }

  // RubyPayeur data
  if (companyData.rubyPayeur && !companyData.rubyPayeur.error) {
    reliability += 40;
    
    // Score global RubyPayeur (inversé car c'est un score de risque)
    if (companyData.rubyPayeur.scoreGlobal) {
      score = Math.max(0, companyData.rubyPayeur.scoreGlobal);
    }

    // Incidents de paiement
    if (companyData.rubyPayeur.nbIncidents > 0) {
      score -= Math.min(30, companyData.rubyPayeur.nbIncidents * 5);
    }

    // Retards moyens
    if (companyData.rubyPayeur.retardsMoyens > 30) {
      score -= 15;
    } else if (companyData.rubyPayeur.retardsMoyens > 60) {
      score -= 25;
    }
  }

  // Predictor analysis
  if (companyData.predictor?.scores) {
    reliability += 20;
    const predictorGlobal = companyData.predictor.scores.global;
    if (predictorGlobal > 0) {
      score = Math.max(score, predictorGlobal); // Prend le meilleur des deux
    }
  }

  // Procédures actives (impact fort sur risque)
  if (companyData.bodacc?.annonces?.some(a => a.type === 'Procédure collective')) {
    score -= 40;
    reliability += 20;
  }

  return { 
    score: Math.max(0, Math.min(100, score)), 
    reliability: Math.min(100, reliability) 
  };
}

/**
 * Calcule la fiabilité globale de l'analyse
 */
function calculateReliability(companyData: CompanyFullData): HybridScoreResult['reliability'] {
  const sources: string[] = [];
  let totalReliability = 0;
  let sourceCount = 0;

  // Sources disponibles
  if (companyData.sirene) {
    sources.push('SIRENE');
    totalReliability += 60;
    sourceCount++;
  }
  
  if (companyData.pappers && companyData.pappers.bilans?.length > 0) {
    sources.push('Pappers');
    totalReliability += 70;
    sourceCount++;
  }
  
  if (companyData.bodacc) {
    sources.push('BODACC');
    totalReliability += 50;
    sourceCount++;
  }
  
  if (companyData.rubyPayeur && !companyData.rubyPayeur.error) {
    sources.push('RubyPayeur');
    totalReliability += 80;
    sourceCount++;
  }

  // Sources premium
  let hasPremiumData = false;
  if (companyData.infogreffe?.notapmeScores || companyData.infogreffe?.afdccScore) {
    sources.push('Infogreffe Premium');
    totalReliability += 95;
    sourceCount++;
    hasPremiumData = true;
  }

  // Données financières récentes
  const hasRecentFinancialData = !!(
    companyData.pappers?.bilans?.some(b => b.annee >= new Date().getFullYear() - 2) ||
    companyData.infogreffe?.notapmeScores
  );

  const overallReliability = sourceCount > 0 ? Math.round(totalReliability / sourceCount) : 30;

  return {
    overall: overallReliability,
    sources,
    hasRecentFinancialData,
    hasPremiumData
  };
}

/**
 * Génère les recommandations d'amélioration
 */
function generateRecommendations(
  companyData: CompanyFullData, 
  globalScore: number, 
  reliability: HybridScoreResult['reliability']
): HybridScoreResult['recommendations'] {
  const suggestedEndpoints: string[] = [];
  let potentialImprovement = 0;
  
  // Si pas de données financières récentes
  if (!reliability.hasRecentFinancialData) {
    if (!companyData.infogreffe?.notapmeScores) {
      suggestedEndpoints.push('NOTAPME Essentiel');
      potentialImprovement += 15;
    }
  }

  // Si pas de score de risque fiable
  if (!companyData.infogreffe?.afdccScore && !companyData.rubyPayeur?.scoreGlobal) {
    suggestedEndpoints.push('AFDCC Score');
    potentialImprovement += 10;
  }

  // Si score moyen et pas d'analyse premium
  if (globalScore < 70 && !reliability.hasPremiumData) {
    suggestedEndpoints.push('NOTAPME Performance');
    potentialImprovement += 20;
  }

  return {
    needsPremiumAnalysis: suggestedEndpoints.length > 0,
    suggestedEndpoints,
    potentialImprovement: Math.min(25, potentialImprovement) // Cap à 25 points
  };
}

/**
 * Génère l'explication textuelle du score
 */
function generateExplanation(
  globalScore: number, 
  reliability: HybridScoreResult['reliability'],
  recommendations: HybridScoreResult['recommendations']
): string {
  let explanation = `Score global de ${globalScore}/100 `;
  
  if (reliability.overall >= 80) {
    explanation += 'basé sur des données fiables et récentes';
  } else if (reliability.overall >= 60) {
    explanation += 'basé sur des données partielles mais pertinentes';
  } else {
    explanation += 'basé sur des données limitées - analyse approximative';
  }

  explanation += ` (sources: ${reliability.sources.join(', ')}).`;

  if (recommendations.needsPremiumAnalysis) {
    explanation += ` Une analyse premium pourrait améliorer la précision de ${recommendations.potentialImprovement} points.`;
  }

  return explanation;
}