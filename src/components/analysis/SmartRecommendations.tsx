import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, AlertTriangle, DollarSign, Users, Lightbulb, ExternalLink } from "lucide-react";
import type { CompanyFullData } from "@/types/api";
import type { PremiumRecommendation } from "@/utils/infogreffeThresholds";
import { generatePremiumRecommendations, calculatePotentialSavings } from "@/utils/infogreffeThresholds";

interface SmartRecommendationsProps {
  companyData: CompanyFullData;
  onRequestPremiumAnalysis?: (endpoint: string) => void;
  className?: string;
}

export function SmartRecommendations({ 
  companyData, 
  onRequestPremiumAnalysis,
  className = "" 
}: SmartRecommendationsProps) {
  const recommendations = generatePremiumRecommendations(companyData);
  const savings = calculatePotentialSavings(companyData);
  
  const getRecommendationIcon = (level: string) => {
    switch (level) {
      case 'essential': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'recommended': return <TrendingUp className="h-4 w-4 text-warning" />;
      case 'optional': return <Lightbulb className="h-4 w-4 text-info" />;
      default: return null;
    }
  };

  const getRecommendationColor = (level: string) => {
    switch (level) {
      case 'essential': return 'destructive';
      case 'recommended': return 'warning';
      case 'optional': return 'secondary';
      default: return 'outline';
    }
  };

  const priorityRecommendations = recommendations.filter(r => r.level !== 'skip');
  const hasRecommendations = priorityRecommendations.length > 0;

  if (!hasRecommendations && savings.totalEuros === 0) return null;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span>Recommandations Intelligentes</span>
          </CardTitle>
          {savings.totalEuros > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {savings.totalEuros.toFixed(2)}€ économisés
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{savings.totalCredits} crédits économisés</p>
                  <p className="text-xs">Analyses non nécessaires: {savings.skippedEndpoints.length}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {hasRecommendations ? (
          <>
            <div className="text-sm text-muted-foreground">
              Basé sur le profil de cette entreprise, voici nos recommandations d'analyses premium :
            </div>
            
            <div className="space-y-3">
              {priorityRecommendations.map((rec) => (
                <div key={rec.endpoint} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getRecommendationIcon(rec.level)}
                      <div>
                        <h4 className="font-medium capitalize">
                          {rec.endpoint.replace('-', ' ')}
                        </h4>
                        <Badge 
                          variant={getRecommendationColor(rec.level) as any}
                          className="text-xs mt-1"
                        >
                          {rec.level === 'essential' && 'Critique'}
                          {rec.level === 'recommended' && 'Recommandé'}
                          {rec.level === 'optional' && 'Optionnel'}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold">{rec.cost.euros.toFixed(2)}€</div>
                      <div className="text-muted-foreground">{rec.cost.credits} crédits</div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {rec.reason}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      <span>Valeur ajoutée estimée: {rec.estimatedValue}%</span>
                    </div>
                    
                    {onRequestPremiumAnalysis && (
                      <Button 
                        variant={rec.level === 'essential' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onRequestPremiumAnalysis(rec.endpoint)}
                        className="flex items-center space-x-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Analyser</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-6 space-y-2">
            <div className="text-sm text-muted-foreground">
              Aucune analyse premium recommandée pour ce profil d'entreprise.
            </div>
            <div className="text-xs text-success">
              <DollarSign className="h-3 w-3 inline mr-1" />
              Économie de {savings.totalEuros.toFixed(2)}€ grâce aux seuils intelligents
            </div>
          </div>
        )}

        {/* Résumé des économies */}
        {savings.skippedEndpoints.length > 0 && (
          <div className="border-t pt-4">
            <div className="text-xs text-muted-foreground">
              <strong>Analyses non recommandées:</strong> {savings.skippedEndpoints.join(', ')}
            </div>
            <div className="text-xs text-success mt-1">
              Ces analyses ne sont pas adaptées au profil de cette entreprise selon nos seuils intelligents.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}