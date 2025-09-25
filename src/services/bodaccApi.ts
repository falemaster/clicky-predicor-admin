import type { BodaccData, ApiError } from '@/types/api';

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
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data: result, error: functionError } = await supabase.functions.invoke('bodacc-api', {
        body: { siren, type: 'annonces' }
      });

      if (functionError) {
        return {
          data: null,
          error: {
            code: 'BODACC_FUNCTION_ERROR',
            message: `Erreur fonction BODACC: ${functionError.message}`,
            source: 'BODACC'
          }
        };
      }

      if (result?.error) {
        return {
          data: null,
          error: {
            code: result.error.code,
            message: result.error.message,
            source: 'BODACC'
          }
        };
      }
      
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
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data: result, error: functionError } = await supabase.functions.invoke('bodacc-api', {
        body: { siren, type: 'procedures' }
      });

      if (functionError) {
        return {
          data: null,
          error: {
            code: 'BODACC_PROCEDURES_FUNCTION_ERROR',
            message: `Erreur fonction BODACC procédures: ${functionError.message}`,
            source: 'BODACC'
          }
        };
      }

      if (result?.error) {
        return {
          data: null,
          error: {
            code: result.error.code,
            message: result.error.message,
            source: 'BODACC'
          }
        };
      }

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