import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  Target,
  Building,
  CreditCard,
  BarChart3,
  PieChart,
  Activity,
  Award,
  CheckCircle,
  AlertTriangle,
  XCircle
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const AdvancedStudy = () => {
  const financialEvolution = [
    { year: '2019', ca: 1850, resultat: 95, tresorerie: 420 },
    { year: '2020', ca: 1920, resultat: 125, tresorerie: 380 },
    { year: '2021', ca: 2100, resultat: 150, tresorerie: 445 },
    { year: '2022', ca: 2250, resultat: 165, tresorerie: 510 },
    { year: '2023', ca: 2400, resultat: 185, tresorerie: 580 }
  ];

  const sectorComparison = [
    { subject: 'Rentabilité', company: 85, sector: 68, fullMark: 100 },
    { subject: 'Liquidité', company: 78, sector: 72, fullMark: 100 },
    { subject: 'Solvabilité', company: 82, sector: 65, fullMark: 100 },
    { subject: 'Efficacité', company: 75, sector: 70, fullMark: 100 },
    { subject: 'Croissance', company: 88, sector: 55, fullMark: 100 }
  ];

  const clientDistribution = [
    { name: 'Top 3 clients', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Clients moyens', value: 35, color: 'hsl(var(--secondary))' },
    { name: 'Petits clients', value: 20, color: 'hsl(var(--accent))' }
  ];

  const employeeEvolution = [
    { year: '2019', effectif: 18, turnover: 8, formations: 24 },
    { year: '2020', effectif: 22, turnover: 12, formations: 31 },
    { year: '2021', effectif: 28, turnover: 15, formations: 45 },
    { year: '2022', effectif: 35, turnover: 18, formations: 52 },
    { year: '2023', effectif: 42, turnover: 22, formations: 68 }
  ];

  const ratios = [
    { name: 'Liquidité générale', value: 1.85, benchmark: 1.5, status: 'good' },
    { name: 'Endettement', value: 0.35, benchmark: 0.6, status: 'good' },
    { name: 'Rentabilité nette', value: 7.7, benchmark: 5.2, status: 'excellent' },
    { name: 'ROE', value: 15.2, benchmark: 12.0, status: 'good' },
    { name: 'Rotation stocks', value: 8.5, benchmark: 6.0, status: 'excellent' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'poor': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic approfondi</CardTitle>
          <CardDescription>Analyse multidimensionnelle complète</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-2">8.2/10</div>
              <div className="text-sm font-medium">Viabilité économique</div>
              <Progress value={82} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">7.8/10</div>
              <div className="text-sm font-medium">Solvabilité financière</div>
              <Progress value={78} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-2">8.5/10</div>
              <div className="text-sm font-medium">Conformité juridique</div>
              <Progress value={85} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Analyse Financière</TabsTrigger>
          <TabsTrigger value="social">Données Sociales & RH</TabsTrigger>
          <TabsTrigger value="commercial">Performance Commerciale</TabsTrigger>
          <TabsTrigger value="operational">Données Opérationnelles</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Évolution Financière (5 ans)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={financialEvolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="ca" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="CA (K€)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="resultat" 
                      stroke="hsl(var(--success))" 
                      strokeWidth={2}
                      name="Résultat (K€)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Target className="h-4 w-4 mr-2" />
                  Comparaison Sectorielle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={sectorComparison}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Entreprise"
                      dataKey="company"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.1}
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
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Ratios Financiers Clés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ratios.map((ratio, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(ratio.status)}
                      <span className="text-sm font-medium">{ratio.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-bold">{ratio.value}%</div>
                        <div className="text-xs text-muted-foreground">
                          Secteur: {ratio.benchmark}%
                        </div>
                      </div>
                      <div className="w-20">
                        <Progress 
                          value={Math.min((ratio.value / ratio.benchmark) * 50, 100)} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Users className="h-4 w-4 mr-2" />
                  Évolution des Effectifs & Formation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={employeeEvolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="effectif"
                      stackId="1"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      name="Effectif"
                    />
                    <Area
                      type="monotone"
                      dataKey="formations"
                      stackId="2"
                      stroke="hsl(var(--success))"
                      fill="hsl(var(--success))"
                      fillOpacity={0.3}
                      name="Formations (h)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Award className="h-4 w-4 mr-2" />
                  Indicateurs RH
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Turn-over annuel</span>
                      <span className="text-sm font-medium">8.5%</span>
                    </div>
                    <Progress value={8.5} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Secteur moyen: 12.3%
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Satisfaction collaborateurs</span>
                      <span className="text-sm font-medium">8.2/10</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Formation continue</span>
                      <span className="text-sm font-medium">68h/an</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Obligation légale: 40h/an
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Structure Organisationnelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">42</div>
                  <div className="text-sm text-muted-foreground">Collaborateurs</div>
                  <Badge variant="secondary" className="mt-2">+17% vs 2022</Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success mb-2">5.2</div>
                  <div className="text-sm text-muted-foreground">Ancienneté moyenne</div>
                  <Badge variant="secondary" className="mt-2">Stable</Badge>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">85%</div>
                  <div className="text-sm text-muted-foreground">CDI</div>
                  <Badge variant="secondary" className="mt-2">Excellent</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <PieChart className="h-4 w-4 mr-2" />
                  Répartition Clientèle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      dataKey="value"
                      data={clientDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({name, value}) => `${name}: ${value}%`}
                    >
                      {clientDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Target className="h-4 w-4 mr-2" />
                  Performance Commerciale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Taux de conversion</span>
                    <Badge variant="secondary" className="bg-success-light text-success">
                      45%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Panier moyen</span>
                    <span className="text-sm font-medium">57K€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Récurrence clients</span>
                    <Badge variant="secondary" className="bg-primary-light text-primary">
                      78%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">NPS Score</span>
                    <Badge variant="secondary" className="bg-success-light text-success">
                      +52
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analyse des Marchés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Secteurs d'activité</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>PME Tech</span>
                      <span>65%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Startups</span>
                      <span>25%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Grands comptes</span>
                      <span>10%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Géographie</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Île-de-France</span>
                      <span>55%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Régions</span>
                      <span>35%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>International</span>
                      <span>10%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Canaux</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Direct</span>
                      <span>70%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Partenaires</span>
                      <span>20%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Digital</span>
                      <span>10%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Certifications & Qualité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ISO 9001</span>
                    <Badge variant="secondary" className="bg-success-light text-success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Certifié
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ISO 27001</span>
                    <Badge variant="secondary" className="bg-success-light text-success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Certifié
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">RGPD</span>
                    <Badge variant="secondary" className="bg-success-light text-success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Conforme
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cyber Score</span>
                    <Badge variant="secondary" className="bg-primary-light text-primary">
                      8.5/10
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-4 w-4 mr-2" />
                  Capacité Opérationnelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Utilisation des capacités</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Productivité</span>
                      <span className="text-sm font-medium">+15% vs 2022</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Automatisation</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Infrastructure & Technologie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-primary mb-1">99.8%</div>
                  <div className="text-xs text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-success mb-1">&lt; 2ms</div>
                  <div className="text-xs text-muted-foreground">Latence API</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary mb-1">Cloud</div>
                  <div className="text-xs text-muted-foreground">100% AWS</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-success mb-1">A+</div>
                  <div className="text-xs text-muted-foreground">Security Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedStudy;