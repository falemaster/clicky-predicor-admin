import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { siren, companyData } = await req.json();

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

    console.log(`Analyzing company data for SIREN: ${siren}`);

    // Calcul des scores basés sur les données disponibles
    const scores = calculateScores(companyData);
    
    // Analyse prédictive basée sur les facteurs de risque
    const probabiliteDefaut = calculateDefaultProbability(companyData, scores);
    
    // Identification des facteurs explicatifs
    const facteursExplicatifs = identifyRiskFactors(companyData, scores);
    
    // Génération d'alertes basées sur les seuils
    const alertes = generateAlerts(companyData, scores, probabiliteDefaut);
    
    // Recommandations personnalisées
    const recommandations = await generateRecommendations(companyData, scores, facteursExplicatifs);

    const analysis = {
      siren,
      scores,
      probabiliteDefaut,
      facteursExplicatifs,
      alertes,
      recommandations,
      analysisDate: new Date().toISOString(),
      version: '1.0'
    };

    console.log(`Analysis completed for SIREN: ${siren}`);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in predictor-analysis function:', error);
    return new Response(JSON.stringify({ 
      error: { 
        code: 'PREDICTOR_INTERNAL_ERROR', 
        message: error instanceof Error ? error.message : 'Erreur inconnue' 
      } 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateScores(companyData: any) {
  const scores = {
    global: 5.0,
    financier: 5.0,
    legal: 5.0,
    fiscal: 5.0,
    prediction: 5.0
  };

  // Score financier basé sur les données Pappers
  if (companyData.pappers?.bilans?.length > 0) {
    const dernierBilan = companyData.pappers.bilans[0];
    if (dernierBilan.chiffreAffaires > 0) {
      const rentabilite = dernierBilan.resultatNet / dernierBilan.chiffreAffaires;
      const endettement = dernierBilan.dettes / (dernierBilan.fondsPropresBruts || 1);
      
      scores.financier = Math.max(1, Math.min(10, 
        5 + (rentabilite * 10) - (endettement * 2)
      ));
    }
  }

  // Score légal basé sur les procédures BODACC
  if (companyData.bodacc?.annonces?.length > 0) {
    const proceduresRecentes = companyData.bodacc.annonces.filter((a: any) => 
      a.type === 'Procédure collective' && 
      new Date(a.date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    );
    scores.legal = proceduresRecentes.length > 0 ? 2.0 : 8.0;
  }

  // Score fiscal (placeholder - nécessite intégration données privées)
  scores.fiscal = 7.0;

  // Score global (moyenne pondérée)
  scores.global = (scores.financier * 0.4 + scores.legal * 0.3 + scores.fiscal * 0.3);
  scores.prediction = scores.global;

  return scores;
}

function calculateDefaultProbability(companyData: any, scores: any) {
  const baseRisk = Math.max(0, (10 - scores.global) / 10);
  
  return {
    mois3: Math.min(0.5, baseRisk * 0.1),
    mois6: Math.min(0.7, baseRisk * 0.2),
    mois12: Math.min(0.9, baseRisk * 0.4)
  };
}

function identifyRiskFactors(companyData: any, scores: any) {
  const factors = [];

  // Facteur âge de l'entreprise
  if (companyData.sirene?.dateCreation) {
    const age = (new Date().getTime() - new Date(companyData.sirene.dateCreation).getTime()) / (365 * 24 * 60 * 60 * 1000);
    factors.push({
      nom: 'Ancienneté de l\'entreprise',
      impact: age < 3 ? -0.3 : age > 10 ? 0.2 : 0,
      importance: 0.7,
      explication: age < 3 ? 'Entreprise jeune - risque accru' : age > 10 ? 'Entreprise établie - facteur positif' : 'Ancienneté modérée'
    });
  }

  // Facteur taille (effectifs)
  if (companyData.sirene?.effectifs) {
    const effectifs = companyData.sirene.effectifs;
    const impact = effectifs.includes('0') ? -0.2 : effectifs.includes('200') ? 0.3 : 0.1;
    factors.push({
      nom: 'Taille de l\'entreprise',
      impact,
      importance: 0.6,
      explication: `Effectifs: ${effectifs}`
    });
  }

  // Facteur performance financière
  if (scores.financier) {
    factors.push({
      nom: 'Performance financière',
      impact: (scores.financier - 5) / 5,
      importance: 0.9,
      explication: scores.financier > 7 ? 'Bonne santé financière' : scores.financier < 4 ? 'Difficultés financières' : 'Situation financière moyenne'
    });
  }

  return factors;
}

function generateAlerts(companyData: any, scores: any, probabilite: any) {
  const alerts = [];

  if (scores.global < 4) {
    alerts.push({
      type: 'Risque',
      niveau: 'Critique',
      message: 'Score global critique - surveillance renforcée requise',
      date: new Date().toISOString(),
      actions: ['Demander garanties supplémentaires', 'Réviser conditions commerciales', 'Contact commercial prioritaire']
    });
  } else if (scores.global < 6) {
    alerts.push({
      type: 'Risque',
      niveau: 'Élevé',
      message: 'Score global en dessous des seuils acceptables',
      date: new Date().toISOString(),
      actions: ['Surveillance mensuelle', 'Vérification des paiements', 'Mise à jour trimestrielle']
    });
  }

  if (probabilite.mois3 > 0.1) {
    alerts.push({
      type: 'Surveillance',
      niveau: 'Modéré',
      message: 'Probabilité de défaut à 3 mois élevée',
      date: new Date().toISOString(),
      actions: ['Suivi rapproché', 'Vérification références clients']
    });
  }

  return alerts;
}

async function generateRecommendations(companyData: any, scores: any, facteurs: any) {
  const recommendations = [];

  if (scores.financier < 5) {
    recommendations.push('Demander les 3 derniers bilans comptables pour analyse approfondie');
    recommendations.push('Mettre en place un suivi mensuel des paiements');
  }

  if (scores.legal < 6) {
    recommendations.push('Vérifier l\'absence de procédures collectives en cours');
    recommendations.push('Surveiller les publications BODACC mensuellement');
  }

  recommendations.push('Effectuer une mise à jour complète dans 3 mois');

  // Utiliser OpenAI pour des recommandations personnalisées si disponible
  if (OPENAI_API_KEY && scores.global < 7) {
    try {
      const prompt = `Basé sur les données suivantes d'une entreprise:
- Score global: ${scores.global}/10
- Score financier: ${scores.financier}/10  
- Score légal: ${scores.legal}/10
- Secteur: ${companyData.sirene?.naf || 'Non spécifié'}
- Effectifs: ${companyData.sirene?.effectifs || 'Non spécifié'}

Génère 2-3 recommandations spécifiques et actionnables pour réduire les risques commerciaux. Sois concret et professionnel.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un expert en analyse de risque commercial. Réponds de manière concise et professionnelle.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 300,
          temperature: 0.7
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiRecommendations = data.choices[0].message.content
          .split('\n')
          .filter((line: string) => line.trim().length > 0)
          .slice(0, 3);
        
        recommendations.push(...aiRecommendations);
      }
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    }
  }

  return recommendations.slice(0, 6); // Limiter à 6 recommandations max
}