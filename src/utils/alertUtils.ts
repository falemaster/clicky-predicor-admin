import { AlertLevel } from "@/components/admin/AlertBadge";

export interface AlertConfig {
  level: AlertLevel;
  message: string;
}

export type SectionType = 'economic' | 'financial' | 'legal' | 'fiscal';

const alertMessages: Record<SectionType, Record<AlertLevel, string>> = {
  economic: {
    critical: "Défaillance probable",
    high: "Risque élevé",
    medium: "Vigilance économique", 
    low: "Attention croissance",
    good: "Performance stable"
  },
  financial: {
    critical: "Risque financier critique",
    high: "Tension financière",
    medium: "Vigilance",
    low: "Attention liquidité",
    good: "Santé financière"
  },
  legal: {
    critical: "Risque juridique critique",
    high: "Non-conformité détectée",
    medium: "Surveillance requise",
    low: "Contrôle préventif",
    good: "Conformité assurée"
  },
  fiscal: {
    critical: "Alerte fiscale majeure",
    high: "Risque fiscal élevé", 
    medium: "Vigilance fiscale",
    low: "Contrôle recommandé",
    good: "Optimisation fiscale"
  }
};

export function calculateAlert(score: number, sectionType: SectionType): AlertConfig {
  let level: AlertLevel;
  
  if (score < 3) {
    level = 'critical';
  } else if (score < 5) {
    level = 'high';
  } else if (score < 6.5) {
    level = 'medium';
  } else if (score < 8) {
    level = 'low';
  } else {
    level = 'good';
  }

  return {
    level,
    message: alertMessages[sectionType][level]
  };
}

export function getGlobalAlertLevel(scores: { economic: number; financial: number; legal: number; fiscal: number }): AlertLevel {
  const averageScore = (scores.economic + scores.financial + scores.legal + scores.fiscal) / 4;
  
  if (averageScore < 3) return 'critical';
  if (averageScore < 5) return 'high';
  if (averageScore < 6.5) return 'medium';
  if (averageScore < 8) return 'low';
  return 'good';
}

export function countAlertsByLevel(scores: { economic: number; financial: number; legal: number; fiscal: number }) {
  const sections: SectionType[] = ['economic', 'financial', 'legal', 'fiscal'];
  const alerts = sections.map(section => calculateAlert(scores[section], section));
  
  return {
    critical: alerts.filter(a => a.level === 'critical').length,
    high: alerts.filter(a => a.level === 'high').length,
    medium: alerts.filter(a => a.level === 'medium').length,
    low: alerts.filter(a => a.level === 'low').length,
    good: alerts.filter(a => a.level === 'good').length,
    total: alerts.filter(a => a.level !== 'good').length
  };
}