import type { CompanyFullData } from '@/types/api';

// Configuration des seuils pour les analyses premium
export const PREMIUM_THRESHOLDS = {
  'notapme-performance': {
    credits: 50,
    euros: 2.50,
    conditions: {
      ca_minimum: 1000000, // 1M€
      effectifs_minimum: 10,
      requires_procedures: false,
      legal_forms_priority: ['SA', 'SAS', 'SARL']
    }
  },
  'notapme-essentiel': {
    credits: 20,
    euros: 1.00,
    conditions: {
      ca_minimum: 500000, // 500k€
      effectifs_minimum: 5,
      requires_procedures: false,
      legal_forms_priority: ['SA', 'SAS', 'SARL', 'SNC']
    }
  },
  'afdcc': {
    credits: 40,
    euros: 2.00,
    conditions: {
      ca_minimum: 750000, // 750k€
      effectifs_minimum: 8,
      requires_procedures: true, // Recommandé si procédures détectées
      legal_forms_priority: ['SA', 'SAS']
    }
  },
  'repartitioncapital': {
    credits: 20,
    euros: 1.00,
    conditions: {
      ca_minimum: 2000000, // 2M€
      effectifs_minimum: 15,
      requires_procedures: false,
      legal_forms_priority: ['SA', 'SAS'] // Structures complexes uniquement
    }
  }
} as const;

export type PremiumEndpoint = keyof typeof PREMIUM_THRESHOLDS;
export type RecommendationLevel = 'skip' | 'optional' | 'recommended' | 'essential';

export interface CompanyProfile {
  estimatedRevenue: number;
  effectifs: number;
  legalForm?: string;
  hasProcedures: boolean;
  hasPaymentIncidents: boolean;
  companyAge: number;
  sector?: string;
}

export interface PremiumRecommendation {
  endpoint: PremiumEndpoint;
  level: RecommendationLevel;
  reason: string;
  estimatedValue: number; // 0-100% de valeur ajoutée estimée
  cost: { credits: number; euros: number };
  priority: number; // 1-5, 5 = highest priority
}

/**
 * Analyse le profil d'une entreprise pour déterminer les recommandations d'analyses premium
 */
export function analyzeCompanyProfile(companyData: CompanyFullData): CompanyProfile {
  const profile: CompanyProfile = {
    estimatedRevenue: 0,
    effectifs: 0,
    hasProcedures: false,
    hasPaymentIncidents: false,
    companyAge: 0
  };

  // Estimation du CA à partir des sources disponibles
  if (companyData.pappers?.bilans?.length > 0) {
    const latestBilan = companyData.pappers.bilans
      .sort((a, b) => b.annee - a.annee)[0];
    profile.estimatedRevenue = latestBilan?.chiffreAffaires || 0;
    profile.effectifs = latestBilan?.effectifs || 0;
  }

  // Fallback vers les données SIRENE
  if (profile.estimatedRevenue === 0 && companyData.sirene) {
    const effectifsStr = companyData.sirene.effectifs;
    if (effectifsStr && effectifsStr !== 'NN') {
      profile.effectifs = parseInt(effectifsStr) || 0;
      // Estimation CA basée sur effectifs (très approximatif)
      profile.estimatedRevenue = profile.effectifs * 80000; // 80k€ par employé en moyenne
    }
  }

  // Forme juridique
  profile.legalForm = companyData.pappers?.formeJuridique || 
                     companyData.infogreffe?.formeJuridique;

  // Détection des procédures
  profile.hasProcedures = !!(
    companyData.bodacc?.annonces?.some(a => a.type === 'Procédure collective') ||
    companyData.infogreffe?.procedures?.length > 0
  );

  // Incidents de paiement
  profile.hasPaymentIncidents = !!(
    companyData.rubyPayeur?.nbIncidents > 0 ||
    companyData.rubyPayeur?.alertes?.some(a => a.type === 'Incident')
  );

  // Âge de l'entreprise
  if (companyData.sirene?.dateCreation) {
    const creationDate = new Date(companyData.sirene.dateCreation);
    profile.companyAge = new Date().getFullYear() - creationDate.getFullYear();
  }

  return profile;
}

/**
 * Génère les recommandations d'analyses premium pour une entreprise
 */
export function generatePremiumRecommendations(
  companyData: CompanyFullData
): PremiumRecommendation[] {
  const profile = analyzeCompanyProfile(companyData);
  const recommendations: PremiumRecommendation[] = [];

  // Évaluation pour chaque endpoint premium
  Object.entries(PREMIUM_THRESHOLDS).forEach(([endpoint, config]) => {
    const recommendation = evaluateEndpoint(
      endpoint as PremiumEndpoint, 
      config, 
      profile
    );
    recommendations.push(recommendation);
  });

  // Tri par priorité décroissante
  return recommendations.sort((a, b) => b.priority - a.priority);
}

/**
 * Évalue si un endpoint spécifique est recommandé pour le profil donné
 */
function evaluateEndpoint(
  endpoint: PremiumEndpoint,
  config: typeof PREMIUM_THRESHOLDS[PremiumEndpoint],
  profile: CompanyProfile
): PremiumRecommendation {
  let level: RecommendationLevel = 'skip';
  let reason = '';
  let estimatedValue = 0;
  let priority = 1;

  const meetsRevenueThreshold = profile.estimatedRevenue >= config.conditions.ca_minimum;
  const meetsEmployeeThreshold = profile.effectifs >= config.conditions.effectifs_minimum;
  const isPreferredLegalForm = config.conditions.legal_forms_priority.some(form => 
    profile.legalForm?.includes(form)
  );
  const procedureCondition = config.conditions.requires_procedures ? 
    profile.hasProcedures : true;

  // Logique de recommandation par endpoint
  switch (endpoint) {
    case 'notapme-performance':
      if (meetsRevenueThreshold && meetsEmployeeThreshold) {
        level = 'essential';
        reason = `Entreprise de ${profile.effectifs} salariés avec CA estimé ${formatRevenue(profile.estimatedRevenue)}`;
        estimatedValue = 90;
        priority = 5;
      } else if (meetsRevenueThreshold || (profile.effectifs >= 5 && isPreferredLegalForm)) {
        level = 'recommended';
        reason = 'Taille suffisante pour bénéficier d\'une analyse financière approfondie';
        estimatedValue = 75;
        priority = 4;
      } else if (isPreferredLegalForm && profile.companyAge > 3) {
        level = 'optional';
        reason = 'Forme juridique complexe justifiant une analyse';
        estimatedValue = 50;
        priority = 2;
      }
      break;

    case 'notapme-essentiel':
      if (meetsRevenueThreshold || meetsEmployeeThreshold) {
        level = 'recommended';
        reason = 'Analyse financière essentielle adaptée à la taille';
        estimatedValue = 80;
        priority = 4;
      } else if (profile.effectifs >= 2 && isPreferredLegalForm) {
        level = 'optional';
        reason = 'Version allégée appropriée pour ce profil';
        estimatedValue = 60;
        priority = 3;
      }
      break;

    case 'afdcc':
      if (profile.hasProcedures || profile.hasPaymentIncidents) {
        level = 'essential';
        reason = 'Incidents détectés - évaluation du risque critique';
        estimatedValue = 95;
        priority = 5;
      } else if (meetsRevenueThreshold && isPreferredLegalForm) {
        level = 'recommended';
        reason = 'Profil justifiant une évaluation du risque de défaut';
        estimatedValue = 70;
        priority = 3;
      } else if (profile.effectifs >= config.conditions.effectifs_minimum) {
        level = 'optional';
        reason = 'Taille suffisante pour une évaluation de risque';
        estimatedValue = 45;
        priority = 2;
      }
      break;

    case 'repartitioncapital':
      if (isPreferredLegalForm && profile.estimatedRevenue >= config.conditions.ca_minimum) {
        level = 'recommended';
        reason = 'Structure de capital complexe probable';
        estimatedValue = 65;
        priority = 2;
      } else if (profile.effectifs >= 50) {
        level = 'optional';
        reason = 'Grande entreprise - structure actionnariale d\'intérêt';
        estimatedValue = 40;
        priority = 1;
      }
      break;
  }

  if (level === 'skip') {
    reason = `Seuils non atteints (CA: ${formatRevenue(profile.estimatedRevenue)}, Effectifs: ${profile.effectifs})`;
  }

  return {
    endpoint,
    level,
    reason,
    estimatedValue,
    cost: {
      credits: config.credits,
      euros: config.euros
    },
    priority
  };
}

/**
 * Détermine si une analyse premium est justifiée économiquement
 */
export function shouldRecommendPremiumAnalysis(
  companyData: CompanyFullData,
  endpoint: PremiumEndpoint
): boolean {
  const recommendations = generatePremiumRecommendations(companyData);
  const recommendation = recommendations.find(r => r.endpoint === endpoint);
  return recommendation ? recommendation.level !== 'skip' : false;
}

/**
 * Calcule l'économie potentielle en appliquant les seuils
 */
export function calculatePotentialSavings(
  companyData: CompanyFullData
): {
  totalCredits: number;
  totalEuros: number;
  skippedEndpoints: PremiumEndpoint[];
  recommendedEndpoints: PremiumEndpoint[];
} {
  const recommendations = generatePremiumRecommendations(companyData);
  
  const skippedEndpoints = recommendations
    .filter(r => r.level === 'skip')
    .map(r => r.endpoint);
  
  const recommendedEndpoints = recommendations
    .filter(r => r.level !== 'skip')
    .map(r => r.endpoint);

  const totalCredits = skippedEndpoints.reduce((sum, endpoint) => 
    sum + PREMIUM_THRESHOLDS[endpoint].credits, 0
  );
  
  const totalEuros = skippedEndpoints.reduce((sum, endpoint) => 
    sum + PREMIUM_THRESHOLDS[endpoint].euros, 0
  );

  return {
    totalCredits,
    totalEuros,
    skippedEndpoints,
    recommendedEndpoints
  };
}

/**
 * Utilitaire pour formater le chiffre d'affaires
 */
function formatRevenue(revenue: number): string {
  if (revenue >= 1000000) {
    return `${(revenue / 1000000).toFixed(1)}M€`;
  } else if (revenue >= 1000) {
    return `${(revenue / 1000).toFixed(0)}k€`;
  } else {
    return `${revenue}€`;
  }
}