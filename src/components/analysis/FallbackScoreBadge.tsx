import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertTriangle, Info } from "lucide-react";

interface FallbackScoreBadgeProps {
  isFallback?: boolean;
  fallbackReason?: string;
  fallbackExplanation?: string;
  className?: string;
}

export function FallbackScoreBadge({ 
  isFallback, 
  fallbackReason, 
  fallbackExplanation,
  className = ""
}: FallbackScoreBadgeProps) {
  if (!isFallback) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`flex items-center space-x-1 bg-warning/10 text-warning border-warning/20 ${className}`}
          >
            <AlertTriangle className="h-3 w-3" />
            <span>Score basé sur signaux faibles</span>
            <Info className="h-3 w-3" />
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-sm">
          <div className="space-y-2">
            <p className="font-semibold text-sm">Score Fallback Activé</p>
            <p className="text-xs">
              <strong>Raison:</strong> {fallbackReason}
            </p>
            <p className="text-xs">
              {fallbackExplanation}
            </p>
            <p className="text-xs text-muted-foreground">
              Ce score est calculé à partir des données publiques disponibles (obligations légales, procédures, etc.) 
              en l'absence de données financières complètes.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}