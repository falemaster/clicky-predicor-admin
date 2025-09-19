import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RUBYPAYEUR_API_KEY = Deno.env.get('RUBYPAYEUR_API_KEY');
const RUBYPAYEUR_BASE_URL = 'https://api.rubypayeur.com/v1';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RUBYPAYEUR_API_KEY) {
      console.log('RubyPayeur API key not configured, using mock data');
      
      // Données simulées si pas de clé API
      const { siren } = await req.json();
      const mockData = {
        siren,
        scoreGlobal: Math.floor(Math.random() * 10) + 1,
        scorePaiement: Math.floor(Math.random() * 10) + 1,
        retardsMoyens: Math.floor(Math.random() * 30),
        nbIncidents: Math.floor(Math.random() * 5),
        tendance: ['Amélioration', 'Stable', 'Dégradation'][Math.floor(Math.random() * 3)],
        derniereMAJ: new Date().toISOString(),
        alertes: []
      };

      return new Response(JSON.stringify(mockData), {
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

    const response = await fetch(`${RUBYPAYEUR_BASE_URL}/company/${siren}/risk-score`, {
      headers: {
        'Authorization': `Bearer ${RUBYPAYEUR_API_KEY}`,
        'Accept': 'application/json',
        'User-Agent': 'Predicor/1.0'
      },
    });

    if (!response.ok) {
      console.error(`RubyPayeur API error: ${response.status} ${response.statusText}`);
      
      // Fallback avec données simulées
      const mockData = {
        siren,
        scoreGlobal: Math.floor(Math.random() * 10) + 1,
        scorePaiement: Math.floor(Math.random() * 10) + 1,
        retardsMoyens: Math.floor(Math.random() * 30),
        nbIncidents: Math.floor(Math.random() * 5),
        tendance: ['Amélioration', 'Stable', 'Dégradation'][Math.floor(Math.random() * 3)],
        derniereMAJ: new Date().toISOString(),
        alertes: [],
        source: 'mock' // Indiquer que ce sont des données simulées
      };

      return new Response(JSON.stringify(mockData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log(`RubyPayeur data fetched successfully for SIREN: ${siren}`);

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
    
    // En cas d'erreur, retourner des données simulées
    const { siren } = await req.json().catch(() => ({ siren: 'unknown' }));
    const fallbackData = {
      siren,
      scoreGlobal: 6,
      scorePaiement: 6,
      retardsMoyens: 10,
      nbIncidents: 1,
      tendance: 'Stable',
      derniereMAJ: new Date().toISOString(),
      alertes: [],
      source: 'fallback',
      error: 'API temporairement indisponible'
    };

    return new Response(JSON.stringify(fallbackData), {
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