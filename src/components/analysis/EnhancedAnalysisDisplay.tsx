import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HybridScoreDisplay } from "./HybridScoreDisplay";
import { SmartRecommendations } from "./SmartRecommendations";
import { FallbackScoreBadge } from "./FallbackScoreBadge";
import { InfogreffeOnDemand } from "./InfogreffeOnDemand";
import { InfogreffeCostTracker } from "./InfogreffeCostTracker";
import type { CompanyFullData } from "@/types/api";
import { useCompanyData } from "@/hooks/useCompanyData";
import { TrendingUp, DollarSign, Lightbulb, Database } from "lucide-react";

interface EnhancedAnalysisDisplayProps {
  companyData: CompanyFullData;
  siren: string;
  className?: string;
}

export function EnhancedAnalysisDisplay({ 
  companyData, 
  siren, 
  className = "" 
}: EnhancedAnalysisDisplayProps) {
  const { hybridScore, premiumRecommendations, costSavings } = useCompanyData();

  const handleRequestPremiumAnalysis = (endpoint: string) => {
    // Cette fonction pourrait déclencher une modal ou naviguer vers une page de commande
    console.log(`Demande d'analyse premium: ${endpoint}`);
    // TODO: Implémenter la logique de demande d'analyse premium
  };

  const handleInfogreffeDataFetched = (endpoint: string, data: any) => {
    console.log(`Données Infogreffe reçues pour ${endpoint}:`, data);
    // Les données seront automatiquement intégrées via le hook useCompanyData
  };

  if (!hybridScore) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Chargement de l'analyse...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec badge de fiabilité */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analyse Intelligente</h2>
        <FallbackScoreBadge
          isFallback={hybridScore.isFallback}
          fallbackReason={hybridScore.isFallback ? "Données financières limitées" : undefined}
          fallbackExplanation={hybridScore.explanation}
          reliability={hybridScore.reliability.overall}
          analysisType={
            hybridScore.reliability.hasPremiumData ? 'complete' :
            hybridScore.reliability.hasRecentFinancialData ? 'partial' : 'standard'
          }
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>Recommandations</span>
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Analyses Premium</span>
          </TabsTrigger>
          <TabsTrigger value="costs" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Coûts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <HybridScoreDisplay hybridScore={hybridScore} />
          
          {/* Résumé des économies */}
          {costSavings && costSavings.totalEuros > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-success" />
                  <span>Optimisation Intelligente</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {costSavings.totalEuros.toFixed(2)}€
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Économisés
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {costSavings.totalCredits}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Crédits épargnés
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {costSavings.skippedEndpoints.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Analyses évitées
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground text-center">
                  Notre système intelligent a déterminé que {costSavings.skippedEndpoints.length} analyses 
                  ne sont pas nécessaires pour ce profil d'entreprise.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <SmartRecommendations 
            companyData={companyData}
            onRequestPremiumAnalysis={handleRequestPremiumAnalysis}
          />
        </TabsContent>

        <TabsContent value="premium" className="space-y-6">
          <InfogreffeOnDemand 
            siren={siren}
            onDataFetched={handleInfogreffeDataFetched}
          />
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <InfogreffeCostTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}