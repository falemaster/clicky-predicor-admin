import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RUBYPAYEUR_API_KEY = Deno.env.get('RUBYPAYEUR_API_KEY');
// URL corrigée - test avec domaine alternatif si DNS principal échoue
const RUBYPAYEUR_BASE_URL = 'https://api.rubypayeur.com/v1';

// Endpoints to test in order of preference avec URLs alternatives
const ENDPOINTS = [
  '/companies/{siren}',
  '/company/{siren}', 
  '/companies?siren={siren}',
  '/companies/{siren}/risk',
  '/companies/{siren}/risk-score'
];

// URLs alternatives à tester si le principal échoue
const ALTERNATIVE_BASE_URLS = [
  'https://api.rubypayeur.com/v1',
  'https://api.rubypayeur.fr/v1',
  'https://rubypayeur-api.herokuapp.com/v1'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RUBYPAYEUR_API_KEY) {
      console.log('RubyPayeur API key not configured, using mock data');
      
      // Service indisponible - pas de clé API configurée
      const { siren } = await req.json();
      const unavailableData = {
        siren,
        serviceStatus: 'indisponible',
        message: 'Service RubyPayeur temporairement indisponible - Clé API non configurée',
        derniereMAJ: new Date().toISOString(),
        source: 'service_unavailable'
      };

      return new Response(JSON.stringify(unavailableData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { siren } = await req.json();

    if (!siren) {
      return new Response(JSON.stringify({ 
        error: { 
          code: 'SIREN_REQUIRED', 
          message: 'Le SIREN est requis' 
        } 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching RubyPayeur data for SIREN: ${siren}`);

    // Try endpoints and alternative URLs until one works
    let data = null;
    let successfulEndpoint = null;
    let successfulBaseUrl = null;
    
    for (const baseUrl of ALTERNATIVE_BASE_URLS) {
      if (data) break; // Si on a déjà des données, on arrête
      
      for (const endpointTemplate of ENDPOINTS) {
        try {
          let url;
          if (endpointTemplate.includes('?siren=')) {
            url = `${baseUrl}${endpointTemplate.replace('{siren}', siren)}`;
          } else {
            url = `${baseUrl}${endpointTemplate.replace('{siren}', siren)}`;
          }
          
          console.log(`Testing endpoint: ${url}`);
          
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${RUBYPAYEUR_API_KEY}`,
              'Accept': 'application/json',
              'User-Agent': 'Predicor/1.0'
            },
          });

          if (response.ok) {
            data = await response.json();
            successfulEndpoint = endpointTemplate;
            successfulBaseUrl = baseUrl;
            console.log(`Success with endpoint: ${endpointTemplate} on ${baseUrl}`);
            console.log('API Response structure:', JSON.stringify(data, null, 2));
            break;
          } else {
            console.log(`Endpoint ${endpointTemplate} on ${baseUrl} failed: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.log(`Endpoint ${endpointTemplate} on ${baseUrl} error:`, errorMessage);
        }
      }
    }

    if (!data) {
      console.error('All RubyPayeur endpoints failed - Service unavailable');
      
      // Service indisponible - toutes les API ont échoué
      const unavailableData = {
        siren,
        serviceStatus: 'indisponible',
        message: 'Service RubyPayeur temporairement indisponible - Toutes les API ont échoué',
        derniereMAJ: new Date().toISOString(),
        source: 'api_unavailable',
        testedEndpoints: ENDPOINTS.length,
        testedUrls: ALTERNATIVE_BASE_URLS.length
      };

      return new Response(JSON.stringify(unavailableData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`RubyPayeur data fetched successfully for SIREN: ${siren} using endpoint: ${successfulEndpoint} on ${successfulBaseUrl}`);

    // Transformer les données RubyPayeur au format attendu
    const transformedData = {
      siren: data.siren || siren,
      scoreGlobal: data.global_score || data.score || 5,
      scorePaiement: data.payment_score || data.score || 5,
      retardsMoyens: data.average_delay_days || 0,
      nbIncidents: data.incidents_count || 0,
      tendance: mapTendance(data.trend || 'stable'),
      derniereMAJ: data.last_update || new Date().toISOString(),
      alertes: (data.alerts || []).map((alert: any) => ({
        type: mapAlertType(alert.type),
        date: alert.date,
        montant: alert.amount,
        description: alert.message,
        gravite: mapSeverity(alert.severity)
      }))
    };

    return new Response(JSON.stringify(transformedData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in rubypayeur-api function:', error);
    
    // En cas d'erreur globale, retourner service indisponible
    const { siren } = await req.json().catch(() => ({ siren: 'unknown' }));
    const errorData = {
      siren,
      serviceStatus: 'erreur',
      message: 'Erreur technique dans le service RubyPayeur',
      derniereMAJ: new Date().toISOString(),
      source: 'technical_error',
      error: error instanceof Error ? error.message : 'Erreur technique inconnue'
    };

    return new Response(JSON.stringify(errorData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function mapTendance(trend: string): 'Amélioration' | 'Stable' | 'Dégradation' {
  const mapping: Record<string, 'Amélioration' | 'Stable' | 'Dégradation'> = {
    'improving': 'Amélioration',
    'stable': 'Stable',
    'deteriorating': 'Dégradation',
    'up': 'Amélioration',
    'down': 'Dégradation'
  };
  return mapping[trend.toLowerCase()] || 'Stable';
}

function mapAlertType(type: string): 'Retard' | 'Incident' | 'Contentieux' {
  const mapping: Record<string, 'Retard' | 'Incident' | 'Contentieux'> = {
    'delay': 'Retard',
    'incident': 'Incident',
    'litigation': 'Contentieux',
    'payment_delay': 'Retard',
    'payment_incident': 'Incident'
  };
  return mapping[type.toLowerCase()] || 'Incident';
}

function mapSeverity(severity: string): 'Faible' | 'Modérée' | 'Élevée' {
  const mapping: Record<string, 'Faible' | 'Modérée' | 'Élevée'> = {
    'low': 'Faible',
    'medium': 'Modérée',
    'high': 'Élevée',
    'minor': 'Faible',
    'major': 'Élevée'
  };
  return mapping[severity.toLowerCase()] || 'Modérée';
}