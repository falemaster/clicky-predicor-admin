import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExecutiveSummary } from "@/components/admin/ExecutiveSummary";
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronDown, 
  ChevronRight, 
  Building, 
  CreditCard, 
  Shield, 
  Crown,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Users,
  Award,
  FileCheck,
  Scale,
  Gavel,
  Eye,
  Bookmark
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdvancedStudyProps {
  companyData?: any;
}

// Interface pour l'analyse IA générée
interface AIAnalysis {
  riskProfile: {
    level: string;
    factors: string[];
    recommendations: string[];
  };
  sectionsAnalysis: {
    economic: string;
    financial: string;
    compliance: string;
    fiscal: string;
    governance: string;
  };
  executiveSynthesis: string;
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    timeline: string;
  }[];
  predictiveComments: string;
}

const AdvancedStudy = ({ companyData }: AdvancedStudyProps) => {
  const { toast } = useToast();
  
  // Provide default data when companyData is not provided (for mockup compatibility)
  const defaultCompanyData = {
    companyInfo: {
      name: "Entreprise Exemple",
      siren: "123456789",
      siret: "12345678900123"
    },
    scores: {
      global: 7.2,
      financial: 6.8,
      commercial: 8.1,
      legal: 7.5,
      risk: 2.3
    }
  };
  
  const data = companyData || defaultCompanyData;
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    economic: false,
    financial: false,
    compliance: false,
    fiscal: false,
    governance: false
  });

  // Fonction pour générer l'analyse IA approfondie
  const generateAIAnalysis = async () => {
    setIsGeneratingAI(true);
    
    try {
      const { data: analysisData, error } = await supabase.functions.invoke('extrapolate-analysis', {
        body: {
          companyData: data,
          scores: {
            financial: data?.scores?.financial || 0,
            legal: data?.scores?.legal || 0,
            commercial: data?.scores?.commercial || 0
          },
          analysisType: 'advanced_study'
        }
      });

      if (error) {
        throw error;
      }

      if (analysisData?.analysis) {
        setAiAnalysis(analysisData.analysis);
        toast({
          title: "Analyse IA générée",
          description: "L'analyse approfondie par IA a été générée avec succès.",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la génération de l\'analyse IA:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'analyse IA. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Fonction pour basculer l'état d'ouverture d'une section
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Données pour les graphiques
  const marketEvolution = [
    { year: '2020', marche: 100, entreprise: 95 },
    { year: '2021', marche: 108, entreprise: 112 },
    { year: '2022', marche: 115, entreprise: 125 },
    { year: '2023', marche: 122, entreprise: 138 },
    { year: '2024', marche: 128, entreprise: 145 }
  ];

  const competitivePosition = [
    { critere: 'Prix', score: 7.5 },
    { critere: 'Qualité', score: 8.8 },
    { critere: 'Service', score: 8.2 },
    { critere: 'Innovation', score: 7.1 },
    { critere: 'Délais', score: 8.5 }
  ];

  const financialRatios = [
    { period: 'T1', liquidite: 1.8, rentabilite: 12.5, solvabilite: 68.2 },
    { period: 'T2', liquidite: 1.9, rentabilite: 13.1, solvabilite: 69.8 },
    { period: 'T3', liquidite: 2.1, rentabilite: 14.2, solvabilite: 71.5 },
    { period: 'T4', liquidite: 2.0, rentabilite: 13.8, solvabilite: 70.9 }
  ];

  const cashflowAnalysis = [
    { month: 'Jan', entrees: 450, sorties: 380, net: 70 },
    { month: 'Fév', entrees: 520, sorties: 420, net: 100 },
    { month: 'Mar', entrees: 480, sorties: 410, net: 70 },
    { month: 'Avr', entrees: 580, sorties: 450, net: 130 },
    { month: 'Mai', entrees: 620, sorties: 480, net: 140 },
    { month: 'Jun', entrees: 550, sorties: 460, net: 90 }
  ];

  const complianceItems = [
    { name: 'Processus décisionnels', score: 7.2, status: 'good' },
    { name: 'Délégations de pouvoir', score: 6.8, status: 'average' },
    { name: 'Contrôle interne', score: 8.1, status: 'excellent' },
    { name: 'Gestion des risques', score: 5.9, status: 'average' },
    { name: 'Communication interne', score: 6.5, status: 'average' }
  ];

  const governanceStructure = [
    { name: 'Direction générale', value: 35 },
    { name: 'Conseil d\'administration', value: 25 },
    { name: 'Comités spécialisés', value: 20 },
    { name: 'Management opérationnel', value: 20 }
  ];

  // Fonctions utilitaires pour l'affichage
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'average': return <Clock className="h-4 w-4 text-warning" />;
      case 'poor': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (score: number, status: string) => {
    const variant = status === 'excellent' || status === 'good' ? 'default' : 
                   status === 'average' ? 'secondary' : 'destructive';
    return <Badge variant={variant}>{score}/10</Badge>;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Executive Summary Component - Synchronized with Admin Editor */}
        {(companyData?.enriched?.visibility?.executiveSummary !== "false") && (
          <ExecutiveSummary 
            scores={{
              economic: data?.scores?.global || 5.5,
              financial: data?.scores?.financial || 6.0,
              legal: data?.scores?.legal || 7.5,
              fiscal: data?.scores?.fiscal || 6.8,
              global: data?.scores?.global || 5.5
            }}
            companyName={data?.companyInfo?.name || "L'entreprise"}
            existingSummary={data?.enriched?.executiveSummary}
          />
        )}

        {/* Additional AI Analysis Section */}
        {aiAnalysis && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analyse IA Approfondie</CardTitle>
              <CardDescription>
                Insights complémentaires générés par intelligence artificielle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-medium mb-2">Profil de Risque</h5>
                  <p className="text-sm text-muted-foreground mb-2">
                    Niveau: <span className="font-medium">{aiAnalysis.riskProfile.level}</span>
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {aiAnalysis.riskProfile.factors.slice(0, 3).map((factor, idx) => (
                      <li key={idx}>• {factor}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h5 className="font-medium mb-2">Recommandations Prioritaires</h5>
                  <div className="space-y-2">
                    {aiAnalysis.recommendations.slice(0, 3).map((rec, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{rec.action}</span>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                            {rec.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Analysis Generation Button */}
        {!aiAnalysis && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Button
                  onClick={generateAIAnalysis}
                  disabled={isGeneratingAI}
                  variant="outline"
                  size="sm"
                >
                  {isGeneratingAI ? "Génération..." : "Générer analyse IA complémentaire"}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Obtenez des insights supplémentaires par intelligence artificielle
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
        {/* Conformités et obligations légales */}
        <Card>
          <Collapsible 
            open={openSections.compliance} 
            onOpenChange={() => toggleSection('compliance')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Conformités et Obligations Légales</CardTitle>
                      <CardDescription>Analyse de la situation de conformité et cohérence déclarative</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-warning text-warning-foreground">
                      Acceptable 6.8/10
                    </Badge>
                    {openSections.compliance ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CardTitle className="text-base flex items-center cursor-help">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Score d'Audit
                          </CardTitle>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Évaluation basée sur les derniers audits réglementaires</p>
                        </TooltipContent>
                      </Tooltip>
                      <CardDescription className="text-xs">
                        Évaluation générale de conformité réglementaire
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Conformité globale</span>
                          {getStatusBadge(6.8, 'good')}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">RGPD</span>
                          {getStatusBadge(8.2, 'excellent')}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Normes sectorielles</span>
                          {getStatusBadge(7.1, 'good')}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Certification qualité</span>
                          {getStatusBadge(5.8, 'average')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CardTitle className="text-base flex items-center cursor-help">
                            <FileText className="h-4 w-4 mr-2" />
                            Obligations Fiscales
                          </CardTitle>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Données DGFiP et déclarations</p>
                        </TooltipContent>
                      </Tooltip>
                      <CardDescription className="text-xs">
                        Suivi des déclarations et obligations fiscales
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>Déclarations TVA</span>
                          <Badge variant="outline" className="text-xs bg-success-light text-success border-success">À jour</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>IS 2023</span>
                          <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Déposé</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>CVAE</span>
                          <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Conforme</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>CET</span>
                          <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Payé</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>Acomptes IS</span>
                          <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Versés</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CardTitle className="text-base flex items-center cursor-help">
                            <Users className="h-4 w-4 mr-2" />
                            Obligations Sociales
                          </CardTitle>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Données URSSAF et DSN</p>
                        </TooltipContent>
                      </Tooltip>
                      <CardDescription className="text-xs">
                        Respect des obligations sociales et RH
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>Déclarations URSSAF</span>
                          <Badge variant="outline" className="text-xs bg-success-light text-success border-success">À jour</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>DSN</span>
                          <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Transmise</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>Formation professionnelle</span>
                          <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning">Retard</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>Médecine du travail</span>
                          <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Conforme</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>Registres obligatoires</span>
                          <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Tenus</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Certifications et agréments */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    Certifications et Agréments
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <Award className="h-4 w-4 mr-2" />
                          Certifications Qualité
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Standards et certifications sectorielles
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>ISO 9001:2015</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Certifiée</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>ISO 14001</span>
                            <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning">En cours</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>OHSAS 18001</span>
                            <Badge variant="outline" className="text-xs bg-muted-light text-muted border-muted">Non certifiée</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Certification RGE</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Valide</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <FileCheck className="h-4 w-4 mr-2" />
                          Agréments Administratifs
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Autorisations et agréments obtenus
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Agrément préfectoral</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Valide</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Licence d'exploitation</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Obtenue</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Homologation produits</span>
                            <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning">Renouvellement</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Autorisation ICPE</span>
                            <Badge variant="outline" className="text-xs bg-muted-light text-muted border-muted">Non applicable</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Procédures judiciaires et légales */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Scale className="h-5 w-5 mr-2 text-primary" />
                    Procédures Judiciaires et Légales
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CardTitle className="text-base flex items-center cursor-help">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Procédures Précontentieuses
                            </CardTitle>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Base BODACC et alertes légales</p>
                          </TooltipContent>
                        </Tooltip>
                        <CardDescription className="text-xs">
                          Procédures de recouvrement et alertes préventives
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="text-xs text-muted-foreground mb-2 italic">
                            Source des données : BODACC
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Mise en demeure</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucune</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Signalement T.A.E.</span>
                            <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning">
                              <Tooltip>
                                <TooltipTrigger>Détecté</TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">La Banque de France a reçu un signalement d'un créancier - Information confidentielle</p>
                                </TooltipContent>
                              </Tooltip>
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Initié</span>
                            <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning">
                              <Tooltip>
                                <TooltipTrigger>En cours</TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Procédure initiée - Détails en cours de confirmation</p>
                                </TooltipContent>
                              </Tooltip>
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Registre numérique des Huissiers Décret n° 2025-493 du 3 juin 2025</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucun</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Dégradation ou contentieux de marché public</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucun</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Inscription privilèges/nantissements</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucune</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Procédure amiable</span>
                            <Badge variant="outline" className="text-xs bg-primary-light text-primary border-primary">1 en cours</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Prévention des difficultés auprès du Tribunal des Activités Économiques</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucune</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Déclaration de créance</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucune</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <CardTitle className="text-base flex items-center cursor-help">
                              <Gavel className="h-4 w-4 mr-2" />
                              Procédures Judiciaires
                            </CardTitle>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Base Portalis</p>
                          </TooltipContent>
                        </Tooltip>
                        <CardDescription className="text-xs">
                          Suivi des procédures contentieuses et juridictionnelles
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm py-2 border-b border-muted/20">
                            <span className="font-medium text-muted-foreground">Nature</span>
                            <span className="font-medium text-muted-foreground">Statut</span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2 italic">
                            Source des données : Portalys
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Assignation Tribunal de commerce</span>
                            <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning">1 active</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Injonction de payer</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucune</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Référé commercial</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucun</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Procédure collective</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Non</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Appel des décisions</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucun</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Contentieux prud'homal</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucun</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Contentieux administratif</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucun</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-medium text-sm mb-2">Analyse de Risque Juridique</h5>
                        <p className="text-xs text-muted-foreground">
                          Profil de risque judiciaire <strong>faible à modéré</strong>. Le contentieux commercial identifié est isolé et fait l'objet d'un provisionnement intégral. 
                          L'absence de contentieux fiscal témoigne d'une gestion rigoureuse des obligations déclaratives. 
                          Recommandation : maintenir la veille juridique active et le suivi préventif des relations contractuelles.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Mitigation Fiscale */}
        {(companyData?.enriched?.visibility?.fiscal !== "false") && (
        <Card>
          <Collapsible 
            open={openSections.fiscal} 
            onOpenChange={() => toggleSection('fiscal')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Mitigation Fiscale</CardTitle>
                      <CardDescription>Optimisation et stratégies de gestion fiscale</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      Performant 8.5/10
                    </Badge>
                    {openSections.fiscal ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <TrendingDown className="h-4 w-4 mr-2" />
                        Optimisation Fiscale Actuelle
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-success-light/20 border border-success-light rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium">Taux d'IS effectif</span>
                          </div>
                          <Badge variant="secondary" className="bg-success-light text-success">
                            {data?.financial?.bilans?.[0] ? 
                              `${((data.financial.bilans[0].resultatNet * 0.25) / data.financial.bilans[0].resultatNet * 100).toFixed(1)}%` : 
                              '24.2%'
                            }
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Crédit d'impôt recherche</span>
                            <span className="font-medium text-success">18 K€</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>CVAE économisée</span>
                            <span className="font-medium text-success">12 K€</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Optimisation amortissements</span>
                            <span className="font-medium text-success">8 K€</span>
                          </div>
                          <div className="flex justify-between text-sm border-t pt-2 font-semibold">
                            <span>Économies totales 2023</span>
                            <span className="text-success">38 K€</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Potentiel d'Optimisation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-primary-light/20 border border-primary-light rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Potentiel identifié</span>
                          </div>
                          <Badge variant="secondary" className="bg-primary-light text-primary">
                            +15 K€
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Report en arrière déficitaire</span>
                            <span className="font-medium text-primary">+7 K€</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Optimisation TVA</span>
                            <span className="font-medium text-primary">+4 K€</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Déduction exceptionnelle</span>
                            <span className="font-medium text-primary">+4 K€</span>
                          </div>
                          <div className="flex justify-between text-sm border-t pt-2 font-semibold">
                            <span>Potentiel total</span>
                            <span className="text-primary">+15 K€</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tableaux de stratégies fiscales */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Stratégies de Mitigation Recommandées
                  </h4>
                  <div className="grid md:grid-cols-1 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Plan d'Action Fiscal 2024
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Recommandations prioritaires pour l'optimisation fiscale
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm py-2 border-b border-muted/20">
                            <span className="font-medium text-muted-foreground">Action</span>
                            <span className="font-medium text-muted-foreground">Impact</span>
                            <span className="font-medium text-muted-foreground">Priorité</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm py-2">
                            <span className="flex-1">Restructuration holdings pour optimiser IS</span>
                            <span className="w-20 text-center font-medium text-success">+12 K€</span>
                            <Badge variant="outline" className="text-xs bg-destructive-light text-destructive border-destructive ml-2">Élevée</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm py-2">
                            <span className="flex-1">Mise en place contrat de management</span>
                            <span className="w-20 text-center font-medium text-success">+8 K€</span>
                            <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning ml-2">Moyenne</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm py-2">
                            <span className="flex-1">Optimisation régime TVA sur marge</span>
                            <span className="w-20 text-center font-medium text-success">+5 K€</span>
                            <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning ml-2">Moyenne</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm py-2">
                            <span className="flex-1">Déduction frais siège social</span>
                            <span className="w-20 text-center font-medium text-success">+3 K€</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success ml-2">Faible</Badge>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm py-2 bg-muted/10 rounded">
                            <span className="flex-1 font-semibold">Économies prévisionnelles totales</span>
                            <span className="w-20 text-center font-bold text-success">+28 K€</span>
                            <span className="w-16"></span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Risques fiscaux et veille */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Gestion des Risques Fiscaux
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-success-light/20 border border-success-light rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium">Niveau de risque</span>
                          </div>
                          <Badge variant="secondary" className="bg-success-light text-success">
                            Faible
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Contrôle fiscal probabilité</span>
                            <span className="font-medium text-success">12%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Documentation transfert prix</span>
                            <span className="font-medium text-success">Complète</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Veille réglementaire</span>
                            <span className="font-medium text-success">Active</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Position fiscale défendable</span>
                            <span className="font-medium text-success">85%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Veille et Accompagnement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-primary-light/20 border border-primary-light rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Bookmark className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Suivi conseil</span>
                          </div>
                          <Badge variant="secondary" className="bg-primary-light text-primary">
                            Actif
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Rendez-vous conseil fiscal</span>
                            <span className="font-medium text-primary">Trimestriel</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Alertes réglementaires</span>
                            <span className="font-medium text-primary">Automatiques</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Formations équipe comptable</span>
                            <span className="font-medium text-primary">2/an</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Audit fiscal préventif</span>
                            <span className="font-medium text-primary">Annuel</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm mb-2">Synthèse Stratégique Fiscale</h5>
                      <p className="text-xs text-muted-foreground">
                        Positionnement fiscal <strong>performant</strong> avec une optimisation déjà bien engagée et un potentiel de gains supplémentaires identifié à +15 K€. 
                        La stratégie fiscale s'appuie sur une approche préventive et documentée, réduisant les risques de contrôle. 
                        Recommandation prioritaire : mise en œuvre du plan d'action 2024 avec focus sur la restructuration holdings.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
         </Card>
        )}

        {/* Situation financière */}
        {(companyData?.enriched?.visibility?.financial !== "false") && (
        <Card>
          <Collapsible 
            open={openSections.financial} 
            onOpenChange={() => toggleSection('financial')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Situation Financière</CardTitle>
                      <CardDescription>Santé financière et ratios de gestion</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-success text-success-foreground">
                      Excellent 9.2/10
                    </Badge>
                    {openSections.financial ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Analyse des Ratios Financiers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={financialRatios}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="liquidite" stroke="#22c55e" strokeWidth={2} />
                            <Line type="monotone" dataKey="rentabilite" stroke="#3b82f6" strokeWidth={2} />
                            <Line type="monotone" dataKey="solvabilite" stroke="#f59e0b" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Analyse des Flux de Trésorerie</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={cashflowAnalysis}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="entrees" fill="#22c55e" />
                            <Bar dataKey="sorties" fill="#ef4444" />
                            <Bar dataKey="net" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
         </Card>
        )}

        {/* Analyse économique et commerciale */}
        {(companyData?.enriched?.visibility?.economic !== "false") && (
        <Card>
          <Collapsible 
            open={openSections.economic} 
            onOpenChange={() => toggleSection('economic')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Analyse Économique et Commerciale</CardTitle>
                      <CardDescription>Performance marché et positionnement concurrentiel</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-success text-success-foreground">
                      Excellent 8.7/10
                    </Badge>
                    {openSections.economic ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Évolution du Marché</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={marketEvolution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="marche" stroke="#3b82f6" strokeWidth={2} />
                            <Line type="monotone" dataKey="entreprise" stroke="#22c55e" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Position Concurrentielle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={competitivePosition}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="critere" />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="score" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
         </Card>
         )}

         {data && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                Tableau de Bord Qualité des Données
              </CardTitle>
              <CardDescription>Évaluation de la complétude et fiabilité des informations collectées</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Données Identité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Complétude</span>
                        <Badge variant="outline" className="text-xs bg-success-light text-success border-success">95%</Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Fiabilité</span>
                        <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Haute</Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Dernière MAJ</span>
                        <span className="text-muted-foreground">15/03/2024</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Données Financières
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Complétude</span>
                        <Badge variant="outline" className="text-xs bg-warning-light text-warning border-warning">78%</Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Fiabilité</span>
                        <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Haute</Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Dernière MAJ</span>
                        <span className="text-muted-foreground">08/03/2024</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Données Légales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Complétude</span>
                        <Badge variant="outline" className="text-xs bg-success-light text-success border-success">92%</Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Fiabilité</span>
                        <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Haute</Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Dernière MAJ</span>
                        <span className="text-muted-foreground">12/03/2024</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Score Global
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Qualité</span>
                        <Badge variant="outline" className="text-xs bg-success-light text-success border-success">88%</Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Confiance</span>
                        <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Élevée</Badge>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Sources</span>
                        <span className="text-muted-foreground">12 APIs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
         )}

         {/* Structuration, Gouvernance et Management */}
         {(companyData?.enriched?.visibility?.governance !== "false") && (
         <Card>
           <Collapsible 
             open={openSections.governance} 
             onOpenChange={() => toggleSection('governance')}
           >
             <CollapsibleTrigger asChild>
               <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <Crown className="h-5 w-5 text-primary" />
                     <div>
                       <CardTitle className="text-lg">Structuration, Gouvernance et Management</CardTitle>
                       <CardDescription>Organisation, processus de décision et management</CardDescription>
                     </div>
                   </div>
                   <div className="flex items-center space-x-2">
                     <Badge variant="default" className="bg-warning text-warning-foreground">
                       Moyen 6.4/10
                     </Badge>
                     {openSections.governance ? 
                       <ChevronDown className="h-4 w-4" /> : 
                       <ChevronRight className="h-4 w-4" />
                     }
                   </div>
                 </div>
               </CardHeader>
             </CollapsibleTrigger>
             
             <CollapsibleContent>
               <CardContent className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                   <Card>
                     <CardHeader>
                       <CardTitle className="text-base">Structure de Gouvernance</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                             <Pie
                               data={governanceStructure}
                               cx="50%"
                               cy="50%"
                               labelLine={false}
                               outerRadius={80}
                               fill="#8884d8"
                               dataKey="value"
                             />
                             <RechartsTooltip />
                           </PieChart>
                         </ResponsiveContainer>
                       </div>
                     </CardContent>
                   </Card>

                   <Card>
                     <CardHeader>
                       <CardTitle className="text-base">Indicateurs de Management</CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="space-y-4">
                         {complianceItems.map((item, index) => (
                           <div key={index} className="flex items-center justify-between">
                             <div className="flex items-center space-x-2">
                               {getStatusIcon(item.status)}
                               <span className="text-sm">{item.name}</span>
                             </div>
                             {getStatusBadge(item.score, item.status)}
                           </div>
                         ))}
                       </div>
                     </CardContent>
                   </Card>
                 </div>
               </CardContent>
             </CollapsibleContent>
           </Collapsible>
         </Card>
         )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdvancedStudy;