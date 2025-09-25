import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { AlertLevel } from "./AlertBadge";
import { calculateAlert, SectionType } from "@/utils/alertUtils";

export interface AlertSummaryBadgeProps {
  scores: {
    economic: number;
    financial: number;
    legal: number;
    fiscal: number;
  };
  className?: string;
}

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    className: "border-transparent bg-red-500 text-white hover:bg-red-600",
  },
  high: {
    icon: AlertTriangle,
    className: "border-transparent bg-orange-500 text-white hover:bg-orange-600",
  },
  medium: {
    icon: AlertCircle,
    className: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
  },
  low: {
    icon: Shield,
    className: "border-transparent bg-green-500 text-white hover:bg-green-600",
  },
  good: {
    icon: CheckCircle,
    className: "border-transparent bg-green-500 text-white hover:bg-green-600",
  },
};

const sectionLabels: Record<SectionType, string> = {
  economic: "Économique",
  financial: "Financier", 
  legal: "Juridique",
  fiscal: "Fiscal"
};

export function AlertSummaryBadge({ scores, className }: AlertSummaryBadgeProps) {
  // Calculer toutes les alertes
  const allAlerts = [
    { ...calculateAlert(scores.economic, 'economic'), type: 'economic' as SectionType },
    { ...calculateAlert(scores.financial, 'financial'), type: 'financial' as SectionType },
    { ...calculateAlert(scores.legal, 'legal'), type: 'legal' as SectionType },
    { ...calculateAlert(scores.fiscal, 'fiscal'), type: 'fiscal' as SectionType }
  ];

  // Filtrer les alertes significatives (pas good ou low)
  const significantAlerts = allAlerts.filter(alert => 
    alert.level !== 'good' && alert.level !== 'low'
  );

  // Si aucune alerte significative, ne rien afficher
  if (significantAlerts.length === 0) {
    return null;
  }

  // Trouver le niveau d'alerte le plus critique
  const levelOrder = { critical: 0, high: 1, medium: 2, low: 3, good: 4 };
  const mostCriticalLevel = significantAlerts.reduce((highest, alert) => 
    levelOrder[alert.level] < levelOrder[highest] ? alert.level : highest
  , 'good' as AlertLevel);

  const config = alertConfig[mostCriticalLevel];
  const Icon = config.icon;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button 
          className={cn(
            config.className, 
            "cursor-pointer p-1.5 h-auto rounded-full border inline-flex items-center justify-center text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", 
            className
          )}
          onClick={(e) => {
            console.log('Button clicked!', e);
          }}
        >
          <Icon className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Alertes détectées</h4>
          <div className="space-y-2">
            {significantAlerts
              .sort((a, b) => levelOrder[a.level] - levelOrder[b.level])
              .map((alert, index) => {
                const alertIcon = alertConfig[alert.level].icon;
                return (
                  <div key={`${alert.type}-${index}`} className="flex items-center space-x-2 text-xs">
                    <div className={cn(
                      "p-1 rounded-full",
                      alert.level === 'critical' && "bg-red-100",
                      alert.level === 'high' && "bg-orange-100", 
                      alert.level === 'medium' && "bg-yellow-100"
                    )}>
                      {React.createElement(alertIcon, { 
                        className: cn(
                          "h-3 w-3",
                          alert.level === 'critical' && "text-red-600",
                          alert.level === 'high' && "text-orange-600",
                          alert.level === 'medium' && "text-yellow-600"
                        )
                      })}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{sectionLabels[alert.type]}</div>
                      <div className="text-muted-foreground">{alert.message}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}