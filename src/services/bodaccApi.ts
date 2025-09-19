import type { BodaccData, ApiError } from '@/types/api';

const BODACC_API_BASE = 'https://bodacc-datainfogreffe.opendatasoft.com/api/records/1.0/search/';

export class BodaccApiService {
  private static instance: BodaccApiService;
  
  public static getInstance(): BodaccApiService {
    if (!BodaccApiService.instance) {
      BodaccApiService.instance = new BodaccApiService();
    }
    return BodaccApiService.instance;
  }

  async getCompanyAnnouncements(siren: string): Promise<{ data: BodaccData | null; error: ApiError | null }> {
    try {
      const query = `dataset=annonces-commerciales&q=siren:${siren}&rows=50&sort=dateparution&facet=typeavis&facet=departement`;
      
      const response = await fetch(`${BODACC_API_BASE}?${query}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          data: null,
          error: {
            code: `BODACC_${response.status}`,
            message: `Erreur API BODACC: ${response.statusText}`,
            source: 'BODACC'
          }
        };
      }

      const result = await response.json();
      
      const annonces = result.records?.map((record: any) => ({
        date: record.fields.dateparution,
        type: this.mapTypeAvis(record.fields.typeavis),
        contenu: record.fields.contenu || record.fields.denomination,
        tribunal: record.fields.tribunal
      })) || [];

      const data: BodaccData = {
        siren,
        annonces
      };

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'BODACC_NETWORK_ERROR',
          message: `Erreur réseau BODACC: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'BODACC'
        }
      };
    }
  }

  async getProcedureCollective(siren: string): Promise<{ data: any; error: ApiError | null }> {
    try {
      const query = `dataset=procedures-collectives&q=siren:${siren}&rows=20&sort=dateparution`;
      
      const response = await fetch(`${BODACC_API_BASE}?${query}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          data: null,
          error: {
            code: `BODACC_PROCEDURES_${response.status}`,
            message: `Erreur API BODACC procédures: ${response.statusText}`,
            source: 'BODACC'
          }
        };
      }

      const result = await response.json();
      return { data: result.records || [], error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'BODACC_PROCEDURES_NETWORK_ERROR',
          message: `Erreur réseau BODACC procédures: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'BODACC'
        }
      };
    }
  }

  private mapTypeAvis(type: string): 'Création' | 'Modification' | 'Procédure collective' | 'Dissolution' {
    const mapping: Record<string, 'Création' | 'Modification' | 'Procédure collective' | 'Dissolution'> = {
      'Immatriculation': 'Création',
      'Modification': 'Modification',
      'Radiation': 'Dissolution',
      'Procédure collective': 'Procédure collective'
    };
    return mapping[type] || 'Modification';
  }
}