import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  Bookmark,
  Euro
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie } from "recharts";

interface StudyDisplayProps {
  companyData?: any;
}

export function StudyDisplay({ companyData }: StudyDisplayProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    compliance: false,
    fiscal: false,
    financial: false,
    economic: false,
    governance: false
  });

  // Toggle section function
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Utility functions for display
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

  // Sample data for charts and displays
  const financialRatios = [
    { period: 'T1', liquidite: 1.8, rentabilite: 12.5, solvabilite: 68.2 },
    { period: 'T2', liquidite: 1.9, rentabilite: 13.1, solvabilite: 69.8 },
    { period: 'T3', liquidite: 2.1, rentabilite: 14.2, solvabilite: 71.5 },
    { period: 'T4', liquidite: 2.0, rentabilite: 13.8, solvabilite: 70.9 }
  ];

  const marketEvolution = [
    { year: '2020', marche: 100, entreprise: 95 },
    { year: '2021', marche: 108, entreprise: 112 },
    { year: '2022', marche: 115, entreprise: 125 },
    { year: '2023', marche: 122, entreprise: 138 },
    { year: '2024', marche: 128, entreprise: 145 }
  ];

  const complianceItems = [
    { name: 'Processus décisionnels', score: 7.2, status: 'good' },
    { name: 'Délégations de pouvoir', score: 6.8, status: 'average' },
    { name: 'Contrôle interne', score: 8.1, status: 'excellent' },
    { name: 'Gestion des risques', score: 5.9, status: 'average' },
    { name: 'Communication interne', score: 6.5, status: 'average' }
  ];

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* 1. Conformités et Obligations Légales */}
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
                      <CardTitle className="text-base flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Score d'Audit
                      </CardTitle>
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
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Obligations Fiscales
                      </CardTitle>
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
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Obligations Sociales
                      </CardTitle>
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
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Historique des actes juridiques */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Gavel className="h-4 w-4 mr-2" />
                      Historique des Actes Juridiques
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Timeline des dépôts et modifications au RCS
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Mock legal acts - would come from companyData.infogreffe.actes */}
                      <div className="border-l-2 border-primary pl-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">Dépôt des comptes annuels 2023</p>
                            <p className="text-xs text-muted-foreground">15 juin 2024</p>
                          </div>
                          <Badge variant="outline" className="text-xs bg-success-light text-success border-success">
                            Conforme
                          </Badge>
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">Modification du capital social</p>
                            <p className="text-xs text-muted-foreground">22 mars 2024</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Enregistré
                          </Badge>
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">Nomination nouveau dirigeant</p>
                            <p className="text-xs text-muted-foreground">10 janvier 2024</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Validé
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comptes annuels */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <FileCheck className="h-4 w-4 mr-2" />
                      Suivi des Comptes Annuels
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Statut de conformité des dépôts comptables
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center space-y-2">
                        <div className="text-lg font-bold text-success">2023</div>
                        <Badge variant="outline" className="bg-success-light text-success border-success">
                          Déposé
                        </Badge>
                        <p className="text-xs text-muted-foreground">15/06/2024</p>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="text-lg font-bold text-success">2022</div>
                        <Badge variant="outline" className="bg-success-light text-success border-success">
                          Déposé
                        </Badge>
                        <p className="text-xs text-muted-foreground">28/05/2023</p>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="text-lg font-bold text-warning">2024</div>
                        <Badge variant="outline" className="bg-warning-light text-warning border-warning">
                          En attente
                        </Badge>
                        <p className="text-xs text-muted-foreground">Échéance: 30/06/2025</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* 2. Mitigation Fiscale */}
        <Card>
          <Collapsible 
            open={openSections.fiscal} 
            onOpenChange={() => toggleSection('fiscal')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Mitigation Fiscale</CardTitle>
                      <CardDescription>Optimisation fiscale et gestion des risques</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-success text-success-foreground">
                      Excellent 8.2/10
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
                      <CardTitle className="text-base">Optimisation TVA</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Taux effectif</span>
                          <span className="text-sm font-medium">18.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Crédit de TVA</span>
                          <span className="text-sm font-medium text-success">+12K€</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Impôt sur les Sociétés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Taux effectif</span>
                          <span className="text-sm font-medium">24.8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Économie réalisée</span>
                          <span className="text-sm font-medium text-success">+45K€</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* 3. Situation Financière */}
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
                      <CardDescription>Analyse des ratios financiers et de la performance</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      Bon 7.3/10
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
                {/* Enhanced financial section with Infogreffe data */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Ratios de Liquidité</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Ratio de liquidité générale</span>
                          <Badge variant="default">2.1</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Ratio de liquidité réduite</span>
                          <Badge variant="default">1.8</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Rentabilité</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Marge nette</span>
                          <Badge variant="default">14.2%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">ROE</span>
                          <Badge variant="default">18.5%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Solvabilité</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Ratio d'endettement</span>
                          <Badge variant="secondary">28.5%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Couverture des intérêts</span>
                          <Badge variant="default">12.3x</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Capital social précis avec données Infogreffe */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Euro className="h-4 w-4 mr-2" />
                      Capital Social et Répartition
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Information détaillée sur la structure capitalistique
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Capital social</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">
                              {companyData?.infogreffe?.capitalSocial?.toLocaleString() || '50 000'} €
                            </span>
                            {/* <SourceBadge source="INFOGREFFE" className="text-xs" /> */}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Nombre d'actions</span>
                          <span className="font-medium">5 000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Valeur nominale</span>
                          <span className="font-medium">10 €</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Évolution du capital</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mars 2024</span>
                            <span>Augmentation: +10 000 €</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Jan 2022</span>
                            <span>Création: 40 000 €</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Évolution des Ratios Financiers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={financialRatios}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="liquidite" stroke="#8884d8" name="Liquidité" />
                        <Line type="monotone" dataKey="rentabilite" stroke="#82ca9d" name="Rentabilité" />
                        <Line type="monotone" dataKey="solvabilite" stroke="#ffc658" name="Solvabilité" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* 4. Analyse Économique et Commerciale */}
        <Card>
          <Collapsible 
            open={openSections.economic} 
            onOpenChange={() => toggleSection('economic')}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Analyse Économique et Commerciale</CardTitle>
                      <CardDescription>Performance commerciale et positionnement marché</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-success text-success-foreground">
                      Très bon 8.1/10
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
                      <CardTitle className="text-base">Performance Commerciale</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Croissance CA</span>
                          <Badge variant="default" className="bg-success text-success-foreground">+12.5%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Part de marché</span>
                          <Badge variant="default">8.2%</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Taux de fidélisation</span>
                          <Badge variant="default" className="bg-success text-success-foreground">89%</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Position Concurrentielle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Rang secteur</span>
                          <Badge variant="default">#3/20</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Avantage concurrentiel</span>
                          <Badge variant="default" className="bg-success text-success-foreground">Fort</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Évolution vs. Marché</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={marketEvolution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="marche" stroke="#8884d8" name="Marché" />
                        <Line type="monotone" dataKey="entreprise" stroke="#82ca9d" name="Entreprise" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* 5. Structuration, Gouvernance et Management - ACTIVATED with Infogreffe data */}
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
                      <CardDescription>Organisation interne et processus de gouvernance</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-primary text-primary-foreground">
                      Actif 7.5/10
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
                {/* Mandats en cours */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Mandats en Cours
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Représentants légaux actuels
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {/* Mock data - would come from companyData.infogreffe.representants */}
                        <div className="flex items-start justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">Jean Dupont</p>
                            <p className="text-xs text-muted-foreground">Président</p>
                            <p className="text-xs text-muted-foreground">Depuis le 15/01/2020</p>
                          </div>
                          <Badge variant="outline" className="bg-success-light text-success border-success">
                            Actif
                          </Badge>
                        </div>
                        <div className="flex items-start justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">Marie Martin</p>
                            <p className="text-xs text-muted-foreground">Directrice Générale</p>
                            <p className="text-xs text-muted-foreground">Depuis le 22/03/2021</p>
                          </div>
                          <Badge variant="outline" className="bg-success-light text-success border-success">
                            Actif
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Gouvernance
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Structure de gouvernance et contrôles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Séparation des pouvoirs</span>
                          <Badge variant="default">Oui</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Comités spécialisés</span>
                          <Badge variant="secondary">2</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Contrôle interne</span>
                          <Badge variant="outline" className="bg-success-light text-success border-success">
                            Conforme
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Historique des mandats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Historique des Mandats
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Changements de dirigeants et mandataires
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border-l-2 border-primary pl-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">Nomination Marie Martin - DG</p>
                            <p className="text-xs text-muted-foreground">22 mars 2021</p>
                          </div>
                          <Badge variant="outline" className="text-xs bg-success-light text-success border-success">
                            Validé
                          </Badge>
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">Démission Pierre Durand - DG</p>
                            <p className="text-xs text-muted-foreground">15 mars 2021</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Enregistré
                          </Badge>
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">Nomination Jean Dupont - Président</p>
                            <p className="text-xs text-muted-foreground">15 janvier 2020</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Validé
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </TooltipProvider>
  );
}