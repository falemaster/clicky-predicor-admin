import type { CompanyFullData } from '@/types/api';

export interface FinancialScore {
  score: number;
  source: 'infogreffe' | 'pappers' | 'predictor' | 'unavailable';
  sourceLabel: string;
  details?: {
    notapme?: {
      performance: number;
      solvabilite: number;
      rentabilite: number;
      robustesse: number;
    };
    afdcc?: {
      notation: string;
      score: number;
      risque: 'Faible' | 'Modéré' | 'Élevé';
    };
  };
}

export interface RiskScore {
  score: number;
  source: 'infogreffe' | 'rubypayeur' | 'predictor' | 'unavailable';
  sourceLabel: string;
  paymentBehavior?: {
    delaisMoyens: number;
    incidents: number;
    tendance: string;
  };
}

/**
 * Calcule le score financier en priorisant Pappers puis Infogreffe NOTAPME
 */
export function calculateFinancialScore(companyData: CompanyFullData): FinancialScore {
  // PRIORITÉ 1: Scores calculés depuis les bilans Pappers
  const bilansData = (companyData.pappers as any)?.bilansSummary || companyData.pappers?.bilans;
  if (bilansData && bilansData.length > 0) {
    const latestBilan = bilansData[0];
    
    // Calcul amélioré basé sur les ratios financiers
    let score = 5; // Score neutre
    
    if (latestBilan.chiffreAffaires > 0) {
      const ratio = (latestBilan.resultatNet || 0) / latestBilan.chiffreAffaires;
      if (ratio > 0.1) score = 8;      // Très rentable
      else if (ratio > 0.05) score = 7; // Rentable
      else if (ratio > 0) score = 6;    // Légèrement positif
      else if (ratio > -0.05) score = 4; // Légèrement négatif
      else score = 3;                   // Difficultés
      
      // Ajustement selon l'endettement si disponible
      if (latestBilan.dettes && latestBilan.totalActif) {
        const ratioEndettement = latestBilan.dettes / latestBilan.totalActif;
        if (ratioEndettement > 0.8) score = Math.max(score - 1, 1); // Très endetté
        else if (ratioEndettement < 0.3) score = Math.min(score + 1, 10); // Peu endetté
      }
    }
    
    return {
      score: Math.min(Math.max(Math.round(score), 1), 10),
      source: 'pappers',
      sourceLabel: 'Calculé depuis bilans Pappers'
    };
  }

  // PRIORITÉ 2: Score NOTAPME Performance d'Infogreffe (fallback)
  const notapmeData = (companyData.infogreffe as any)?.notapmePerformance;
  if (notapmeData) {
    // Calculer score composite basé sur les indices NOTAPME
    const performanceScore = notapmeData.scorePerformance || notapmeData.performance || 0;
    const solvabiliteScore = notapmeData.indiceSolvabilite || notapmeData.solvabilite || 0;
    const rentabiliteScore = notapmeData.indiceRentabilite || notapmeData.rentabilite || 0;
    const robustesseScore = notapmeData.indiceRobustesse || notapmeData.robustesse || 0;
    
    // Score composite pondéré
    const compositeScore = Math.round(
      (performanceScore * 0.4 + solvabiliteScore * 0.3 + rentabiliteScore * 0.2 + robustesseScore * 0.1)
    );
    
    return {
      score: Math.min(Math.max(compositeScore, 1), 10), // Entre 1 et 10
      source: 'infogreffe',
      sourceLabel: 'Infogreffe NOTAPME',
      details: {
        notapme: {
          performance: performanceScore,
          solvabilite: solvabiliteScore,
          rentabilite: rentabiliteScore,
          robustesse: robustesseScore
        }
      }
    };
  }

  // PRIORITÉ 3: Analyse prédictive interne
  const predictorScore = (companyData.predictor as any)?.scoreFinancier || (companyData.predictor as any)?.scoreEconomique;
  if (predictorScore !== undefined) {
    return {
      score: Math.min(Math.max(Math.round(predictorScore), 1), 10),
      source: 'predictor',
      sourceLabel: 'Analyse prédictive'
    };
  }

  // Aucune source disponible
  return {
    score: 0,
    source: 'unavailable',
    sourceLabel: 'Score non disponible'
  };
}

