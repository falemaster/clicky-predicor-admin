import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredictiveAnalysis from "@/components/predictive/PredictiveAnalysis";
import AdvancedStudy from "@/components/study/AdvancedStudy";
import { Search, Building, TrendingUp, Shield, Users } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState("home");

  if (activeView === "predictive") {
    return <PredictiveAnalysis />;
  }

  if (activeView === "study") {
    return <AdvancedStudy />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Predicor</h1>
                <p className="text-sm text-slate-600">Évaluation des risques d'entreprise</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" size="sm">Accueil</Button>
              <Button variant="ghost" size="sm">Solutions</Button>
              <Button variant="ghost" size="sm">Tarifs</Button>
              <Button variant="ghost" size="sm">Contact</Button>
              <Button size="sm">Connexion</Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Évaluez les risques<br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              de vos partenaires
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Plateforme SaaS d'analyse prédictive pour évaluer la santé financière 
            et les risques de défaillance de vos clients et fournisseurs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-700"
              onClick={() => setActiveView("study")}
            >
              <Search className="h-5 w-5 mr-2" />
              Voir l'exemple d'étude
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setActiveView("predictive")}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Analyse prédictive
            </Button>
          </div>
        </div>

        {/* Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setActiveView("study")}>
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Étude Complète</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Analyse détaillée de l'identité, situation financière, commerciale et juridique de l'entreprise
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Informations légales et dirigeants</li>
                <li>• Bilans et ratios financiers</li>
                <li>• Portefeuille clients et analyse sectorielle</li>
                <li>• Procédures juridiques et conformité</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setActiveView("predictive")}>
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Analyse Prédictive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Évaluation du risque de défaillance avec score sur 10 et probabilités à 12 mois
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Score de défaillance actualisé</li>
                <li>• Tendances et projections</li>
                <li>• Alertes et signaux faibles</li>
                <li>• Recommandations d'actions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Surveillance Continue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Monitoring en temps réel avec alertes automatiques sur les évolutions critiques
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Veille automatisée 24/7</li>
                <li>• Notifications personnalisées</li>
                <li>• Rapports périodiques</li>
                <li>• Tableaux de bord interactifs</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Demo Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Découvrez nos analyses en action
            </h2>
            <p className="text-slate-600">
              Explorez des exemples concrets d'analyses d'entreprises avec nos outils avancés
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="financial">Financier</TabsTrigger>
              <TabsTrigger value="risk">Risques</TabsTrigger>
              <TabsTrigger value="predictions">Prédictions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      SOCIETE EXEMPLE SAS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Secteur</span>
                        <span className="text-sm font-medium">Commerce de gros</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">CA 2024</span>
                        <span className="text-sm font-medium">2.8M€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Employés</span>
                        <span className="text-sm font-medium">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Score de risque</span>
                        <span className="text-sm font-bold text-red-600">7.2/10</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Indicateurs Clés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Liquidité</span>
                        <span className="text-sm font-medium text-green-600">Correcte</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rentabilité</span>
                        <span className="text-sm font-medium text-red-600">Négative</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Concentration clients</span>
                        <span className="text-sm font-medium text-orange-600">Élevée</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Conformité</span>
                        <span className="text-sm font-medium text-green-600">Partielle</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution Financière</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                    [Graphique d'évolution du CA et résultat sur 3 ans]
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-red-600">Risques Élevés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Résultat net négatif</li>
                      <li>• Procédure judiciaire</li>
                      <li>• Dépendance clientèle</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-600">Surveillance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Endettement élevé</li>
                      <li>• Secteur concurrentiel</li>
                      <li>• Assurance incomplète</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-600">Points Forts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm space-y-1">
                      <li>• Équipe expérimentée</li>
                      <li>• Secteur en croissance</li>
                      <li>• Liquidité correcte</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scénarios à 12 mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 mb-2">28%</div>
                      <div className="text-sm font-medium text-red-800">Risque de défaillance</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600 mb-2">45%</div>
                      <div className="text-sm font-medium text-orange-800">Stabilisation difficultés</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">27%</div>
                      <div className="text-sm font-medium text-green-800">Amélioration situation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-8">
            <Button 
              size="lg" 
              onClick={() => setActiveView("study")}
              className="bg-gradient-to-r from-blue-600 to-blue-700"
            >
              Voir l'analyse complète
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Prêt à sécuriser vos relations d'affaires ?
          </h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Rejoignez plus de 500 entreprises qui font confiance à Predicor pour évaluer leurs partenaires commerciaux
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700">
              Démarrer l'essai gratuit
            </Button>
            <Button variant="outline" size="lg">
              Demander une démo
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold">Predicor</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Votre partenaire pour l'évaluation des risques d'entreprise et la prise de décision éclairée.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Analyse de risque</li>
                <li>Surveillance continue</li>
                <li>Rapports personnalisés</li>
                <li>API & Intégrations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>À propos</li>
                <li>Blog</li>
                <li>Carrières</li>
                <li>Presse</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Centre d'aide</li>
                <li>Documentation</li>
                <li>Contact</li>
                <li>Statut</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2025 Predicor. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;