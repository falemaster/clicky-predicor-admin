import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DataWithSource } from "@/components/ui/data-with-source";
import { EditableField } from "@/components/ui/editable-field";
import { VisibilityToggle } from "@/components/admin/VisibilityToggle";
import { useEditing } from "@/components/result/EditingContext";
import { calculateFinancialScore, calculateRiskScore } from "@/utils/scoreCalculator";
import { 
  TrendingUp, 
  ChevronDown, 
  ChevronRight, 
  Shield, 
  Crown,
  BarChart3,
  CheckCircle,
  FileText,
  Users,
  Award,
  Euro,
  Target,
  Activity,
  Calendar
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

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

  // Get visibility settings with sub-encarts
  const encartVisibility = companyData?.encartVisibility?.study || {
    compliance: true,
    fiscal: true,
    financial: true,
    economic: true,
    governance: true,
    // Sub-encarts
    compliance_audit: true,
    compliance_fiscal: true,
    compliance_social: true,
    fiscal_declarations: true,
    fiscal_evolution: true,
    fiscal_optimization: true,
    financial_ratios: true,
    financial_evolution: true,
    financial_cashflow: true,
    economic_market: true,
    economic_competition: true,
    economic_performance: true,
    governance_structure: true,
    governance_management: true,
    governance_control: true
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate scores
  const financialScore = companyData ? calculateFinancialScore(companyData) : { score: 0, source: 'unavailable' };
  const riskScore = companyData ? calculateRiskScore(companyData) : { score: 0, source: 'unavailable' };

  const getBilansData = () => {
    const bilans = companyData?.pappers?.bilans || [];
    return bilans.slice(0, 4).map((bilan: any, index: number) => ({
      period: bilan.millesime || `${new Date().getFullYear() - index}`,
      liquidite: bilan.ratioLiquidite || 1.5,
      rentabilite: bilan.chiffreAffaires > 0 ? ((bilan.resultatNet || 0) / bilan.chiffreAffaires * 100) : 0,
      solvabilite: bilan.capitauxPropres && bilan.totalActif ? (bilan.capitauxPropres / bilan.totalActif * 100) : 50
    }));
  };

  const financialRatios = getBilansData();

  const getComplianceScore = () => {
    let score = 7.0;
    const procedures = companyData?.bodacc?.procedures || [];
    if (procedures.length > 0) score -= procedures.length * 1.5;
    if (financialRatios.length > 0) score += 0.5;
    return Math.max(Math.min(score, 10), 1);
  };

  const complianceScore = getComplianceScore();

  // Data for charts
  const fiscalEvolution = [
    { annee: '2020', tva: 85000, is: 15000 },
    { annee: '2021', tva: 92000, is: 18000 },
    { annee: '2022', tva: 98000, is: 22000 },
    { annee: '2023', tva: 105000, is: 25000 }
  ];

  const marketEvolution = [
    { year: '2020', marche: 100, entreprise: 95 },
    { year: '2021', marche: 108, entreprise: 112 },
    { year: '2022', marche: 115, entreprise: 125 },
    { year: '2023', marche: 122, entreprise: 138 }
  ];

  const competitionData = [
    { name: 'Entreprise', value: 35, color: '#0088FE' },
    { name: 'Concurrent A', value: 28, color: '#00C49F' },
    { name: 'Concurrent B', value: 22, color: '#FFBB28' },
    { name: 'Autres', value: 15, color: '#FF8042' }
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
            <Collapsible open={openSections.compliance} onOpenChange={() => toggleSection('compliance')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Conformités et Obligations Légales</CardTitle>
                        <CardDescription>Analyse de la situation de conformité</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <EditableField
                        value={complianceScore.toFixed(1)}
                        field="study.compliance.global_score"
                        badge={<Badge variant="secondary" className="bg-primary/10 text-primary">Acceptable {complianceScore.toFixed(1)}/10</Badge>}
                        displayValue={`Acceptable ${complianceScore.toFixed(1)}/10`}
                      />
                      {openSections.compliance ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Score d'Audit */}
                    {(encartVisibility.compliance_audit || isEditing) && (
                      <Card>
                        {isEditing && (
                          <div className="p-2 border-b bg-muted/20">
                            <VisibilityToggle  
                              isVisible={encartVisibility.compliance_audit}
                              onToggle={(visible) => onEdit?.('encartVisibility.study.compliance_audit', visible)}
                              label="Score d'Audit"
                              className="text-xs"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Score d'Audit
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Conformité globale</span>
                              <EditableField
                                value={complianceScore.toFixed(1)}
                                field="study.compliance.global_score"
                                badge={<Badge variant="secondary">{complianceScore.toFixed(1)}/10</Badge>}
                                displayValue={`${complianceScore.toFixed(1)}/10`}
                              />
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">RGPD</span>
                              <EditableField
                                value="8.2"
                                field="study.compliance.rgpd_score"
                                badge={<Badge variant="secondary">8.2/10</Badge>}
                                displayValue="8.2/10"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Obligations Fiscales */}  
                    {(encartVisibility.compliance_fiscal || isEditing) && (
                      <Card>
                        {isEditing && (
                          <div className="p-2 border-b bg-muted/20">
                            <VisibilityToggle  
                              isVisible={encartVisibility.compliance_fiscal}
                              onToggle={(visible) => onEdit?.('encartVisibility.study.compliance_fiscal', visible)}
                              label="Obligations Fiscales"
                              className="text-xs"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            Obligations Fiscales
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span>TVA</span>
                              <EditableField
                                value="À jour"
                                field="study.fiscal.tva_status"
                                badge={<Badge variant="outline" className="text-xs bg-success-light text-success">À jour</Badge>}
                                displayValue="À jour"
                              />
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>IS 2023</span>
                              <EditableField
                                value="Déposé"
                                field="study.fiscal.is_2023"
                                badge={<Badge variant="outline" className="text-xs bg-success-light text-success">Déposé</Badge>}
                                displayValue="Déposé"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Obligations Sociales */}
                    {(encartVisibility.compliance_social || isEditing) && (
                      <Card>
                        {isEditing && (
                          <div className="p-2 border-b bg-muted/20">
                            <VisibilityToggle  
                              isVisible={encartVisibility.compliance_social}
                              onToggle={(visible) => onEdit?.('encartVisibility.study.compliance_social', visible)}
                              label="Obligations Sociales"
                              className="text-xs"
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            Obligations Sociales
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                              <span>URSSAF</span>
                              <EditableField
                                value="À jour"
                                field="study.social.urssaf"
                                badge={<Badge variant="outline" className="text-xs bg-success-light text-success">À jour</Badge>}
                                displayValue="À jour"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* 2. Obligations Fiscales */}
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
            <Collapsible open={openSections.fiscal} onOpenChange={() => toggleSection('fiscal')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Obligations Fiscales</CardTitle>
                        <CardDescription>Analyse des obligations fiscales</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <EditableField
                        value="7.8"
                        field="study.fiscal.global_score"
                        badge={<Badge variant="secondary" className="bg-primary/10 text-primary">Bon 7.8/10</Badge>}
                        displayValue="Bon 7.8/10"
                      />
                      {openSections.fiscal ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent>
                  {(encartVisibility.fiscal_evolution || isEditing) && (
                    <Card>
                      {isEditing && (
                        <div className="p-2 border-b bg-muted/20">
                          <VisibilityToggle  
                            isVisible={encartVisibility.fiscal_evolution}
                            onToggle={(visible) => onEdit?.('encartVisibility.study.fiscal_evolution', visible)}
                            label="Évolution Fiscale"
                            className="text-xs"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-base">Évolution Fiscale</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fiscalEvolution}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="annee" />
                              <YAxis />
                              <RechartsTooltip />
                              <Bar dataKey="tva" fill="#8884d8" name="TVA" />
                              <Bar dataKey="is" fill="#82ca9d" name="IS" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* 3. Situation Financière */}
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
            <Collapsible open={openSections.financial} onOpenChange={() => toggleSection('financial')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Situation Financière</CardTitle>
                        <CardDescription>Analyse financière détaillée</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <EditableField
                        value={financialScore.score.toFixed(1)}
                        field="study.financial.global_score"
                        badge={<Badge variant="secondary" className="bg-primary/10 text-primary">Correct {financialScore.score.toFixed(1)}/10</Badge>}
                        displayValue={`Correct ${financialScore.score.toFixed(1)}/10`}
                      />
                      {openSections.financial ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent>
                  {(encartVisibility.financial_ratios || isEditing) && (
                    <Card>
                      {isEditing && (
                        <div className="p-2 border-b bg-muted/20">
                          <VisibilityToggle  
                            isVisible={encartVisibility.financial_ratios}
                            onToggle={(visible) => onEdit?.('encartVisibility.study.financial_ratios', visible)}
                            label="Ratios Financiers"
                            className="text-xs"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-base">Ratios Financiers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Liquidité</span>
                            <EditableField
                              value="1.50"
                              field="study.financial.liquidity_ratio"
                              badge={<Badge variant="outline">1.50</Badge>}
                              displayValue="1.50"
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Solvabilité</span>
                            <EditableField
                              value="45.0%"
                              field="study.financial.solvency_ratio"
                              badge={<Badge variant="outline">45.0%</Badge>}
                              displayValue="45.0%"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* 4. Performance Économique */}
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
            <Collapsible open={openSections.economic} onOpenChange={() => toggleSection('economic')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Performance Économique</CardTitle>
                        <CardDescription>Analyse de performance</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <EditableField
                        value="6.8"
                        field="study.economic.global_score"
                        badge={<Badge variant="secondary" className="bg-primary/10 text-primary">Correct 6.8/10</Badge>}
                        displayValue="Correct 6.8/10"
                      />
                      {openSections.economic ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent>
                  {(encartVisibility.economic_market || isEditing) && (
                    <Card>
                      {isEditing && (
                        <div className="p-2 border-b bg-muted/20">
                          <VisibilityToggle  
                            isVisible={encartVisibility.economic_market}
                            onToggle={(visible) => onEdit?.('encartVisibility.study.economic_market', visible)}
                            label="Positionnement Marché"
                            className="text-xs"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-base">Positionnement Marché</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={marketEvolution}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="year" />
                              <YAxis />
                              <RechartsTooltip />
                              <Line type="monotone" dataKey="marche" stroke="#8884d8" name="Marché" />
                              <Line type="monotone" dataKey="entreprise" stroke="#82ca9d" name="Entreprise" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}

        {/* 5. Gouvernance */}
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
            <Collapsible open={openSections.governance} onOpenChange={() => toggleSection('governance')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Crown className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">Gouvernance</CardTitle>
                        <CardDescription>Structure de gouvernance</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <EditableField
                        value="7.2"
                        field="study.governance.global_score"
                        badge={<Badge variant="secondary" className="bg-primary/10 text-primary">Bon 7.2/10</Badge>}
                        displayValue="Bon 7.2/10"
                      />
                      {openSections.governance ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent>
                  {(encartVisibility.governance_structure || isEditing) && (
                    <Card>
                      {isEditing && (
                        <div className="p-2 border-b bg-muted/20">
                          <VisibilityToggle  
                            isVisible={encartVisibility.governance_structure}
                            onToggle={(visible) => onEdit?.('encartVisibility.study.governance_structure', visible)}
                            label="Structure Dirigeants"
                            className="text-xs"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-base">Structure Dirigeants</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Président</span>
                            <EditableField
                              value="M. MARTIN Jean"
                              field="study.governance.president_name"
                              displayValue="M. MARTIN Jean"
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Nb administrateurs</span>
                            <EditableField
                              value="5"
                              field="study.governance.board_members_count"
                              badge={<Badge variant="outline">5</Badge>}
                              displayValue="5"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}