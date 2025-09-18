import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, Building, Shield, Users, ChevronDown, ChevronRight, Award, CheckCircle, AlertTriangle, XCircle, CreditCard, FileText, Gavel, Crown } from "lucide-react";
import CompanyMap from "../visualization/CompanyMap";

const AdvancedStudy = () => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    economic: false,
    financial: false,
    compliance: false,
    governance: false
  });

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
          <CardTitle>Étude Approfondie</CardTitle>
          <CardDescription>Analyse multidimensionnelle par volets spécialisés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg border border-primary/10">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3 text-primary">Diagnostic IA Explicable</h3>
                <div className="prose prose-sm text-muted-foreground space-y-3">
                  <p>
                    <strong className="text-foreground">Profil d'excellence globale</strong> - L'entreprise présente un profil remarquablement équilibré avec une note moyenne de <span className="font-semibold text-success">8.4/10</span>, plaçant l'organisation dans le quartile supérieur de son secteur.
                  </p>
                  <p>
                    <strong className="text-foreground">Points forts critiques :</strong> La conformité légale (9.1/10) constitue un avantage concurrentiel majeur, témoignant d'une culture de rigueur et de transparence exceptionnelle. La performance économique (8.4/10) reflète une stratégie commerciale bien maîtrisée avec une croissance soutenue et un positionnement concurrentiel solide.
                  </p>
                  <p>
                    <strong className="text-foreground">Axes d'optimisation :</strong> La solidité financière (7.8/10), bien que satisfaisante, présente un potentiel d'amélioration notable. L'optimisation de la structure de capital et l'amélioration des ratios de liquidité pourraient renforcer significativement la résilience financière.
                  </p>
                  <p>
                    <strong className="text-foreground">Recommandation stratégique :</strong> Maintenir l'excellence opérationnelle actuelle tout en investissant dans le renforcement des fondamentaux financiers pour sécuriser la croissance à long terme.
                  </p>
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
                      Excellent 8.4/10
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
                    <div className="text-xl font-bold text-primary mb-2">3.1%</div>
                    <div className="text-sm text-muted-foreground">Part de marché</div>
                    <Badge variant="secondary" className="mt-2">+0.3pts vs 2022</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-success mb-2">6.7%</div>
                    <div className="text-sm text-muted-foreground">Croissance 2023</div>
                    <Badge variant="secondary" className="mt-2">Secteur: 4.2%</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary mb-2">85%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction client</div>
                    <Badge variant="secondary" className="mt-2">NPS +52</Badge>
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
                    <div className="text-xl font-bold text-primary mb-2">1.85</div>
                    <div className="text-sm text-muted-foreground">Ratio liquidité</div>
                    <Badge variant="secondary" className="mt-2">Seuil: 1.5</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-success mb-2">7.7%</div>
                    <div className="text-sm text-muted-foreground">Rentabilité nette</div>
                    <Badge variant="secondary" className="mt-2">Secteur: 5.2%</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary mb-2">35%</div>
                    <div className="text-sm text-muted-foreground">Taux endettement</div>
                    <Badge variant="secondary" className="mt-2">Limite: 60%</Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-success mb-2">385K€</div>
                    <div className="text-sm text-muted-foreground">Cash-flow 2023</div>
                    <Badge variant="secondary" className="mt-2">+22% vs 2022</Badge>
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