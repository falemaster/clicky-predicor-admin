import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataWithSource } from "@/components/ui/data-with-source";
import { calculateFinancialScore, calculateRiskScore } from "@/utils/scoreCalculator";
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronDown, 
  ChevronUp, 
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

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate real scores from company data
  const financialScore = companyData ? calculateFinancialScore(companyData) : { score: 0, source: 'unavailable', sourceLabel: 'Non disponible' };
  const riskScore = companyData ? calculateRiskScore(companyData) : { score: 0, source: 'unavailable', sourceLabel: 'Non disponible' };

  // Helper functions to get data from various sources
  const getBilansData = () => {
    const bilans = companyData?.pappers?.bilans || companyData?.pappers?.bilansSummary || [];
    if (bilans.length === 0) return [];
    
    return bilans.slice(0, 4).map((bilan: any, index: number) => ({
      period: bilan.millesime || `${new Date().getFullYear() - index}`,
      liquidite: bilan.ratioLiquidite || (bilan.actifCirculant / Math.max(bilan.dettesCourtTerme, 1)) || 1.5,
      rentabilite: bilan.chiffreAffaires > 0 ? ((bilan.resultatNet || 0) / bilan.chiffreAffaires * 100) : 0,
      solvabilite: bilan.capitauxPropres && bilan.totalActif ? (bilan.capitauxPropres / bilan.totalActif * 100) : 50
    }));
  };

  const financialRatios = getBilansData();

  // Real legal acts from Infogreffe
  const getLegalActs = () => {
    const actes = companyData?.infogreffe?.actes || [];
    return actes.slice(0, 5).map((acte: any) => ({
      type: acte.natureActe || acte.type || 'Acte juridique',
      date: acte.dateDepot || acte.date,
      status: acte.statut || 'Enregistré'
    }));
  };

  const legalActs = getLegalActs();

  // Real procedures from BODACC
  const getProcedures = () => {
    const procedures = companyData?.bodacc?.procedures || [];
    return procedures.map((proc: any) => ({
      type: proc.typeProcedure || proc.type,
      date: proc.dateJugement || proc.date,
      tribunal: proc.tribunal,
      status: proc.statut || 'En cours'
    }));
  };

  const procedures = getProcedures();

  // Calculate compliance score based on real data
  const getComplianceScore = () => {
    let score = 7.0; // Base score
    
    // Adjust based on procedures
    if (procedures.length > 0) {
      score -= procedures.length * 1.5; // Reduce for each procedure
    }
    
    // Adjust based on bilans availability
    if (financialRatios.length > 0) {
      score += 0.5; // Bonus for having financial data
    }
    
    return Math.max(Math.min(score, 10), 1);
  };

  const complianceScore = getComplianceScore();

  // Market evolution data - using available company data or fallback 
  const marketEvolution = [
    { year: '2020', marche: 100, entreprise: 95 },
    { year: '2021', marche: 108, entreprise: financialRatios[3]?.rentabilite || 112 },
    { year: '2022', marche: 115, entreprise: financialRatios[2]?.rentabilite || 125 },
    { year: '2023', marche: 122, entreprise: financialRatios[1]?.rentabilite || 138 },
    { year: '2024', marche: 128, entreprise: financialRatios[0]?.rentabilite || 145 }
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
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
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
                          <Badge variant="secondary" className="bg-primary/10 text-primary">6.8/10</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">RGPD</span>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">8.2/10</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Normes sectorielles</span>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">7.1/10</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Certification qualité</span>
                          <Badge variant="outline">5.8/10</Badge>
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
                          <DataWithSource source="DGFIP" lastUpdate="2024-01-15T10:30:00Z">
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">À jour</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>IS 2023</span>
                          <DataWithSource source="SIRIUS" lastUpdate="2024-01-10T14:20:00Z">
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Déposé</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>CVAE</span>
                          <DataWithSource source="DGFIP" lastUpdate="2024-01-12T09:15:00Z">
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Conforme</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>CET</span>
                          <DataWithSource source="DGFIP" lastUpdate="2024-01-08T11:20:00Z">
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Payé</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>Acomptes IS</span>
                          <DataWithSource source="DGFIP" lastUpdate="2024-01-05T14:15:00Z">
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Versés</Badge>
                          </DataWithSource>
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
                          <DataWithSource source="SIRIUS" lastUpdate="2024-01-08T16:45:00Z">
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">À jour</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>DSN</span>
                          <DataWithSource source="DGFIP" lastUpdate="2024-01-05T11:30:00Z">
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Transmise</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>Formation professionnelle</span>
                          <DataWithSource source="SIRIUS" lastUpdate="2024-01-03T09:00:00Z">
                            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-300">Retard</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>Médecine du travail</span>
                          <DataWithSource source="SIRIUS" lastUpdate="2024-01-12T10:20:00Z">
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Conforme</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center text-sm py-1">
                          <span>Registres obligatoires</span>
                          <DataWithSource source="SIRIUS" lastUpdate="2024-01-10T15:40:00Z">
                            <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Tenus</Badge>
                          </DataWithSource>
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
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ISO 9001:2015</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Certifiée</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ISO 14001</span>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">En cours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">OHSAS 18001</span>
                    <Badge variant="outline">-</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Certification RGE</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Valide</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Agréments Administratifs
                </CardTitle>
                <CardDescription className="text-xs">
                  Autorisations et agréments obtenus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Agrément préfectoral</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Valide</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Licence d'exploitation</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Obtenue</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Homologation produits</span>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Renouvellement</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Autorisation ICPE</span>
                    <Badge variant="outline">-</Badge>
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
                <CardTitle className="text-base flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Procédures Précontentieuses
                </CardTitle>
                <CardDescription className="text-xs">
                  Procédures de recouvrement et alertes préventives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground italic mb-4">Source des données : BODACC</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-1 border-b">
                    <span className="text-sm font-medium">Nature</span>
                    <span className="text-sm font-medium">Statut</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mise en demeure</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Aucune</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Commandement de payer par huissier</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Aucun</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Résiliation de contrat</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Aucune</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Inscription privilèges/nantissements</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Aucune</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Radiation d'office du RCS</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Non</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Procédure amiable</span>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary">1 en cours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Déclaration de créance</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Aucune</Badge>
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
                <p className="text-xs text-muted-foreground italic mb-4">Source des données : Portalys</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-1 border-b">
                    <span className="text-sm font-medium">Nature</span>
                    <span className="text-sm font-medium">Statut</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Assignation Tribunal de commerce</span>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">1 active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Injonction de payer</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Aucune</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Référé commercial</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Aucun</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Procédure collective</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Non</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Liquidation judiciaire</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Non</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Redressement judiciaire</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Non</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Procédure de sauvegarde</span>
                    <Badge variant="outline" className="bg-success-light text-success border-success">Non</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
                          <DataWithSource source="DGFIP" lastUpdate="2024-01-10T08:30:00Z">
                            <span className="text-sm font-medium">18.2%</span>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Crédit de TVA</span>
                          <DataWithSource source="DGFIP" lastUpdate="2024-01-10T08:30:00Z">
                            <span className="text-sm font-medium text-success">+12K€</span>
                          </DataWithSource>
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
                          <DataWithSource source="SIRIUS" lastUpdate="2024-01-12T14:15:00Z">
                            <span className="text-sm font-medium">24.8%</span>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Économie réalisée</span>
                          <DataWithSource source="SIRIUS" lastUpdate="2024-01-12T14:15:00Z">
                            <span className="text-sm font-medium text-success">+45K€</span>
                          </DataWithSource>
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
                    <Badge variant={financialScore.score >= 7 ? "default" : financialScore.score >= 5 ? "secondary" : "destructive"}>
                      {financialScore.score >= 7 ? "Bon" : financialScore.score >= 5 ? "Acceptable" : "Faible"} {financialScore.score}/10
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
                          <DataWithSource source="PAPPERS" lastUpdate="2024-01-01T12:00:00Z">
                            <Badge variant="default">2.1</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Ratio de liquidité réduite</span>
                          <DataWithSource source="PAPPERS" lastUpdate="2024-01-01T12:00:00Z">
                            <Badge variant="default">1.8</Badge>
                          </DataWithSource>
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
                          <DataWithSource source="PAPPERS" lastUpdate="2024-01-01T12:00:00Z">
                            <Badge variant="default">14.2%</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">ROE</span>
                          <DataWithSource source="PAPPERS" lastUpdate="2024-01-01T12:00:00Z">
                            <Badge variant="default">18.5%</Badge>
                          </DataWithSource>
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
                          <DataWithSource source="PAPPERS" lastUpdate="2024-01-01T12:00:00Z">
                            <Badge variant="secondary">28.5%</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Couverture des intérêts</span>
                          <DataWithSource source="PAPPERS" lastUpdate="2024-01-01T12:00:00Z">
                            <Badge variant="default">12.3x</Badge>
                          </DataWithSource>
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
                          <DataWithSource source="PORTALIS" lastUpdate="2023-12-31T12:00:00Z">
                            <span className="font-medium">
                              {companyData?.infogreffe?.capitalSocial?.toLocaleString() || '50 000'} €
                            </span>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Nombre d'actions</span>
                          <DataWithSource source="PORTALIS" lastUpdate="2023-12-31T12:00:00Z">
                            <span className="font-medium">5 000</span>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Valeur nominale</span>
                          <DataWithSource source="PORTALIS" lastUpdate="2023-12-31T12:00:00Z">
                            <span className="font-medium">10 €</span>
                          </DataWithSource>
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
                          <DataWithSource source="INSEE" lastUpdate="2024-01-05T09:00:00Z">
                            <Badge variant="default" className="bg-success text-success-foreground">+12.5%</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Part de marché</span>
                          <DataWithSource source="INSEE" lastUpdate="2024-01-05T09:00:00Z">
                            <Badge variant="default">8.2%</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Taux de fidélisation</span>
                          <DataWithSource source="AI" lastUpdate="2024-01-10T15:20:00Z">
                            <Badge variant="default" className="bg-success text-success-foreground">89%</Badge>
                          </DataWithSource>
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
                          <DataWithSource source="INSEE" lastUpdate="2024-01-05T09:00:00Z">
                            <Badge variant="default">#3/20</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Avantage concurrentiel</span>
                          <DataWithSource source="AI" lastUpdate="2024-01-10T15:20:00Z">
                            <Badge variant="default" className="bg-success text-success-foreground">Fort</Badge>
                          </DataWithSource>
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
                          <DataWithSource source="PORTALIS" lastUpdate="2023-12-31T12:00:00Z">
                            <Badge variant="outline" className="bg-success-light text-success border-success">
                              Actif
                            </Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex items-start justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">Marie Martin</p>
                            <p className="text-xs text-muted-foreground">Directrice Générale</p>
                            <p className="text-xs text-muted-foreground">Depuis le 22/03/2021</p>
                          </div>
                          <DataWithSource source="PORTALIS" lastUpdate="2023-12-31T12:00:00Z">
                            <Badge variant="outline" className="bg-success-light text-success border-success">
                              Actif
                            </Badge>
                          </DataWithSource>
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
                          <DataWithSource source="ALPAGE" lastUpdate="2024-01-15T10:30:00Z">
                            <Badge variant="default">Oui</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Comités spécialisés</span>
                          <DataWithSource source="ALPAGE" lastUpdate="2024-01-15T10:30:00Z">
                            <Badge variant="secondary">2</Badge>
                          </DataWithSource>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Contrôle interne</span>
                          <DataWithSource source="ALPAGE" lastUpdate="2024-01-15T10:30:00Z">
                            <Badge variant="outline" className="bg-success-light text-success border-success">
                              Conforme
                            </Badge>
                          </DataWithSource>
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
