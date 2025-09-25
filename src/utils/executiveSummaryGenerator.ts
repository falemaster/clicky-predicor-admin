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
  
  // Génération d'un paragraphe libre et condensé de 6-7 lignes maximum
  let executiveSummary = "";
  
  if (globalScore >= 8) {
    executiveSummary = `${companyName} présente un profil d'excellence avec une note moyenne de ${globalScore.toFixed(1)}/10, démontrant une performance remarquable dans l'ensemble de ses activités sectorielles. L'entreprise maintient un niveau de performance exceptionnel dans ses domaines clés, constituant ses principaux atouts concurrentiels. Les indicateurs montrent une position solide avec des fondamentaux sains qui témoignent d'une gestion rigoureuse et d'une stratégie bien maîtrisée. Cette performance équilibrée offre une base stable pour envisager une croissance durable et le renforcement de l'avantage concurrentiel. La consolidation des acquis et la mise en place d'une stratégie d'expansion ciblée permettront de maintenir cette excellence opérationnelle à long terme.`;
  } else if (globalScore >= 6.5) {
    executiveSummary = `${companyName} présente un profil solide avec une note moyenne de ${globalScore.toFixed(1)}/10, maintenant un niveau de performance satisfaisant dans son secteur d'activité. L'entreprise démontre une stabilité dans ses opérations principales tout en révélant des opportunités d'optimisation ciblées qui pourraient renforcer significativement sa position concurrentielle. Les analyses sectorielles mettent en évidence des atouts importants à valoriser ainsi que des axes d'amélioration identifiés pour progresser vers l'excellence. L'équilibre général des indicateurs suggère une trajectoire positive avec un potentiel de croissance bien maîtrisé. La mise en place d'un plan d'amélioration continue sur les domaines identifiés sécurisera et renforcera durablement la performance opérationnelle.`;
  } else if (globalScore >= 5) {
    executiveSummary = `${companyName} présente un profil moyen avec une note moyenne de ${globalScore.toFixed(1)}/10, nécessitant une attention particulière pour améliorer sa position sectorielle. L'analyse révèle des défis opérationnels significatifs qui requièrent des mesures correctives ciblées pour sécuriser la pérennité de l'activité. Plusieurs domaines montrent des signaux d'alerte qui, bien que gérables, demandent une approche structurée pour redresser les indicateurs critiques. Les opportunités d'optimisation identifiées offrent des leviers d'amélioration concrets pour renforcer les fondamentaux de l'entreprise. Un plan d'action prioritaire focalisé sur les points faibles sera déterminant pour sécuriser la croissance et restaurer une trajectoire de performance durable.`;
  } else {
    executiveSummary = `${companyName} présente un profil fragile avec une note moyenne de ${globalScore.toFixed(1)}/10, requérant des mesures correctives urgentes pour sécuriser sa pérennité. L'analyse met en évidence des vulnérabilités importantes dans plusieurs domaines critiques qui nécessitent une intervention rapide et structurée. Les indicateurs révèlent des risques significatifs qui, sans action corrective immédiate, pourraient compromettre la stabilité opérationnelle et financière de l'organisation. Cette situation critique exige une approche globale de redressement avec des priorités clairement définies et un suivi rigoureux des actions mises en œuvre. La mise en place urgente d'un plan de restructuration et de stabilisation constitue un prérequis indispensable pour restaurer les équilibres fondamentaux et engager une dynamique de redressement durable.`;
  }

  return {
    profile: executiveSummary,
    strengths: "",
    optimizationAreas: "",
    strategicRecommendation: ""
  };
}