import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { FallbackScoreBadge } from "../analysis/FallbackScoreBadge";
import { 
  TrendingDown, 
  AlertTriangle, 
  BarChart3, 
  Target,
  Clock,
  Shield,
  CheckCircle,
  Info
} from "lucide-react";

interface PredictiveAnalysisProps {
  companyData?: any;
  scores?: any;
}

export function PredictiveAnalysis({ companyData, scores }: PredictiveAnalysisProps) {
  if (!companyData) return null;

  const predictorData = companyData.predictor;
  const isFallback = predictorData?.isFallbackScore;
  
  return (
    <div className="space-y-6">
      {/* En-tête avec badge fallback si applicable */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analyse Prédictive</h2>
        <FallbackScoreBadge 
          isFallback={isFallback}
          fallbackReason={predictorData?.fallbackReason}
          fallbackExplanation={predictorData?.fallbackExplanation}
        />
      </div>

      {isFallback && (
        <Alert className="border-warning/20 bg-warning/10">
          <Info className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning">
            <strong>Analyse basée sur signaux faibles:</strong> {predictorData?.fallbackExplanation}
            <br />
            <span className="text-xs">Les probabilités sont calculées à partir des données publiques disponibles.</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Affichage du breakdown fallback si disponible */}
      {isFallback && predictorData?.fallbackBreakdown && (
        <Card className="border-warning/20 bg-warning/5">
          <CardHeader>
            <CardTitle className="text-warning flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Détail du Score Fallback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(predictorData.fallbackBreakdown).map(([category, data]: [string, any]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-semibold text-sm">
                    {category === 'obligationsLegales' ? 'Obligations Légales' :
                     category === 'proceduresLegales' ? 'Procédures Légales' :
                     category === 'paiementsReputation' ? 'Paiements & Réputation' :
                     category === 'profilStructurel' ? 'Profil Structurel' : category}
                  </h4>
                  {data.penalite > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-destructive">Pénalité: -{data.penalite} pts</span>
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                    </div>
                  )}
                  {data.bonus > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-success">Bonus: +{data.bonus} pts</span>
                      <CheckCircle className="h-3 w-3 text-success" />
                    </div>
                  )}
                  {data.details?.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {data.details.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenu original du composant - Risques prédictifs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Risque 3M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {predictorData?.probabiliteDefaut?.mois3 
                  ? `${(predictorData.probabiliteDefaut.mois3 * 100).toFixed(1)}%` 
                  : '2.1%'}
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                Faible
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Risque 6M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {predictorData?.probabiliteDefaut?.mois6 
                  ? `${(predictorData.probabiliteDefaut.mois6 * 100).toFixed(1)}%` 
                  : '3.8%'}
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">
                Faible
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Risque 12M
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {predictorData?.probabiliteDefaut?.mois12 
                  ? `${(predictorData.probabiliteDefaut.mois12 * 100).toFixed(1)}%` 
                  : '4.9%'}
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Modéré
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facteurs explicatifs */}
      {predictorData?.facteursExplicatifs && predictorData.facteursExplicatifs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Facteurs Explicatifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictorData.facteursExplicatifs.map((factor: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{factor.nom}</div>
                    <div className="text-xs text-muted-foreground">
                      Impact: {factor.impact > 0 ? '+' : ''}{(factor.impact * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={factor.importance * 100} className="w-20 h-2" />
                    {factor.impact > 0 ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alertes */}
      {predictorData?.alertes && predictorData.alertes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alertes & Recommandations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictorData.alertes.map((alert: any, index: number) => (
                <Alert key={index} className={
                  alert.niveau === 'Critique' ? 'border-destructive/20 bg-destructive/10' :
                  alert.niveau === 'Élevé' ? 'border-warning/20 bg-warning/10' :
                  'border-blue-200 bg-blue-50'
                }>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium">{alert.message}</div>
                    {alert.actions && alert.actions.length > 0 && (
                      <div className="mt-2">
                        <div className="text-sm font-medium mb-1">Actions recommandées:</div>
                        <ul className="text-sm list-disc list-inside space-y-1">
                          {alert.actions.map((action: string, actionIndex: number) => (
                            <li key={actionIndex}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PredictiveAnalysis;