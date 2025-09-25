// Types pour les données des APIs externes

// INSEE/SIRENE API
export interface SireneCompanyData {
  siren: string;
  siret: string;
  denomination: string;
  naf: string;
  effectifs: string;
  adresse: string;
  statut: 'Actif' | 'Cessé' | 'Suspendu';
  dateCreation: string;
}

// Pappers API
export interface PappersCompanyData {
  siren: string;
  denomination: string;
  // Informations enrichies
  formeJuridique?: string;
  capitalSocial?: number;
  telephone?: string;
  email?: string;
  siteWeb?: string;
  adresseSiege?: string;
  codePostal?: string;
  ville?: string;
  codeNaf?: string;
  libelleNaf?: string;
  dateCreation?: string;
  dateCessation?: string;
  dirigeants: PappersDirigeant[];
  bilans: PappersBilan[];
  depotComptes: boolean;
  dernieresMutations: PappersMutation[];
}

export interface PappersDirigeant {
  nom: string;
  prenom: string;
  fonction: string;
  dateNaissance?: string;
  adresse?: string;
}

export interface PappersBilan {
  annee: number;
  chiffreAffaires: number;
  resultatNet: number;
  fondsPropresBruts: number;
  dettes: number;
  effectifs: number;
}

export interface PappersMutation {
  date: string;
  type: string;
  description: string;
}

// INPI/Infogreffe API
export interface InfogreffeData {
  siren: string;
  procedures: InfogreffeProcedure[];
  actes: InfogreffeActe[];
  comptes: InfogreffeCompte[];
}

export interface InfogreffeCompanyData {
  siren: string;
  formeJuridique?: string;
  capitalSocial?: number;
  dateImmatriculation?: string;
  numeroRcs?: string;
  greffe?: string;
  activitePrincipale?: string;
  dureePersonneMorale?: string;
  dateClotureExercice?: string;
  procedures?: InfogreffeProcedure[];
  actes?: InfogreffeActe[];
  comptes?: InfogreffeCompte[];
}

export interface InfogreffeProcedure {
  type: 'Redressement' | 'Liquidation' | 'Sauvegarde';
  date: string;
  tribunal: string;
  statut: string;
}

export interface InfogreffeActe {
  date: string;
  type: string;
  description: string;
}

export interface InfogreffeCompte {
  annee: number;
  dateDepot: string;
  type: 'Comptes annuels' | 'Comptes consolidés';
  statut: 'Déposé' | 'Non déposé';
}

// RubyPayeur API
export interface RubyPayeurData {
  siren: string;
  scoreGlobal: number;
  scorePaiement: number;
  retardsMoyens: number;
  nbIncidents: number;
  tendance: 'Amélioration' | 'Stable' | 'Dégradation';
  derniereMAJ: string;
  alertes: RubyPayeurAlerte[];
  source?: 'api' | 'mock' | 'fallback';
  error?: string;
}

export interface RubyPayeurAlerte {
  type: 'Retard' | 'Incident' | 'Contentieux';
  date: string;
  montant?: number;
  description: string;
  gravite: 'Faible' | 'Modérée' | 'Élevée';
}

// BODACC API
export interface BodaccData {
  siren: string;
  annonces: BodaccAnnonce[];
}

export interface BodaccAnnonce {
  date: string;
  type: 'Création' | 'Modification' | 'Procédure collective' | 'Dissolution';
  contenu: string;
  tribunal?: string;
}

// Moteur Predicor (interne)
export interface PredictorAnalysis {
  siren: string;
  scores: {
    global: number;
    financier: number;
    legal: number;
    fiscal: number;
    prediction: number;
  };
  probabiliteDefaut: {
    mois3: number;
    mois6: number;
    mois12: number;
  };
  facteursExplicatifs: PredictorFactor[];
  alertes: PredictorAlert[];
  recommandations: string[];
}

export interface PredictorFactor {
  nom: string;
  impact: number; // -1 à 1
  importance: number; // 0 à 1
  explication: string;
}

export interface PredictorAlert {
  type: 'Risque' | 'Opportunité' | 'Surveillance';
  niveau: 'Faible' | 'Modéré' | 'Élevé' | 'Critique';
  message: string;
  date: string;
  actions: string[];
}

export interface EnrichedData {
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
  legalInfo: {
    preciseForm: string;
    socialCapital: string;
    rcsNumber: string;
    fiscalYearEnd: string;
  };
  businessInfo: {
    detailedActivity: string;
    secondaryActivities: string[];
    collectiveAgreement: string;
    mainClients: string;
  };
  financialIndicators: {
    estimatedRevenue: string;
    profitabilityRange: string;
    growthTrend: string;
    riskFactors: string[];
  };
  metadata: {
    dataQuality: string;
    sources: string;
    confidence: string;
  };
}

// Types d'erreur API
export interface ApiError {
  code: string;
  message: string;
  source: 'SIRENE' | 'PAPPERS' | 'INFOGREFFE' | 'RUBYPAYEUR' | 'BODACC' | 'PREDICTOR' | 'ENRICHMENT';
}

// Types pour les réponses agrégées
export interface CompanyFullData {
  sirene?: SireneCompanyData;
  pappers?: PappersCompanyData;
  infogreffe?: InfogreffeCompanyData;
  rubyPayeur?: RubyPayeurData;
  bodacc?: BodaccData;
  predictor?: PredictorAnalysis;
  enriched?: EnrichedData;
  lastUpdate: string;
  errors: ApiError[];
}