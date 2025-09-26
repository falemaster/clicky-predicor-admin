import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SourceBadgeProps {
  source: 'INSEE' | 'INFOGREFFE' | 'PAPPERS' | 'PREDICTOR' | 'RUBYPAYEUR' | 'AI';
  lastUpdate?: string;
  className?: string;
}

const sourceConfig = {
  INSEE: {
    color: 'bg-primary text-primary-foreground',
    label: 'INSEE',
    description: 'Données officielles INSEE/SIRENE (gratuit)'
  },
  INFOGREFFE: {
    color: 'bg-warning text-warning-foreground',
    label: 'Infogreffe',
    description: 'Données juridiques Infogreffe (payant)'
  },
  PAPPERS: {
    color: 'bg-destructive text-destructive-foreground',
    label: 'Pappers',
    description: 'Données enrichies Pappers (coût élevé)'
  },
  PREDICTOR: {
    color: 'bg-accent text-accent-foreground',
    label: 'Predictor',
    description: 'Analyse prédictive interne'
  },
  RUBYPAYEUR: {
    color: 'bg-secondary text-secondary-foreground',
    label: 'RubyPayeur',
    description: 'Scores de paiement'
  },
  AI: {
    color: 'bg-success text-success-foreground',
    label: 'IA',
    description: 'Enrichissement par intelligence artificielle'
  }
};

export function SourceBadge({ source, lastUpdate, className }: SourceBadgeProps) {
  const config = sourceConfig[source];
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Mis à jour il y a moins d\'1h';
    if (diffHours < 24) return `Mis à jour il y a ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Mis à jour il y a ${diffDays}j`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="secondary" 
            className={`text-xs ${config.color} ${className}`}
          >
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{config.description}</p>
            {lastUpdate && (
              <p className="text-xs text-muted-foreground">
                {formatDate(lastUpdate)}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}