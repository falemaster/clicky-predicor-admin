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

    const sireneService = SireneApiService.getInstance();
    const pappersService = PappersApiService.getInstance();
    const bodaccService = BodaccApiService.getInstance();
    const infogreffeService = InfogreffeApiService.getInstance();

  const fetchCompanyData = async (identifier: string, type: 'siren' | 'siret') => {
    setLoading(true);
    setErrors([]);
    setCurrentIdentifier({ value: identifier, type });

    const allErrors: ApiError[] = [];

    try {
      // 1. Données SIRENE (obligatoires)
      const sireneResult = type === 'siren' 
        ? await sireneService.getCompanyBySiren(identifier)
        : await sireneService.getCompanyBySiret(identifier);

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

      // 4. Données Infogreffe (optionnelles)
      try {
        const infogreffeResult = await infogreffeService.getMockData(sireneResult.data.siren);
        if (infogreffeResult.data) {
          companyData.infogreffe = infogreffeResult.data;
        } else if (infogreffeResult.error) {
          allErrors.push(infogreffeResult.error);
        }
      } catch (error) {
        allErrors.push({
          code: 'INFOGREFFE_FETCH_ERROR',
          message: 'Erreur lors de la récupération des données Infogreffe',
          source: 'INFOGREFFE'
        });
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

      companyData.errors = allErrors;
      setData(companyData as CompanyFullData);
      setErrors(allErrors);

      // Sauvegarder en localStorage pour la cache
      localStorage.setItem(`company-data-${sireneResult.data.siren}`, JSON.stringify(companyData));

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
    clearData
  };
};