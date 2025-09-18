import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  MapPin, 
  Calendar, 
  Users, 
  Euro, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Scale, 
  FileText, 
  Download, 
  BarChart3, 
  Activity,
  Shield,
  Clock,
  Target,
  Zap,
  Info
} from "lucide-react";

const AdvancedStudy = () => {
  const [activeTab, setActiveTab] = useState("identity");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Étude Avancée - SOCIETE EXEMPLE SAS
            </h1>
            <p className="text-slate-600">
              Analyse complète et détaillée de l'entreprise
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Rapport PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Score de Risque Principal */}
      <Card className="mb-8 border-l-4 border-l-destructive">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-destructive mb-1">
                  7.2/10
                </div>
                <Badge variant="destructive" className="text-xs">
                  Risque Élevé
                </Badge>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  Score de Défaillance
                </h3>
                <p className="text-sm text-muted-foreground">
                  Probabilité de défaillance à 12 mois : <strong className="text-destructive">28%</strong>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Dernière analyse</p>
              <p className="text-sm font-medium">18 septembre 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation par onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="identity" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Identité
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Financier
          </TabsTrigger>
          <TabsTrigger value="commercial" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Commercial
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Juridique
          </TabsTrigger>
          <TabsTrigger value="risks" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risques
          </TabsTrigger>
          <TabsTrigger value="synthesis" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Synthèse
          </TabsTrigger>
        </TabsList>

        {/* Onglet Identité */}
        <TabsContent value="identity" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Informations Générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-muted-foreground">Dénomination</span>
                    <span className="text-sm font-medium text-right">SOCIETE EXEMPLE SAS</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-muted-foreground">SIREN</span>
                    <span className="text-sm font-medium">123 456 789</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-muted-foreground">SIRET (siège)</span>
                    <span className="text-sm font-medium">123 456 789 00012</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-muted-foreground">Code APE</span>
                    <span className="text-sm font-medium">4649Z</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-muted-foreground">Forme juridique</span>
                    <span className="text-sm font-medium">SAS</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adresse et contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  Siège Social
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">123 RUE DE L'EXEMPLE</p>
                  <p className="text-sm">75001 PARIS</p>
                  <p className="text-sm text-muted-foreground">FRANCE</p>
                </div>
                <div className="pt-4 border-t border-muted/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Créée le 15 mars 2018</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Activité Principale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm mb-1">Commerce de gros d'autres biens de consommation</p>
                    <p className="text-xs text-muted-foreground">Code NAF: 4649Z</p>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-md">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">Entreprise active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dirigeants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  Dirigeants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">M. Jean DUPONT</p>
                    <p className="text-xs text-muted-foreground">Président</p>
                    <p className="text-xs text-muted-foreground">Nommé le 15/03/2018</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium text-sm">Mme Marie MARTIN</p>
                    <p className="text-xs text-muted-foreground">Directeur Général</p>
                    <p className="text-xs text-muted-foreground">Nommée le 01/06/2020</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Capital et actionnariat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5 text-blue-600" />
                Capital et Actionnariat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Capital Social</h4>
                  <p className="text-2xl font-bold text-blue-600">100 000 €</p>
                  <p className="text-sm text-muted-foreground">Entièrement libéré</p>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Répartition</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>M. Jean DUPONT</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mme Marie MARTIN</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Autres</span>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Évolution</h4>
                  <div className="space-y-1 text-sm">
                    <p>Création: 50 000 € (2018)</p>
                    <p>Augmentation: +50 000 € (2021)</p>
                    <Badge variant="outline" className="text-xs">Stable</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Financier */}
        <TabsContent value="financial" className="space-y-6">
          {/* Chiffres clés */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Euro className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CA 2024</p>
                    <p className="text-xl font-bold">2.8M€</p>
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <TrendingDown className="h-3 w-3" />
                      -15%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Résultat Net</p>
                    <p className="text-xl font-bold text-destructive">-58k€</p>
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <TrendingDown className="h-3 w-3" />
                      -2.1%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bilan</p>
                    <p className="text-xl font-bold">1.2M€</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      +2%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Effectifs</p>
                    <p className="text-xl font-bold">24</p>
                    <div className="flex items-center gap-1 text-xs text-success">
                      <TrendingUp className="h-3 w-3" />
                      +9%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Évolution financière */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-muted/20">
                    <span className="font-medium">Année</span>
                    <span className="font-medium">CA (€)</span>
                    <span className="font-medium">Évolution</span>
                  </div>
                  {[
                    { year: "2024", ca: "2 800 000", evolution: "-15%", trend: "down" },
                    { year: "2023", ca: "3 294 000", evolution: "+8%", trend: "up" },
                    { year: "2022", ca: "3 050 000", evolution: "+12%", trend: "up" },
                    { year: "2021", ca: "2 723 000", evolution: "-5%", trend: "down" },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-1">
                      <span className="text-sm font-medium">{item.year}</span>
                      <span className="text-sm">{item.ca}</span>
                      <span className={`text-sm flex items-center gap-1 ${item.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                        {item.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {item.evolution}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ratios Financiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Liquidité générale", value: "1.8", status: "correct", desc: "Actif circulant / Dettes CT" },
                    { label: "Autonomie financière", value: "35%", status: "attention", desc: "Capitaux propres / Total bilan" },
                    { label: "Endettement", value: "65%", status: "attention", desc: "Dettes totales / Total bilan" },
                    { label: "Rentabilité nette", value: "-2.1%", status: "critique", desc: "Résultat net / CA" },
                  ].map((ratio, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{ratio.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium text-sm ${
                            ratio.status === 'correct' ? 'text-success' : 
                            ratio.status === 'attention' ? 'text-warning' : 'text-destructive'
                          }`}>
                            {ratio.value}
                          </span>
                          <Badge variant={ratio.status === 'correct' ? 'success' : ratio.status === 'attention' ? 'warning' : 'destructive'} className="text-xs">
                            {ratio.status === 'correct' ? 'Correct' : ratio.status === 'attention' ? 'Attention' : 'Critique'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{ratio.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bilan comptable simplifié */}
          <Card>
            <CardHeader>
              <CardTitle>Bilan Comptable Simplifié (2024)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4 text-center">ACTIF</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-muted/20">
                      <span className="font-medium">Immobilisations</span>
                      <span className="font-medium">280 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Incorporelles</span>
                      <span className="text-sm">15 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Corporelles</span>
                      <span className="text-sm">185 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Financières</span>
                      <span className="text-sm">80 000 €</span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b border-muted/20">
                      <span className="font-medium">Actif circulant</span>
                      <span className="font-medium">920 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Stocks</span>
                      <span className="text-sm">450 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Créances clients</span>
                      <span className="text-sm">320 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Trésorerie</span>
                      <span className="text-sm">150 000 €</span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-t-2 border-primary font-bold">
                      <span>TOTAL ACTIF</span>
                      <span>1 200 000 €</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4 text-center">PASSIF</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-muted/20">
                      <span className="font-medium">Capitaux propres</span>
                      <span className="font-medium">420 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Capital social</span>
                      <span className="text-sm">100 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Réserves</span>
                      <span className="text-sm">378 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Résultat</span>
                      <span className="text-sm text-destructive">-58 000 €</span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-b border-muted/20">
                      <span className="font-medium">Dettes</span>
                      <span className="font-medium">780 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Emprunts LT</span>
                      <span className="text-sm">280 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Dettes fournisseurs</span>
                      <span className="text-sm">350 000 €</span>
                    </div>
                    <div className="flex justify-between py-1 pl-4">
                      <span className="text-sm">- Dettes fiscales</span>
                      <span className="text-sm">150 000 €</span>
                    </div>
                    
                    <div className="flex justify-between py-2 border-t-2 border-primary font-bold">
                      <span>TOTAL PASSIF</span>
                      <span>1 200 000 €</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Commercial */}
        <TabsContent value="commercial" className="space-y-6">
          {/* Indicateurs commerciaux */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Portefeuille Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Clients actifs</span>
                    <span className="font-bold text-lg">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Nouveaux (12m)</span>
                    <span className="font-medium text-success">+23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Perdus (12m)</span>
                    <span className="font-medium text-destructive">-18</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Taux de rétention</span>
                      <Badge variant="success">88%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Concentration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top 3 clients</span>
                    <span className="font-medium text-warning">68%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Top 10 clients</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Client A</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Client B</span>
                      <span className="font-medium">23%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Client C</span>
                      <span className="font-medium">17%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CA moyen/client</span>
                    <span className="font-medium">17 950€</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Commandes/mois</span>
                    <span className="font-medium">142</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Panier moyen</span>
                    <span className="font-medium">1 640€</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Croissance</span>
                      <Badge variant="destructive">-15%</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analyse sectorielle */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse Sectorielle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4">Environnement Concurrentiel</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Croissance du secteur</span>
                      <Badge variant="success">+3.2%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nombre de concurrents</span>
                      <span className="font-medium">~450</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Position sur le marché</span>
                      <Badge variant="outline">Acteur moyen</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Barrières à l'entrée</span>
                      <Badge variant="warning">Faibles</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Opportunités & Menaces</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Digitalisation croissante</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Nouveaux marchés émergents</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span>Pression sur les marges</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span>Concurrence e-commerce</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Géolocalisation */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition Géographique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Par Région (CA 2024)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Île-de-France</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>PACA</span>
                      <span className="font-medium">22%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Rhône-Alpes</span>
                      <span className="font-medium">18%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Autres</span>
                      <span className="font-medium">15%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">International</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Export UE</span>
                      <span className="font-medium">8%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Hors UE</span>
                      <span className="font-medium">3%</span>
                    </div>
                    <div className="pt-2">
                      <Badge variant="outline">Potentiel à développer</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Canaux de Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Vente directe</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Distributeurs</span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>En ligne</span>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Juridique */}
        <TabsContent value="legal" className="space-y-6">
          {/* Statut juridique */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                Statut Juridique et Conformité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Informations Légales</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Forme juridique</span>
                        <span className="font-medium">SAS</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date de création</span>
                        <span className="font-medium">15/03/2018</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Durée de vie</span>
                        <span className="font-medium">99 ans</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Exercice social</span>
                        <span className="font-medium">01/01 - 31/12</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Comptes Annuels</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dépôt 2024</span>
                        <Badge variant="success">À jour</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dépôt 2023</span>
                        <Badge variant="success">À jour</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Commissaire aux comptes</span>
                        <Badge variant="outline">Non requis</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Conformité Réglementaire</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Immatriculation RCS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Déclarations fiscales</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">Cotisations sociales</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="text-sm">RGPD - À mettre à jour</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Assurances</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>RC Professionnelle</span>
                        <Badge variant="success">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Multirisque</span>
                        <Badge variant="success">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Cyber-risques</span>
                        <Badge variant="destructive">Manquante</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Procédures Juridiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Procédures Juridiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                  <h4 className="font-medium mb-3 text-orange-900">Procédures Non-Contentieuses</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm py-2 border-b border-muted/20">
                      <span className="font-medium text-muted-foreground">Nature</span>
                      <span className="font-medium text-muted-foreground">Statut</span>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1">
                      <span>Saisine pour mesures conservatoires</span>
                      <Badge variant="warning" className="text-xs">En cours</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1">
                      <span>Injonction de payer</span>
                      <Badge variant="outline" className="text-xs">Terminée</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1">
                      <span>Référé provision</span>
                      <Badge variant="success" className="text-xs">Favorable</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                  <h4 className="font-medium mb-3 text-red-900">Procédures Judiciaires</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm py-2 border-b border-muted/20">
                      <span className="font-medium text-muted-foreground">Nature</span>
                      <span className="font-medium text-muted-foreground">Statut</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2 italic">
                      Source des données : Portalys
                    </div>
                    <div className="flex justify-between items-center text-sm py-1">
                      <span>Assignation Tribunal de commerce</span>
                      <Badge variant="destructive" className="text-xs">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1">
                      <span>Contentieux commercial</span>
                      <Badge variant="warning" className="text-xs">En appel</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm py-1">
                      <span>Litige fournisseur</span>
                      <Badge variant="outline" className="text-xs">Clôturé</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analyse des risques juridiques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Analyse des Risques Juridiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-l-4 border-l-destructive">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">Risque Élevé</h5>
                        <Badge variant="destructive">3</Badge>
                      </div>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Procédure en cours</li>
                        <li>• Défaut de paiement récurrent</li>
                        <li>• Non-conformité RGPD</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-warning">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">Risque Modéré</h5>
                        <Badge variant="warning">2</Badge>
                      </div>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Assurance cyber manquante</li>
                        <li>• Contentieux en appel</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-success">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm">Conformité</h5>
                        <Badge variant="success">5</Badge>
                      </div>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Comptes à jour</li>
                        <li>• Assurances principales</li>
                        <li>• Immatriculation valide</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Recommandations Prioritaires</span>
                  </div>
                  <ul className="text-sm space-y-1 text-blue-800">
                    <li>• Mise en conformité RGPD urgente</li>
                    <li>• Souscription assurance cyber-risques</li>
                    <li>• Suivi rapproché des procédures en cours</li>
                    <li>• Renforcement de la gestion des créances</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Risques */}
        <TabsContent value="risks" className="space-y-6">
          {/* Matrice des risques */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Matrice des Risques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4">Risques Financiers</h4>
                  <div className="space-y-3">
                    {[
                      { risk: "Liquidité", level: "Élevé", impact: "Critique", probability: "Moyenne" },
                      { risk: "Solvabilité", level: "Élevé", impact: "Critique", probability: "Élevée" },
                      { risk: "Change", level: "Faible", impact: "Faible", probability: "Faible" },
                      { risk: "Taux d'intérêt", level: "Modéré", impact: "Modéré", probability: "Moyenne" },
                    ].map((risk, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium text-sm">{risk.risk}</span>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={risk.level === 'Élevé' ? 'destructive' : risk.level === 'Modéré' ? 'warning' : 'success'} className="text-xs">
                              {risk.level}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div>Impact: {risk.impact}</div>
                          <div>Prob.: {risk.probability}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Risques Opérationnels</h4>
                  <div className="space-y-3">
                    {[
                      { risk: "Dépendance clients", level: "Élevé", impact: "Critique", probability: "Élevée" },
                      { risk: "Compétences clés", level: "Modéré", impact: "Élevé", probability: "Moyenne" },
                      { risk: "Supply chain", level: "Modéré", impact: "Modéré", probability: "Moyenne" },
                      { risk: "Cyber-sécurité", level: "Élevé", impact: "Élevé", probability: "Moyenne" },
                    ].map((risk, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium text-sm">{risk.risk}</span>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={risk.level === 'Élevé' ? 'destructive' : risk.level === 'Modéré' ? 'warning' : 'success'} className="text-xs">
                              {risk.level}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <div>Impact: {risk.impact}</div>
                          <div>Prob.: {risk.probability}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Signaux d'alerte */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-destructive">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertes Critiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span>Retards de paiement clients</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span>Baisse significative CA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span>Procédure judiciaire active</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                    <span>Résultat net négatif</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-warning flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Surveillance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span>Concentration clientèle</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span>Endettement élevé</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span>Secteur en mutation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span>Assurance incomplète</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-success">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-success flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Points Positifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Secteur en croissance</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Équipe expérimentée</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Conformité réglementaire</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Liquidité correcte</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scénarios prédictifs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                Scénarios Prédictifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <h4 className="font-medium text-green-900 mb-3">Scénario Optimiste</h4>
                  <div className="space-y-2 text-sm text-green-800">
                    <div className="flex justify-between">
                      <span>Probabilité:</span>
                      <Badge variant="success">25%</Badge>
                    </div>
                    <div>• Reprise activité commerciale</div>
                    <div>• Règlement contentieux</div>
                    <div>• Nouveaux marchés</div>
                    <div className="pt-2 font-medium">
                      Impact: Risque faible (3/10)
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
                  <h4 className="font-medium text-orange-900 mb-3">Scénario Probable</h4>
                  <div className="space-y-2 text-sm text-orange-800">
                    <div className="flex justify-between">
                      <span>Probabilité:</span>
                      <Badge variant="warning">45%</Badge>
                    </div>
                    <div>• Stabilisation difficultés</div>
                    <div>• Maintien niveau actuel</div>
                    <div>• Surveillance renforcée</div>
                    <div className="pt-2 font-medium">
                      Impact: Risque modéré (6/10)
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                  <h4 className="font-medium text-red-900 mb-3">Scénario Pessimiste</h4>
                  <div className="space-y-2 text-sm text-red-800">
                    <div className="flex justify-between">
                      <span>Probabilité:</span>
                      <Badge variant="destructive">30%</Badge>
                    </div>
                    <div>• Aggravation des difficultés</div>
                    <div>• Perte clients majeurs</div>
                    <div>• Défaillance possible</div>
                    <div className="pt-2 font-medium">
                      Impact: Risque élevé (9/10)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Synthèse */}
        <TabsContent value="synthesis" className="space-y-6">
          {/* Score global */}
          <Card className="border-l-4 border-l-destructive">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Score Global de Risque</h2>
                  <p className="text-muted-foreground">Évaluation consolidée basée sur l'analyse multi-critères</p>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-destructive mb-2">7.2/10</div>
                  <Badge variant="destructive" className="text-sm">Risque Élevé</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-destructive">8.1</div>
                  <div className="text-sm text-muted-foreground">Financier</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-warning">6.5</div>
                  <div className="text-sm text-muted-foreground">Commercial</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-destructive">7.8</div>
                  <div className="text-sm text-muted-foreground">Juridique</div>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-warning">6.3</div>
                  <div className="text-sm text-muted-foreground">Opérationnel</div>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">Conclusion</h4>
                <p className="text-sm text-red-800">
                  L'entreprise présente un profil de risque élevé principalement dû aux difficultés financières actuelles, 
                  à la concentration de sa clientèle et aux procédures judiciaires en cours. Une surveillance rapprochée 
                  s'impose avec mise en place d'actions correctives urgentes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Plan d'actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Plan d'Actions Recommandé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4 text-destructive">Actions Urgentes (0-3 mois)</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 border rounded-lg bg-red-50 border-red-200">
                        <div className="w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                          <h5 className="font-medium text-sm">Restructuration financière</h5>
                          <p className="text-xs text-muted-foreground">Négociation échelonnements, recherche financement</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border rounded-lg bg-red-50 border-red-200">
                        <div className="w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                          <h5 className="font-medium text-sm">Gestion des contentieux</h5>
                          <p className="text-xs text-muted-foreground">Suivi procédures, négociation amiable</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border rounded-lg bg-red-50 border-red-200">
                        <div className="w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                          <h5 className="font-medium text-sm">Diversification clientèle</h5>
                          <p className="text-xs text-muted-foreground">Réduction dépendance top 3 clients</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4 text-warning">Actions Prioritaires (3-12 mois)</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 border rounded-lg bg-orange-50 border-orange-200">
                        <div className="w-6 h-6 bg-warning text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                          <h5 className="font-medium text-sm">Optimisation opérationnelle</h5>
                          <p className="text-xs text-muted-foreground">Réduction coûts, amélioration marges</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border rounded-lg bg-orange-50 border-orange-200">
                        <div className="w-6 h-6 bg-warning text-white rounded-full flex items-center justify-center text-xs font-bold">5</div>
                        <div>
                          <h5 className="font-medium text-sm">Mise en conformité</h5>
                          <p className="text-xs text-muted-foreground">RGPD, assurances, certifications</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border rounded-lg bg-orange-50 border-orange-200">
                        <div className="w-6 h-6 bg-warning text-white rounded-full flex items-center justify-center text-xs font-bold">6</div>
                        <div>
                          <h5 className="font-medium text-sm">Développement commercial</h5>
                          <p className="text-xs text-muted-foreground">Nouveaux marchés, digitalisation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Recommandations de Suivi</span>
                  </div>
                  <ul className="text-sm space-y-1 text-blue-800">
                    <li>• Reporting mensuel des indicateurs financiers clés</li>
                    <li>• Suivi trimestriel des actions correctives</li>
                    <li>• Réévaluation du score de risque tous les 6 mois</li>
                    <li>• Veille sectorielle et concurrentielle continue</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historique des évaluations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Évolution du Profil de Risque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">Période</span>
                  <span className="font-medium">Score</span>
                  <span className="font-medium">Niveau</span>
                  <span className="font-medium">Tendance</span>
                </div>
                {[
                  { period: "Sept 2025", score: "7.2", level: "Élevé", trend: "up", color: "destructive" },
                  { period: "Mars 2025", score: "6.8", level: "Élevé", trend: "up", color: "destructive" },
                  { period: "Sept 2024", score: "5.9", level: "Modéré", trend: "stable", color: "warning" },
                  { period: "Mars 2024", score: "4.3", level: "Modéré", trend: "down", color: "warning" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-sm">{item.period}</span>
                    <span className="font-medium">{item.score}/10</span>
                    <Badge variant={item.color as any} className="text-xs">{item.level}</Badge>
                    <div className="flex items-center gap-1">
                      {item.trend === 'up' && <TrendingUp className="h-3 w-3 text-destructive" />}
                      {item.trend === 'down' && <TrendingDown className="h-3 w-3 text-success" />}
                      {item.trend === 'stable' && <div className="w-3 h-0.5 bg-muted-foreground"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedStudy;