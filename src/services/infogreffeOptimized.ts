import type { 
  ApiError, 
  InfogreffeCompanyData,
  InfogreffeRepresentant, 
  InfogreffeRepartitionCapital,
  InfogreffeCompte,
  CompanyFullData
} from '@/types/api';
import { supabase } from '@/integrations/supabase/client';
import { shouldRecommendPremiumAnalysis, type PremiumEndpoint } from '@/utils/infogreffeThresholds';

// Pricing structure based on the uploaded image
const INFOGREFFE_PRICING = {
  'ficheidentite': { credits: 1, euros: 0.05 },
  'representants': { credits: 1, euros: 0.05 },
  'comptesannuels': { credits: 5, euros: 0.25 },
  'repartitioncapital': { credits: 20, euros: 1.00 },
  'procedures': { credits: 1, euros: 0.05 },
  'notapme-performance': { credits: 50, euros: 2.50 },
  'notapme-essentiel': { credits: 20, euros: 1.00 },
  'afdcc': { credits: 40, euros: 2.00 }
} as const;

// TTL (Time To Live) by endpoint type
const CACHE_TTL_HOURS = {
  'ficheidentite': 720, // 30 days - static data
  'representants': 168, // 7 days - can change
  'comptesannuels': 2160, // 90 days - annual data
  'repartitioncapital': 720, // 30 days - ownership changes slowly
  'procedures': 24, // 1 day - can change quickly
  'notapme-performance': 720, // 30 days - financial analysis
  'notapme-essentiel': 720, // 30 days - financial ratios
  'afdcc': 720 // 30 days - risk score
} as const;

export class InfogreffeOptimizedService {
  private static instance: InfogreffeOptimizedService;
  private sessionId: string;
  
  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Évalue si une analyse premium est recommandée pour une entreprise
   */
  public shouldFetchPremiumData(
    companyData: CompanyFullData, 
    endpoint: PremiumEndpoint
  ): boolean {
    return shouldRecommendPremiumAnalysis(companyData, endpoint);
  }
  
