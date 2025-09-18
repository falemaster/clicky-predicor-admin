import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AdvancedStudy from "@/components/study/AdvancedStudy";
import PredictiveAnalysis from "@/components/predictive/PredictiveAnalysis";
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

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const companyData = {
    name: "TECH SOLUTIONS FRANCE",
    siren: "123 456 789",
    siret: "123 456 789 00012",
    naf: "6202A - Conseil en systèmes et logiciels informatiques",
    employees: "25-50",
    address: "25 Rue de la Paix, 75002 Paris",
    director: "Jean MARTIN",
    phone: "01 42 96 12 34",
    email: "contact@techsolutions.fr",
    foundedYear: "2015",
    status: "Actif"
  };

  const scores = {
    global: 7.2,
    financial: 6.8,
    legal: 8.1,
    fiscal: 7.5,
    defaultRisk: "Faible"
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Predicor</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-success border-success">Admin</Badge>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                J. Martin
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Company Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-2xl font-bold text-foreground">{companyData.name}</h2>
                  <Badge variant="secondary" className="bg-success-light text-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {companyData.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span>SIREN: {companyData.siren}</span>
                  <span>SIRET: {companyData.siret}</span>
                  <span>{companyData.naf}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-1">{scores.global}/10</div>
              <div className="text-sm text-muted-foreground">Score global</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
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

export default Index;