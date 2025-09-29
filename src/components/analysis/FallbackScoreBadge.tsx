import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, Info } from "lucide-react";

interface FallbackScoreBadgeProps {
  isFallback?: boolean;
  fallbackReason?: string;
  fallbackExplanation?: string;
  reliability?: number; // 0-100% fiabilité
  analysisType?: 'standard' | 'complete' | 'partial';
  className?: string;
}

export function FallbackScoreBadge({ 
  isFallback, 
  fallbackReason, 
  fallbackExplanation,
  reliability = 50,
  analysisType = 'standard',
  className = ""
}: FallbackScoreBadgeProps) {
  const getBadgeConfig = () => {
    if (!isFallback && analysisType === 'complete') {
      return {
        variant: 'outline' as const,
        className: 'bg-success/10 text-success border-success/20',
        icon: <Info className="h-3 w-3" />,
        text: 'Analyse Complète',
        description: 'Analyse basée sur des données premium Infogreffe'
      };
    }
    
    if (analysisType === 'partial') {
      return {
        variant: 'outline' as const,
        className: 'bg-info/10 text-info border-info/20',
        icon: <AlertTriangle className="h-3 w-3" />,
        text: 'Données Partielles',
        description: 'Analyse mixte avec quelques données premium'
      };
    }
    
    // Default fallback/standard
    return {
      variant: 'outline' as const,
      className: 'bg-warning/10 text-warning border-warning/20',
      icon: <AlertTriangle className="h-3 w-3" />,
      text: 'Analyse Standard',
      description: 'Score basé sur les données publiques disponibles'
    };
  };

  const config = getBadgeConfig();
  
  // Ne rien afficher si c'est une analyse complète sans fallback
  if (!isFallback && analysisType === 'complete') {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={config.variant}
            className={`flex items-center space-x-1 ${config.className} ${className}`}
          >
            {config.icon}
            <span>{config.text}</span>
            {reliability && (
              <span className="text-xs">({reliability}%)</span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-sm">
          <div className="space-y-2">
            <p className="font-semibold text-sm">{config.text}</p>
            {reliability && (
              <p className="text-xs">
                <strong>Fiabilité:</strong> {reliability}%
              </p>
            )}
            {fallbackReason && (
              <p className="text-xs">
                <strong>Raison:</strong> {fallbackReason}
              </p>
            )}
            {fallbackExplanation && (
              <p className="text-xs">
                {fallbackExplanation}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {config.description}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}