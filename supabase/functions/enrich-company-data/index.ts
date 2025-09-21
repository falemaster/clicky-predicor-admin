import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { companyData } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Construct the prompt for ChatGPT to enrich missing data
    const prompt = `Tu es un expert en données d'entreprises françaises. À partir des informations disponibles, génère les données manquantes probables pour cette entreprise.

DONNÉES DISPONIBLES :
- Nom: ${companyData.name || 'Non disponible'}
- SIREN: ${companyData.siren || 'Non disponible'}
- Secteur NAF: ${companyData.naf || 'Non disponible'}
- Adresse: ${companyData.address || 'Non disponible'}
- Nombre d'employés: ${companyData.employees || 'Non disponible'}
- Année de création: ${companyData.foundedYear || 'Non disponible'}

GÉNÈRE un JSON avec les données manquantes probables :

{
  "contactInfo": {
    "phone": "Numéro de téléphone probable (format français)",
    "email": "Email probable de contact général",
    "website": "URL probable du site web"
  },
  "legalInfo": {
    "preciseForm": "Forme juridique précise (SAS, SARL, SA, etc.)",
    "socialCapital": "Capital social probable en euros",
    "rcsNumber": "Numéro RCS probable",
    "fiscalYearEnd": "Date de fin d'exercice probable (MM-DD)"
  },
  "businessInfo": {
    "detailedActivity": "Description détaillée de l'activité (2-3 phrases)",
    "secondaryActivities": ["Activité secondaire 1", "Activité secondaire 2"],
    "collectiveAgreement": "Convention collective probable",
    "mainClients": "Type de clientèle principale"
  },
  "financialIndicators": {
    "estimatedRevenue": "Chiffre d'affaires estimé basé sur le secteur et la taille",
    "profitabilityRange": "Fourchette de rentabilité probable (%)",
    "growthTrend": "Tendance de croissance probable",
    "riskFactors": ["Facteur de risque 1", "Facteur de risque 2"]
  },
  "metadata": {
    "dataQuality": "Estimation de la fiabilité des données (1-10)",
    "sources": "Sources utilisées pour l'estimation",
    "confidence": "Niveau de confiance global (%)"
  }
}

INSTRUCTIONS :
- Utilise ta connaissance des entreprises françaises pour faire des estimations réalistes
- Base-toi sur le secteur d'activité NAF pour estimer les données manquantes
- Sois cohérent avec la taille de l'entreprise (nombre d'employés)
- Génère des données plausibles, pas fantaisistes
- Réponds UNIQUEMENT en JSON valide`;

    console.log('Calling OpenAI API for data enrichment...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Tu es un expert en données d\'entreprises françaises. Tu génères des estimations réalistes de données manquantes en JSON.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    console.log('Generated enriched data:', generatedText);

    // Parse the JSON response from ChatGPT
    let enrichedData;
    try {
      enrichedData = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse ChatGPT response as JSON:', parseError);
      console.error('Raw response:', generatedText);
      
      // Fallback: return basic enriched data structure
      enrichedData = {
        contactInfo: {
          phone: "01 XX XX XX XX",
          email: "contact@entreprise.fr",
          website: "www.entreprise.fr"
        },
        legalInfo: {
          preciseForm: "SAS",
          socialCapital: "50000",
          rcsNumber: "XXX XXX XXX",
          fiscalYearEnd: "12-31"
        },
        businessInfo: {
          detailedActivity: "Activité principale dans le secteur spécifié",
          secondaryActivities: ["Services associés"],
          collectiveAgreement: "Convention collective du secteur",
          mainClients: "Entreprises et particuliers"
        },
        financialIndicators: {
          estimatedRevenue: "Estimation basée sur le secteur",
          profitabilityRange: "5-15%",
          growthTrend: "Stable",
          riskFactors: ["Dépendance sectorielle"]
        },
        metadata: {
          dataQuality: "5",
          sources: "Estimation automatique",
          confidence: "60"
        }
      };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      enrichedData: enrichedData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enrich-company-data function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});