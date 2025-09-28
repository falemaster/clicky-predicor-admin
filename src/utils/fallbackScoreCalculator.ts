import type { CompanyFullData } from '@/types/api';

export interface FallbackScoreResult {
  score: number; // Score final plafonné à 70
  isFallback: true;
  reason: string;
  explanation: string;
  breakdown: {
    obligationsLegales: {
      penalite: number;
      details: string[];
    };
    proceduresLegales: {
      penalite: number;
      details: string[];
    };
    paiementsReputation: {
      penalite: number;
      bonus: number;
      details: string[];
    };
    profilStructurel: {
      penalite: number;
      details: string[];
    };
  };
}

/**
 * Calcule le score global secondaire (fallback) basé sur les signaux faibles
 * Plafonné à 70/100 maximum
 */
export function calculateFallbackScore(companyData: CompanyFullData): FallbackScoreResult {
  let scoreBase = 100;
  let totalBonus = 0;
  
  const breakdown = {
    obligationsLegales: { penalite: 0, details: [] as string[] },
    proceduresLegales: { penalite: 0, details: [] as string[] },
    paiementsReputation: { penalite: 0, bonus: 0, details: [] as string[] },
    profilStructurel: { penalite: 0, details: [] as string[] }
  };

  // 1. OBLIGATIONS LÉGALES (40% du poids) - Pénalités max: 40 points
  const obligationsLegales = analyzeObligationsLegales(companyData);
  breakdown.obligationsLegales = obligationsLegales;
  scoreBase -= obligationsLegales.penalite;

  // 2. PROCÉDURES LÉGALES (30% du poids) - Pénalités max: 30 points  
  const proceduresLegales = analyzeProceduresLegales(companyData);
  breakdown.proceduresLegales = proceduresLegales;
  scoreBase -= proceduresLegales.penalite;

  // 3. PAIEMENTS & RÉPUTATION (20% du poids) - Pénalités max: 20 points, Bonus max: 10 points
  const paiementsReputation = analyzePaiementsReputation(companyData);
  breakdown.paiementsReputation = paiementsReputation;
  scoreBase -= paiementsReputation.penalite;
  totalBonus += paiementsReputation.bonus;

  // 4. PROFIL STRUCTUREL (10% du poids) - Pénalités max: 10 points
  const profilStructurel = analyzeProfilStructurel(companyData);
  breakdown.profilStructurel = profilStructurel;
  scoreBase -= profilStructurel.penalite;

  // Score final avec bonus mais plafonné à 70
  const finalScore = Math.min(70, Math.max(0, scoreBase + totalBonus));
  
  // Génération automatique d'explications
  const explanation = generateExplanation(finalScore, breakdown, companyData);
  const reason = determineReason(companyData);

  return {
    score: Math.round(finalScore),
    isFallback: true,
    reason,
    explanation,
    breakdown
  };
}

/**
 * Analyse les obligations légales (40%)
 */
function analyzeObligationsLegales(companyData: CompanyFullData) {
  let penalite = 0;
  const details: string[] = [];
  
  // Retards de dépôt des comptes (0-25 points)
  const depotComptes = companyData.pappers?.depotComptes;
  if (depotComptes === false || (companyData.pappers?.bilans?.length === 0)) {
    const dateCreation = companyData.sirene?.dateCreation;
    if (dateCreation) {
      const ageAnnees = (new Date().getTime() - new Date(dateCreation).getTime()) / (365 * 24 * 60 * 60 * 1000);
      if (ageAnnees > 2) {
        penalite += 25;
        details.push('Absence de dépôt de comptes depuis 2+ ans');
      } else if (ageAnnees > 1) {
        penalite += 15;
        details.push('Retard dans le dépôt des comptes annuels');
      }
    }
  }

  // Obligations administratives manquantes (0-15 points)
  const hasBasicInfo = !!(companyData.sirene?.denomination && companyData.sirene?.adresse);
  if (!hasBasicInfo) {
    penalite += 15;
    details.push('Informations administratives incomplètes');
  }

  return { penalite: Math.min(40, penalite), details };
}

/**
 * Analyse les procédures légales (30%)
 */
function analyzeProceduresLegales(companyData: CompanyFullData) {
  let penalite = 0;
  const details: string[] = [];

  // Procédures collectives actives (0-20 points)
  const procedures = companyData.bodacc?.annonces?.filter(a => 
    a.type === 'Procédure collective' && 
    new Date(a.date) > new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000)
  ) || [];

  if (procedures.length > 0) {
    const procedureRecente = procedures.find(p => 
      new Date(p.date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    );
    
    if (procedureRecente) {
      penalite += 20;
      details.push(`Procédure collective récente: ${procedureRecente.contenu}`);
    } else {
      penalite += 10;
      details.push('Antécédents de procédures collectives');
    }
  }

  // Injonctions et nantissements (0-10 points)
  const infogreffeData = companyData.infogreffe as any;
  if (infogreffeData?.procedures?.length > 0) {
    penalite += 5;
    details.push('Procédures judiciaires en cours');
  }

  return { penalite: Math.min(30, penalite), details };
}

/**
 * Analyse paiements et réputation (20%)
 */
function analyzePaiementsReputation(companyData: CompanyFullData) {
  let penalite = 0;
  let bonus = 0;
  const details: string[] = [];

  // Données RubyPayeur si disponibles
  const rubyData = companyData.rubyPayeur as any;
  if (rubyData && !rubyData.serviceStatus) {
    // Service opérationnel
    if (rubyData.nbIncidents > 5) {
      penalite += 15;
      details.push(`${rubyData.nbIncidents} incidents de paiement recensés`);
    } else if (rubyData.nbIncidents > 2) {
      penalite += 8;
      details.push('Quelques incidents de paiement');
    }

    if (rubyData.retardsMoyens > 30) {
      penalite += 5;
      details.push(`Retards moyens: ${rubyData.retardsMoyens} jours`);
    }

    // Bonus bon payeur
    if (rubyData.nbIncidents === 0 && rubyData.retardsMoyens < 10) {
      bonus += 8;
      details.push('Excellent comportement de paiement');
    } else if (rubyData.nbIncidents < 2 && rubyData.retardsMoyens < 20) {
      bonus += 4;
      details.push('Bon comportement de paiement');
    }
  } else {
    // RubyPayeur indisponible - pénalité modérée
    penalite += 5;
    details.push('Données de paiement non disponibles');
  }

  return { 
    penalite: Math.min(20, penalite), 
    bonus: Math.min(10, bonus),
    details 
  };
}

/**
 * Analyse du profil structurel (10%)
 */
function analyzeProfilStructurel(companyData: CompanyFullData) {
  let penalite = 0;
  const details: string[] = [];

  // Entreprise très jeune (< 2 ans)
  const dateCreation = companyData.sirene?.dateCreation;
  if (dateCreation) {
    const ageAnnees = (new Date().getTime() - new Date(dateCreation).getTime()) / (365 * 24 * 60 * 60 * 1000);
    if (ageAnnees < 2) {
      penalite += 5;
      details.push(`Entreprise jeune: ${Math.round(ageAnnees * 10) / 10} ans`);
    }
  }

  // Effectif à zéro
  const effectifs = companyData.sirene?.effectifs;
  if (effectifs && (effectifs.includes('0') || effectifs === '0 salarié')) {
    penalite += 3;
    details.push('Aucun salarié déclaré');
  }

  // Secteurs à risque (codes NAF spécifiques)
  const naf = companyData.sirene?.naf;
  const secteursRisque = ['47', '56', '68.2', '77', '81', '95']; // Commerce détail, restauration, location immobilière, etc.
  if (naf && secteursRisque.some(secteur => naf.startsWith(secteur))) {
    penalite += 2;
    details.push('Secteur d\'activité à risque élevé');
  }

  return { penalite: Math.min(10, penalite), details };
}

/**
 * Génère une explication contextuelle du score
 */
function generateExplanation(score: number, breakdown: any, companyData: CompanyFullData): string {
  const nomEntreprise = companyData.sirene?.denomination || 'Cette entreprise';
  
  if (score >= 60) {
    return `${nomEntreprise} présente un profil de risque acceptable malgré l'absence de données financières complètes. Les signaux faibles analysés (obligations légales, procédures, réputation) sont globalement favorables.`;
  } else if (score >= 40) {
    return `${nomEntreprise} présente quelques signaux d'alerte nécessitant une vigilance accrue. L'absence de données financières complètes limite l'évaluation précise du risque.`;
  } else if (score >= 20) {
    return `${nomEntreprise} cumule plusieurs facteurs de risque significatifs. Une analyse approfondie et des garanties supplémentaires sont fortement recommandées.`;
  } else {
    return `${nomEntreprise} présente un profil à haut risque avec de multiples signaux d'alerte. Les relations commerciales doivent être évitées ou strictement encadrées.`;
  }
}

/**
 * Détermine la raison du fallback
 */
function determineReason(companyData: CompanyFullData): string {
  const reasons: string[] = [];
  
  if (!companyData.pappers?.bilans?.length) {
    reasons.push('Bilans financiers indisponibles');
  }
  
  if (!companyData.infogreffe?.notapmeScores) {
    reasons.push('Scores Infogreffe NOTAPME indisponibles');
  }
  
  if (!companyData.infogreffe?.afdccScore) {
    reasons.push('Score AFDCC indisponible');
  }

  return reasons.join(', ') || 'Données financières limitées';
}

/**
 * Vérifie si les conditions de fallback sont remplies
 */
export function shouldUseFallbackScore(companyData: CompanyFullData): boolean {
  // Critères pour activer le fallback
  const hasRecentBilans = companyData.pappers?.bilans?.some(bilan => {
    const currentYear = new Date().getFullYear();
    return bilan.annee >= currentYear - 2;
  });

  const hasInfogreffeScores = !!(
    companyData.infogreffe?.notapmeScores || 
    companyData.infogreffe?.afdccScore
  );

  const hasFinancialData = hasRecentBilans || hasInfogreffeScores;

  return !hasFinancialData;
}