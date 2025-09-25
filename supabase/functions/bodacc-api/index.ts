import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BODACC_API_BASE = 'https://bodacc-datainfogreffe.opendatasoft.com/api/records/1.0/search/';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { siren, type = 'annonces' } = await req.json();

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

    console.log(`Fetching BODACC data for SIREN: ${siren}, type: ${type}`);

    let query = '';
    switch (type) {
      case 'annonces':
        query = `dataset=annonces-commerciales&q=siren:${siren}&rows=50&sort=dateparution&facet=typeavis&facet=departement`;
        break;
      case 'procedures':
        query = `dataset=procedures-collectives&q=siren:${siren}&rows=20&sort=dateparution`;
        break;
      default:
        return new Response(JSON.stringify({ 
          error: { 
            code: 'INVALID_TYPE', 
            message: 'Type non supporté' 
          } 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const response = await fetch(`${BODACC_API_BASE}?${query}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Predicor/1.0'
      },
    });

    if (!response.ok) {
      // Un 404 signifie simplement qu'il n'y a pas d'annonces pour cette entreprise
      if (response.status === 404) {
        console.log(`Aucune annonce BODACC trouvée pour SIREN: ${siren}`);
        return new Response(JSON.stringify({ records: [] }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      console.error(`BODACC API error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ 
        error: { 
          code: `BODACC_API_${response.status}`, 
          message: `Erreur API BODACC: ${response.statusText}` 
        } 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log(`BODACC data fetched successfully for SIREN: ${siren}`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in bodacc-api function:', error);
    return new Response(JSON.stringify({ 
      error: { 
        code: 'BODACC_INTERNAL_ERROR', 
        message: error instanceof Error ? error.message : 'Erreur inconnue' 
      } 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});