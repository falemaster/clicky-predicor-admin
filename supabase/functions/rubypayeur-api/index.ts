import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RUBYPAYEUR_API_KEY = Deno.env.get('RUBYPAYEUR_API_KEY');
const RUBYPAYEUR_BASE_URL = 'https://rubypayeur.com/api';

// Cache simple pour l'auth_token (valable 24h selon la doc)
let authTokenCache: { token: string; expiresAt: number } | null = null;

// Fonction pour obtenir un token d'authentification valide
async function getAuthToken(): Promise<string | null> {
  // Vérifier si on a un token en cache et qu'il n'est pas expiré
  if (authTokenCache && authTokenCache.expiresAt > Date.now()) {
    console.log('Using cached auth token');
    return authTokenCache.token;
  }

  console.log('Authenticating with RubyPayeur...');
  
  try {
    const authResponse = await fetch(`${RUBYPAYEUR_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        token: RUBYPAYEUR_API_KEY
      })
    });

    if (!authResponse.ok) {
      console.error(`Authentication failed: ${authResponse.status} ${authResponse.statusText}`);
      const errorText = await authResponse.text();
      console.error('Auth error response:', errorText);
      return null;
    }

    const authData = await authResponse.json();
    console.log('Authentication successful');
    
    if (!authData.auth_token) {
      console.error('No auth_token in response:', authData);
      return null;
    }

    // Mettre en cache le token pour 23 heures (un peu moins que 24h pour être sûr)
    authTokenCache = {
      token: authData.auth_token,
      expiresAt: Date.now() + (23 * 60 * 60 * 1000)
    };

    return authData.auth_token;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

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

    // Obtenir un token d'authentification valide
    const authToken = await getAuthToken();
    if (!authToken) {
      console.error('Failed to authenticate with RubyPayeur');
      
      const unavailableData = {
        siren,
        serviceStatus: 'indisponible',
        message: 'Service RubyPayeur temporairement indisponible - Échec d\'authentification',
        derniereMAJ: new Date().toISOString(),
        source: 'auth_failed'
      };

      return new Response(JSON.stringify(unavailableData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Faire la requête vers l'API RubyPayeur avec l'endpoint correct
    const url = `${RUBYPAYEUR_BASE_URL}/companies?siren=${siren}&include=bodacc_events,balances,scorings,sanctions`;
    
    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      console.error(`RubyPayeur API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('API error response:', errorText);
      
      const unavailableData = {
        siren,
        serviceStatus: 'indisponible',
        message: `Service RubyPayeur temporairement indisponible - Erreur API ${response.status}`,
        derniereMAJ: new Date().toISOString(),
        source: 'api_error',
        httpStatus: response.status
      };

      return new Response(JSON.stringify(unavailableData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('RubyPayeur API Response structure:', JSON.stringify(data, null, 2));

    // Vérifier si des données ont été trouvées
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.log(`No data found for SIREN: ${siren}`);
      
      const noDataResponse = {
        siren,
        serviceStatus: 'aucune_donnee',
        message: 'Aucune donnée disponible pour cette entreprise sur RubyPayeur',
        derniereMAJ: new Date().toISOString(),
        source: 'no_data'
      };

      return new Response(JSON.stringify(noDataResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`RubyPayeur data fetched successfully for SIREN: ${siren}`);

    // Transformer les données RubyPayeur au format attendu
    // Note: Ajuster le mapping selon la structure réelle des données
    const companyData = Array.isArray(data) ? data[0] : data;
    
    const transformedData = {
      siren: companyData.siren || siren,
      scoreGlobal: companyData.global_score || companyData.score || 5,
      scorePaiement: companyData.payment_score || companyData.score || 5,
      retardsMoyens: companyData.average_delay_days || 0,
      nbIncidents: companyData.incidents_count || 0,
      tendance: mapTendance(companyData.trend || 'stable'),
      derniereMAJ: companyData.last_update || new Date().toISOString(),
      alertes: (companyData.alerts || []).map((alert: any) => ({
        type: mapAlertType(alert.type),
        date: alert.date,
        montant: alert.amount,
        description: alert.message,
        gravite: mapSeverity(alert.severity)
      })),
      sourceStatus: 'disponible',
      source: 'rubypayeur_api'
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