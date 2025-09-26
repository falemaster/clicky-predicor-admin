import { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DataWithSourceProps {
  children: ReactNode;
  source: 'INSEE' | 'INFOGREFFE' | 'PAPPERS' | 'PREDICTOR' | 'RUBYPAYEUR' | 'AI' | 'ALPAGE' | 'PORTALIS' | 'SIRIUS' | 'DGFIP' | 'BODACC';
  lastUpdate?: string;
  className?: string;
}

const sourceConfig = {
  INSEE: {
    label: 'INSEE',
    description: 'Données officielles INSEE/SIRENE'
  },
  INFOGREFFE: {
    label: 'Infogreffe',
    description: 'Données juridiques Infogreffe'
  },
  PAPPERS: {
    label: 'Pappers',
    description: 'Données enrichies Pappers'
  },
  PREDICTOR: {
    label: 'Predictor',
    description: 'Analyse prédictive interne'
  },
  RUBYPAYEUR: {
    label: 'RubyPayeur',
    description: 'Scores de paiement'
  },
  AI: {
    label: 'IA',
    description: 'Enrichissement par intelligence artificielle'
  },
  ALPAGE: {
    label: 'ALPAGE',
    description: 'Base de données juridiques du ministère de la Justice'
  },
  PORTALIS: {
    label: 'PORTALIS',
    description: 'Registre national des procédures collectives'
  },
  SIRIUS: {
    label: 'SIRIUS',
    description: 'Système d\'information des entreprises - DGFIP'
  },
  DGFIP: {
    label: 'DGFIP',
    description: 'Direction générale des Finances publiques'
  },
  BODACC: {
    label: 'BODACC',
    description: 'Bulletin officiel des annonces civiles et commerciales'
  }
};

export function DataWithSource({ children, source, lastUpdate, className }: DataWithSourceProps) {
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
    <Popover>
      <PopoverTrigger asChild>
        <div className={cn(
          "cursor-pointer hover:underline decoration-dotted underline-offset-2 transition-all duration-200",
          className
        )}>
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-2">
          <div className="font-medium text-sm">{config.label}</div>
          <div className="text-xs text-muted-foreground">{config.description}</div>
          {lastUpdate && (
            <div className="text-xs text-muted-foreground">
              {formatDate(lastUpdate)}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}