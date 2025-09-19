import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SIRENE_API_BASE = 'https://api.insee.fr/entreprises/sirene/V3.11';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, type = 'name', limit = 10 } = await req.json();

    if (!query || query.trim().length < 2) {
      return new Response(JSON.stringify({ 
        error: { 
          code: 'QUERY_TOO_SHORT', 
          message: 'La requête doit contenir au moins 2 caractères' 
        } 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`SIRENE search: ${type} - "${query}"`);

    let url = '';
    if (type === 'name') {
      // Recherche par dénomination avec wildcard
      const cleanQuery = query.trim().replace(/[^\w\s\-\.]/gi, '').substring(0, 50);
      const searchQuery = `denominationUniteLegale:${cleanQuery}*`;
      url = `${SIRENE_API_BASE}/siret?q=${encodeURIComponent(searchQuery)}&nombre=${limit}&tri=denominationUniteLegale`;
    } else if (type === 'siren') {
      url = `${SIRENE_API_BASE}/siret?q=siren:${query}&nombre=1`;
    } else if (type === 'siret') {
      url = `${SIRENE_API_BASE}/siret/${query}`;
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
      
      // Si l'API SIRENE ne fonctionne pas, retourner des données de démonstration
      if (type === 'name' && response.status === 429) {
        // Limite de taux atteinte - données de démonstration
        const mockResults = generateMockResults(query);
        return new Response(JSON.stringify({ 
          results: mockResults,
          source: 'mock',
          message: 'Données de démonstration (limite API atteinte)'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

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
    console.log(`SIRENE API response: ${data.etablissements?.length || 0} results`);

    if (!data.etablissements || data.etablissements.length === 0) {
      // Pas de résultats - essayer des données de démonstration si c'est une recherche par nom
      if (type === 'name') {
        const mockResults = generateMockResults(query);
        if (mockResults.length > 0) {
          return new Response(JSON.stringify({ 
            results: mockResults,
            source: 'mock',
            message: 'Données de démonstration'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
      
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
    
    // En cas d'erreur, essayer de retourner des données de démonstration
    try {
      const { query, type } = await req.json().catch(() => ({ query: '', type: 'name' }));
      if (type === 'name' && query) {
        const mockResults = generateMockResults(query);
        return new Response(JSON.stringify({ 
          results: mockResults,
          source: 'mock',
          message: 'Données de démonstration (erreur API)',
          error: error.message
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch {}

    return new Response(JSON.stringify({ 
      error: { 
        code: 'SIRENE_INTERNAL_ERROR', 
        message: error.message 
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

function generateMockResults(query: string): any[] {
  const mockCompanies = [
    {
      siren: '552120222',
      siret: '55212022200023',
      denomination: 'APPLE FRANCE',
      naf: '4651Z - Commerce de gros d\'ordinateurs',
      effectifs: '200 à 249 salariés',
      adresse: '19-21 Boulevard Malesherbes, 75008 Paris',
      statut: 'Actif',
      dateCreation: '1981-01-28'
    },
    {
      siren: '542051180',
      siret: '54205118000031',
      denomination: 'MICROSOFT FRANCE',
      naf: '6202A - Conseil en systèmes et logiciels informatiques',
      effectifs: '500 à 999 salariés',
      adresse: '37 Quai du Président Roosevelt, 92130 Issy-les-Moulineaux',
      statut: 'Actif',
      dateCreation: '1985-03-15'
    },
    {
      siren: '552032534',
      siret: '55203253400024',
      denomination: 'TOTAL ENERGIES SE',
      naf: '0610Z - Extraction de pétrole brut',
      effectifs: '10000 salariés et plus',
      adresse: '2 Place Jean Millier, 92400 Courbevoie',
      statut: 'Actif',
      dateCreation: '1924-03-28'
    },
    {
      siren: '775665101',
      siret: '77566510100045',
      denomination: 'SOCIETE GENERALE',
      naf: '6419Z - Autres intermédiations monétaires',
      effectifs: '10000 salariés et plus',
      adresse: '29 Boulevard Haussmann, 75009 Paris',
      statut: 'Actif',
      dateCreation: '1864-05-04'
    },
    {
      siren: '542107596',
      siret: '54210759600047',
      denomination: 'L\'OREAL',
      naf: '2042Z - Fabrication de parfums et de produits pour la toilette',
      effectifs: '10000 salariés et plus',
      adresse: '14 Rue Royale, 75008 Paris',
      statut: 'Actif',
      dateCreation: '1909-07-30'
    }
  ];

  // Filtrer les entreprises qui correspondent à la recherche
  const searchTerm = query.toLowerCase();
  return mockCompanies.filter(company => 
    company.denomination.toLowerCase().includes(searchTerm) ||
    company.denomination.toLowerCase().startsWith(searchTerm)
  ).slice(0, 5);
}