  public static getInstance(): InfogreffeOptimizedService {
    if (!InfogreffeOptimizedService.instance) {
      InfogreffeOptimizedService.instance = new InfogreffeOptimizedService();
    }
    return InfogreffeOptimizedService.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async checkCache(siren: string, endpoint: string, millesime?: number): Promise<any | null> {
    try {
      const { data, error } = await supabase.rpc('get_infogreffe_cache', {
        p_siren: siren,
        p_endpoint: endpoint,
        p_millesime: millesime || null
      });

      if (error) {
        console.warn('Cache check error:', error);
        return null;
      }

      if (data) {
        console.log(`✅ Cache HIT for ${endpoint} - ${siren}`, { cached: true });
        return data;
      }

      console.log(`❌ Cache MISS for ${endpoint} - ${siren}`);
      return null;
    } catch (error) {
      console.warn('Cache check failed:', error);
      return null;
    }
  }

  private async setCache(siren: string, endpoint: string, data: any, millesime?: number): Promise<void> {
    try {
      const ttlHours = CACHE_TTL_HOURS[endpoint as keyof typeof CACHE_TTL_HOURS] || 24;
      const credits = INFOGREFFE_PRICING[endpoint as keyof typeof INFOGREFFE_PRICING]?.credits || 1;

      await supabase.rpc('set_infogreffe_cache', {
        p_siren: siren,
        p_endpoint: endpoint,
        p_data: data,
        p_millesime: millesime || null,
        p_ttl_hours: ttlHours,
        p_credits_used: credits
      });

      console.log(`💾 Cached ${endpoint} for ${siren} (TTL: ${ttlHours}h, Credits: ${credits})`);
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  private async trackCost(siren: string, endpoint: string): Promise<void> {
    try {
      const pricing = INFOGREFFE_PRICING[endpoint as keyof typeof INFOGREFFE_PRICING];
      if (!pricing) return;

      await supabase.from('infogreffe_costs').insert({
        session_id: this.sessionId,
        siren,
        endpoint,
        credits_used: pricing.credits,
        cost_euros: pricing.euros,
        user_agent: navigator.userAgent,
        ip_address: null // Will be set by database if needed
      });

      console.log(`💰 Cost tracked: ${endpoint} - ${pricing.credits} credits (€${pricing.euros})`);
    } catch (error) {
      console.warn('Failed to track cost:', error);
    }
  }

  private async callInfogreffeAPI(siren: string, endpoint: string, millesime?: number): Promise<{ data: any | null; error: ApiError | null }> {
    try {
      // Check cache first
      const cachedData = await this.checkCache(siren, endpoint, millesime);
      if (cachedData) {
        return { data: cachedData, error: null };
      }

      // Track cost before making the call
      await this.trackCost(siren, endpoint);

      // Call the API
      const { data, error } = await supabase.functions.invoke('infogreffe-api', {
        body: { siren, endpoint, millesime }
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

      // Cache successful response
      await this.setCache(siren, endpoint, data, millesime);

      return { data, error: null };
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

  // Essential data (always fetched)
  async getCompanyData(siren: string): Promise<{ data: InfogreffeCompanyData | null; error: ApiError | null }> {
    const result = await this.callInfogreffeAPI(siren, 'ficheidentite');
    
    if (!result.data || result.error) {
      return result;
    }

    // Map the API response to our data structure
    const apiData = result.data.Data || result.data;
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
  }

  // On-demand methods (only called when explicitly requested)
  async getRepresentants(siren: string): Promise<{ data: InfogreffeRepresentant[] | null; error: ApiError | null; cost: { credits: number; euros: number } }> {
    const cost = INFOGREFFE_PRICING.representants;
    const result = await this.callInfogreffeAPI(siren, 'representants');
    
    if (!result.data || result.error) {
      return { ...result, cost };
    }

    const apiData = result.data.Data || result.data;
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

    return { data: representants, error: null, cost };
  }

  async getComptesAnnuels(siren: string, millesime?: number): Promise<{ data: InfogreffeCompte | null; error: ApiError | null; cost: { credits: number; euros: number } }> {
    const cost = INFOGREFFE_PRICING.comptesannuels;
    const result = await this.callInfogreffeAPI(siren, 'comptesannuels', millesime);
    
    if (!result.data || result.error) {
      return { ...result, cost };
    }

    const apiData = result.data.Data || result.data;
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

    return { data: compteData, error: null, cost };
  }

  async getRepartitionCapital(siren: string): Promise<{ data: InfogreffeRepartitionCapital | null; error: ApiError | null; cost: { credits: number; euros: number } }> {
    const cost = INFOGREFFE_PRICING.repartitioncapital;
    const result = await this.callInfogreffeAPI(siren, 'repartitioncapital');
    
    if (!result.data || result.error) {
      return { ...result, cost };
    }

    const apiData = result.data.Data || result.data;
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

    return { data: repartition, error: null, cost };
  }

  // Premium financial analysis methods (very costly - on demand only)
  async getNotapmePerformance(siren: string, millesime?: number): Promise<{ data: any | null; error: ApiError | null; cost: { credits: number; euros: number } }> {
    const cost = INFOGREFFE_PRICING['notapme-performance'];
    const result = await this.callInfogreffeAPI(siren, 'notapme-performance', millesime);
    
    return { data: result.data?.Data || result.data, error: result.error, cost };
  }

  async getNotapmeEssentiel(siren: string, millesime?: number): Promise<{ data: any | null; error: ApiError | null; cost: { credits: number; euros: number } }> {
    const cost = INFOGREFFE_PRICING['notapme-essentiel'];
    const result = await this.callInfogreffeAPI(siren, 'notapme-essentiel', millesime);
    
    return { data: result.data?.Data || result.data, error: result.error, cost };
  }

  async getAfdccScore(siren: string, millesime?: number): Promise<{ data: any | null; error: ApiError | null; cost: { credits: number; euros: number } }> {
    const cost = INFOGREFFE_PRICING.afdcc;
    const result = await this.callInfogreffeAPI(siren, 'afdcc', millesime);
    
    return { data: result.data?.Data || result.data, error: result.error, cost };
  }

  // Cost tracking methods
  async getSessionCosts(): Promise<{ total_credits: number; total_euros: number; details: any[] }> {
    try {
      const { data, error } = await supabase
        .from('infogreffe_costs')
        .select('*')
        .eq('session_id', this.sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const totalCredits = data.reduce((sum, item) => sum + item.credits_used, 0);
      const totalEuros = data.reduce((sum, item) => sum + parseFloat(item.cost_euros.toString()), 0);

      return {
        total_credits: totalCredits,
        total_euros: totalEuros,
        details: data
      };
    } catch (error) {
      console.error('Failed to get session costs:', error);
      return { total_credits: 0, total_euros: 0, details: [] };
    }
  }

  // Utility methods
  getEndpointCost(endpoint: string): { credits: number; euros: number } {
    return INFOGREFFE_PRICING[endpoint as keyof typeof INFOGREFFE_PRICING] || { credits: 1, euros: 0.05 };
  }

  getAllEndpointCosts(): typeof INFOGREFFE_PRICING {
    return INFOGREFFE_PRICING;
  }

  private parseCapitalSocial(value: any): number | undefined {
    if (!value) return undefined;
    const parsed = typeof value === 'string' ? parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) : parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }
}