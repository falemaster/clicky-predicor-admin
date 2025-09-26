import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  TrendingUp, 
  Bell, 
  Calculator, 
  Radar, 
  MousePointer, 
  Target,
  CheckCircle,
  Star,
  Brain,
  Clock,
  Users,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanySearch } from '@/components/search/CompanySearch';

const Index = () => {
  const navigate = useNavigate();

  const handleCompanySelected = (siren: string) => {
    navigate(`/analysis?siren=${siren}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-primary-dark to-slate-700 rounded-lg flex items-center justify-center shadow-lg">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-warning via-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-slate-700 to-primary-dark bg-clip-text text-transparent tracking-tight">
                  Predicor
                </h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wider">
                  Analyse Financière Prédictive
                </p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                Accueil
              </Link>
              <Link to="/analysis" className="text-sm font-medium hover:text-primary transition-colors">
                Solutions
              </Link>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Tarifs
              </a>
              <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
                Souscrire Premium
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Analyse prédictive dédiée aux{' '}
                <span className="text-primary">acteurs financiers et aux environnements régulés</span>
              </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Outil d'analyse prédictive conçu pour accompagner les acteurs financiers dans l'évaluation et l'anticipation des risques d'entreprise.
          </p>
            </div>

            {/* Integrated Search */}
            <div className="max-w-2xl mx-auto">
              <CompanySearch 
                onCompanySelected={handleCompanySelected}
                className="bg-card rounded-lg border shadow-lg p-6"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={() => navigate('/analysis')}>
                <Building2 className="mr-2 h-5 w-5" />
                Analyser une entreprise
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/analysis-mockup')}>
                <ExternalLink className="mr-2 h-5 w-5" />
                Voir la démo
              </Button>
            </div>

            {/* Partner Logos */}
            <div className="pt-8">
              <p className="text-sm text-muted-foreground mb-4">Sources officielles et partenaires institutionnels certifiés</p>
              <div className="flex flex-wrap justify-center items-center gap-4 opacity-70">
                <Badge variant="outline" className="px-3 py-1 font-medium">INSEE</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">BODACC</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">Pappers</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">CreditSafe</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">DGFiP</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">Portalis</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">COPERNIC</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">CHORUS</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">HELIOS</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">CASSIOPÉE</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">RUBIS</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">ARIANE</Badge>
                <Badge variant="outline" className="px-3 py-1 font-medium">SIRHEN</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility Section */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              L'excellence technologique au service de la performance
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Notre IA propriétaire combine machine learning avancé, big data et sources institutionnelles premium pour des analyses d'une précision inégalée
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center max-w-4xl mx-auto">
            <div className="text-center">
              <Radar className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Détection Préventive IA</p>
            </div>
            <div className="text-center">
              <Calculator className="h-8 w-8 text-success mx-auto mb-2" />
              <p className="text-sm font-medium">Audit de Solvabilité</p>
            </div>
            <div className="text-center">
              <Target className="h-8 w-8 text-warning mx-auto mb-2" />
              <p className="text-sm font-medium">Scoring de Défaillance</p>
            </div>
            <div className="text-center">
              <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Intelligence Prédictive</p>
            </div>
          </div>

          <div className="flex justify-center gap-8 mt-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">50M+</div>
              <div className="text-sm text-muted-foreground">Datapoints analysés</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">99.97%</div>
              <div className="text-sm text-muted-foreground">Précision algorithmique</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Trois piliers pour votre sécurité commerciale
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une approche complète pour évaluer et surveiller vos partenaires commerciaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Building2 className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Analyse Complète</CardTitle>
                <CardDescription>
                  Vue d'ensemble exhaustive de l'entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Identité et forme juridique
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Situation financière
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Historique juridique
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Conformité réglementaire
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-success mb-4" />
                <CardTitle>Scoring Prédictif</CardTitle>
                <CardDescription>
                  Intelligence artificielle pour anticiper les risques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Probabilité de défaillance 12 mois
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Score de risque global
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Analyse financière IA
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Recommandations personnalisées
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Bell className="h-12 w-12 text-warning mb-4" />
                <CardTitle>Surveillance Continue</CardTitle>
                <CardDescription>
                  Alertes automatiques en temps réel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Surveillance 24/7 automatique
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Alertes par email/SMS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Notifications changements
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Dashboard personnalisé
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Predicor */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Pourquoi choisir Predicor ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              La solution de référence pour les professionnels du risk management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <Calculator className="h-16 w-16 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Fiabilité</h3>
              <p className="text-muted-foreground text-sm">
                Sources officielles exclusivement, données certifiées et mises à jour en temps réel
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <Radar className="h-16 w-16 text-warning mx-auto" />
              <h3 className="text-xl font-semibold">Puissance</h3>
              <p className="text-muted-foreground text-sm">
                Moteur d'IA propriétaire nouvelle génération avec deep learning et réseaux de neurones avancés
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <MousePointer className="h-16 w-16 text-success mx-auto" />
              <h3 className="text-xl font-semibold">Simplicité</h3>
              <p className="text-muted-foreground text-sm">
                Interface intuitive, rapports automatisés et intégration API facile
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <Target className="h-16 w-16 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Sérieux</h3>
              <p className="text-muted-foreground text-sm">
                Utilisé quotidiennement par les directeurs financiers et credit managers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Interactive */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Découvrez la puissance de Predicor en action
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Exemple concret d'analyse d'entreprise avec nos outils avancés
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="flex items-center justify-between">
                  <span>Analyse - SOCIÉTÉ EXEMPLE SAS</span>
                  <Badge variant="default">Score Global: 7.8/10</Badge>
                </CardTitle>
                <CardDescription>
                  SIREN: 123456789 • Secteur: Services informatiques
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                    <TabsTrigger value="financial">Analyse financière</TabsTrigger>
                    <TabsTrigger value="risks">Risques</TabsTrigger>
                    <TabsTrigger value="predictions">Prédictions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="p-6 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">7.8</div>
                        <div className="text-sm text-muted-foreground">Score Global</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-success">8.2</div>
                        <div className="text-sm text-muted-foreground">Score Financier</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-success">9.1</div>
                        <div className="text-sm text-muted-foreground">Score Légal</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-warning">2.3%</div>
                        <div className="text-sm text-muted-foreground">Risque 12M</div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="financial" className="p-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Indicateurs financiers clés</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Chiffre d'affaires</span>
                            <span className="font-medium">2.5M€</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Croissance</span>
                            <span className="font-medium text-success">+12%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Résultat net</span>
                            <span className="font-medium">340K€</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Ratio d'endettement</span>
                            <span className="font-medium text-success">23%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="risks" className="p-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Analyse des risques</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                          <span className="text-sm">Risque de liquidité</span>
                          <Badge variant="outline" className="text-success border-success">Faible</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                          <span className="text-sm">Concentration client</span>
                          <Badge variant="outline" className="text-warning border-warning">Moyen</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                          <span className="text-sm">Conformité légale</span>
                          <Badge variant="outline" className="text-success border-success">Conforme</Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="predictions" className="p-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Prédictions IA</h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Probabilité de défaillance 12 mois</span>
                            <span className="text-lg font-bold text-success">2.3%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Risque très faible basé sur l'analyse financière et les tendances sectorielles
                          </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Recommandation</span>
                            <Badge variant="default">Partenaire fiable</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Profil solide, relation commerciale recommandée avec limites standards
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <div className="text-center mt-8">
              <Button size="lg" onClick={() => navigate('/analysis-mockup')}>
                <Brain className="mr-2 h-5 w-5" />
                Tester avec vos données
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Anonymous Testimonials */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              La confiance de nos clients
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Retours d'expérience de professionnels qui utilisent Predicor au quotidien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-muted-foreground mb-4">
                  "La précision des analyses nous a permis d'éviter plusieurs défaillances majeures. 
                  L'outil est devenu indispensable pour nos décisions de crédit."
                </blockquote>
                <cite className="text-xs font-medium">
                  — Directeur Financier, Groupe industriel 500M€ CA
                </cite>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-muted-foreground mb-4">
                  "Interface très intuitive et données toujours fiables. La confidentialité 
                  est parfaitement respectée, essentiel pour notre activité."
                </blockquote>
                <cite className="text-xs font-medium">
                  — Credit Manager, Société de services BtoB
                </cite>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-muted-foreground mb-4">
                  "Le scoring prédictif nous fait gagner un temps précieux. 
                  Les alertes automatiques nous permettent de réagir rapidement."
                </blockquote>
                <cite className="text-xs font-medium">
                  — Responsable Risques, Établissement financier
                </cite>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Methodology & Compliance */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Méthodologie et conformité
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transparence totale sur nos processus et notre conformité réglementaire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Méthodologie IA</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Algorithmes d'apprentissage automatique
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Analyse multifactorielle avancée
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Modèles prédictifs sectoriels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Mise à jour continue des modèles
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calculator className="h-12 w-12 text-success mb-4" />
                <CardTitle>Conformité RGPD</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Données chiffrées bout en bout
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Hébergement sécurisé France
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Audit de sécurité régulier
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Respect du droit à l'oubli
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Target className="h-12 w-12 text-warning mb-4" />
                <CardTitle>Transparence</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Sources de données identifiées
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Processus d'analyse documenté
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Explications des scores
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Historique des modifications
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Solution premium sur-mesure
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Accompagnement personnalisé et onboarding dédié pour les établissements financiers
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <Card className="relative overflow-hidden border-2 border-primary">
              <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2">
                <span className="text-sm font-medium">Plan Premium</span>
              </div>
              <CardHeader className="pt-12 text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  À partir de 2990€
                  <span className="text-lg font-normal text-muted-foreground"> HT</span>
                </div>
                <CardDescription>
                  Solution entreprise avec accompagnement personnalisé
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm">Analyses d'entreprises illimitées</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm">Scoring prédictif IA avancé</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm">Surveillance continue 24/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm">Rapports automatisés (PDF/Excel)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm">API REST complète</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm">Support prioritaire</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm">Accès aux 6 sources de données</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Users className="mr-2 h-5 w-5" />
                  Nous contacter
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Devis personnalisé • Formation incluse • Onboarding dédié
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support & Integrations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Support Professionnel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Documentation complète
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    FAQ et tutoriels vidéo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Support email prioritaire
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Formation personnalisée
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Radar className="h-12 w-12 text-warning mb-4" />
                <CardTitle>Intégrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    API REST moderne
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Webhooks temps réel
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Exports Excel/PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Connecteurs CRM
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calculator className="h-12 w-12 text-success mb-4" />
                <CardTitle>Sécurité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Hébergement sécurisé France
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Chiffrement bout en bout
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Audits sécurité réguliers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Conformité RGPD garantie
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-card border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Predicor</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plateforme SaaS d'analyse prédictive pour la gestion des risques commerciaux.
              </p>
              <div className="flex space-x-4">
                <Badge variant="outline">RGPD Conforme</Badge>
                <Badge variant="outline">ISO 27001</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/analysis" className="hover:text-primary transition-colors">Analyse d'entreprise</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Scoring prédictif</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Surveillance continue</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API & Intégrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Équipe</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Partenaires</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Actualités</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="mailto:contact@predicor.fr" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Statut service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-primary transition-colors">CGV</a>
              <a href="#" className="hover:text-primary transition-colors">RGPD</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
              <Link to="/admin" className="hover:text-primary transition-colors text-xs">Administration</Link>
            </div>
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              © 2024 Predicor. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;