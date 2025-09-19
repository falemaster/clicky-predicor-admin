import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminConfig } from '@/hooks/useAdminConfig';
import { Link } from 'react-router-dom';
import PredictiveAnalysis from '@/components/predictive/PredictiveAnalysis';
import AdvancedStudy from '@/components/study/AdvancedStudy';

const Home = () => {
  const [activeView, setActiveView] = useState<'home' | 'predictive' | 'study'>('home');
  const { config, content } = useAdminConfig();

  if (activeView === 'predictive') {
    return <PredictiveAnalysis />;
  }

  if (activeView === 'study') {
    return <AdvancedStudy />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">{config.companyName.charAt(0)}</span>
              </div>
              <span className="text-xl font-bold text-foreground">{config.companyName}</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">Solutions</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Entreprise</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Support</a>
              <Link to="/admin">
                <Button variant="ghost" size="sm">Admin</Button>
              </Link>
              <Button variant="outline">Se connecter</Button>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              {content.heroTitle}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setActiveView('study')}>
                Voir l'exemple d'étude
              </Button>
              <Button variant="outline" size="lg" onClick={() => setActiveView('predictive')}>
                Analyse prédictive
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Nos solutions pour {config.targetMarket}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {config.description}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {content.features.map((feature, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('study')}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Exemple d'analyse</h2>
              <p className="text-muted-foreground">
                Découvrez comment notre plateforme analyse {content.demoData.companyExample}
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="financial">Financier</TabsTrigger>
                  <TabsTrigger value="risks">Risques</TabsTrigger>
                  <TabsTrigger value="predictions">Prédictions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{content.demoData.companyExample}</CardTitle>
                      <CardDescription>Société spécialisée dans {config.industry}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{content.demoData.metrics.revenue}</div>
                          <div className="text-sm text-muted-foreground">Chiffre d'affaires</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{content.demoData.metrics.growth}</div>
                          <div className="text-sm text-muted-foreground">Croissance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{content.demoData.metrics.risk}</div>
                          <div className="text-sm text-muted-foreground">Niveau de risque</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{content.demoData.metrics.score}</div>
                          <div className="text-sm text-muted-foreground">Score global</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="financial" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Analyse financière</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Solvabilité</span>
                          <Badge variant="secondary">Bonne</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Liquidité</span>
                          <Badge variant="secondary">Correcte</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Rentabilité</span>
                          <Badge variant="secondary">Élevée</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="risks" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Facteurs de risque identifiés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {content.demoData.riskFactors.map((risk, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span>{risk}</span>
                            <Badge variant="outline">Surveillé</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="predictions" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Prédictions à 12 mois</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Probabilité de défaillance</span>
                          <Badge variant="secondary">2.1%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Évolution du CA</span>
                          <Badge variant="secondary">+12% à +18%</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Score prédit</span>
                          <Badge variant="secondary">7.4/10</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Prêt à analyser vos risques ?</h2>
            <p className="text-xl mb-8 opacity-90">
              Commencez votre essai gratuit dès aujourd'hui
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                Essai gratuit 14 jours
              </Button>
              <Button size="lg" variant="outline">
                Demander une démo
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{config.companyName.charAt(0)}</span>
                  </div>
                  <span className="text-lg font-bold">{config.companyName}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {config.description}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Solutions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {config.primaryServices.map((service, index) => (
                    <li key={index}><a href="#" className="hover:text-foreground">{service}</a></li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Entreprise</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">À propos</a></li>
                  <li><a href="#" className="hover:text-foreground">Carrières</a></li>
                  <li><a href="#" className="hover:text-foreground">Presse</a></li>
                  <li><a href="#" className="hover:text-foreground">Partenaires</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                  <li><a href="#" className="hover:text-foreground">Contact</a></li>
                  <li><a href="#" className="hover:text-foreground">Statut API</a></li>
                  <li><a href="#" className="hover:text-foreground">Politique de confidentialité</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 {config.companyName}. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;