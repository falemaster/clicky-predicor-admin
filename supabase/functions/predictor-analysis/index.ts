import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Import du calculateur fallback (réimplémenté pour Deno)
interface FallbackScoreResult {
  score: number;
  isFallback: true;
  reason: string;
  explanation: string;
  breakdown: {
    obligationsLegales: { penalite: number; details: string[] };
    proceduresLegales: { penalite: number; details: string[] };
    paiementsReputation: { penalite: number; bonus: number; details: string[] };
    profilStructurel: { penalite: number; details: string[] };
  };
}

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

    // Vérifier si on doit utiliser le score fallback
    const shouldUseFallback = checkShouldUseFallbackScore(companyData);
    
    let analysis: any;
    
    if (shouldUseFallback) {
      console.log(`Using fallback score for SIREN: ${siren} due to insufficient financial data`);
      
      // Calculer le score fallback
      const fallbackResult = calculateFallbackScore(companyData);
      
      // Adapter les scores pour le format existant
      const adaptedScores = {
        global: fallbackResult.score / 10, // Convertir 0-70 vers 0-7
        financier: 0, // Pas de données financières
        legal: calculateLegalScore(companyData),
        fiscal: 5.0, // Score neutre par défaut
        prediction: fallbackResult.score / 10
      };
      
      const probabiliteDefaut = calculateDefaultProbability(companyData, adaptedScores);
      const facteursExplicatifs = identifyRiskFactorsFromFallback(companyData, fallbackResult);
      const alertes = generateAlerts(companyData, adaptedScores, probabiliteDefaut);
      const recommandations = await generateRecommendationsForFallback(companyData, fallbackResult);
      
      analysis = {
        siren,
        scores: adaptedScores,
        probabiliteDefaut,
        facteursExplicatifs,
        alertes,
        recommandations,
        isFallbackScore: true,
        fallbackReason: fallbackResult.reason,
        fallbackExplanation: fallbackResult.explanation,
        fallbackBreakdown: fallbackResult.breakdown,
        analysisDate: new Date().toISOString(),
        version: '1.1-fallback'
      };
    } else {
      // Calcul normal avec données financières disponibles
      const scores = calculateScores(companyData);
      const probabiliteDefaut = calculateDefaultProbability(companyData, scores);
      const facteursExplicatifs = identifyRiskFactors(companyData, scores);
      const alertes = generateAlerts(companyData, scores, probabiliteDefaut);
      const recommandations = await generateRecommendations(companyData, scores, facteursExplicatifs);
      
      analysis = {
        siren,
        scores,
        probabiliteDefaut,
        facteursExplicatifs,
        alertes,
        recommandations,
        isFallbackScore: false,
        analysisDate: new Date().toISOString(),
        version: '1.1'
      };
    }

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

// ====== FONCTIONS POUR LE SCORE FALLBACK ======

function checkShouldUseFallbackScore(companyData: any): boolean {
  // Critères pour activer le fallback
  const hasRecentBilans = companyData.pappers?.bilans?.some((bilan: any) => {
    const currentYear = new Date().getFullYear();
    return bilan.annee >= currentYear - 2;
  });

  const hasInfogreffeScores = !!(
    companyData.infogreffe?.notapmeScores || 
    companyData.infogreffe?.afdccScore
  );

  const hasFinancialData = hasRecentBilans || hasInfogreffeScores;
  return !hasFinancialData;
}

function calculateFallbackScore(companyData: any): FallbackScoreResult {
  let scoreBase = 100;
  let totalBonus = 0;
  
  const breakdown = {
    obligationsLegales: { penalite: 0, details: [] as string[] },
    proceduresLegales: { penalite: 0, details: [] as string[] },
    paiementsReputation: { penalite: 0, bonus: 0, details: [] as string[] },
    profilStructurel: { penalite: 0, details: [] as string[] }
  };

  // 1. OBLIGATIONS LÉGALES (40%)
  const obligationsLegales = analyzeFallbackObligationsLegales(companyData);
  breakdown.obligationsLegales = obligationsLegales;
  scoreBase -= obligationsLegales.penalite;

  // 2. PROCÉDURES LÉGALES (30%)
  const proceduresLegales = analyzeFallbackProceduresLegales(companyData);
  breakdown.proceduresLegales = proceduresLegales;
  scoreBase -= proceduresLegales.penalite;

  // 3. PAIEMENTS & RÉPUTATION (20%)
  const paiementsReputation = analyzeFallbackPaiementsReputation(companyData);
  breakdown.paiementsReputation = paiementsReputation;
  scoreBase -= paiementsReputation.penalite;
  totalBonus += paiementsReputation.bonus;

  // 4. PROFIL STRUCTUREL (10%)
  const profilStructurel = analyzeFallbackProfilStructurel(companyData);
  breakdown.profilStructurel = profilStructurel;
  scoreBase -= profilStructurel.penalite;

  // Score final avec bonus mais plafonné à 70
  const finalScore = Math.min(70, Math.max(0, scoreBase + totalBonus));
  
  const explanation = generateFallbackExplanation(finalScore, companyData);
  const reason = determineFallbackReason(companyData);

  return {
    score: Math.round(finalScore),
    isFallback: true,
    reason,
    explanation,
    breakdown
  };
}

function analyzeFallbackObligationsLegales(companyData: any) {
  let penalite = 0;
  const details: string[] = [];
  
  const depotComptes = companyData.pappers?.depotComptes;
  if (depotComptes === false || !companyData.pappers?.bilans?.length) {
    const dateCreation = companyData.sirene?.dateCreation;
    if (dateCreation) {
      const ageAnnees = (new Date().getTime() - new Date(dateCreation).getTime()) / (365 * 24 * 60 * 60 * 1000);
      if (ageAnnees > 2) {
        penalite += 25;
        details.push('Absence de dépôt de comptes depuis 2+ ans');
      } else if (ageAnnees > 1) {
        penalite += 15;
        details.push('Retard dans le dépôt des comptes annuels');
      }
    }
  }

  const hasBasicInfo = !!(companyData.sirene?.denomination && companyData.sirene?.adresse);
  if (!hasBasicInfo) {
    penalite += 15;
    details.push('Informations administratives incomplètes');
  }

  return { penalite: Math.min(40, penalite), details };
}

function analyzeFallbackProceduresLegales(companyData: any) {
  let penalite = 0;
  const details: string[] = [];

  const procedures = companyData.bodacc?.annonces?.filter((a: any) => 
    a.type === 'Procédure collective' && 
    new Date(a.date) > new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000)
  ) || [];

  if (procedures.length > 0) {
    const procedureRecente = procedures.find((p: any) => 
      new Date(p.date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    );
    
    if (procedureRecente) {
      penalite += 20;
      details.push(`Procédure collective récente: ${procedureRecente.contenu}`);
    } else {
      penalite += 10;
      details.push('Antécédents de procédures collectives');
    }
  }

  if (companyData.infogreffe?.procedures?.length > 0) {
    penalite += 5;
    details.push('Procédures judiciaires en cours');
  }

  return { penalite: Math.min(30, penalite), details };
}

function analyzeFallbackPaiementsReputation(companyData: any) {
  let penalite = 0;
  let bonus = 0;
  const details: string[] = [];

  const rubyData = companyData.rubyPayeur;
  if (rubyData && !rubyData.serviceStatus) {
    if (rubyData.nbIncidents > 5) {
      penalite += 15;
      details.push(`${rubyData.nbIncidents} incidents de paiement recensés`);
    } else if (rubyData.nbIncidents > 2) {
      penalite += 8;
      details.push('Quelques incidents de paiement');
    }

    if (rubyData.retardsMoyens > 30) {
      penalite += 5;
      details.push(`Retards moyens: ${rubyData.retardsMoyens} jours`);
    }

    if (rubyData.nbIncidents === 0 && rubyData.retardsMoyens < 10) {
      bonus += 8;
      details.push('Excellent comportement de paiement');
    } else if (rubyData.nbIncidents < 2 && rubyData.retardsMoyens < 20) {
      bonus += 4;
      details.push('Bon comportement de paiement');
    }
  } else {
    penalite += 5;
    details.push('Données de paiement non disponibles');
  }

  return { 
    penalite: Math.min(20, penalite), 
    bonus: Math.min(10, bonus),
    details 
  };
}

function analyzeFallbackProfilStructurel(companyData: any) {
  let penalite = 0;
  const details: string[] = [];

  const dateCreation = companyData.sirene?.dateCreation;
  if (dateCreation) {
    const ageAnnees = (new Date().getTime() - new Date(dateCreation).getTime()) / (365 * 24 * 60 * 60 * 1000);
    if (ageAnnees < 2) {
      penalite += 5;
      details.push(`Entreprise jeune: ${Math.round(ageAnnees * 10) / 10} ans`);
    }
  }

  const effectifs = companyData.sirene?.effectifs;
  if (effectifs && (effectifs.includes('0') || effectifs === '0 salarié')) {
    penalite += 3;
    details.push('Aucun salarié déclaré');
  }

  const naf = companyData.sirene?.naf;
  const secteursRisque = ['47', '56', '68.2', '77', '81', '95'];
  if (naf && secteursRisque.some(secteur => naf.startsWith(secteur))) {
    penalite += 2;
    details.push('Secteur d\'activité à risque élevé');
  }

  return { penalite: Math.min(10, penalite), details };
}

function generateFallbackExplanation(score: number, companyData: any): string {
  const nomEntreprise = companyData.sirene?.denomination || 'Cette entreprise';
  
  if (score >= 60) {
    return `${nomEntreprise} présente un profil de risque acceptable malgré l'absence de données financières complètes. Les signaux faibles analysés sont globalement favorables.`;
  } else if (score >= 40) {
    return `${nomEntreprise} présente quelques signaux d'alerte nécessitant une vigilance accrue. L'absence de données financières complètes limite l'évaluation précise du risque.`;
  } else if (score >= 20) {
    return `${nomEntreprise} cumule plusieurs facteurs de risque significatifs. Une analyse approfondie et des garanties supplémentaires sont fortement recommandées.`;
  } else {
    return `${nomEntreprise} présente un profil à haut risque avec de multiples signaux d'alerte. Les relations commerciales doivent être évitées ou strictement encadrées.`;
  }
}

function determineFallbackReason(companyData: any): string {
  const reasons: string[] = [];
  
  if (!companyData.pappers?.bilans?.length) {
    reasons.push('Bilans financiers indisponibles');
  }
  
  if (!companyData.infogreffe?.notapmeScores) {
    reasons.push('Scores Infogreffe NOTAPME indisponibles');
  }
  
  if (!companyData.infogreffe?.afdccScore) {
    reasons.push('Score AFDCC indisponible');
  }

  return reasons.join(', ') || 'Données financières limitées';
}

function calculateLegalScore(companyData: any): number {
  if (companyData.bodacc?.annonces?.length > 0) {
    const proceduresRecentes = companyData.bodacc.annonces.filter((a: any) => 
      a.type === 'Procédure collective' && 
      new Date(a.date) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    );
    return proceduresRecentes.length > 0 ? 2.0 : 8.0;
  }
  return 7.0;
}

function identifyRiskFactorsFromFallback(companyData: any, fallbackResult: FallbackScoreResult) {
  const factors = [];

  // Facteurs basés sur le breakdown du fallback
  Object.entries(fallbackResult.breakdown).forEach(([category, data]) => {
    if (data.penalite > 0) {
      factors.push({
        nom: getCategoryLabel(category),
        impact: -Math.min(1, data.penalite / 20),
        importance: getCategoryImportance(category),
        explication: data.details.join(', ') || 'Facteur de risque détecté'
      });
    }
  });

  // Ajouter facteur global fallback
  factors.push({
    nom: 'Score basé sur signaux faibles',
    impact: (fallbackResult.score - 35) / 35, // Normalisé autour de 35 (milieu de 0-70)
    importance: 0.9,
    explication: 'Analyse basée sur les données publiques disponibles'
  });

  return factors;
}

function getCategoryLabel(category: string): string {
  const labels: { [key: string]: string } = {
    'obligationsLegales': 'Obligations légales',
    'proceduresLegales': 'Procédures légales',
    'paiementsReputation': 'Réputation de paiement',
    'profilStructurel': 'Profil structurel'
  };
  return labels[category] || category;
}

function getCategoryImportance(category: string): number {
  const importance: { [key: string]: number } = {
    'obligationsLegales': 0.8,
    'proceduresLegales': 0.9,
    'paiementsReputation': 0.7,
    'profilStructurel': 0.5
  };
  return importance[category] || 0.6;
}

async function generateRecommendationsForFallback(companyData: any, fallbackResult: FallbackScoreResult) {
  const recommendations = [];

  // Recommandations basées sur le score fallback
  if (fallbackResult.score < 40) {
    recommendations.push('Score basé sur signaux faibles - Demander analyse financière complète');
    recommendations.push('Exiger des garanties supplémentaires avant toute relation commerciale');
  } else if (fallbackResult.score < 60) {
    recommendations.push('Surveillance renforcée recommandée - Données financières à obtenir');
    recommendations.push('Vérifier les références commerciales auprès d\'autres fournisseurs');
  }

  recommendations.push('Obtenir les derniers bilans comptables pour affiner l\'analyse');
  
  // Recommandations spécifiques selon les pénalités
  if (fallbackResult.breakdown.obligationsLegales.penalite > 15) {
    recommendations.push('Vérifier le statut des obligations déclaratives de l\'entreprise');
  }
  
  if (fallbackResult.breakdown.proceduresLegales.penalite > 10) {
    recommendations.push('Surveiller étroitement les publications BODACC et tribunaux de commerce');
  }

  // IA recommendations pour scores fallback faibles
  if (OPENAI_API_KEY && fallbackResult.score < 50) {
    try {
      const prompt = `Une entreprise a un score de risque fallback de ${fallbackResult.score}/70 (basé sur signaux faibles car données financières manquantes).
Raison: ${fallbackResult.reason}
Secteur: ${companyData.sirene?.naf || 'Non spécifié'}

Génère 2 recommandations spécifiques pour gérer ce risque en l'absence de données financières.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un expert en analyse de risque. Réponds de manière concise et professionnelle pour des scores fallback.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 200,
          temperature: 0.7
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiRecommendations = data.choices[0].message.content
          .split('\n')
          .filter((line: string) => line.trim().length > 0)
          .slice(0, 2);
        
        recommendations.push(...aiRecommendations);
      }
    } catch (error) {
      console.error('Error generating AI recommendations for fallback:', error);
    }
  }

  return recommendations.slice(0, 6);
}