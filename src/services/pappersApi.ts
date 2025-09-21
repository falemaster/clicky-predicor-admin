import type { PappersCompanyData, ApiError } from '@/types/api';
import { supabase } from '@/integrations/supabase/client';

export class PappersApiService {
  private static instance: PappersApiService;
  
  public static getInstance(): PappersApiService {
    if (!PappersApiService.instance) {
      PappersApiService.instance = new PappersApiService();
    }
    return PappersApiService.instance;
  }

  async getCompanyData(siren: string): Promise<{ data: PappersCompanyData | null; error: ApiError | null }> {
    try {
      // Appel via edge function pour sécuriser la clé API
      const { data, error } = await supabase.functions.invoke('pappers-api', {
        body: { siren, endpoint: 'entreprise' }
      });

      if (error) {
        return {
          data: null,
          error: {
            code: 'PAPPERS_FUNCTION_ERROR',
            message: `Erreur fonction Pappers: ${error.message}`,
            source: 'PAPPERS'
          }
        };
      }

      if (data.error) {
        return {
          data: null,
          error: {
            code: data.error.code || 'PAPPERS_API_ERROR',
            message: data.error.message || 'Erreur API Pappers',
            source: 'PAPPERS'
          }
        };
      }

      const companyData: PappersCompanyData = {
        siren: data.siren,
        denomination: data.nom_entreprise,
        // Informations enrichies
        formeJuridique: data.forme_juridique,
        capitalSocial: data.capital_social || data.capital,
        telephone: data.telephone,
        email: data.email,
        siteWeb: data.site_internet,
        adresseSiege: data.adresse_ligne_1 ? [
          data.adresse_ligne_1,
          data.adresse_ligne_2,
          data.adresse_ligne_3,
          data.adresse_ligne_4,
          data.adresse_ligne_5,
          data.adresse_ligne_6,
          data.adresse_ligne_7
        ].filter(Boolean).join(', ') : undefined,
        codePostal: data.code_postal,
        ville: data.ville,
        codeNaf: data.code_naf,
        libelleNaf: data.libelle_naf,
        dateCreation: data.date_creation_entreprise,
        dateCessation: data.date_cessation_entreprise,
        dirigeants: data.representants?.map((rep: any) => ({
          nom: rep.nom,
          prenom: rep.prenom,
          fonction: rep.qualite,
          dateNaissance: rep.date_de_naissance,
          adresse: rep.adresse
        })) || [],
        bilans: data.finances?.map((finance: any) => ({
          annee: finance.annee,
          chiffreAffaires: finance.chiffre_affaires || 0,
          resultatNet: finance.resultat_net || 0,
          fondsPropresBruts: finance.fonds_propres || 0,
          dettes: finance.dettes || 0,
          effectifs: finance.effectifs || 0
        })) || [],
        depotComptes: data.depot_actes_derniere_annee || false,
        dernieresMutations: data.evenements?.slice(0, 5).map((evt: any) => ({
          date: evt.date,
          type: evt.type,
          description: evt.description
        })) || []
      };

      return { data: companyData, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'PAPPERS_NETWORK_ERROR',
          message: `Erreur réseau Pappers: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'PAPPERS'
        }
      };
    }
  }

  async getFinancialData(siren: string): Promise<{ data: any; error: ApiError | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('pappers-api', {
        body: { siren, endpoint: 'bilans' }
      });

      if (error) {
        return {
          data: null,
          error: {
            code: 'PAPPERS_FUNCTION_ERROR',
            message: `Erreur fonction Pappers bilans: ${error.message}`,
            source: 'PAPPERS'
          }
        };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'PAPPERS_NETWORK_ERROR',
          message: `Erreur réseau Pappers bilans: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'PAPPERS'
        }
      };
    }
  }
}