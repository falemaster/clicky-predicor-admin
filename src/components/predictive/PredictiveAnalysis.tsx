import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Brain,
  Target,
  Zap,
  Activity,
  Shield,
  BarChart3,
  LineChart as LineChartIcon,
  Settings,
  ArrowRight,
  Info
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';

const PredictiveAnalysis = () => {
  const riskEvolution = [
    { month: 'Jan', risk: 2.1, confidence: 89, market: 3.2 },
    { month: 'Fév', risk: 2.3, confidence: 91, market: 3.1 },
    { month: 'Mar', risk: 2.8, confidence: 88, market: 3.4 },
    { month: 'Avr', risk: 3.2, confidence: 85, market: 3.8 },
    { month: 'Mai', risk: 3.5, confidence: 87, market: 4.1 },
    { month: 'Jun', risk: 3.8, confidence: 89, market: 4.3 },
    { month: 'Jul', risk: 4.1, confidence: 86, market: 4.6 },
    { month: 'Aoû', risk: 4.3, confidence: 84, market: 4.8 },
    { month: 'Sep', risk: 4.5, confidence: 82, market: 5.1 },
    { month: 'Oct', risk: 4.7, confidence: 81, market: 5.3 },
    { month: 'Nov', risk: 4.8, confidence: 79, market: 5.5 },
    { month: 'Déc', risk: 4.9, confidence: 78, market: 5.7 }
  ];

  const stressTestData = [
    { scenario: 'Récession -10%', impact: 6.8, probability: 15 },
    { scenario: 'Perte client majeur', impact: 8.2, probability: 25 },
    { scenario: 'Crise secteur tech', impact: 5.4, probability: 20 },
    { scenario: 'Inflation +5%', impact: 4.1, probability: 40 },
    { scenario: 'Taux +3%', impact: 3.7, probability: 35 }
  ];

  const aiFactors = [
    { factor: 'Croissance CA', weight: 25, impact: 'positive', value: '+12%' },
    { factor: 'Trésorerie', weight: 20, impact: 'positive', value: 'Forte' },
    { factor: 'Retard URSSAF', weight: 15, impact: 'negative', value: 'Mineur' },
    { factor: 'Secteur porteur', weight: 18, impact: 'positive', value: 'Tech' },
    { factor: 'Dépendance clients', weight: 12, impact: 'negative', value: '45%' },
    { factor: 'Innovation R&D', weight: 10, impact: 'positive', value: '8% CA' }
  ];

  const getRiskColor = (risk: number) => {
    if (risk < 3) return 'hsl(var(--success))';
    if (risk < 5) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getRiskLevel = (risk: number) => {
    if (risk < 3) return { level: 'Faible', class: 'bg-success-light text-success' };
    if (risk < 5) return { level: 'Modéré', class: 'bg-warning-light text-warning' };
    return { level: 'Élevé', class: 'bg-destructive-light text-destructive' };
  };

  return (
    <div className="space-y-6">
      {/* Risk Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-2">2.1%</div>
              <div className="text-sm font-medium mb-2">Risque 3 mois</div>
              <Badge variant="secondary" className="bg-success-light text-success">
                Très faible
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-2">3.8%</div>
              <div className="text-sm font-medium mb-2">Risque 6 mois</div>
              <Badge variant="secondary" className="bg-success-light text-success">
                Faible
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning mb-2">4.9%</div>
              <div className="text-sm font-medium mb-2">Risque 12 mois</div>
              <Badge variant="secondary" className="bg-warning-light text-warning">
                Modéré
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm font-medium mb-2">Confiance IA</div>
              <Badge variant="secondary" className="bg-primary-light text-primary">
                Élevée
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LineChartIcon className="h-5 w-5 mr-2" />
            Évolution du Risque Prédictif (12 mois)
          </CardTitle>
          <CardDescription>
            Projection mensuelle basée sur les algorithmes d'IA avancés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={riskEvolution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="confidence"
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                stroke="none"
                name="Confiance (%)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="risk"
                stroke="hsl(var(--warning))"
                strokeWidth={3}
                name="Risque entreprise (%)"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="market"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Moyenne secteur (%)"
              />
              <ReferenceLine yAxisId="left" y={5} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Stress Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Tests de Résistance
            </CardTitle>
            <CardDescription>
              Simulation de scénarios de crise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stressTestData.map((scenario, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{scenario.scenario}</span>
                    <Badge 
                      variant="secondary" 
                      className={getRiskLevel(scenario.impact).class}
                    >
                      {scenario.impact}%
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Impact</span>
                        <span>Probabilité: {scenario.probability}%</span>
                      </div>
                      <Progress value={scenario.impact * 10} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Facteurs Discriminants IA
            </CardTitle>
            <CardDescription>
              Poids des variables dans le modèle prédictif
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiFactors.map((factor, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{factor.factor}</span>
                      <div className="flex items-center space-x-2">
                        {factor.impact === 'positive' ? 
                          <CheckCircle className="h-3 w-3 text-success" /> : 
                          <AlertTriangle className="h-3 w-3 text-warning" />
                        }
                        <span className="text-xs text-muted-foreground">{factor.value}</span>
                      </div>
                    </div>
                    <Progress value={factor.weight * 4} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      Poids: {factor.weight}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Machine Learning Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Insights Machine Learning
          </CardTitle>
          <CardDescription>
            Analyses avancées et recommandations automatisées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Target className="h-5 w-5 text-primary mr-2" />
                <h4 className="font-semibold">Modèle de Score</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Algorithme</span>
                  <span className="font-medium">XGBoost v2.1</span>
                </div>
                <div className="flex justify-between">
                  <span>Précision</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Variables</span>
                  <span className="font-medium">247</span>
                </div>
                <div className="flex justify-between">
                  <span>Entraînement</span>
                  <span className="font-medium">450K entreprises</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 text-success mr-2" />
                <h4 className="font-semibold">Signaux Faibles</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>Trend CA positif détecté</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>Recrutements récents (+5)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-3 w-3 text-warning" />
                  <span>Délais paiement +2 jours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>Innovation R&D maintenue</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-warning/5 to-warning/10 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Settings className="h-5 w-5 text-warning mr-2" />
                <h4 className="font-semibold">Recommandations</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <ArrowRight className="h-3 w-3 text-warning mt-0.5 flex-shrink-0" />
                  <span>Surveiller URSSAF mensuel</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ArrowRight className="h-3 w-3 text-warning mt-0.5 flex-shrink-0" />
                  <span>Diversifier top 3 clients</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ArrowRight className="h-3 w-3 text-warning mt-0.5 flex-shrink-0" />
                  <span>Renforcer trésorerie Q4</span>
                </div>
                <div className="flex items-start space-x-2">
                  <ArrowRight className="h-3 w-3 text-warning mt-0.5 flex-shrink-0" />
                  <span>Monitoring hebdomadaire</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Simulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Simulation de Scénarios
          </CardTitle>
          <CardDescription>
            Modélisation interactive des impacts futurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 mb-4">
              <Button variant="outline" size="sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                Croissance +20%
              </Button>
              <Button variant="outline" size="sm">
                <TrendingDown className="h-3 w-3 mr-1" />
                Récession -15%
              </Button>
              <Button variant="outline" size="sm">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Perte client majeur
              </Button>
              <Button variant="outline" size="sm">
                <Shield className="h-3 w-3 mr-1" />
                Renforcement BFR
              </Button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Info className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium">Scénario sélectionné: Croissance +20%</span>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-1">Impact sur le score</div>
                  <div className="font-semibold text-success">6.8/10 → 7.4/10</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Risque 12 mois</div>
                  <div className="font-semibold text-success">4.9% → 3.2%</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Recommandation</div>
                  <div className="font-semibold text-primary">Maintenir stratégie</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalysis;