export interface ScoreAnalysis {
  economic: number;
  financial: number;
  legal: number;
  fiscal: number;
  global: number;
}

export interface ExecutiveSummaryData {
  profile: string;
  strengths: string;
  optimizationAreas: string;
  strategicRecommendation: string;
}

export function generateExecutiveSummary(
  scores: ScoreAnalysis, 
  companyName: string = "L'entreprise"
): ExecutiveSummaryData {
  const globalScore = scores.global;
  
  // Profil général basé sur la note globale
  let profile = "";
  if (globalScore >= 8) {
    profile = `${companyName} présente un profil d'excellence avec une note moyenne de ${globalScore.toFixed(1)}/10, démontrant une performance remarquable dans l'ensemble de ses activités sectorielles.`;
  } else if (globalScore >= 6.5) {
    profile = `${companyName} présente un profil solide avec une note moyenne de ${globalScore.toFixed(1)}/10, maintenant un niveau de performance satisfaisant dans son secteur d'activité.`;
  } else if (globalScore >= 5) {
    profile = `${companyName} présente un profil moyen avec une note moyenne de ${globalScore.toFixed(1)}/10, nécessitant une attention particulière pour améliorer sa position sectorielle.`;
  } else {
    profile = `${companyName} présente un profil fragile avec une note moyenne de ${globalScore.toFixed(1)}/10, requérant des mesures correctives urgentes pour sécuriser sa pérennité.`;
  }

  // Points forts basés sur les meilleurs scores
  const scoreEntries = [
    { name: 'économique', score: scores.economic },
    { name: 'financière', score: scores.financial },
    { name: 'juridique', score: scores.legal },
    { name: 'fiscale', score: scores.fiscal }
  ].sort((a, b) => b.score - a.score);

  const topScores = scoreEntries.filter(s => s.score >= 6.5);
  let strengths = "";
  
  if (topScores.length >= 2) {
    const areas = topScores.slice(0, 2).map(s => `situation ${s.name}`).join(' et ');
    strengths = `L'entreprise maintient un niveau de performance satisfaisant dans sa ${areas}, constituant ses principaux atouts concurrentiels.`;
  } else if (topScores.length === 1) {
    strengths = `L'entreprise démontre une performance correcte principalement dans sa situation ${topScores[0].name}, qui constitue son principal point fort.`;
  } else {
    strengths = `L'entreprise présente des défis dans l'ensemble de ses domaines d'activité, nécessitant une approche globale de redressement.`;
  }

  // Axes d'optimisation basés sur les scores les plus faibles
  const weakScores = scoreEntries.filter(s => s.score < 6.5);
  let optimizationAreas = "";
  
  if (weakScores.length >= 1) {
    const areas = weakScores.slice(0, 2).map(s => `gestion ${s.name}`).join(' et ');
    optimizationAreas = `Les indicateurs montrent des opportunités d'optimisation significatives dans la ${areas}. L'amélioration de ces aspects pourrait renforcer considérablement la position concurrentielle.`;
  } else {
    optimizationAreas = `L'entreprise présente une performance équilibrée sur l'ensemble des domaines analysés, avec des opportunités d'optimisation ciblées pour atteindre l'excellence opérationnelle.`;
  }

  // Recommandation stratégique basée sur la situation globale
  let strategicRecommendation = "";
  if (globalScore >= 7) {
    strategicRecommendation = `Consolidation des acquis et mise en place d'une stratégie de croissance durable pour maintenir l'avantage concurrentiel à long terme.`;
  } else if (globalScore >= 5.5) {
    strategicRecommendation = `Mise en place d'un plan d'amélioration continue ciblé sur les domaines identifiés pour sécuriser et renforcer la performance opérationnelle.`;
  } else {
    strategicRecommendation = `Mise en place d'un plan d'action prioritaire pour redresser les indicateurs critiques et sécuriser la croissance à long terme.`;
  }

  return {
    profile,
    strengths,
    optimizationAreas,
    strategicRecommendation
  };
}