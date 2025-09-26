import { useState, useEffect } from 'react';
import type { CompanyFullData, ApiError } from '@/types/api';
import { SireneApiService } from '@/services/sireneApi';
import { PappersApiService } from '@/services/pappersApi';
import { BodaccApiService } from '@/services/bodaccApi';
import { InfogreffeApiService } from '@/services/infogreffeApi';
import { supabase } from '@/integrations/supabase/client';

interface UseCompanyDataOptions {
  siren?: string;
  siret?: string;
  autoFetch?: boolean;
}

interface UseCompanyDataReturn {
  data: CompanyFullData | null;
  loading: boolean;
  errors: ApiError[];
  fetchCompanyData: (identifier: string, type: 'siren' | 'siret') => Promise<void>;
  refetch: () => Promise<void>;
  clearData: () => void;
  updateData: (updatedData: CompanyFullData) => void;
  isInitialLoad: boolean;
}

export const useCompanyData = ({
  siren,
  siret,
  autoFetch = false
}: UseCompanyDataOptions = {}): UseCompanyDataReturn => {
  const [data, setData] = useState<CompanyFullData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ApiError[]>([]);
  const [currentIdentifier, setCurrentIdentifier] = useState<{ value: string; type: 'siren' | 'siret' } | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

    const sireneService = SireneApiService.getInstance();
    const pappersService = PappersApiService.getInstance();
    const bodaccService = BodaccApiService.getInstance();
    const infogreffeService = InfogreffeApiService.getInstance();

  const fetchCompanyData = async (identifier: string, type: 'siren' | 'siret') => {
    console.log(`🔍 Début de la recherche ${type.toUpperCase()}: ${identifier}`);
    setLoading(true);
    setErrors([]);
    setCurrentIdentifier({ value: identifier, type });
    setIsInitialLoad(false); // Marquer qu'on charge de vraies données

    const allErrors: ApiError[] = [];

    // Log search activity to admin_search_history
    try {
      await supabase.rpc('log_search_activity', {
        p_search_type: type.toUpperCase(),
        p_search_query: identifier,
        p_results_found: true, // Will be updated later if no results
        p_user_agent: navigator.userAgent
      });
    } catch (logError) {
      console.warn('Failed to log search activity:', logError);
    }

    try {
      // 1. Vérifier d'abord s'il y a des données admin modifiées
      const adminDataResult = await supabase
        .from('admin_companies')
        .select('enriched_data, is_manually_edited, show_data_quality_dashboard')
        .eq('siren', type === 'siren' ? identifier : identifier.substring(0, 9))
        .maybeSingle();

      let adminData: CompanyFullData | null = null;
      let showDataQualityDashboard = false; // Default to false (hidden)
      
      if (adminDataResult.data?.is_manually_edited && adminDataResult.data?.enriched_data) {
        adminData = adminDataResult.data.enriched_data as unknown as CompanyFullData;
        console.log('📋 Données admin trouvées, elles seront prioritaires sur les données API');
      }
      
      // Always get the visibility setting, even if no admin data exists
      if (adminDataResult.data) {
        showDataQualityDashboard = adminDataResult.data.show_data_quality_dashboard || false;
      }

      // 2. SMART API STRATEGY: INSEE Sirene → Infogreffe → Pappers (fallback)
      console.log(`📡 Phase 1: Appel API INSEE pour ${type}: ${identifier}`);
      let sireneResult = type === 'siren' 
        ? await sireneService.getCompanyBySiren(identifier)
        : await sireneService.getCompanyBySiret(identifier);
      
      console.log(`📊 Résultat API INSEE:`, sireneResult);

      if (sireneResult.error || !sireneResult.data) {
        if (sireneResult.error) allErrors.push(sireneResult.error);
        setErrors(allErrors);
        setLoading(false);
        return;
      }

      const companyData: Partial<CompanyFullData> = {
        sirene: sireneResult.data,
        lastUpdate: new Date().toISOString(),
        errors: []
      };

      // 2. Données Pappers (optionnelles)
      try {
        const pappersResult = await pappersService.getCompanyData(sireneResult.data.siren);
        if (pappersResult.data) {
          companyData.pappers = pappersResult.data;
        } else if (pappersResult.error) {
          allErrors.push(pappersResult.error);
        }
      } catch (error) {
        allErrors.push({
          code: 'PAPPERS_FETCH_ERROR',
          message: 'Erreur lors de la récupération des données Pappers',
          source: 'PAPPERS'
        });
      }

      // 3. Données BODACC (optionnelles)
      try {
        const bodaccResult = await bodaccService.getCompanyAnnouncements(sireneResult.data.siren);
        if (bodaccResult.data) {
          companyData.bodacc = bodaccResult.data;
        } else if (bodaccResult.error) {
          allErrors.push(bodaccResult.error);
        }
      } catch (error) {
        allErrors.push({
          code: 'BODACC_FETCH_ERROR',
          message: 'Erreur lors de la récupération des données BODACC',
          source: 'BODACC'
        });
      }

      // 4. Données Infogreffe (optionnelles) - VRAIES DONNÉES
      try {
        const infogreffeResult = await infogreffeService.getCompanyData(sireneResult.data.siren);
        if (infogreffeResult.data) {
          companyData.infogreffe = infogreffeResult.data;
          console.log('📊 Données Infogreffe réelles récupérées:', infogreffeResult.data);
        } else if (infogreffeResult.error) {
          allErrors.push(infogreffeResult.error);
          console.warn('⚠️ Erreur Infogreffe:', infogreffeResult.error);
        }
      } catch (error) {
        allErrors.push({
          code: 'INFOGREFFE_FETCH_ERROR',
          message: 'Erreur lors de la récupération des données Infogreffe',
          source: 'INFOGREFFE'
        });
        console.error('❌ Erreur réseau Infogreffe:', error);
      }

      // 5. Analyse Predictor (via edge function)
      try {
        const { data: predictorData, error: predictorError } = await supabase.functions.invoke('predictor-analysis', {
          body: { 
            siren: sireneResult.data.siren,
            companyData: companyData
          }
        });

        if (predictorData && !predictorError) {
          companyData.predictor = predictorData;
        } else if (predictorError) {
          allErrors.push({
            code: 'PREDICTOR_FUNCTION_ERROR',
            message: `Erreur analyse Predictor: ${predictorError.message}`,
            source: 'PREDICTOR'
          });
        }
      } catch (error) {
        allErrors.push({
          code: 'PREDICTOR_FETCH_ERROR',
          message: 'Erreur lors de l\'analyse prédictive',
          source: 'PREDICTOR'
        });
      }

      // 6. RubyPayeur (via edge function)
      try {
        const { data: rubyPayeurData, error: rubyPayeurError } = await supabase.functions.invoke('rubypayeur-api', {
          body: { siren: sireneResult.data.siren }
        });

        if (rubyPayeurData && !rubyPayeurError) {
          companyData.rubyPayeur = rubyPayeurData;
        } else if (rubyPayeurError) {
          allErrors.push({
            code: 'RUBYPAYEUR_FUNCTION_ERROR',
            message: `Erreur RubyPayeur: ${rubyPayeurError.message}`,
            source: 'RUBYPAYEUR'
          });
        }
      } catch (error) {
        allErrors.push({
          code: 'RUBYPAYEUR_FETCH_ERROR',
          message: 'Erreur lors de la récupération des données de paiement',
          source: 'RUBYPAYEUR'
        });
      }

      // 7. Enrichissement IA des données manquantes
      try {
        const enrichmentData = {
          name: sireneResult.data.denomination,
          siren: sireneResult.data.siren,
          naf: sireneResult.data.naf,
          address: sireneResult.data.adresse,
          employees: sireneResult.data.effectifs,
          foundedYear: sireneResult.data.dateCreation?.substring(0, 4)
        };

        const { data: enrichedData, error: enrichedError } = await supabase.functions.invoke('enrich-company-data', {
          body: { companyData: enrichmentData }
        });

        if (enrichedData && !enrichedError) {
          companyData.enriched = enrichedData.enrichedData;
        } else if (enrichedError) {
          allErrors.push({
            code: 'ENRICHMENT_FUNCTION_ERROR',
            message: `Erreur enrichissement IA: ${enrichedError.message}`,
            source: 'ENRICHMENT'
          });
        }
      } catch (error) {
        allErrors.push({
          code: 'ENRICHMENT_FETCH_ERROR',
          message: 'Erreur lors de l\'enrichissement des données',
          source: 'ENRICHMENT'
        });
      }

      // 8. Merger les données admin avec les données API (admin prioritaire)
      let finalData = companyData as CompanyFullData;
      if (adminData) {
        finalData = mergeAdminDataWithApiData(adminData, companyData as CompanyFullData);
        console.log('🔄 Données admin mergées avec les données API');
      }

      // Add admin settings to the final data
      (finalData as any).adminSettings = {
        showDataQualityDashboard
      };

      finalData.errors = allErrors;
      setData(finalData);
      setErrors(allErrors);

      // Sauvegarder en localStorage pour la cache
      localStorage.setItem(`company-data-${sireneResult.data.siren}`, JSON.stringify(finalData));

    } catch (error) {
      const globalError: ApiError = {
        code: 'GLOBAL_FETCH_ERROR',
        message: `Erreur globale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        source: 'PREDICTOR'
      };
      allErrors.push(globalError);
      setErrors(allErrors);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour merger intelligemment les données admin avec les données API
  const mergeAdminDataWithApiData = (adminData: CompanyFullData, apiData: CompanyFullData): CompanyFullData => {
    const merged = { ...apiData };
    
    // Les données admin écrasent les données API quand elles existent
    if (adminData.sirene) merged.sirene = { ...apiData.sirene, ...adminData.sirene };
    if (adminData.pappers) merged.pappers = { ...apiData.pappers, ...adminData.pappers };
    if (adminData.infogreffe) merged.infogreffe = { ...apiData.infogreffe, ...adminData.infogreffe };
    if (adminData.rubyPayeur) merged.rubyPayeur = { ...apiData.rubyPayeur, ...adminData.rubyPayeur };
    if (adminData.predictor) merged.predictor = { ...apiData.predictor, ...adminData.predictor };
    if (adminData.enriched) merged.enriched = { ...apiData.enriched, ...adminData.enriched };
    if (adminData.bodacc) merged.bodacc = { ...apiData.bodacc, ...adminData.bodacc };

    // Marquer que les données contiennent des modifications admin
    (merged as any).hasAdminModifications = true;
    
    return merged;
  };

  const refetch = async () => {
    if (currentIdentifier) {
      await fetchCompanyData(currentIdentifier.value, currentIdentifier.type);
    }
  };

  const clearData = () => {
    setData(null);
    setErrors([]);
    setCurrentIdentifier(null);
  };

  const updateData = (updatedData: CompanyFullData) => {
    setData(updatedData);
    // Sauvegarder en cache
    if (updatedData.sirene?.siren) {
      localStorage.setItem(`company-data-${updatedData.sirene.siren}`, JSON.stringify(updatedData));
    }
  };

  // Auto-fetch si siren ou siret fournis
  useEffect(() => {
    if (autoFetch) {
      if (siren) {
        fetchCompanyData(siren, 'siren');
      } else if (siret) {
        fetchCompanyData(siret, 'siret');
      }
    }
  }, [siren, siret, autoFetch]);

  // Charger depuis le cache au démarrage
  useEffect(() => {
    const identifier = siren || siret;
    if (identifier) {
      const cached = localStorage.getItem(`company-data-${identifier}`);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          // Vérifier si les données ont moins de 1 heure
          const lastUpdate = new Date(cachedData.lastUpdate);
          const now = new Date();
          const diffHours = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
          
          if (diffHours < 1) {
            setData(cachedData);
            setErrors(cachedData.errors || []);
          }
        } catch (error) {
          console.error('Erreur lors du chargement du cache:', error);
        }
      }
    }
  }, [siren, siret]);

  return {
    data,
    loading,
    errors,
    fetchCompanyData,
    refetch,
    clearData,
    updateData,
    isInitialLoad
  };
};