import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AdvancedStudy from "@/components/study/AdvancedStudy";
import PredictiveAnalysis from "@/components/predictive/PredictiveAnalysis";
import { useAnalysisData } from "@/hooks/useAnalysisData";
import { Link } from "react-router-dom";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Share,
  Bell,
  FileText,
  BarChart3,
  Shield,
  CreditCard
} from "lucide-react";

const Analysis = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { data, generatedContent } = useAnalysisData();

  // Utiliser les données depuis le hook ou fallback vers les données par défaut
  const companyData = data.companyInfo;
  const scores = data.scores;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Predicor</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/admin-analysis">
                <Badge variant="outline" className="text-success border-success hover:bg-success/10 cursor-pointer transition-colors">Admin</Badge>
              </Link>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">J. Martin</span>
                <span className="sm:hidden">JM</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Company Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 mb-2">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">{companyData.name}</h2>
                  <Badge variant="secondary" className="bg-success-light text-success w-fit">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {companyData.status}
                  </Badge>
                </div>
                <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
                  <span>SIREN: {companyData.siren}</span>
                  <span>SIRET: {companyData.siret}</span>
                  <span>{companyData.naf}</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{scores.global}/10</div>
              <div className="text-sm text-muted-foreground">Score global</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="study">Étude approfondie</TabsTrigger>
            <TabsTrigger value="predictive">Analyse prédictive</TabsTrigger>
            <TabsTrigger value="reports">Rapports & Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{companyData.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Dirigeant: {companyData.director}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Créée en {companyData.foundedYear}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{companyData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{companyData.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Effectif: {companyData.employees} salariés</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges and Status */}
            <Card>
              <CardHeader>
                <CardTitle>Statuts et certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="bg-success-light text-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Bon payeur RubyPayeur
                  </Badge>
                  <Badge variant="secondary" className="bg-success-light text-success">
                    <Shield className="h-3 w-3 mr-1" />
                    Conformité fiscale
                  </Badge>
                  <Badge variant="secondary" className="bg-success-light text-success">
                    <FileText className="h-3 w-3 mr-1" />
                    Comptes à jour
                  </Badge>
                  <Badge variant="secondary" className="bg-warning-light text-warning">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Retard URSSAF mineur
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Scores */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-success" />
                    Santé financière
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success mb-2">{scores.financial}/10</div>
                  <p className="text-sm text-muted-foreground">
                    Résultats stables avec une croissance du CA de +12% sur l'exercice.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    Conformité légale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-2">{scores.legal}/10</div>
                  <p className="text-sm text-muted-foreground">
                    Excellent respect des obligations légales et réglementaires.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-warning" />
                    Risque prédictif 12m
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success mb-2">{scores.defaultRisk}</div>
                  <p className="text-sm text-muted-foreground">
                    Probabilité de défaillance inférieure à 5% sur 12 mois.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analyse IA globale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-100 rounded-lg p-4">
                  <p className="text-sm leading-relaxed">
                    <strong>Tech Solutions France</strong> présente un profil d'entreprise solide avec une croissance soutenue 
                    et une gestion financière équilibrée. L'entreprise respecte ses obligations légales et fiscales, 
                    avec un historique de paiement exemplaire. Le léger retard URSSAF identifié reste mineur et ne 
                    constitue pas un facteur de risque significatif. Le secteur d'activité est porteur et l'entreprise 
                    bénéficie d'une position concurrentielle favorable.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Informations juridiques détaillées */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Informations juridiques
                    </CardTitle>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Avis situation SIRENE
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">SIREN :</span>
                      <div className="font-medium">{companyData.siren}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">SIRET (siège) :</span>
                      <div className="font-medium">{companyData.siret}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Forme juridique :</span>
                      <div className="font-medium">SAS, société par actions simplifiée</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Numéro de TVA :</span>
                      <div className="font-medium">FR{companyData.siren.replace(/\s/g, '')}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Inscription RCS :</span>
                      <div className="font-medium text-success">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        INSCRIT (au greffe de PARIS, le 15/03/2015)
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Inscription RNE :</span>
                      <div className="font-medium text-success">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        INSCRIT (le 15/03/2015)
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Numéro RCS :</span>
                      <div className="font-medium">{companyData.siren} R.C.S. Paris</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capital social :</span>
                      <div className="font-medium">150 000,00 €</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Shield className="h-4 w-4 mr-1" />
                      Extrait INPI
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-1" />
                      Extrait Pappers
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Activité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Activité principale déclarée :</span>
                    <div className="font-medium mt-1">
                      Conseil en systèmes et logiciels informatiques, développement de solutions digitales sur mesure
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Code NAF ou APE :</span>
                      <div className="font-medium">
                        6202A <Badge variant="outline" className="ml-1 text-xs">Commerce</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        (Conseil en systèmes et logiciels informatiques)
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Domaine d'activité :</span>
                      <div className="font-medium">Services aux entreprises</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Forme d'exercice :</span>
                      <div className="font-medium">Commerciale</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Convention collective :</span>
                      <div className="font-medium">
                        Syntec - IDCC 1486
                        <Badge variant="outline" className="ml-1 text-xs">supposée</Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date de clôture exercice :</span>
                      <div className="font-medium">31/12/2024</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Durée exercice :</span>
                      <div className="font-medium">12 mois</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Activités secondaires</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Formation professionnelle</span>
                        <Badge variant="outline" className="text-xs">8559A</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintenance informatique</span>
                        <Badge variant="outline" className="text-xs">9511Z</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="study" className="space-y-6">
            <AdvancedStudy />
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <PredictiveAnalysis />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Rapports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Télécharger rapport complet PDF
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Rapport exécutif (2 pages)
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analyse prédictive détaillée
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Alertes & Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Configurer les alertes
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Partager l'analyse
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Ajouter un commentaire admin
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analysis;