/**
 * Calcule le score de risque en priorisant RubyPayeur puis Infogreffe AFDCC
 */
export function calculateRiskScore(companyData: CompanyFullData): RiskScore {
  // PRIORITÉ 1: RubyPayeur (service de paiement prioritaire)
  const rubyData = companyData.rubyPayeur as any;
  if (rubyData && rubyData.source !== 'service_unavailable' && rubyData.source !== 'auth_failed' && rubyData.source !== 'api_error') {
    // Service RubyPayeur opérationnel avec vraies données
    const globalScore = rubyData.scoreGlobal || rubyData.scorePaiement || 5;
    
    // Convertir le score RubyPayeur (0-100) vers échelle 1-10
    let convertedScore = globalScore;
    if (globalScore > 10) {
      // Si le score est sur 100, le convertir
      convertedScore = Math.round((globalScore / 100) * 10);
    }
    
    return {
      score: Math.min(Math.max(convertedScore, 1), 10),
      source: 'rubypayeur',
      sourceLabel: 'RubyPayeur',
      paymentBehavior: {
        delaisMoyens: rubyData.retardsMoyens || 0,
        incidents: rubyData.nbIncidents || 0,
        tendance: rubyData.tendance || 'Stable'
      }
    };
  }

  // PRIORITÉ 2: Score AFDCC d'Infogreffe (fallback)
  const afdccData = (companyData.infogreffe as any)?.afdccScore;
  if (afdccData) {
    // Mapper la notation AFDCC vers un score 1-10
    let score = 5;
    const notation = afdccData.notation || afdccData.score || afdccData.note;
    
    if (typeof notation === 'string') {
      const notationUpper = notation.toUpperCase();
      if (notationUpper.includes('AAA') || notationUpper.includes('AA')) score = 9;
      else if (notationUpper.includes('A')) score = 8;
      else if (notationUpper.includes('BBB')) score = 7;
      else if (notationUpper.includes('BB')) score = 6;
      else if (notationUpper.includes('B')) score = 4;
      else if (notationUpper.includes('CCC') || notationUpper.includes('CC')) score = 3;
      else if (notationUpper.includes('C')) score = 2;
      else if (notationUpper.includes('D')) score = 1;
    } else if (typeof notation === 'number') {
      score = Math.min(Math.max(Math.round(notation), 1), 10);
    }
    
    return {
      score,
      source: 'infogreffe',
      sourceLabel: 'Infogreffe AFDCC'
    };
  }

  // PRIORITÉ 3: Analyse prédictive interne
  const predictorRiskScore = (companyData.predictor as any)?.scoreRisque || (companyData.predictor as any)?.risqueDefaillance;
  if (predictorRiskScore !== undefined) {
    return {
      score: Math.min(Math.max(Math.round(predictorRiskScore), 1), 10),
      source: 'predictor',
      sourceLabel: 'Analyse prédictive'
    };
  }

  // Aucune source disponible
  return {
    score: 0,
    source: 'unavailable',
    sourceLabel: 'Score non disponible'
  };
}

/**
 * Détermine si RubyPayeur est disponible
 */
export function isRubyPayeurAvailable(companyData: CompanyFullData): boolean {
  const rubyData = companyData.rubyPayeur as any;
  return !!(
    rubyData && 
    !rubyData.serviceStatus && 
    !rubyData.source?.includes('unavailable')
  );
}

/**
 * Obtient le message d'état pour RubyPayeur
 */
export function getRubyPayeurStatus(companyData: CompanyFullData): string {
  const rubyData = companyData.rubyPayeur as any;
  
  if (!rubyData) {
    return 'Service non interrogé';
  }
  
  if (rubyData.serviceStatus === 'indisponible') {
    return rubyData.message || 'Service temporairement indisponible';
  }
  
  if (rubyData.serviceStatus === 'erreur') {
    return 'Erreur technique du service';
  }
  
  return 'Service opérationnel';
}