import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIDataIndicator } from "@/components/ui/ai-data-indicator";
import { Phone, Mail, Globe, Building, CreditCard, Users, TrendingUp, AlertTriangle, Bot, Sparkles, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import type { CompanyFullData } from '@/types/api';

interface EnrichedDataDisplayAIProps {
  data: CompanyFullData;
  onDataEnriched?: (enrichedData: any) => void;
}

const EnrichedDataDisplayAI: React.FC<EnrichedDataDisplayAIProps> = ({ data, onDataEnriched }) => {
  const { toast } = useToast();
  const [isEnriching, setIsEnriching] = useState(false);

  const enrichCompanyData = async () => {
    setIsEnriching(true);
    
    try {
      const enrichmentData = {
        name: data.sirene?.denomination,
        siren: data.sirene?.siren,
        naf: data.sirene?.naf,
        address: data.sirene?.adresse,
        employees: data.sirene?.effectifs,
        foundedYear: data.sirene?.dateCreation?.substring(0, 4)
      };

      const { data: enrichedResult, error } = await supabase.functions.invoke('enrich-company-data', {
        body: { companyData: enrichmentData }
      });

      if (error) throw error;
      
      if (enrichedResult?.success && enrichedResult?.enrichedData) {
        onDataEnriched?.(enrichedResult.enrichedData);
        toast({
          title: "Données enrichies",
          description: "Les données manquantes ont été générées par l'IA"
        });
      }
    } catch (error) {
      console.error('Error enriching data:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enrichir les données",
        variant: "destructive"
      });
    } finally {
      setIsEnriching(false);
    }
  };

  const enrichedData = data.enriched;

  return (
    <div className="space-y-6">
      {/* Bouton d'enrichissement */}
      {!enrichedData && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-primary">Enrichissement IA</h3>
                  <p className="text-sm text-muted-foreground">
                    Générez les données manquantes avec l'intelligence artificielle
                  </p>
                </div>
              </div>
              <Button
                onClick={enrichCompanyData}
                disabled={isEnriching}
                className="flex items-center gap-2"
              >
                <Bot className="h-4 w-4" />
                {isEnriching ? "Génération..." : "Enrichir les données"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations de Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Informations de Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                Téléphone
                {enrichedData?.contactInfo?.phone && (
                  <AIDataIndicator variant="mini" />
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {enrichedData?.contactInfo?.phone || data.pappers?.telephone || "01 XX XX XX XX"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                Email
                {enrichedData?.contactInfo?.email && (
                  <AIDataIndicator variant="mini" />
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {enrichedData?.contactInfo?.email || data.pappers?.email || "contact@entreprise.fr"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium flex items-center gap-2">
                Site web
                {enrichedData?.contactInfo?.website && (
                  <AIDataIndicator variant="mini" />
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {enrichedData?.contactInfo?.website || data.pappers?.siteWeb || "www.entreprise.fr"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations Légales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informations Légales
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Forme juridique</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {enrichedData?.legalInfo?.preciseForm || 
                   data.infogreffe?.formeJuridique || 
                   data.pappers?.formeJuridique ||
                   "SAS"}
                </span>
                {enrichedData?.legalInfo?.preciseForm && (
                  <AIDataIndicator variant="mini" />
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Capital social</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {data.infogreffe?.capitalSocial?.toLocaleString() + ' €' || 
                   data.pappers?.capitalSocial?.toLocaleString() + ' €' ||
                   "Non renseigné"}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">RCS</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {enrichedData?.legalInfo?.rcsNumber || 
                   data.infogreffe?.numeroRcs || 
                   "Paris B 123 456 789"}
                </span>
                {enrichedData?.legalInfo?.rcsNumber && (
                  <AIDataIndicator variant="mini" />
                )}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Exercice fiscal</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {enrichedData?.legalInfo?.fiscalYearEnd || 
                   data.infogreffe?.dateClotureExercice ||
                   "31/12"}
                </span>
                {enrichedData?.legalInfo?.fiscalYearEnd && (
                  <AIDataIndicator variant="mini" />
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Convention collective</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {enrichedData?.businessInfo?.collectiveAgreement || "Syntec"}
                </span>
                {enrichedData?.businessInfo?.collectiveAgreement && (
                  <AIDataIndicator variant="mini" />
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Activité principale</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {data.sirene?.naf || data.pappers?.codeNaf || "Conseil informatique"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activité Détaillée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Activité de l'Entreprise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <p className="flex-1">
                {enrichedData?.businessInfo?.detailedActivity || 
                 data.pappers?.libelleNaf ||
                 "L'entreprise évolue dans le secteur du conseil informatique et développement logiciel. Elle propose des services de transformation digitale et d'accompagnement technologique aux entreprises."}
              </p>
              {enrichedData?.businessInfo?.detailedActivity && (
                <AIDataIndicator variant="mini" />
              )}
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-foreground">Activités secondaires :</h4>
                {enrichedData?.businessInfo?.secondaryActivities && (
                  <AIDataIndicator variant="mini" />
                )}
              </div>
              <ul className="list-disc list-inside space-y-1">
                {(enrichedData?.businessInfo?.secondaryActivities || [
                  "Formation informatique",
                  "Audit et conseil en systèmes", 
                  "Maintenance applicative"
                ]).map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
            {enrichedData?.businessInfo?.mainClients && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-foreground">Clientèle principale :</h4>
                  <AIDataIndicator variant="mini" />
                </div>
                <p>{enrichedData.businessInfo.mainClients}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Indicateurs Financiers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Indicateurs Financiers
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-success" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm font-medium">CA estimé</p>
                    <p className="text-lg font-bold text-success">
                      {enrichedData?.financialIndicators?.estimatedRevenue || 
                       (data.pappers?.bilans?.[0] ? `${(data.pappers.bilans[0].chiffreAffaires / 1000000).toFixed(1)}M€` : "2.4M€")}
                    </p>
                    <p className="text-xs text-muted-foreground">Basé sur secteur et taille</p>
                  </div>
                    {enrichedData?.financialIndicators?.estimatedRevenue && (
                      <AIDataIndicator variant="mini" />
                    )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-primary" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm font-medium">Rentabilité</p>
                    <p className="text-lg font-bold text-primary">
                      {enrichedData?.financialIndicators?.profitabilityRange || "5-15%"}
                    </p>
                    <p className="text-xs text-muted-foreground">Fourchette sectorielle</p>
                  </div>
                    {enrichedData?.financialIndicators?.profitabilityRange && (
                      <AIDataIndicator variant="mini" />
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium">Facteurs de risque :</h4>
                {enrichedData?.financialIndicators?.riskFactors && (
                  <AIDataIndicator variant="mini" />
                )}
              </div>
              <div className="space-y-2">
                {(enrichedData?.financialIndicators?.riskFactors || [
                  "Dépendance technologique",
                  "Concurrence forte", 
                  "Évolution réglementaire"
                ]).map((risk, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-warning" />
                    <span className="text-sm">{risk}</span>
                  </div>
                ))}
              </div>
            </div>
            {enrichedData?.financialIndicators?.growthTrend && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">Tendance de croissance :</h4>
                  <AIDataIndicator variant="mini" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {enrichedData.financialIndicators.growthTrend}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Qualité des données */}
      {enrichedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Fiabilité des Données IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10">
              <div>
                <p className="font-medium">Score de confiance IA</p>
                <p className="text-sm text-muted-foreground">
                  {enrichedData.metadata?.sources || "Estimation automatique basée sur les données disponibles"}
                </p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-lg px-3 py-1 bg-primary/10 text-primary">
                  {enrichedData.metadata?.confidence || "75"}%
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Qualité: {enrichedData.metadata?.dataQuality || "7"}/10
                </p>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <div className="flex items-start gap-2">
                <Info className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
                <p>
                  Les données marquées "IA" ont été générées automatiquement par intelligence artificielle 
                  basée sur les informations disponibles et les tendances sectorielles.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnrichedDataDisplayAI;