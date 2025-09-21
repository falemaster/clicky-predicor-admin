import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache pour le token OAuth2
let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  
  // Réutiliser le token s'il est encore valide (avec marge de 5 minutes)
  if (accessToken && tokenExpiry > now + 300000) {
    return accessToken;
  }

  const clientId = Deno.env.get('INSEE_CLIENT_ID');
  const clientSecret = Deno.env.get('INSEE_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('Credentials INSEE non configurés');
  }

  console.log('Demande d\'un nouveau token OAuth2 INSEE...');

  const tokenResponse = await fetch('https://api.insee.fr/catalogue/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error(`Erreur OAuth2 INSEE: ${tokenResponse.status} - ${errorText}`);
    throw new Error(`Erreur authentification INSEE: ${tokenResponse.status}`);
  }

  const tokenData = await tokenResponse.json();
  accessToken = tokenData.access_token;
  tokenExpiry = now + (tokenData.expires_in * 1000); // Convertir en ms
  
  console.log(`Token OAuth2 obtenu, expire dans ${tokenData.expires_in} secondes`);
  return accessToken;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, siren, siret, query } = await req.json();

    // Obtenir le token OAuth2
    const token = await getAccessToken();

    let url: string;
    const baseUrl = 'https://api.insee.fr/entreprises/sirene/V3.11';

    // Construction de l'URL selon l'endpoint demandé
    switch (endpoint) {
      case 'siren':
        if (!siren) {
          return new Response(
            JSON.stringify({ error: 'SIREN requis pour cet endpoint' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        url = `${baseUrl}/siret?q=siren:${siren}&nombre=1`;
        break;
      
      case 'siret':
        if (!siret) {
          return new Response(
            JSON.stringify({ error: 'SIRET requis pour cet endpoint' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        url = `${baseUrl}/siret/${siret}`;
        break;
      
      case 'search':
        if (!query) {
          return new Response(
            JSON.stringify({ error: 'Query requis pour la recherche' }),
            { 
              status: 400, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        // Recherche par dénomination
        url = `${baseUrl}/siret?q=denominationUniteLegale:"*${query}*"&nombre=10`;
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint non supporté' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

    console.log(`Appel API INSEE: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error(`Erreur API INSEE: ${response.status} - ${response.statusText}`);
      return new Response(
        JSON.stringify({ 
          error: `Erreur API INSEE: ${response.status} - ${response.statusText}`,
          status: response.status 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log(`Réponse API INSEE reçue: ${JSON.stringify(data).substring(0, 200)}...`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erreur dans insee-api function:', error);
    return new Response(
      JSON.stringify({ 
        error: `Erreur interne: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});