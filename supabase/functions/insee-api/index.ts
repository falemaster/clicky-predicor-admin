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

  // Utiliser le nouvel endpoint officiel INSEE
  const tokenEndpoints = [
    'https://portail-api.insee.fr/api/oauth2/token', // Endpoint officiel principal
    'https://portail-api.insee.fr/oauth2/token',     // Fallback 1
    'https://api.insee.fr/oauth2/token',              // Fallback 2 (ancien)
  ];

  let lastErrorText = '';
  let lastStatus = 0;
  for (const endpoint of tokenEndpoints) {
    // 1) Tentative avec Authorization: Basic
    try {
      const tokenResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: new URLSearchParams({ grant_type: 'client_credentials', validity_period: '604800' }).toString()
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        accessToken = tokenData.access_token;
        tokenExpiry = now + (tokenData.expires_in * 1000);
        console.log(`Token OAuth2 obtenu via ${endpoint} (Basic).`);
        return accessToken!;
      } else {
        lastStatus = tokenResponse.status;
        lastErrorText = await tokenResponse.text();
        console.warn(`Échec token (Basic) sur ${endpoint}: ${tokenResponse.status} - ${lastErrorText}`);
      }
    } catch (e) {
      console.warn(`Erreur réseau (Basic) sur ${endpoint}: ${e instanceof Error ? e.message : String(e)}`);
    }

    // 2) Tentative avec credentials dans le corps (sans Authorization)
    try {
      const body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        validity_period: '604800',
      });

      const tokenResponse2 = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: body.toString(),
      });

      if (tokenResponse2.ok) {
        const tokenData = await tokenResponse2.json();
        accessToken = tokenData.access_token;
        tokenExpiry = now + (tokenData.expires_in * 1000);
        console.log(`Token OAuth2 obtenu via ${endpoint} (body credentials).`);
        return accessToken!;
      } else {
        lastStatus = tokenResponse2.status;
        lastErrorText = await tokenResponse2.text();
        console.warn(`Échec token (body) sur ${endpoint}: ${tokenResponse2.status} - ${lastErrorText}`);
      }
    } catch (e) {
      console.warn(`Erreur réseau (body) sur ${endpoint}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  const errMsg = `Impossible d'obtenir un token OAuth2 INSEE. Dernier statut: ${lastStatus}. Détails: ${lastErrorText}`;
  console.error(errMsg);
  throw new Error(errMsg);
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
        // Recherche multi-champs (dénomination, sigle, enseigne) avec wildcard suffixe
        const term = String(query).trim();
        const sanitized = term.replace(/[^\p{L}\p{N}\s\-']/gu, ' ').replace(/\s+/g, ' ').trim();
        const searchToken = sanitized.replace(/\s+/g, ' ');
        const q = `(
          denominationUniteLegale:${searchToken}* 
          OR denominationUsuelle1UniteLegale:${searchToken}* 
          OR denominationUsuelle2UniteLegale:${searchToken}* 
          OR denominationUsuelle3UniteLegale:${searchToken}* 
          OR sigleUniteLegale:${searchToken}* 
          OR enseigne1Etablissement:${searchToken}* 
          OR enseigne2Etablissement:${searchToken}* 
          OR enseigne3Etablissement:${searchToken}*
        )`;
        url = `${baseUrl}/siret?q=${encodeURIComponent(q)}&nombre=10`;
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