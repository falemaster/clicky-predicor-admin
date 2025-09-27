import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Infogreffe API called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { siren, endpoint, millesime } = await req.json();
    console.log('Infogreffe request:', { siren, endpoint, millesime });

    const INFOGREFFE_API_KEY = Deno.env.get('INFOGREFFE_API_KEY');
    
    if (!INFOGREFFE_API_KEY) {
      console.log('INFOGREFFE_API_KEY not found, returning error response');
      return new Response(JSON.stringify({
        error: { 
          code: 'NO_API_KEY', 
          message: 'Clé API Infogreffe manquante. Fallback vers Pappers.' 
        },
        metadata: { mock: true, reason: 'no_key' }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Construct API URL based on endpoint
    let apiUrl = '';
    switch (endpoint) {
      case 'entreprise':
      case 'ficheidentite':
        apiUrl = `https://api.datainfogreffe.fr/api/v1/Entreprise/FicheIdentite/${siren}`;
        break;
      case 'representants':
      case 'dirigeants':
        apiUrl = `https://api.datainfogreffe.fr/api/v1/Entreprise/Representants/${siren}`;
        break;
      case 'comptes':
      case 'comptesannuels':
        apiUrl = `https://api.datainfogreffe.fr/api/v1/Entreprise/ComptesAnnuels/${siren}`;
        if (millesime) {
          apiUrl += `?millesime=${millesime}`;
        }
        break;
      case 'procedures':
      case 'procedurescollectives':
        apiUrl = `https://api.datainfogreffe.fr/api/v1/Entreprise/ProceduresCollectives/${siren}`;
        break;
      case 'repartitioncapital':
      case 'associes':
        apiUrl = `https://api.datainfogreffe.fr/api/v1/Entreprise/RepartitionCapital?siren=${siren}&restitution=json`;
        break;
      case 'notapme-performance':
        apiUrl = `https://api.datainfogreffe.fr/api/v1/Entreprise/notapme/performance/${siren}`;
        if (millesime) {
          apiUrl += `?millesime=${millesime}`;
        }
        break;
      case 'notapme-essentiel':
        apiUrl = `https://api.datainfogreffe.fr/api/v1/Entreprise/notapme/essentiel/${siren}`;
        if (millesime) {
          apiUrl += `?millesime=${millesime}`;
        }
        break;
      case 'notapme-integral':
        apiUrl = `https://api.datainfogreffe.fr/api/v1/Entreprise/notapme/integral/${siren}`;
        if (millesime) {
          apiUrl += `?millesime=${millesime}`;
        }
        break;
      case 'afdcc':
        apiUrl = `https://api.datainfogreffe.fr/api/v1/Entreprise/afdcc/${siren}`;
        if (millesime) {
          apiUrl += `?millesime=${millesime}`;
        }
        break;
      default:
        apiUrl = `https://api.datainfogreffe.fr/api/v1/Entreprise/FicheIdentite/${siren}`;
    }

    // Add token parameter
    const separator = apiUrl.includes('?') ? '&' : '?';
    apiUrl += `${separator}token=${INFOGREFFE_API_KEY}`;

    console.log('Calling Infogreffe API:', apiUrl.replace(INFOGREFFE_API_KEY, '[HIDDEN]'));

    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error('Infogreffe API error:', response.status, response.statusText);
      let errorCode = 'API_ERROR';
      let reason = 'api_error';
      
      if (response.status === 402) {
        errorCode = 'PAYMENT_REQUIRED';
        reason = 'payment_required';
        console.log('Infogreffe 402 Payment Required - fallback to Pappers needed');
      }
      
      return new Response(JSON.stringify({
        error: { 
          code: errorCode, 
          message: `Erreur Infogreffe (${response.status}). Fallback vers Pappers.` 
        },
        metadata: { mock: true, reason }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Infogreffe API response for', endpoint, ':', {
      ...data,
      Data: data.Data ? '[DATA_RECEIVED]' : null,
      Metadata: data.Metadata
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Infogreffe function error:', error);
    
    // Extract siren from error context if available
    const siren = req.url?.includes('siren') ? 
      new URL(req.url).searchParams.get('siren') : null;
    
    if (siren) {
      return new Response(JSON.stringify({
        error: { 
          code: 'FUNCTION_ERROR', 
          message: 'Erreur fonction Infogreffe. Fallback vers Pappers.' 
        },
        metadata: { mock: true, reason: 'function_error' }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateMockInfogreffeData(siren: string, endpoint: string = 'entreprise') {
  const baseData = {
    Metadata: {
      CreditsUsed: 1,
      CreditsLeft: 9999
    }
  };

  switch (endpoint) {
    case 'representants':
    case 'dirigeants':
      return {
        ...baseData,
        Data: {
          CodeGreffe: "7501",
          LibelleGreffe: "Paris",
          Siren: siren,
          Denomination: `ENTREPRISE ${siren}`,
          Statut: "Active",
          Representants: [
            {
              Nom: "MARTIN",
              Prenom: "Jean",
              DateNaissance: "1980-01-15",
              LieuNaissance: "Paris",
              Nationalite: "Française",
              Qualite: "Président",
              DateDebut: "2020-01-01",
              DateFin: null
            }
          ]
        }
      };
      
    case 'comptes':
    case 'comptesannuels':
      return {
        ...baseData,
        Data: {
          CodeGreffe: "7501",
          Siren: siren,
          Denomination: `ENTREPRISE ${siren}`,
          Millesime: 2023,
          TypeComptes: "Comptes annuels",
          Liasse: "2050",
          Devise: "EUR",
          DateCloture: "2023-12-31",
          DureeExo: 12,
          DureeExoPrecedent: 12,
          Postes: [
            { Code: "FL", Libelle: "Chiffre d'affaires net", Valeur: 1500000 },
            { Code: "FM", Libelle: "Production stockée", Valeur: 0 },
            { Code: "FN", Libelle: "Production immobilisée", Valeur: 0 }
          ]
        }
      };
      
    case 'procedures':
    case 'procedurescollectives':
      return {
        ...baseData,
        Data: {
          CodeGreffe: "7501",
          Siren: siren,
          Denomination: `ENTREPRISE ${siren}`,
          ExistenceProcedure: false,
          Procedures: []
        }
      };
      
    case 'repartitioncapital':
    case 'associes':
      return {
        ...baseData,
        Data: {
          ReferentielGreffe: {
            CodeGreffe: "7501",
            NomGreffe: "Paris",
            Adresse: "1 Quai de la Corse, 75001 Paris"
          },
          SocieteInfos: {
            Denomination: `ENTREPRISE ${siren}`,
            Siren: siren,
            Registre: "RCS Paris",
            LibelleGreffe: "Paris",
            Adresse: "123 Rue de la Paix, 75001 Paris",
            LibelleFormeJuridique: "SAS"
          },
          CapitalSocial: {
            Montant: 50000,
            NbrParts: 5000,
            PourcentageDetentionPP: 80,
            PourcentageDetentionPM: 20
          },
          CapitalDetention: [
            {
              TypePersonne: "PP",
              Nom: "MARTIN",
              Prenom: "Jean",
              NombreParts: 4000,
              Pourcentage: 80
            },
            {
              TypePersonne: "PM",
              Denomination: "HOLDING MARTIN",
              Siren: "123456789",
              NombreParts: 1000,
              Pourcentage: 20
            }
          ]
        }
      };
      
    default:
      // entreprise/ficheidentite endpoint
      return generateDefaultMockData(siren);
  }
}

function generateDefaultMockData(siren: string) {
  const formes = ['SAS', 'SARL', 'SA', 'SCI', 'EURL', 'SASU'];
  const greffes = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nantes', 'Strasbourg'];
  const activites = [
    'Services informatiques et conseil',
    'Commerce de détail spécialisé',
    'Industrie manufacturière',
    'Services financiers et assurance',
    'Conseil aux entreprises',
    'Commerce de gros',
    'Transport et logistique',
    'Services de santé',
    'Éducation et formation'
  ];

  // Générer des données cohérentes basées sur le SIREN
  const formeIndex = parseInt(siren.slice(-1)) % formes.length;
  const greffeIndex = parseInt(siren.slice(-2, -1)) % greffes.length;
  const activiteIndex = parseInt(siren.slice(-3, -2)) % activites.length;
  
  const capitalBase = parseInt(siren.slice(-3));
  const capital = Math.max(1000, capitalBase * 100 + 10000);
  
  const year = 2000 + (parseInt(siren.slice(-2)) % 24);
  const month = Math.max(1, parseInt(siren.slice(-1)) % 12);
  const day = Math.max(1, parseInt(siren.slice(-2, -1)) % 28);
  const dateImmatriculation = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  return {
    siren,
    forme_juridique: formes[formeIndex],
    capital_social: capital,
    date_immatriculation: dateImmatriculation,
    numero_rcs: `${siren} RCS ${greffes[greffeIndex]}`,
    greffe: greffes[greffeIndex],
    activite_principale: activites[activiteIndex],
    duree_personne_morale: '99 ans',
    date_cloture_exercice: '31/12',
    procedures: [],
    actes: [
      {
        date: `${year + 2}-03-15`,
        type: 'Modification des statuts',
        description: 'Modification de l\'objet social'
      },
      {
        date: `${year + 1}-01-20`,
        type: 'Modification du capital',
        description: 'Augmentation de capital social'
      }
    ],
    comptes: [
      {
        annee: 2023,
        date_depot: '2024-05-15',
        type: 'Comptes annuels',
        statut: 'Déposé'
      },
      {
        annee: 2022,
        date_depot: '2023-05-12',
        type: 'Comptes annuels',
        statut: 'Déposé'
      },
      {
        annee: 2021,
        date_depot: '2022-04-30',
        type: 'Comptes annuels',
        statut: 'Déposé'
      }
    ]
  };
}