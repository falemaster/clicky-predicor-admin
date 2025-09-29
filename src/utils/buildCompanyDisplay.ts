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

export interface DisplayEnrichedData {
  companyInfo: DisplayCompanyData;
  scores: DisplayScores;
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

  // Données enrichies pour les composants enfants
  const enrichedData: DisplayEnrichedData = {
    companyInfo: companyData,
    scores,
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
    rawData: realData
  };

  return {
    companyData,
    scores,
    enrichedData,
    hasRealData: true
  };
}