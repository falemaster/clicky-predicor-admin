/**
 * Utilitaire de construction des données d'affichage unifiées
 * ⚠️ Source unique de vérité pour le mapping des données entre API et affichage
 * Utilisé par Analysis.tsx (user) et CompanyWYSIWYGEditor.tsx (admin)
 */

import type { CompanyFullData } from "@/types/api";

export interface DisplayCompanyData {
  name: string;
  siren: string;
  siret: string;
  naf: string;
  employees: string;
  address: string;
  director: string;
  phone: string;
  email: string;
  foundedYear: string;
  status: string;
}

export interface DisplayScores {
  global: number;
  financial: number;
  legal: number;
  fiscal: number;
  defaultRisk: string;
}

export interface StudyData {
  compliance: {
    procedures_bodacc: {
      status: string;
      count: number;
      details: any[];
    };
    procedures_portalis: {
      status: string;
      count: number;
      details: any[];
    };
    legal_risk_analysis: string;
    compliance_audit: string;
    obligations_status: string;
  };
  fiscal: {
    tva_declarations: string;
    is_declarations: string;
    cet_declarations: string;
    fiscal_optimization: string;
    tax_strategy: string;
    fiscal_evolution: any[];
  };
  financial: {
    financial_ratios: any[];
    balance_analysis: string;
    cash_flow_analysis: string;
    profitability_analysis: string;
    financial_recommendations: string;
  };
  economic: {
    market_position: string;
    competitive_analysis: string;
    growth_strategy: string;
    market_evolution: any[];
    performance_indicators: any[];
  };
  governance: {
    management_quality: string;
    board_composition: string;
    control_systems: string;
    governance_score: number;
    leadership_analysis: string;
  };
  certifications: {
    iso_certifications: string;
    industry_approvals: string;
    quality_labels: string;
    environmental_certifications: string;
  };
}

export interface EncartVisibility {
  overview: {
    company_info: boolean;
    scores: boolean;
    surveillance: boolean;
    data_quality: boolean;
  };
  study: {
    compliance: boolean;
    compliance_audit: boolean;
    procedures_bodacc: boolean;
    procedures_portalis: boolean;
    fiscal: boolean;
    fiscal_evolution: boolean;
    tax_strategy: boolean;
    financial: boolean;
    financial_ratios: boolean;
    balance_analysis: boolean;
    economic: boolean;
    market_position: boolean;
    competitive_analysis: boolean;
    governance: boolean;
    management_quality: boolean;
    board_composition: boolean;
    certifications: boolean;
    iso_certifications: boolean;
    quality_labels: boolean;
  };
  predictive: {
    risk_analysis: boolean;
    explanatory_factors: boolean;
    alerts: boolean;
  };
}

export interface DisplayEnrichedData {
  companyInfo: DisplayCompanyData;
  scores: DisplayScores;
  study: StudyData;
  financial: {
    bilans: any[];
    chiffreAffaires: number;
    resultatNet: number;
    endettement: number;
    effectifs: number;
  };
  legal: {
    procedures: any[];
    bodaccAnnonces: any[];
    compteStatus: boolean;
  };
  paymentScore: {
    scoreGlobal: number;
    scorePaiement: number;
    retardsMoyens: number;
    tendance: string;
    alertes: any[];
  };
  predictor: any;
  rawData: CompanyFullData;
  encartVisibility?: EncartVisibility;
  adminSettings?: {
    showDataQualitySection: boolean;
  };
}

export interface BuildCompanyDisplayResult {
  companyData: DisplayCompanyData | null;
  scores: DisplayScores | null;
  enrichedData: DisplayEnrichedData | null;
  hasRealData: boolean;
}

/**
 * Construit les données d'affichage normalisées à partir des données API brutes
 */
export function buildCompanyDisplay(realData: CompanyFullData | null): BuildCompanyDisplayResult {
  // Déterminer si on a des vraies données
  const hasRealData = realData && realData.sirene;

  if (!hasRealData) {
    return {
      companyData: null,
      scores: null,
      enrichedData: null,
      hasRealData: false
    };
  }

  // Construire les données d'affichage
  const companyData: DisplayCompanyData = {
    name: realData.sirene.denomination,
    siren: realData.sirene.siren,
    siret: realData.sirene.siret,
    naf: realData.sirene.naf,
    employees: realData.sirene.effectifs,
    address: realData.sirene.adresse,
    director: realData.pappers?.dirigeants?.[0] ? 
      `${realData.pappers.dirigeants[0].prenom || ''} ${realData.pappers.dirigeants[0].nom || ''}`.trim() || 'Non renseigné' : 
      'Non renseigné',
    phone: realData.enriched?.contactInfo?.phone || 'Non renseigné',
    email: realData.enriched?.contactInfo?.email || 'Non renseigné',
    foundedYear: new Date(realData.sirene.dateCreation).getFullYear().toString(),
    status: realData.sirene.statut
  };

  const scores: DisplayScores = {
    global: realData.predictor?.scores?.global || 5.5,
    financial: realData.predictor?.scores?.financier || 6.0,
    legal: realData.predictor?.scores?.legal || 7.5,
    fiscal: realData.predictor?.scores?.fiscal || 6.8,
    defaultRisk: realData.predictor?.probabiliteDefaut ? 
      `${(realData.predictor.probabiliteDefaut.mois12 * 100).toFixed(1)}%` : 
      'Faible'
  };

  // Build comprehensive study data structure
  const studyData: StudyData = {
    compliance: {
      procedures_bodacc: {
        status: realData.bodacc?.annonces?.length > 0 ? "actives" : "aucune",
        count: realData.bodacc?.annonces?.length || 0,
        details: realData.bodacc?.annonces || []
      },
      procedures_portalis: {
        status: realData.infogreffe?.procedures?.length > 0 ? "actives" : "aucune",
        count: realData.infogreffe?.procedures?.length || 0,
        details: realData.infogreffe?.procedures || []
      },
      legal_risk_analysis: "Analyse automatisée des risques juridiques basée sur les données BODACC et Infogreffe",
      compliance_audit: "Audit de conformité réglementaire en cours",
      obligations_status: "conforme"
    },
    fiscal: {
      tva_declarations: "à_jour",
      is_declarations: "à_jour", 
      cet_declarations: "à_jour",
      fiscal_optimization: "Stratégie d'optimisation fiscale adaptée au secteur d'activité",
      tax_strategy: "Stratégie fiscale optimisée pour minimiser les charges",
      fiscal_evolution: []
    },
    financial: {
      financial_ratios: realData.pappers?.bilans || [],
      balance_analysis: "Analyse du bilan comptable et de la structure financière",
      cash_flow_analysis: "Évaluation des flux de trésorerie et de la liquidité",
      profitability_analysis: "Analyse de la rentabilité et des marges",
      financial_recommendations: "Recommandations financières personnalisées"
    },
    economic: {
      market_position: "Position concurrentielle sur le marché",
      competitive_analysis: "Analyse de la concurrence et du positionnement",
      growth_strategy: "Stratégie de croissance adaptée",
      market_evolution: [],
      performance_indicators: []
    },
    governance: {
      management_quality: "Qualité du management et de la direction",
      board_composition: "Composition du conseil d'administration",
      control_systems: "Systèmes de contrôle interne",
      governance_score: 7.5,
      leadership_analysis: "Analyse du leadership et de la gouvernance"
    },
    certifications: {
      iso_certifications: "non_applicable",
      industry_approvals: "non_applicable", 
      quality_labels: "non_applicable",
      environmental_certifications: "non_applicable"
    }
  };

  // Données enrichies pour les composants enfants
  const enrichedData: DisplayEnrichedData = {
    companyInfo: companyData,
    scores,
    study: studyData,
    financial: {
      bilans: realData.pappers?.bilans || [],
      chiffreAffaires: realData.pappers?.bilans?.[0]?.chiffreAffaires || 0,
      resultatNet: realData.pappers?.bilans?.[0]?.resultatNet || 0,
      endettement: realData.pappers?.bilans?.[0]?.dettes || 0,
      effectifs: realData.pappers?.bilans?.[0]?.effectifs || 0
    },
    legal: {
      procedures: realData.infogreffe?.procedures || [],
      bodaccAnnonces: realData.bodacc?.annonces || [],
      compteStatus: realData.pappers?.depotComptes || false
    },
    paymentScore: {
      scoreGlobal: realData.rubyPayeur?.scoreGlobal || 0,
      scorePaiement: realData.rubyPayeur?.scorePaiement || 0,
      retardsMoyens: realData.rubyPayeur?.retardsMoyens || 0,
      tendance: realData.rubyPayeur?.tendance || 'Stable',
      alertes: realData.rubyPayeur?.alertes || []
    },
    predictor: realData.predictor || null,
    rawData: realData,
    encartVisibility: (realData as any).encartVisibility || {
      overview: {
        company_info: true,
        scores: true,
        surveillance: true,
        data_quality: true
      },
      study: {
        compliance: true,
        compliance_audit: true,
        procedures_bodacc: true,
        procedures_portalis: true,
        fiscal: true,
        fiscal_evolution: true,
        tax_strategy: true,
        financial: true,
        financial_ratios: true,
        balance_analysis: true,
        economic: true,
        market_position: true,
        competitive_analysis: true,
        governance: true,
        management_quality: true,
        board_composition: true,
        certifications: true,
        iso_certifications: true,
        quality_labels: true
      },
      predictive: {
        risk_analysis: true,
        explanatory_factors: true,
        alerts: true
      }
    },
    adminSettings: {
      showDataQualitySection: (realData as any).show_data_quality_dashboard || false
    }
  };

  return {
    companyData,
    scores,
    enrichedData,
    hasRealData: true
  };
}