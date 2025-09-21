import type { ApiError } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

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
        body: { siren, endpoint: 'entreprise' }
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
            source: 'INFOGREFFE'
          }
        };
      }

      // Mapper les données Infogreffe
      const companyData: InfogreffeCompanyData = {
        siren: data.siren || siren,
        formeJuridique: data.forme_juridique,
        capitalSocial: data.capital_social ? parseFloat(data.capital_social) : undefined,
        dateImmatriculation: data.date_immatriculation,
        numeroRcs: data.numero_rcs,
        greffe: data.greffe,
        activitePrincipale: data.activite_principale,
        dureePersonneMorale: data.duree_personne_morale,
        dateClotureExercice: data.date_cloture_exercice,
        procedures: data.procedures?.map((proc: any) => ({
          type: proc.type,
          date: proc.date,
          tribunal: proc.tribunal,
          statut: proc.statut
        })) || [],
        actes: data.actes?.map((acte: any) => ({
          date: acte.date,
          type: acte.type,
          description: acte.description
        })) || [],
        comptes: data.comptes?.map((compte: any) => ({
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