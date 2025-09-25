import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Building, Shield, Users, ChevronDown, ChevronRight, Award, CheckCircle, AlertTriangle, XCircle, CreditCard, FileText, Gavel, Crown, Bot } from "lucide-react";
import CompanyMap from "../visualization/CompanyMap";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ExecutiveSummary } from "@/components/admin/ExecutiveSummary";

interface AdvancedStudyProps {
  companyData?: {
    companyInfo: any;
    scores: any;
    financial: any;
    legal: any;
    paymentScore: any;
    rawData: any;
  } | null;
}

interface AIAnalysis {
  riskProfile: string;
  defaultRisk: string;
  sections: {
    activite: { title: string; content: string };
    financier: { title: string; content: string };
    legal: { title: string; content: string };
    fiscal: { title: string; content: string };
  };
  syntheseExecutive: string;
  recommandations: string[];
  commentairesPredictifs: {
    evolutionRisque: string;
    facteursCles: string;
    scenarios: string;
  };
}

const AdvancedStudy = ({ companyData }: AdvancedStudyProps) => {
  const { toast } = useToast();
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
      const companyInfo = {
        name: companyData?.companyInfo?.denomination || 'Entreprise',
        naf: companyData?.companyInfo?.activitePrincipale || 'Non spécifié',
        employees: companyData?.companyInfo?.nombreSalaries || 'Non spécifié',
        foundedYear: companyData?.companyInfo?.dateCreation?.substring(0, 4) || 'Non spécifié',
        address: companyData?.companyInfo?.adresse || 'Adresse non disponible'
      };

      const scores = {
        global: companyData?.scores?.global || 8.4,
        financial: companyData?.scores?.financial || 7.8,
        legal: companyData?.scores?.legal || 9.1,
        fiscal: companyData?.scores?.fiscal || 8.5,
        defaultRisk: 'Modéré'
      };

      const { data: result, error } = await supabase.functions.invoke('extrapolate-analysis', {
        body: { companyData: companyInfo, scores }
      });

      if (error) throw error;
      
      if (result?.success && result?.analysis) {
        setAiAnalysis(result.analysis);
        toast({
          title: "Analyse IA approfondie générée",
          description: "L'étude détaillée a été générée par l'IA"
        });
      }
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer l'analyse IA",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Data for Economic & Commercial Analysis
  const marketEvolution = [
    { year: '2019', ca: 1850, partMarche: 2.1, croissance: 5.2 },
    { year: '2020', ca: 1920, partMarche: 2.3, croissance: 3.8 },
    { year: '2021', ca: 2100, partMarche: 2.6, croissance: 9.4 },
    { year: '2022', ca: 2250, partMarche: 2.8, croissance: 7.1 },
    { year: '2023', ca: 2400, partMarche: 3.1, croissance: 6.7 }
  ];

  const competitivePosition = [
    { subject: 'Innovation', company: 85, sector: 68, fullMark: 100 },
    { subject: 'Prix', company: 78, sector: 72, fullMark: 100 },
    { subject: 'Qualité', company: 92, sector: 75, fullMark: 100 },
    { subject: 'Service', company: 88, sector: 70, fullMark: 100 },
    { subject: 'Distribution', company: 75, sector: 65, fullMark: 100 }
  ];

  // Data for Financial Analysis
  const financialRatios = [
    { year: '2019', liquidite: 1.65, endettement: 0.45, rentabilite: 5.1, roe: 12.8 },
    { year: '2020', liquidite: 1.72, endettement: 0.42, rentabilite: 6.5, roe: 14.2 },
    { year: '2021', liquidite: 1.78, endettement: 0.38, rentabilite: 7.1, roe: 15.8 },
    { year: '2022', liquidite: 1.82, endettement: 0.36, rentabilite: 7.3, roe: 15.1 },
    { year: '2023', liquidite: 1.85, endettement: 0.35, rentabilite: 7.7, roe: 15.2 }
  ];

  const cashflowAnalysis = [
    { year: '2019', operationnel: 185, investissement: -95, financement: -45 },
    { year: '2020', operationnel: 220, investissement: -120, financement: -35 },
    { year: '2021', operationnel: 285, investissement: -140, financement: -25 },
    { year: '2022', operationnel: 315, investissement: -165, financement: -15 },
    { year: '2023', operationnel: 385, investissement: -185, financement: 12 }
  ];

  // Data for Compliance
  const complianceItems = [
    { domain: 'Fiscal', status: 'excellent', lastAudit: '2023-11', score: 95 },
    { domain: 'Social', status: 'good', lastAudit: '2023-09', score: 88 },
    { domain: 'Environnemental', status: 'good', lastAudit: '2023-10', score: 92 },
    { domain: 'RGPD', status: 'excellent', lastAudit: '2023-12', score: 96 },
    { domain: 'Secteur spécifique', status: 'good', lastAudit: '2023-08', score: 89 }
  ];

  // Data for Governance
  const governanceStructure = [
    { name: 'Conseil Administration', value: 7, color: 'hsl(var(--primary))' },
    { name: 'Direction Générale', value: 3, color: 'hsl(var(--secondary))' },
    { name: 'Comités spécialisés', value: 4, color: 'hsl(var(--accent))' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'poor': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string, score: number) => {
    const variant = status === 'excellent' ? 'default' : status === 'good' ? 'secondary' : 'destructive';
    return (
      <Badge variant={variant} className="ml-2">
        {score}/100
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Étude Approfondie</CardTitle>
              <CardDescription>Analyse multidimensionnelle par volets spécialisés</CardDescription>
            </div>
            <Button
              onClick={generateAIAnalysis}
              disabled={isGeneratingAI}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Bot className="h-4 w-4" />
              {isGeneratingAI ? "Génération..." : "Analyse IA Avancée"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg border border-primary/10">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  {aiAnalysis ? "Synthèse Exécutive IA" : "Synthèse Exécutive"}
                </h3>
                <div className="prose prose-sm text-muted-foreground space-y-3">
                  {aiAnalysis ? (
                    <div>
                      <p className="text-foreground">{aiAnalysis.syntheseExecutive}</p>
                      {aiAnalysis.recommandations && aiAnalysis.recommandations.length > 0 && (
                        <div className="mt-4">
                          <strong className="text-foreground">Recommandations IA :</strong>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            {aiAnalysis.recommandations.slice(0, 3).map((rec, index) => (
                              <li key={index} className="text-sm">{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                     <>
                       <p>
                         <strong className="text-foreground">Profil de l'entreprise {companyData?.companyInfo?.denomination || 'analysée'}</strong> - L'entreprise présente un profil avec une note moyenne de <span className="font-semibold text-success">{companyData?.scores?.global?.toFixed(1) || '6.0'}/10</span>, {companyData?.scores?.global >= 8 ? 'plaçant l\'organisation dans le quartile supérieur de son secteur' : companyData?.scores?.global >= 6.5 ? 'indiquant une performance correcte dans son secteur' : 'nécessitant une attention particulière pour améliorer sa position sectorielle'}.
                       </p>
                       <p>
                         <strong className="text-foreground">Points forts critiques :</strong> {companyData?.scores?.legal >= 8 ? `La conformité légale (${companyData.scores.legal.toFixed(1)}/10) constitue un avantage concurrentiel majeur` : companyData?.scores?.financial >= 8 ? `La solidité financière (${companyData.scores.financial.toFixed(1)}/10) représente un atout important` : companyData?.scores?.fiscal >= 8 ? `La conformité fiscale (${companyData.scores.fiscal.toFixed(1)}/10) témoigne d'une gestion rigoureuse` : 'L\'entreprise maintient un niveau de performance acceptable dans ses activités principales'}. {companyData?.companyInfo?.activitePrincipale ? `L'activité dans le secteur ${companyData.companyInfo.activitePrincipale} bénéficie d'une expertise reconnue.` : ''}
                       </p>
                       <p>
                         <strong className="text-foreground">Axes d'optimisation :</strong> {companyData?.scores?.financial < 7 ? `La solidité financière (${companyData?.scores?.financial?.toFixed(1) || '6.0'}/10) présente un potentiel d'amélioration notable.` : companyData?.scores?.legal < 7 ? `La conformité légale (${companyData?.scores?.legal?.toFixed(1) || '6.0'}/10) nécessite une attention renforcée.` : 'Les indicateurs montrent des opportunités d\'optimisation.'} L'amélioration de ces aspects pourrait renforcer significativement la position concurrentielle.
                       </p>
                       <p>
                         <strong className="text-foreground">Recommandation stratégique :</strong> {companyData?.scores?.global >= 7.5 ? 'Maintenir l\'excellence opérationnelle actuelle tout en consolidant les acquis' : companyData?.scores?.global >= 6 ? 'Concentrer les efforts sur l\'amélioration des points faibles identifiés' : 'Mise en place d\'un plan d\'action prioritaire pour redresser les indicateurs critiques'} pour sécuriser la croissance à long terme.
                       </p>
                     </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {/* Analyse économique et commerciale */}
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
                      Excellent {(companyData?.scores?.global || 8.4).toFixed(1)}/10
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
                      <CardTitle className="text-base">Évolution Marché & Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={marketEvolution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="ca" stroke="hsl(var(--primary))" strokeWidth={2} name="CA (K€)" />
                          <Line type="monotone" dataKey="croissance" stroke="hsl(var(--success))" strokeWidth={2} name="Croissance %" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Position Concurrentielle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <RadarChart data={competitivePosition}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar
                            name="Entreprise"
                            dataKey="company"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                          <Radar
                            name="Secteur"
                            dataKey="sector"
                            stroke="hsl(var(--secondary))"
                            fill="hsl(var(--secondary))"
                            fillOpacity={0.1}
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary mb-2">
                      {companyData?.financial?.chiffreAffaires ? 
                        `${(companyData.financial.chiffreAffaires / 1000000).toFixed(1)}M€` : 
                        '2.4M€'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Chiffre d'affaires</div>
                    <Badge variant="secondary" className="mt-2">Dernier exercice</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-success mb-2">
                      {companyData?.financial?.resultatNet ? 
                        `${((companyData.financial.resultatNet / companyData.financial.chiffreAffaires) * 100).toFixed(1)}%` :
                        '6.7%'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Marge nette</div>
                    <Badge variant="secondary" className="mt-2">
                      {companyData?.financial?.resultatNet > 0 ? 'Profitable' : 'Secteur: 4.2%'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary mb-2">
                      {companyData?.financial?.effectifs || '25'}
                    </div>
                    <div className="text-sm text-muted-foreground">Effectifs</div>
                    <Badge variant="secondary" className="mt-2">Salariés</Badge>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Situation financière */}
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
                    <Badge variant="secondary" className="bg-primary-light text-primary">
                      Solide 7.8/10
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
                      <CardTitle className="text-base">Évolution des Ratios Clés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={financialRatios}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="liquidite" stroke="hsl(var(--primary))" strokeWidth={2} name="Liquidité" />
                          <Line type="monotone" dataKey="rentabilite" stroke="hsl(var(--success))" strokeWidth={2} name="Rentabilité %" />
                          <Line type="monotone" dataKey="endettement" stroke="hsl(var(--warning))" strokeWidth={2} name="Endettement" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Analyse des Flux de Trésorerie</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={cashflowAnalysis}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="operationnel" fill="hsl(var(--success))" name="Opérationnel" />
                          <Bar dataKey="investissement" fill="hsl(var(--warning))" name="Investissement" />
                          <Bar dataKey="financement" fill="hsl(var(--primary))" name="Financement" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary mb-2">
                      {companyData?.financial?.bilans?.[0] ? 
                        ((companyData.financial.bilans[0].chiffreAffaires - companyData.financial.bilans[0].dettes) / companyData.financial.bilans[0].dettes).toFixed(2) :
                        '1.85'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Ratio liquidité</div>
                    <Badge variant="secondary" className="mt-2">Seuil: 1.5</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-success mb-2">
                      {companyData?.financial?.bilans?.[0] ? 
                        ((companyData.financial.bilans[0].resultatNet / companyData.financial.bilans[0].chiffreAffaires) * 100).toFixed(1) + '%' :
                        '7.7%'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Rentabilité nette</div>
                    <Badge variant="secondary" className="mt-2">Secteur: 5.2%</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary mb-2">
                      {companyData?.financial?.bilans?.[0] ? 
                        ((companyData.financial.bilans[0].dettes / (companyData.financial.bilans[0].chiffreAffaires + companyData.financial.bilans[0].fondsPropresBruts)) * 100).toFixed(0) + '%' :
                        '35%'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Taux endettement</div>
                    <Badge variant="secondary" className="mt-2">Limite: 60%</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-success mb-2">
                      {companyData?.paymentScore?.scoreGlobal ? 
                        `${companyData.paymentScore.scoreGlobal}/10` :
                        '385K€'
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">Score paiement</div>
                    <Badge variant="secondary" className="mt-2">
                      {companyData?.paymentScore?.tendance || '+22% vs 2022'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

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
                      <CardDescription>Respect des réglementations et audits de conformité</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-success text-success-foreground">
                      Excellent 9.1/10
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
                <div className="grid md:grid-cols-1 gap-4">
                  {complianceItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <div className="font-medium">{item.domain}</div>
                          <div className="text-sm text-muted-foreground">
                            Dernier audit: {new Date(item.lastAudit).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-bold">{item.score}/100</div>
                          <div className="text-xs text-muted-foreground">Score conformité</div>
                        </div>
                        <div className="w-20">
                          <Progress value={item.score} className="h-2" />
                        </div>
                        {getStatusBadge(item.status, item.score)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Gavel className="h-4 w-4 mr-2" />
                        Obligations Fiscales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>TVA</span>
                          <Badge variant="secondary" className="bg-success-light text-success">À jour</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>IS</span>
                          <Badge variant="secondary" className="bg-success-light text-success">À jour</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>CET</span>
                          <Badge variant="secondary" className="bg-success-light text-success">À jour</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Obligations Sociales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>URSSAF</span>
                          <Badge variant="secondary" className="bg-success-light text-success">À jour</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Retraite</span>
                          <Badge variant="secondary" className="bg-success-light text-success">À jour</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Mutuelle</span>
                          <Badge variant="secondary" className="bg-success-light text-success">À jour</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>ISO 27001</span>
                          <Badge variant="secondary" className="bg-primary-light text-primary">Valide</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>RGPD</span>
                          <Badge variant="secondary" className="bg-success-light text-success">Conforme</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Qualiopi</span>
                          <Badge variant="secondary" className="bg-primary-light text-primary">Certifié</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Nouvelle sous-section Conformité Judiciaire */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center">
                    <Gavel className="h-5 w-5 mr-2 text-primary" />
                    Conformité Judiciaire
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Contentieux Fiscal
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-success-light/20 border border-success-light rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-sm font-medium">Aucun contentieux en cours</span>
                            </div>
                            <Badge variant="secondary" className="bg-success-light text-success">
                              0 dossier
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Dernière vérification : Décembre 2023
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Redressements 5 ans</span>
                              <span className="font-medium">0</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Contrôles fiscaux</span>
                              <span className="font-medium">1 (2021)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Pénalités</span>
                              <span className="font-medium text-success">0€</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <XCircle className="h-4 w-4 mr-2" />
                          Contentieux Judiciaire
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-warning-light/20 border border-warning-light rounded-lg">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                              <span className="text-sm font-medium">Procédures en cours</span>
                            </div>
                            <Badge variant="secondary" className="bg-warning-light text-warning">
                              1 dossier
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Dernière mise à jour : Janvier 2024
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Litiges commerciaux</span>
                              <span className="font-medium">1</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Montant estimé</span>
                              <span className="font-medium">45 K€</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Provision constituée</span>
                              <span className="font-medium text-success">45 K€</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Encarts Procédures Juridiques et Judiciaires */}
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Procédures Juridiques
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Suivi des procédures pré-contentieuses et contractuelles
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm py-2 border-b border-muted/20">
                            <span className="font-medium text-muted-foreground">Nature</span>
                            <span className="font-medium text-muted-foreground">Statut</span>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Mise en demeure</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucune</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Commandement de payer par huissier</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucun</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Résiliation de contrat</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucune</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Inscription privilèges/nantissements</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Aucune</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Radiation d'office du RCS</span>
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Non</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Procédure amiable</span>
                            <Badge variant="outline" className="text-xs bg-primary-light text-primary border-primary">1 en cours</Badge>
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
                        <CardTitle className="text-base flex items-center">
                          <Gavel className="h-4 w-4 mr-2" />
                          Procédures Judiciaires
                        </CardTitle>
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
                            {companyData?.financial?.bilans?.[0] ? 
                              `${((companyData.financial.bilans[0].resultatNet * 0.25) / companyData.financial.bilans[0].resultatNet * 100).toFixed(1)}%` : 
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
                            <span className="font-medium text-success">2.1%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Provisions constituées</span>
                            <span className="font-medium text-success">12 K€</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Couverture assurance</span>
                            <span className="font-medium text-success">Active</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Veille réglementaire</span>
                            <span className="font-medium text-success">À jour</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Suivi Performance Fiscale
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Taux d'optimisation</span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Conformité déclarative</span>
                            <span className="text-sm font-medium">95%</span>
                          </div>
                          <Progress value={95} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Anticipation réglementaire</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
                  <div className="flex items-start space-x-3">
                    <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm mb-2">Recommandations Stratégiques Fiscales</h5>
                      <div className="text-xs text-muted-foreground space-y-2">
                        <p>
                          <strong className="text-foreground">Structuration optimale :</strong> La mise en place d'une holding intermédiaire permettrait une optimisation significative de +12K€ via l'intégration fiscale et la déduction des frais de siège.
                        </p>
                        <p>
                          <strong className="text-foreground">Veille réglementaire active :</strong> Anticipation des évolutions législatives (suppression CVAE, réforme IS) pour adapter la stratégie fiscale en temps réel.
                        </p>
                        <p>
                          <strong className="text-foreground">Documentation renforcée :</strong> Formalisation des prix de transfert et justificatifs économiques pour sécuriser les positions fiscales adoptées.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Structuration, Gouvernance et Management */}
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
                    <Badge variant="secondary" className="bg-primary-light text-primary">
                      Solide 8.2/10
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
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            dataKey="value"
                            data={governanceStructure}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            label={({name, value}) => `${name}: ${value}`}
                          >
                            {governanceStructure.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Indicateurs Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Autonomie équipes</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Processus documentés</span>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm">Réactivité décision</span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary mb-2">7</div>
                    <div className="text-sm text-muted-foreground">Membres CA</div>
                    <Badge variant="secondary" className="mt-2">3 indépendants</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-success mb-2">4</div>
                    <div className="text-sm text-muted-foreground">Comités spécialisés</div>
                    <Badge variant="secondary" className="mt-2">Audit, RH, Tech</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary mb-2">92%</div>
                    <div className="text-sm text-muted-foreground">Processus qualité</div>
                    <Badge variant="secondary" className="mt-2">ISO certifié</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-success mb-2">5.8</div>
                    <div className="text-sm text-muted-foreground">Ancienneté dirigeants</div>
                    <Badge variant="secondary" className="mt-2">Expérience</Badge>
                  </div>
                </div>

                {/* Cartographie de l'entreprise */}
                <CompanyMap />

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Analyse des Risques Organisationnels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-success">Points forts</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Gouvernance transparente et structurée</li>
                          <li>• Processus de décision optimisés</li>
                          <li>• Management expérimenté et stable</li>
                          <li>• Délégation efficace des responsabilités</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 text-warning">Points d'attention</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Succession dirigeant à préparer</li>
                          <li>• Digitalisation processus RH</li>
                          <li>• Formation management intermédiaire</li>
                          <li>• Améliorer reporting performance</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedStudy;