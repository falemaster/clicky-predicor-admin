import { AlertTriangle, CheckCircle, AlertCircle, TrendingUp, Shield, BarChart3 } from "lucide-react";

export interface ScoreTheme {
  textColor: string;
  iconColor: string;
  icon: any;
  description: string;
}

export function getScoreTheme(score: number, type: 'financial' | 'legal' | 'risk'): ScoreTheme {
  // Risk scores are inverted (lower is better)
  const normalizedScore = type === 'risk' ? (10 - score) : score;
  
  const themes = {
    critical: {
      textColor: "text-destructive",
      iconColor: "text-destructive",
      icon: AlertTriangle,
    },
    high: {
      textColor: "text-destructive",
      iconColor: "text-destructive", 
      icon: AlertTriangle,
    },
    medium: {
      textColor: "text-warning",
      iconColor: "text-warning",
      icon: AlertCircle,
    },
    low: {
      textColor: "text-warning",
      iconColor: "text-warning",
      icon: AlertCircle,
    },
    good: {
      textColor: "text-success",
      iconColor: "text-success",
      icon: CheckCircle,
    }
  };

  let level: keyof typeof themes;
  if (normalizedScore < 3) {
    level = 'critical';
  } else if (normalizedScore < 5) {
    level = 'high';
  } else if (normalizedScore < 6.5) {
    level = 'medium';
  } else if (normalizedScore < 8) {
    level = 'low';
  } else {
    level = 'good';
  }

  const baseTheme = themes[level];

  // Keep original icons for headers but use risk-appropriate icons for status
  let headerIcon;
  switch (type) {
    case 'financial':
      headerIcon = TrendingUp;
      break;
    case 'legal':
      headerIcon = Shield;
      break;
    case 'risk':
      headerIcon = BarChart3;
      break;
  }

  // Generate contextual descriptions
  const descriptions = {
    financial: {
      critical: "Situation financière très préoccupante nécessitant une action immédiate.",
      high: "Difficultés financières importantes détectées.",
      medium: "Santé financière correcte mais des améliorations sont possibles.",
      low: "Bonne performance financière avec quelques points d'attention.",
      good: "Excellente santé financière avec une croissance stable."
    },
    legal: {
      critical: "Non-conformité critique nécessitant une intervention urgente.",
      high: "Problèmes de conformité importants détectés.",
      medium: "Conformité globalement satisfaisante avec des améliorations possibles.",
      low: "Bonne conformité légale avec vigilance sur certains points.",
      good: "Excellente conformité légale et réglementaire."
    },
    risk: {
      critical: type === 'risk' && score >= 8 ? "Risque de défaillance très élevé à court terme." : "Situation très préoccupante.",
      high: type === 'risk' && score >= 6 ? "Risque de défaillance élevé nécessitant une surveillance." : "Risque élevé détecté.",
      medium: type === 'risk' && score >= 4 ? "Risque modéré nécessitant une vigilance." : "Niveau de risque modéré.",
      low: type === 'risk' && score >= 2 ? "Faible risque de défaillance avec surveillance recommandée." : "Faible niveau de risque.",
      good: type === 'risk' && score < 2 ? "Risque de défaillance très faible." : "Très faible risque."
    }
  };

  return {
    ...baseTheme,
    icon: headerIcon,
    description: descriptions[type][level]
  };
}
