import type { 
  ApiError, 
  InfogreffeCompanyData,
  InfogreffeRepresentant, 
  InfogreffeRepartitionCapital,
  InfogreffeCompte,
  InfogreffePosteComptable
} from '@/types/api';
import { supabase } from '@/integrations/supabase/client';


export class InfogreffeApiService {
  private static instance: InfogreffeApiService;
  
  public static getInstance(): InfogreffeApiService {
    if (!InfogreffeApiService.instance) {
      InfogreffeApiService.instance = new InfogreffeApiService();
    }
    return InfogreffeApiService.instance;
  }

  async getCompanyData(siren: string): Promise<{ data: InfogreffeCompanyData | null; error: ApiError | null }> {
    try {
      // Appel via edge function pour gérer l'authentification Infogreffe
      const { data, error } = await supabase.functions.invoke('infogreffe-api', {
        body: { siren, endpoint: 'ficheidentite' }
      });

      if (error) {
        return {
          data: null,
          error: {
            code: 'INFOGREFFE_FUNCTION_ERROR',
            message: `Erreur fonction Infogreffe: ${error.message}`,
            source: 'INFOGREFFE'
          }
        };
      }

      if (data?.error) {
        return {
          data: null,
          error: {
            code: data.error.code || 'INFOGREFFE_API_ERROR',
            message: data.error.message || 'Erreur API Infogreffe',
            source: 'INFOGREFFE',
            metadata: data.metadata
          }
        };
      }

      // Check if it's mock data and treat as unavailable
      if (data?.metadata?.mock) {
        return {
          data: null,
          error: {
            code: 'PAYMENT_REQUIRED',
            message: 'Infogreffe indisponible (paiement requis). Fallback vers Pappers.',
            source: 'INFOGREFFE',
            metadata: data.metadata
          }
        };
      }

      // Mapper les données Infogreffe selon le format de réponse API
      const apiData = data.Data || data;
      const companyData: InfogreffeCompanyData = {
        siren: apiData.siren || apiData.Siren || siren,
        formeJuridique: apiData.forme_juridique || apiData.FormeJuridique || apiData.LibelleFormeJuridique,
        capitalSocial: this.parseCapitalSocial(apiData.capital_social || apiData.CapitalSocial),
        dateImmatriculation: apiData.date_immatriculation || apiData.DateImmatriculation,
        numeroRcs: apiData.numero_rcs || apiData.NumeroRcs,
        greffe: apiData.greffe || apiData.LibelleGreffe,
        activitePrincipale: apiData.activite_principale || apiData.CodeNaf,
        dureePersonneMorale: apiData.duree_personne_morale,
        dateClotureExercice: apiData.date_cloture_exercice,
        procedures: apiData.procedures?.map((proc: any) => ({
          type: proc.type,
          date: proc.date,
          tribunal: proc.tribunal,
          statut: proc.statut
        })) || [],
        actes: apiData.actes?.map((acte: any) => ({
          date: acte.date,
          type: acte.type,
          description: acte.description
        })) || [],
        comptes: apiData.comptes?.map((compte: any) => ({
          annee: compte.annee,
          dateDepot: compte.date_depot,
          type: compte.type,
          statut: compte.statut
        })) || []
      };

      return { data: companyData, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'INFOGREFFE_NETWORK_ERROR',
          message: `Erreur réseau Infogreffe: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'INFOGREFFE'
        }
      };
    }
  }

  async getRepresentants(siren: string): Promise<{ data: InfogreffeRepresentant[] | null; error: ApiError | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('infogreffe-api', {
        body: { siren, endpoint: 'representants' }
      });

      if (error || data?.error) {
        return {
          data: null,
          error: {
            code: 'INFOGREFFE_REPRESENTANTS_ERROR',
            message: error?.message || data?.error?.message || 'Erreur lors de la récupération des représentants',
            source: 'INFOGREFFE'
          }
        };
      }

      const apiData = data.Data || data;
      const representants = apiData.Representants?.map((rep: any) => ({
        nom: rep.Nom,
        prenom: rep.Prenom,
        dateNaissance: rep.DateNaissance,
        lieuNaissance: rep.LieuNaissance,
        nationalite: rep.Nationalite,
        qualite: rep.Qualite,
        dateDebut: rep.DateDebut,
        dateFin: rep.DateFin
      })) || [];

      return { data: representants, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'INFOGREFFE_REPRESENTANTS_NETWORK_ERROR',
          message: `Erreur réseau: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'INFOGREFFE'
        }
      };
    }
  }

  async getComptesAnnuels(siren: string, millesime?: number): Promise<{ data: InfogreffeCompte | null; error: ApiError | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('infogreffe-api', {
        body: { siren, endpoint: 'comptesannuels', millesime }
      });

      if (error || data?.error) {
        return {
          data: null,
          error: {
            code: 'INFOGREFFE_COMPTES_ERROR',
            message: error?.message || data?.error?.message || 'Erreur lors de la récupération des comptes',
            source: 'INFOGREFFE'
          }
        };
      }

      const apiData = data.Data || data;
      const compteData: InfogreffeCompte = {
        annee: apiData.Millesime || millesime || new Date().getFullYear() - 1,
        dateDepot: apiData.DateCloture,
        type: apiData.TypeComptes || 'Comptes annuels',
        statut: 'Déposé',
        postes: apiData.Postes?.map((poste: any) => ({
          code: poste.Code,
          libelle: poste.Libelle,
          valeur: poste.Valeur
        })) || []
      };

      return { data: compteData, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'INFOGREFFE_COMPTES_NETWORK_ERROR',
          message: `Erreur réseau: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'INFOGREFFE'
        }
      };
    }
  }

  async getRepartitionCapital(siren: string): Promise<{ data: InfogreffeRepartitionCapital | null; error: ApiError | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('infogreffe-api', {
        body: { siren, endpoint: 'repartitioncapital' }
      });

      if (error || data?.error) {
        return {
          data: null,
          error: {
            code: 'INFOGREFFE_REPARTITION_ERROR',
            message: error?.message || data?.error?.message || 'Erreur lors de la récupération de la répartition du capital',
            source: 'INFOGREFFE'
          }
        };
      }

      const apiData = data.Data || data;
      const repartition: InfogreffeRepartitionCapital = {
        montant: apiData.CapitalSocial?.Montant || 0,
        nombreParts: apiData.CapitalSocial?.NbrParts || 0,
        pourcentageDetentionPP: apiData.CapitalSocial?.PourcentageDetentionPP || 0,
        pourcentageDetentionPM: apiData.CapitalSocial?.PourcentageDetentionPM || 0,
        detention: apiData.CapitalDetention?.map((det: any) => ({
          typePersonne: det.TypePersonne,
          nom: det.Nom,
          prenom: det.Prenom,
          denomination: det.Denomination,
          siren: det.Siren,
          nombreParts: det.NombreParts,
          pourcentage: det.Pourcentage
        })) || []
      };

      return { data: repartition, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'INFOGREFFE_REPARTITION_NETWORK_ERROR',
          message: `Erreur réseau: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'INFOGREFFE'
        }
      };
    }
  }

  // Nouvelles méthodes pour les scores financiers NOTAPME et AFDCC
  async getNotapmePerformance(siren: string, millesime?: number): Promise<{ data: any | null; error: ApiError | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('infogreffe-api', {
        body: { siren, endpoint: 'notapme-performance', millesime }
      });

      if (error || data?.error) {
        return {
          data: null,
          error: {
            code: 'INFOGREFFE_NOTAPME_ERROR',
            message: error?.message || data?.error?.message || 'Erreur lors de la récupération des données NOTAPME Performance',
            source: 'INFOGREFFE'
          }
        };
      }

      return { data: data.Data || data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'INFOGREFFE_NOTAPME_NETWORK_ERROR',
          message: `Erreur réseau NOTAPME: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'INFOGREFFE'
        }
      };
    }
  }

  async getNotapmeEssentiel(siren: string, millesime?: number): Promise<{ data: any | null; error: ApiError | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('infogreffe-api', {
        body: { siren, endpoint: 'notapme-essentiel', millesime }
      });

      if (error || data?.error) {
        return {
          data: null,
          error: {
            code: 'INFOGREFFE_NOTAPME_ESSENTIEL_ERROR',
            message: error?.message || data?.error?.message || 'Erreur lors de la récupération des données NOTAPME Essentiel',
            source: 'INFOGREFFE'
          }
        };
      }

      return { data: data.Data || data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'INFOGREFFE_NOTAPME_ESSENTIEL_NETWORK_ERROR',
          message: `Erreur réseau NOTAPME Essentiel: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'INFOGREFFE'
        }
      };
    }
  }

  async getAfdccScore(siren: string, millesime?: number): Promise<{ data: any | null; error: ApiError | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('infogreffe-api', {
        body: { siren, endpoint: 'afdcc', millesime }
      });

      if (error || data?.error) {
        return {
          data: null,
          error: {
            code: 'INFOGREFFE_AFDCC_ERROR',
            message: error?.message || data?.error?.message || 'Erreur lors de la récupération du score AFDCC',
            source: 'INFOGREFFE'
          }
        };
      }

      return { data: data.Data || data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'INFOGREFFE_AFDCC_NETWORK_ERROR',
          message: `Erreur réseau AFDCC: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'INFOGREFFE'
        }
      };
    }
  }

  private parseCapitalSocial(value: any): number | undefined {
    if (!value) return undefined;
    const parsed = typeof value === 'string' ? parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) : parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }

  async getMockData(siren: string): Promise<{ data: InfogreffeCompanyData | null; error: ApiError | null }> {
    // Données mock enrichies basées sur le SIREN
    const mockData: InfogreffeCompanyData = {
      siren,
      formeJuridique: this.getMockFormeJuridique(siren),
      capitalSocial: this.getMockCapitalSocial(siren),
      dateImmatriculation: this.getMockDateImmatriculation(siren),
      numeroRcs: `${siren} RCS Paris`,
      greffe: 'Paris',
      activitePrincipale: this.getMockActivitePrincipale(siren),
      dureePersonneMorale: '99 ans',
      dateClotureExercice: '31/12',
      procedures: [],
      actes: [
        {
          date: '2020-01-15',
          type: 'Modification du capital',
          description: 'Augmentation de capital social'
        }
      ],
      comptes: [
        {
          annee: 2023,
          dateDepot: '2024-05-15',
          type: 'Comptes annuels',
          statut: 'Déposé'
        },
        {
          annee: 2022,
          dateDepot: '2023-05-12',
          type: 'Comptes annuels',
          statut: 'Déposé'
        }
      ]
    };

    return { data: mockData, error: null };
  }

  private getMockFormeJuridique(siren: string): string {
    const formes = ['SAS', 'SARL', 'SA', 'SCI', 'EURL'];
    const index = parseInt(siren.slice(-1)) % formes.length;
    return formes[index];
  }

  private getMockCapitalSocial(siren: string): number {
    const base = parseInt(siren.slice(-3));
    return base * 1000 + 10000; // Entre 10K et 999K
  }

  private getMockDateImmatriculation(siren: string): string {
    const year = 2000 + (parseInt(siren.slice(-2)) % 24);
    const month = Math.max(1, parseInt(siren.slice(-1)) % 12);
    const day = Math.max(1, parseInt(siren.slice(-2, -1)) % 28);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  private getMockActivitePrincipale(siren: string): string {
    const activites = [
      'Services informatiques',
      'Commerce de détail',
      'Industrie manufacturière',
      'Services financiers',
      'Conseil aux entreprises',
      'Commerce de gros',
      'Transport et logistique'
    ];
    const index = parseInt(siren.slice(-1)) % activites.length;
    return activites[index];
  }
}