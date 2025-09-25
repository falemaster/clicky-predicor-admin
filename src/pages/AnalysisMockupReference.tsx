/**
 * 🚨 MAQUETTE DE RÉFÉRENCE - NE PAS MODIFIER
 * 
 * Cette page contient la maquette originale de l'analyse d'entreprise.
 * Elle sert de référence pour les futures améliorations et ne doit pas être modifiée.
 * 
 * Pour accéder à cette page : /analysis-mockup
 * La version fonctionnelle est sur : /analysis
 */

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AdvancedStudy from "@/components/study/AdvancedStudy";
import PredictiveAnalysis from "@/components/predictive/PredictiveAnalysis";
import { useAnalysisData } from "@/hooks/useAnalysisData";
import { CompanySearchMockup } from "@/components/search/CompanySearchMockup";
import { EnrichedDataDisplayMockup } from "@/components/analysis/EnrichedDataDisplayMockup";
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
  CreditCard,
  Search,
  Loader2
} from "lucide-react";

const AnalysisMockupReference = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { data } = useAnalysisData();

  const companyData = data.companyInfo;
  const scores = data.scores;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header avec indication qu'il s'agit de la maquette */}
      <header className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Predicor</h1>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                📋 MAQUETTE DE RÉFÉRENCE
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/analysis">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Version Fonctionnelle
                </Button>
              </Link>
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

      {/* Avertissement */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-yellow-800 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>
              <strong>Maquette de référence</strong> - Cette page utilise des données simulées. 
              <Link to="/analysis" className="underline ml-1">Accéder à la version fonctionnelle</Link>
            </span>
          </div>
        </div>
      </div>

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
              <div className="text-sm text-muted-foreground">Score global (simulé)</div>
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
            {/* Note explicative */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Maquette de référence</p>
                    <p>Cette interface présente la structure et le design original. Toutes les données affichées sont simulées pour des fins de démonstration.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reste du contenu de la maquette originale... */}
            <EnrichedDataDisplayMockup companyData={data} />
          </TabsContent>

          <TabsContent value="study">
            <AdvancedStudy />
          </TabsContent>

          <TabsContent value="predictive">
            <PredictiveAnalysis />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Rapports disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <FileText className="h-4 w-4 mr-2" />
                    Rapport complet PDF (Maquette)
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analyse financière (Maquette)
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Prévisions 12 mois (Maquette)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Actions & Alertes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Bell className="h-4 w-4 mr-2" />
                    Configurer alertes (Maquette)
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Share className="h-4 w-4 mr-2" />
                    Partager analyse (Maquette)
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <FileText className="h-4 w-4 mr-2" />
                    Exporter données (Maquette)
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

export default AnalysisMockupReference;