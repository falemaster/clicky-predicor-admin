import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Download,
  FileText,
  BarChart3,
  Users,
  Calendar,
  Target,
  Activity,
  Zap
} from "lucide-react";

const PredictiveAnalysis = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const riskScore = 7.2;
  const getRiskLevel = (score: number) => {
    if (score <= 3) return { level: "Faible", color: "success" };
    if (score <= 6) return { level: "Modéré", color: "warning" };
    return { level: "Élevé", color: "destructive" };
  };

  const risk = getRiskLevel(riskScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Analyse Prédictive - SOCIETE EXEMPLE SAS
            </h1>
            <p className="text-slate-600">
              Évaluation complète des risques et opportunités commerciales
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Rapport
            </Button>
          </div>
        </div>
      </div>

      {/* Score de Risque Principal */}
      <Card className="mb-8 border-l-4 border-l-destructive">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-destructive">
                {riskScore}/10
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  Score de Défaillance
                </h3>
                <Badge variant={risk.color as any} className="mt-1">
                  Risque {risk.level}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
              <p className="text-sm font-medium">18 septembre 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Financier
          </TabsTrigger>
          <TabsTrigger value="commercial" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Commercial
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Prédictif
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Indicateurs clés */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Santé Financière
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ratio de liquidité</span>
                    <span className="font-medium text-success">1.8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Endettement</span>
                    <span className="font-medium text-warning">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rentabilité</span>
                    <span className="font-medium text-destructive">-2.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CA 2024</span>
                    <span className="font-medium">2.8M€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Évolution</span>
                    <span className="font-medium text-destructive flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      -15%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Employés</span>
                    <span className="font-medium">24</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Alertes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span>Retards de paiement</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span>Baisse de CA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Secteur stable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Évolution du risque */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Évolution du Score de Risque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                [Graphique d'évolution du score de risque sur 12 mois]
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyse Financière */}
        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ratios Financiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Liquidité générale", value: "1.8", trend: "stable", color: "success" },
                    { label: "Autonomie financière", value: "35%", trend: "down", color: "warning" },
                    { label: "Rotation des stocks", value: "4.2", trend: "up", color: "success" },
                    { label: "Délai de paiement", value: "65j", trend: "up", color: "destructive" },
                  ].map((ratio, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-muted/20">
                      <span className="text-sm font-medium">{ratio.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-${ratio.color}`}>{ratio.value}</span>
                        {ratio.trend === "up" && <TrendingUp className="h-3 w-3 text-success" />}
                        {ratio.trend === "down" && <TrendingDown className="h-3 w-3 text-destructive" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flux de Trésorerie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center text-muted-foreground">
                  [Graphique des flux de trésorerie]
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analyse Commerciale */}
        <TabsContent value="commercial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portefeuille Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Nombre de clients actifs</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Concentration (top 3)</span>
                    <span className="font-medium text-warning">68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Nouveaux clients (12m)</span>
                    <span className="font-medium">23</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendances Sectorielles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Croissance du secteur</span>
                    <Badge variant="success">+3.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Position concurrentielle</span>
                    <Badge variant="outline">Moyenne</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Barrières à l'entrée</span>
                    <Badge variant="warning">Faibles</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analyse Prédictive */}
        <TabsContent value="predictive" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Projections 12 mois
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="font-medium text-destructive">Risque Élevé</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Probabilité de défaillance dans les 12 prochains mois : <strong>28%</strong>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Facteurs de risque identifiés :</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-destructive rounded-full"></div>
                        Dégradation de la trésorerie
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-destructive rounded-full"></div>
                        Perte de clients majeurs
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-warning rounded-full"></div>
                        Augmentation des charges
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Surveillance renforcée</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Suivi mensuel des indicateurs clés recommandé
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-900">Actions préventives</span>
                    </div>
                    <p className="text-sm text-green-800">
                      Diversification du portefeuille clients prioritaire
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveAnalysis;