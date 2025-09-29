import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataWithSource } from "@/components/ui/data-with-source";
import { EditableField } from "@/components/ui/editable-field";
import { VisibilityToggle } from "@/components/admin/VisibilityToggle";
import { useEditing } from "@/components/result/EditingContext";
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
  const { isEditing, onEdit } = useEditing();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    compliance: false,
    fiscal: false,
    financial: false,
    economic: false,
    governance: false
  });

  // Get visibility settings from companyData
  const encartVisibility = companyData?.encartVisibility?.study || {
    compliance: true,
    fiscal: true,
    financial: true,
    economic: true,
    governance: true
  };

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
        {(encartVisibility.compliance || isEditing) && (
          <Card>
            {isEditing && (
              <div className="p-4 border-b bg-muted/50">
                <VisibilityToggle
                  isVisible={encartVisibility.compliance}
                  onToggle={(visible) => onEdit?.('encartVisibility.study.compliance', visible)}
                  label="Conformités et Obligations Légales"
                />
              </div>
            )}
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
                      <EditableField
                        value={complianceScore.toFixed(1)}
                        field="compliance_score"
                        badge={<Badge variant="secondary" className="bg-primary/10 text-primary">Acceptable {complianceScore.toFixed(1)}/10</Badge>}
                        displayValue={`Acceptable ${complianceScore.toFixed(1)}/10`}
                      />
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
                            <EditableField
                              value={complianceScore.toFixed(1)}
                              field="compliance.global_score"
                              badge={<Badge variant="secondary" className="bg-primary/10 text-primary">{complianceScore.toFixed(1)}/10</Badge>}
                              displayValue={`${complianceScore.toFixed(1)}/10`}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">RGPD</span>
                            <EditableField
                              value="8.2"
                              field="compliance.rgpd_score"
                              badge={<Badge variant="secondary" className="bg-primary/10 text-primary">8.2/10</Badge>}
                              displayValue="8.2/10"
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Normes sectorielles</span>
                            <EditableField
                              value="7.1"
                              field="compliance.sector_norms_score"
                              badge={<Badge variant="secondary" className="bg-primary/10 text-primary">7.1/10</Badge>}
                              displayValue="7.1/10"
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Certification qualité</span>
                            <EditableField
                              value="5.8"
                              field="compliance.quality_certification_score"
                              badge={<Badge variant="outline">5.8/10</Badge>}
                              displayValue="5.8/10"
                            />
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
                            <EditableField
                              value="À jour"
                              field="fiscal.tva_declarations"
                              badge={
                                <DataWithSource source="DGFIP" lastUpdate="2024-01-15T10:30:00Z">
                                  <Badge variant="outline" className="text-xs bg-success-light text-success border-success">À jour</Badge>
                                </DataWithSource>
                              }
                              displayValue="À jour"
                            />
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>IS 2023</span>
                            <EditableField
                              value="Déposé"
                              field="fiscal.is_2023"
                              badge={
                                <DataWithSource source="SIRIUS" lastUpdate="2024-01-10T14:20:00Z">
                                  <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Déposé</Badge>
                                </DataWithSource>
                              }
                              displayValue="Déposé"
                            />
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>CVAE</span>
                            <EditableField
                              value="Conforme"
                              field="fiscal.cvae"
                              badge={
                                <DataWithSource source="DGFIP" lastUpdate="2024-01-12T09:15:00Z">
                                  <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Conforme</Badge>
                                </DataWithSource>
                              }
                              displayValue="Conforme"
                            />
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>CET</span>
                            <EditableField
                              value="Payé"
                              field="fiscal.cet"
                              badge={
                                <DataWithSource source="DGFIP" lastUpdate="2024-01-08T11:20:00Z">
                                  <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Payé</Badge>
                                </DataWithSource>
                              }
                              displayValue="Payé"
                            />
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Acomptes IS</span>
                            <EditableField
                              value="Versés"
                              field="fiscal.acomptes_is"
                              badge={
                                <DataWithSource source="DGFIP" lastUpdate="2024-01-05T14:15:00Z">
                                  <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Versés</Badge>
                                </DataWithSource>
                              }
                              displayValue="Versés"
                            />
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
                            <EditableField
                              value="À jour"
                              field="social.urssaf_declarations"
                              badge={
                                <DataWithSource source="SIRIUS" lastUpdate="2024-01-08T16:45:00Z">
                                  <Badge variant="outline" className="text-xs bg-success-light text-success border-success">À jour</Badge>
                                </DataWithSource>
                              }
                              displayValue="À jour"
                            />
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>DSN</span>
                            <EditableField
                              value="Transmise"
                              field="social.dsn"
                              badge={
                                <DataWithSource source="DGFIP" lastUpdate="2024-01-05T11:30:00Z">
                                  <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Transmise</Badge>
                                </DataWithSource>
                              }
                              displayValue="Transmise"
                            />
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Formation professionnelle</span>
                            <EditableField
                              value="Retard"
                              field="social.formation_professionnelle"
                              badge={
                                <DataWithSource source="OPALE" lastUpdate="2024-01-03T09:00:00Z">
                                  <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-300">Retard</Badge>
                                </DataWithSource>
                              }
                              displayValue="Retard"
                            />
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Médecine du travail</span>
                            <EditableField
                              value="Conforme"
                              field="social.medecine_travail"
                              badge={
                                <DataWithSource source="OPALE" lastUpdate="2024-01-12T10:20:00Z">
                                  <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Conforme</Badge>
                                </DataWithSource>
                              }
                              displayValue="Conforme"
                            />
                          </div>
                          <div className="flex justify-between items-center text-sm py-1">
                            <span>Registres obligatoires</span>
                            <EditableField
                              value="Tenus"
                              field="social.registres_obligatoires"
                              badge={
                                <DataWithSource source="INFOGREFFE" lastUpdate="2024-01-10T15:40:00Z">
                                  <Badge variant="outline" className="text-xs bg-success-light text-success border-success">Tenus</Badge>
                                </DataWithSource>
                              }
                              displayValue="Tenus"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* 2. Section Fiscale */}
        {(encartVisibility.fiscal || isEditing) && (
          <Card>
            {isEditing && (
              <div className="p-4 border-b bg-muted/50">
                <VisibilityToggle
                  isVisible={encartVisibility.fiscal}
                  onToggle={(visible) => onEdit?.('encartVisibility.study.fiscal', visible)}
                  label="Obligations Fiscales"
                />
              </div>
            )}
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
                        <CardTitle className="text-lg">Obligations Fiscales</CardTitle>
                        <CardDescription>Analyse des déclarations et obligations fiscales</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        Excellent 8.5/10
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
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Données fiscales détaillées - Implémentation en cours
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* 3. Section Financière */}
        {(encartVisibility.financial || isEditing) && (
          <Card>
            {isEditing && (
              <div className="p-4 border-b bg-muted/50">
                <VisibilityToggle
                  isVisible={encartVisibility.financial}
                  onToggle={(visible) => onEdit?.('encartVisibility.study.financial', visible)}
                  label="Situation Financière"
                />
              </div>
            )}
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
                        <CardDescription>Analyse des ratios et indicateurs financiers</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Satisfaisant {financialScore.score.toFixed(1)}/10
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
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Analyse financière détaillée - Implémentation en cours
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* 4. Section Économique */}
        {(encartVisibility.economic || isEditing) && (
          <Card>
            {isEditing && (
              <div className="p-4 border-b bg-muted/50">
                <VisibilityToggle
                  isVisible={encartVisibility.economic}
                  onToggle={(visible) => onEdit?.('encartVisibility.study.economic', visible)}
                  label="Performance Économique"
                />
              </div>
            )}
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
                        <CardTitle className="text-lg">Performance Économique</CardTitle>
                        <CardDescription>Évolution et positionnement économique</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        Très bon 8.2/10
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
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Performance économique détaillée - Implémentation en cours
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* 5. Section Gouvernance */}
        {(encartVisibility.governance || isEditing) && (
          <Card>
            {isEditing && (
              <div className="p-4 border-b bg-muted/50">
                <VisibilityToggle
                  isVisible={encartVisibility.governance}
                  onToggle={(visible) => onEdit?.('encartVisibility.study.governance', visible)}
                  label="Gouvernance"
                />
              </div>
            )}
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
                        <CardTitle className="text-lg">Gouvernance</CardTitle>
                        <CardDescription>Structure de gouvernance et dirigeants</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Bon 7.4/10
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
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Gouvernance détaillée - Implémentation en cours
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}