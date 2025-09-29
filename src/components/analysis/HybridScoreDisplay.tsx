import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, Scale, DollarSign, AlertTriangle, Info, Star } from "lucide-react";
import type { HybridScoreResult } from "@/utils/hybridScoreCalculator";

interface HybridScoreDisplayProps {
  hybridScore: HybridScoreResult;
  className?: string;
}

export function HybridScoreDisplay({ hybridScore, className = "" }: HybridScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getReliabilityStars = (reliability: number) => {
    const stars = Math.round(reliability / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
      />
    ));
  };

  const subScoreIcons = {
    economic: TrendingUp,
    legal: Scale,
    financial: DollarSign,
    risk: AlertTriangle
  };

  const subScoreLabels = {
    economic: 'Économique',
    legal: 'Légal',
    financial: 'Financier',
    risk: 'Risque'
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Score Hybride</CardTitle>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1">
                    {getReliabilityStars(hybridScore.reliability.overall)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fiabilité: {hybridScore.reliability.overall}%</p>
                  <p className="text-xs">Sources: {hybridScore.reliability.sources.join(', ')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {hybridScore.isFallback && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Analyse Standard
              </Badge>
            )}
            {hybridScore.reliability.hasPremiumData && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Star className="h-3 w-3 mr-1" />
                Analyse Complète
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Global */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(hybridScore.globalScore)}`}>
            {hybridScore.globalScore}/100
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {hybridScore.explanation}
          </p>
        </div>

        {/* Sous-scores détaillés */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(hybridScore.subScores).map(([key, subScore]) => {
            const Icon = subScoreIcons[key as keyof typeof subScoreIcons];
            const label = subScoreLabels[key as keyof typeof subScoreLabels];
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">({Math.round(subScore.weight * 100)}%)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`font-semibold ${getScoreColor(subScore.score)}`}>
                      {subScore.score}/100
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex">
                            {getReliabilityStars(subScore.reliability)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fiabilité {label}: {subScore.reliability}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <Progress 
                  value={subScore.score} 
                  className="h-2"
                />
              </div>
            );
          })}
        </div>

        {/* Indicateurs de fiabilité */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Données sources:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {hybridScore.reliability.sources.map((source) => (
                <Badge key={source} variant="secondary" className="text-xs">
                  {source}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${hybridScore.reliability.hasRecentFinancialData ? 'bg-success' : 'bg-warning'}`} />
              <span>Données financières récentes</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${hybridScore.reliability.hasPremiumData ? 'bg-success' : 'bg-muted'}`} />
              <span>Analyses premium</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}