import type { CompanyFullData } from '@/types/api';
import { calculateHybridScore, type HybridScoreResult } from './hybridScoreCalculator';

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
 * Calcule le score hybride moderne avec tous les indicateurs disponibles
 */
export function calculateModernScore(companyData: CompanyFullData): HybridScoreResult {
  return calculateHybridScore(companyData);
}

/**
 * Calcule le score financier en priorisant Infogreffe NOTAPME puis les autres sources
 */
export function calculateFinancialScore(companyData: CompanyFullData): FinancialScore {
  // PRIORITÉ 1: Score NOTAPME Performance d'Infogreffe
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

  // PRIORITÉ 2: Scores calculés depuis les bilans Pappers
  const bilansData = (companyData.pappers as any)?.bilansSummary || companyData.pappers?.bilans;
  if (bilansData && bilansData.length > 0) {
    const latestBilan = bilansData[0];
    
    // Calcul simple basé sur les ratios financiers
    let score = 5; // Score neutre
    
    if (latestBilan.chiffreAffaires > 0) {
      const ratio = (latestBilan.resultatNet || 0) / latestBilan.chiffreAffaires;
      if (ratio > 0.1) score = 8;      // Très rentable
      else if (ratio > 0.05) score = 7; // Rentable
      else if (ratio > 0) score = 6;    // Légèrement positif
      else if (ratio > -0.05) score = 4; // Légèrement négatif
      else score = 3;                   // Difficultés
    }
    
    return {
      score: Math.min(Math.max(Math.round(score), 1), 10),
      source: 'pappers',
      sourceLabel: 'Calculé depuis bilans Pappers'
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
 * Calcule le score de risque en priorisant Infogreffe AFDCC puis RubyPayeur
 */
export function calculateRiskScore(companyData: CompanyFullData): RiskScore {
  // PRIORITÉ 1: Score AFDCC d'Infogreffe
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

  // PRIORITÉ 2: RubyPayeur (uniquement si service fonctionnel)
  const rubyData = companyData.rubyPayeur as any;
  if (rubyData && !rubyData.serviceStatus) {
    // Service RubyPayeur opérationnel
    const globalScore = rubyData.scoreGlobal || rubyData.scorePaiement || 5;
    
    return {
      score: Math.min(Math.max(Math.round(globalScore), 1), 10),
      source: 'rubypayeur',
      sourceLabel: 'RubyPayeur',
      paymentBehavior: {
        delaisMoyens: rubyData.retardsMoyens || 0,
        incidents: rubyData.nbIncidents || 0,
        tendance: rubyData.tendance || 'Stable'
      }
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