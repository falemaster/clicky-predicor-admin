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
    const { companyData, scores } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Construct the prompt for ChatGPT
    const prompt = `Tu es un expert-comptable et analyste financier français. 
    
Voici les données d'une entreprise :
- Nom: ${companyData.name}
- Secteur d'activité: ${companyData.naf}
- Nombre d'employés: ${companyData.employees}
- Année de création: ${companyData.foundedYear}
- Adresse: ${companyData.address}

Scores actuels :
- Score global: ${scores.global}/10
- Score financier: ${scores.financial}/10  
- Score légal: ${scores.legal}/10
- Score fiscal: ${scores.fiscal}/10
- Risque de défaut: ${scores.defaultRisk}

GÉNÈRE une analyse complète structurée en JSON avec les clés suivantes :

{
  "riskProfile": "faible|modere|eleve",
  "defaultRisk": "Très faible|Faible|Modéré|Élevé|Très élevé",
  "sections": {
    "activite": {
      "title": "Analyse de l'activité",
      "content": "Description détaillée de l'activité et du secteur (3-4 phrases)"
    },
    "financier": {
      "title": "Situation financière", 
      "content": "Analyse de la santé financière basée sur le score (3-4 phrases)"
    },
    "legal": {
      "title": "Conformité légale",
      "content": "Évaluation de la conformité légale (3-4 sentences)"
    },
    "fiscal": {
      "title": "Situation fiscale",
      "content": "Analyse de la situation fiscale (3-4 sentences)"
    }
  },
  "syntheseExecutive": "Synthèse exécutive globale en 2-3 paragraphes analysant les points clés",
  "recommandations": [
    "Recommandation concrète 1",
    "Recommandation concrète 2", 
    "Recommandation concrète 3"
  ],
  "commentairesPredictifs": {
    "evolutionRisque": "Analyse de l'évolution probable du risque sur 12 mois",
    "facteursCles": "Facteurs clés à surveiller",
    "scenarios": "Scénarios probables d'évolution"
  }
}

IMPORTANT: 
- Réponds UNIQUEMENT en JSON valide, sans commentaires
- Adapte le ton et les recommandations aux scores fournis
- Sois précis et professionnel dans tes analyses
- Si les scores sont faibles, identifie les problèmes potentiels
- Si les scores sont élevés, souligne les points forts`;

    console.log('Calling OpenAI API for company analysis...');
    
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
            content: 'Tu es un expert-comptable français spécialisé dans l\'analyse d\'entreprises. Tu réponds toujours en JSON valide.'
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    console.log('Generated analysis:', generatedText);

    // Parse the JSON response from ChatGPT
    let analysisData;
    try {
      analysisData = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse ChatGPT response as JSON:', parseError);
      console.error('Raw response:', generatedText);
      
      // Fallback: return a structured response
      analysisData = {
        riskProfile: scores.global < 4 ? 'eleve' : scores.global < 7 ? 'modere' : 'faible',
        defaultRisk: scores.defaultRisk,
        sections: {
          activite: {
            title: "Analyse de l'activité",
            content: "Analyse générée par IA indisponible. Analyse basique appliquée."
          },
          financier: {
            title: "Situation financière", 
            content: scores.financial < 4 ? "Situation financière préoccupante nécessitant une attention immédiate." : "Situation financière stable."
          },
          legal: {
            title: "Conformité légale",
            content: "Conformité légale à évaluer selon les scores fournis."
          },
          fiscal: {
            title: "Situation fiscale",
            content: "Situation fiscale nécessitant un suivi régulier."
          }
        },
        syntheseExecutive: "Analyse automatique basée sur les scores fournis.",
        recommandations: [
          "Suivre régulièrement les indicateurs financiers",
          "Maintenir la conformité réglementaire", 
          "Optimiser la gestion des risques"
        ],
        commentairesPredictifs: {
          evolutionRisque: "Evolution à surveiller selon les indicateurs actuels",
          facteursCles: "Facteurs économiques et sectoriels",
          scenarios: "Scenarios d'évolution basés sur les tendances actuelles"
        }
      };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: analysisData 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extrapolate-analysis function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});