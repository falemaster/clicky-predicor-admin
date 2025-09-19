import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAPPERS_API_KEY = Deno.env.get('PAPPERS_API_KEY');
const PAPPERS_BASE_URL = 'https://api.pappers.fr/v2';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!PAPPERS_API_KEY) {
      return new Response(JSON.stringify({ 
        error: { 
          code: 'PAPPERS_API_KEY_MISSING', 
          message: 'Clé API Pappers non configurée' 
        } 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { siren, endpoint = 'entreprise' } = await req.json();

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

    console.log(`Fetching Pappers data for SIREN: ${siren}, endpoint: ${endpoint}`);

    let url = '';
    switch (endpoint) {
      case 'entreprise':
        url = `${PAPPERS_BASE_URL}/entreprise?api_token=${PAPPERS_API_KEY}&siren=${siren}&format_devise=symbole`;
        break;
      case 'bilans':
        url = `${PAPPERS_BASE_URL}/entreprise/bilans?api_token=${PAPPERS_API_KEY}&siren=${siren}`;
        break;
      case 'dirigeants':
        url = `${PAPPERS_BASE_URL}/entreprise/dirigeants?api_token=${PAPPERS_API_KEY}&siren=${siren}`;
        break;
      default:
        return new Response(JSON.stringify({ 
          error: { 
            code: 'INVALID_ENDPOINT', 
            message: 'Endpoint non supporté' 
          } 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Predicor/1.0'
      },
    });

    if (!response.ok) {
      console.error(`Pappers API error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ 
        error: { 
          code: `PAPPERS_API_${response.status}`, 
          message: `Erreur API Pappers: ${response.statusText}` 
        } 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log(`Pappers data fetched successfully for SIREN: ${siren}`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in pappers-api function:', error);
    return new Response(JSON.stringify({ 
      error: { 
        code: 'PAPPERS_INTERNAL_ERROR', 
        message: error.message 
      } 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});