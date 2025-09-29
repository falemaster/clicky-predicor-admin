import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client for calling other edge functions
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const SIRENE_API_BASE = 'https://api.insee.fr/entreprises/sirene/V3.11';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, type = 'name', limit = 10 } = await req.json();

    if (!query || query.trim().length < 3) {
      return new Response(JSON.stringify({ 
        error: { 
          code: 'QUERY_TOO_SHORT', 
          message: 'La requête doit contenir au moins 3 caractères' 
        } 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`SIRENE search: ${type} - "${query}"`);

    let url = '';
    if (type === 'name') {
      // Utiliser l'API publique recherche-entreprises (pas d'OAuth requis)
      const cleanQuery = query.trim().substring(0, 80);
      url = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(cleanQuery)}&page=1&per_page=${limit}&open=true`;
    } else if (type === 'siren' || type === 'siret') {
      // Recherche directe via l'API publique (pas d'OAuth) pour fiabiliser SIREN/SIRET
      const cleanQuery = query.trim().substring(0, 80);
      url = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(cleanQuery)}&page=1&per_page=1&open=true`;
    }

    console.log(`Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Predicor/1.0'
      },
    });

    if (!response.ok) {
      console.error(`SIRENE API error: ${response.status} ${response.statusText}`);
      
      return new Response(JSON.stringify({ 
        error: { 
          code: `SIRENE_API_${response.status}`, 
          message: `Erreur API SIRENE: ${response.statusText}` 
        } 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    if (type === 'name' || type === 'siren' || type === 'siret') {
      const results = Array.isArray(data.results) ? data.results.slice(0, limit) : [];
      console.log(`Recherche-Entreprises response: ${results.length} results`);
      
      // Pour les recherches SIREN/SIRET, retourner une erreur plus explicite si aucun résultat
      if ((type === 'siren' || type === 'siret') && results.length === 0) {
        return new Response(JSON.stringify({ 
          error: { 
            code: 'SIRENE_NOT_FOUND', 
            message: `Aucune entreprise trouvée pour le ${type.toUpperCase()} ${query}. Vérifiez que le numéro est correct et que l'entreprise existe.` 
          } 
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ results, source: 'recherche-entreprises' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`SIRENE API response: ${data.etablissements?.length || 0} results`);

    if (!data.etablissements || data.etablissements.length === 0) {
      return new Response(JSON.stringify({ results: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Transformer les résultats et dédupliquer par SIREN
    const seenSirens = new Set();
    const results = data.etablissements
      .filter((etablissement: any) => {
        const siren = etablissement.uniteLegale?.siren;
        if (!siren || seenSirens.has(siren)) return false;
        seenSirens.add(siren);
        return true;
      })
      .map((etablissement: any) => {
        const uniteLegale = etablissement.uniteLegale;
        return {
          siren: uniteLegale.siren,
          siret: etablissement.siret,
          denomination: uniteLegale.denominationUniteLegale || 
                      `${uniteLegale.prenom1UniteLegale || ''} ${uniteLegale.nomUniteLegale || ''}`.trim(),
          naf: etablissement.activitePrincipaleEtablissement,
          effectifs: mapEffectifs(uniteLegale.trancheEffectifsUniteLegale),
          adresse: formatAdresse(etablissement.adresseEtablissement),
          statut: etablissement.etatAdministratifEtablissement === 'A' ? 'Actif' : 'Cessé',
          dateCreation: uniteLegale.dateCreationUniteLegale
        };
      });

    return new Response(JSON.stringify({ 
      results,
      source: 'sirene'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sirene-search function:', error);
    return new Response(JSON.stringify({ 
      error: { 
        code: 'SIRENE_INTERNAL_ERROR', 
        message: error instanceof Error ? error.message : 'Erreur inconnue' 
      } 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function mapEffectifs(tranche: string): string {
  const mapping: Record<string, string> = {
    '00': '0 salarié',
    '01': '1 ou 2 salariés',
    '02': '3 à 5 salariés',
    '03': '6 à 9 salariés',
    '11': '10 à 19 salariés',
    '12': '20 à 49 salariés',
    '21': '50 à 99 salariés',
    '22': '100 à 199 salariés',
    '31': '200 à 249 salariés',
    '32': '250 à 499 salariés',
    '41': '500 à 999 salariés',
    '42': '1000 à 1999 salariés',
    '51': '2000 à 4999 salariés',
    '52': '5000 à 9999 salariés',
    '53': '10000 salariés et plus'
  };
  return mapping[tranche] || 'Non renseigné';
}

function formatAdresse(adresse: any): string {
  if (!adresse) return 'Adresse non renseignée';
  
  const parts = [
    adresse.numeroVoieEtablissement,
    adresse.typeVoieEtablissement,
    adresse.libelleVoieEtablissement,
    adresse.codePostalEtablissement,
    adresse.libelleCommuneEtablissement
  ].filter(Boolean);
  
  return parts.join(' ');
}

// Appeler l'API INSEE via notre edge function existante
async function callInseeApiSearch(query: string): Promise<any[]> {
  try {
    const { data, error } = await supabase.functions.invoke('insee-api', {
      body: {
        endpoint: 'search',
        query: query
      }
    });

    if (error) {
      console.error('Error calling INSEE API:', error);
      return [];
    }

    // Transformer les données INSEE au format attendu
    return mapInseeToExpectedFormat(data);
  } catch (error) {
    console.error('Exception in callInseeApiSearch:', error);
    return [];
  }
}

// Transformer les données INSEE au format attendu par le frontend
function mapInseeToExpectedFormat(inseeData: any): any[] {
  if (!inseeData?.etablissements || !Array.isArray(inseeData.etablissements)) {
    return [];
  }

  // Dédupliquer par SIREN et transformer
  const seenSirens = new Set();
  const results = inseeData.etablissements
    .filter((etablissement: any) => {
      const siren = etablissement.uniteLegale?.siren;
      if (!siren || seenSirens.has(siren)) return false;
      seenSirens.add(siren);
      return true;
    })
    .map((etablissement: any) => {
      const uniteLegale = etablissement.uniteLegale;
      return {
        siren: uniteLegale.siren,
        siret: etablissement.siret,
        denomination: uniteLegale.denominationUniteLegale || 
                    uniteLegale.denominationUsuelle1UniteLegale ||
                    `${uniteLegale.prenom1UniteLegale || ''} ${uniteLegale.nomUniteLegale || ''}`.trim(),
        naf: etablissement.activitePrincipaleEtablissement,
        effectifs: mapEffectifs(uniteLegale.trancheEffectifsUniteLegale),
        adresse: formatAdresse(etablissement.adresseEtablissement),
        statut: etablissement.etatAdministratifEtablissement === 'A' ? 'Actif' : 'Cessé',
        dateCreation: uniteLegale.dateCreationUniteLegale
      };
    })
    .slice(0, 8); // Limiter à 8 résultats comme l'API gouvernementale

  return results;
}