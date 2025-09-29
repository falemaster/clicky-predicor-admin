import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Shield, Calculator, TrendingUp, Building, Award, AlertTriangle, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { EditableField } from "@/components/ui/editable-field";
import { EditableSelect } from "@/components/ui/editable-select";
import { VisibilityToggle } from "@/components/admin/VisibilityToggle";
import { useEditing } from "@/components/result/EditingContext";
import type { DisplayEnrichedData } from "@/utils/buildCompanyDisplay";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface StudyDisplayProps {
  companyData?: DisplayEnrichedData | null;
}

export function StudyDisplay({ companyData }: StudyDisplayProps) {
  const { isEditing, onEdit } = useEditing();
  const [openSections, setOpenSections] = useState({
    compliance: true,
    fiscal: false,
    financial: false,
    economic: false,
    governance: false,
    certifications: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const encartVisibility = companyData?.encartVisibility?.study || {
    compliance: true,
    compliance_audit: true,
    procedures_bodacc: true,
    procedures_portalis: true,
    fiscal: true,
    fiscal_evolution: true,
    tax_strategy: true,
    financial: true,
    financial_ratios: true,
    balance_analysis: true,
    economic: true,
    market_position: true,
    competitive_analysis: true,
    governance: true,
    management_quality: true,
    board_composition: true,
    certifications: true,
    iso_certifications: true,
    quality_labels: true
  };

  const handleVisibilityToggle = (field: string, visible: boolean) => {
    onEdit?.(`encartVisibility.study.${field}`, visible);
  };

  // Options for dropdowns
  const procedureStatusOptions = [
    { value: "aucune", label: "Aucune" },
    { value: "1_active", label: "1 active" },
    { value: "2-5_actives", label: "2-5 actives" },
    { value: "6+_actives", label: "6+ actives" },
    { value: "non_applicable", label: "Non applicable" }
  ];

  const complianceStatusOptions = [
    { value: "conforme", label: "Conforme" },
    { value: "non_conforme", label: "Non conforme" },
    { value: "partiellement_conforme", label: "Partiellement conforme" },
    { value: "en_cours", label: "En cours de vérification" }
  ];

  const fiscalStatusOptions = [
    { value: "à_jour", label: "À jour" },
    { value: "retard", label: "En retard" },
    { value: "non_applicable", label: "Non applicable" },
    { value: "en_cours", label: "En cours" }
  ];

  const certificationStatusOptions = [
    { value: "certifié", label: "Certifié" },
    { value: "en_cours", label: "En cours" },
    { value: "non_certifié", label: "Non certifié" },
    { value: "non_applicable", label: "Non applicable" }
  ];

  const qualityStatusOptions = [
    { value: "excellent", label: "Excellent" },
    { value: "bon", label: "Bon" },
    { value: "moyen", label: "Moyen" },
    { value: "faible", label: "Faible" },
    { value: "non_évalué", label: "Non évalué" }
  ];

  // Mock data for charts
  const fiscalEvolution = [
    { year: '2021', tva: 98, is: 100, cet: 95 },
    { year: '2022', tva: 95, is: 98, cet: 100 },
    { year: '2023', tva: 100, is: 100, cet: 98 },
    { year: '2024', tva: 100, is: 100, cet: 100 }
  ];

  const marketEvolution = [
    { period: 'T1 2023', performance: 85, marché: 80 },
    { period: 'T2 2023', performance: 88, marché: 82 },
    { period: 'T3 2023', performance: 92, marché: 85 },
    { period: 'T4 2023', performance: 95, marché: 87 },
    { period: 'T1 2024', performance: 97, marché: 89 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'conforme':
      case 'à_jour':
      case 'certifié':
      case 'excellent':
      case 'bon':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'non_conforme':
      case 'retard':
      case 'non_certifié':
      case 'faible':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'en_cours':
      case 'partiellement_conforme':
      case 'moyen':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'aucune':
      case 'non_applicable':
      case 'non_évalué':
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'conforme':
      case 'à_jour':
      case 'certifié':
      case 'excellent':
        return <Badge variant="default">Excellent</Badge>;
      case 'bon':
        return <Badge variant="secondary">Bon</Badge>;
      case 'moyen':
      case 'partiellement_conforme':
        return <Badge variant="outline">Moyen</Badge>;
      case 'non_conforme':
      case 'retard':
      case 'faible':
        return <Badge variant="destructive">À risque</Badge>;
      default:
        return <Badge variant="secondary">Non évalué</Badge>;
    }
  };

  if (!companyData?.study) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune donnée d'étude approfondie disponible
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Conformités et Obligations Légales */}
      {encartVisibility.compliance && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Conformités et Obligations Légales</CardTitle>
                {getStatusBadge(companyData.study.compliance.obligations_status)}
              </div>
              <div className="flex items-center space-x-2">
                {isEditing && (
                  <VisibilityToggle
                    isVisible={encartVisibility.compliance}
                    onToggle={(visible) => handleVisibilityToggle('compliance', visible)}
                    label="Conformité"
                  />
                )}
                <Collapsible open={openSections.compliance} onOpenChange={() => toggleSection('compliance')}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center">
                      {openSections.compliance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
          </CardHeader>
          <Collapsible open={openSections.compliance} onOpenChange={() => toggleSection('compliance')}>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Procédures BODACC - Liste détaillée */}
                {encartVisibility.procedures_bodacc && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Procédures Précontentieuses (BODACC)</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.procedures_bodacc}
                          onToggle={(visible) => handleVisibilityToggle('procedures_bodacc', visible)}
                          label="BODACC"
                        />
                      )}
                    </div>
                    <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-3 italic">
                        Source des données : BODACC
                      </div>
                      
                      <div className="flex justify-between items-center text-sm py-1.5 border-b border-muted/20">
                        <span>Mise en demeure</span>
                        <EditableSelect
                          value={companyData.study.compliance.procedures_bodacc.mise_en_demeure || "aucune"}
                          field="procedures_bodacc.mise_en_demeure"
                          options={procedureStatusOptions}
                          icon={getStatusIcon(companyData.study.compliance.procedures_bodacc.mise_en_demeure || "aucune")}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm py-1.5 border-b border-muted/20">
                        <span>Signalement T.A.E.</span>
                        <EditableSelect
                          value={companyData.study.compliance.procedures_bodacc.signalement_tae || "aucune"}
                          field="procedures_bodacc.signalement_tae"
                          options={procedureStatusOptions}
                          icon={getStatusIcon(companyData.study.compliance.procedures_bodacc.signalement_tae || "aucune")}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm py-1.5 border-b border-muted/20">
                        <span>Initié</span>
                        <EditableSelect
                          value={companyData.study.compliance.procedures_bodacc.initie || "aucune"}
                          field="procedures_bodacc.initie"
                          options={procedureStatusOptions}
                          icon={getStatusIcon(companyData.study.compliance.procedures_bodacc.initie || "aucune")}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm py-1.5 border-b border-muted/20">
                        <span className="text-xs">Registre numérique des Huissiers Décret n° 2025-493 du 3 juin 2025</span>
                        <EditableSelect
                          value={companyData.study.compliance.procedures_bodacc.registre_huissiers || "aucune"}
                          field="procedures_bodacc.registre_huissiers"
                          options={procedureStatusOptions}
                          icon={getStatusIcon(companyData.study.compliance.procedures_bodacc.registre_huissiers || "aucune")}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm py-1.5 border-b border-muted/20">
                        <span>Dégradation ou contentieux de marché public</span>
                        <EditableSelect
                          value={companyData.study.compliance.procedures_bodacc.contentieux_marche_public || "aucune"}
                          field="procedures_bodacc.contentieux_marche_public"
                          options={procedureStatusOptions}
                          icon={getStatusIcon(companyData.study.compliance.procedures_bodacc.contentieux_marche_public || "aucune")}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm py-1.5 border-b border-muted/20">
                        <span>Inscription privilèges/nantissements</span>
                        <EditableSelect
                          value={companyData.study.compliance.procedures_bodacc.inscription_privileges || "aucune"}
                          field="procedures_bodacc.inscription_privileges"
                          options={procedureStatusOptions}
                          icon={getStatusIcon(companyData.study.compliance.procedures_bodacc.inscription_privileges || "aucune")}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm py-1.5 border-b border-muted/20">
                        <span>Procédure amiable</span>
                        <EditableSelect
                          value={companyData.study.compliance.procedures_bodacc.procedure_amiable || "aucune"}
                          field="procedures_bodacc.procedure_amiable"
                          options={procedureStatusOptions}
                          icon={getStatusIcon(companyData.study.compliance.procedures_bodacc.procedure_amiable || "aucune")}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm py-1.5 border-b border-muted/20">
                        <span>Prévention des difficultés auprès du Tribunal des Activités Économiques</span>
                        <EditableSelect
                          value={companyData.study.compliance.procedures_bodacc.prevention_tae || "aucune"}
                          field="procedures_bodacc.prevention_tae"
                          options={procedureStatusOptions}
                          icon={getStatusIcon(companyData.study.compliance.procedures_bodacc.prevention_tae || "aucune")}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-sm py-1.5">
                        <span>Déclaration de créance</span>
                        <EditableSelect
                          value={companyData.study.compliance.procedures_bodacc.declaration_creance || "aucune"}
                          field="procedures_bodacc.declaration_creance"
                          options={procedureStatusOptions}
                          icon={getStatusIcon(companyData.study.compliance.procedures_bodacc.declaration_creance || "aucune")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Procédures Portalis */}
                {encartVisibility.procedures_portalis && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Procédures Judiciaires (Portalis)</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.procedures_portalis}
                          onToggle={(visible) => handleVisibilityToggle('procedures_portalis', visible)}
                          label="Portalis"
                        />
                      )}
                    </div>
                    <EditableSelect
                      value={companyData.study.compliance.procedures_portalis.status}
                      field="procedures_portalis_status"
                      options={procedureStatusOptions}
                      icon={getStatusIcon(companyData.study.compliance.procedures_portalis.status)}
                      badge={<Badge variant="outline">{companyData.study.compliance.procedures_portalis.count} actives</Badge>}
                    />
                  </div>
                )}

                {/* Audit de conformité */}
                {encartVisibility.compliance_audit && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Audit de Conformité</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.compliance_audit}
                          onToggle={(visible) => handleVisibilityToggle('compliance_audit', visible)}
                          label="Audit"
                        />
                      )}
                    </div>
                    <EditableField
                      value={companyData.study.compliance.compliance_audit}
                      field="compliance_audit"
                      multiline
                      icon={<FileText className="h-4 w-4" />}
                    />
                    <EditableField
                      value={companyData.study.compliance.legal_risk_analysis}
                      field="legal_risk_analysis"
                      multiline
                      icon={<AlertTriangle className="h-4 w-4" />}
                    />
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Section Mitigation Fiscale */}
      {encartVisibility.fiscal && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Mitigation Fiscale</CardTitle>
                {getStatusBadge("à_jour")}
              </div>
              <div className="flex items-center space-x-2">
                {isEditing && (
                  <VisibilityToggle
                    isVisible={encartVisibility.fiscal}
                    onToggle={(visible) => handleVisibilityToggle('fiscal', visible)}
                    label="Fiscal"
                  />
                )}
                <Collapsible open={openSections.fiscal} onOpenChange={() => toggleSection('fiscal')}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center">
                      {openSections.fiscal ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
          </CardHeader>
          <Collapsible open={openSections.fiscal} onOpenChange={() => toggleSection('fiscal')}>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Déclarations fiscales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <EditableSelect
                    value={companyData.study.fiscal.tva_declarations}
                    field="tva_declarations"
                    options={fiscalStatusOptions}
                    icon={getStatusIcon(companyData.study.fiscal.tva_declarations)}
                    badge={<Badge variant="outline">TVA</Badge>}
                  />
                  <EditableSelect
                    value={companyData.study.fiscal.is_declarations}
                    field="is_declarations"
                    options={fiscalStatusOptions}
                    icon={getStatusIcon(companyData.study.fiscal.is_declarations)}
                    badge={<Badge variant="outline">IS</Badge>}
                  />
                  <EditableSelect
                    value={companyData.study.fiscal.cet_declarations}
                    field="cet_declarations"
                    options={fiscalStatusOptions}
                    icon={getStatusIcon(companyData.study.fiscal.cet_declarations)}
                    badge={<Badge variant="outline">CET</Badge>}
                  />
                </div>

                {/* Évolution fiscale */}
                {encartVisibility.fiscal_evolution && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Évolution des Obligations Fiscales</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.fiscal_evolution}
                          onToggle={(visible) => handleVisibilityToggle('fiscal_evolution', visible)}
                          label="Évolution"
                        />
                      )}
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={fiscalEvolution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="tva" stroke="#8884d8" strokeWidth={2} />
                          <Line type="monotone" dataKey="is" stroke="#82ca9d" strokeWidth={2} />
                          <Line type="monotone" dataKey="cet" stroke="#ffc658" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Stratégie fiscale */}
                {encartVisibility.tax_strategy && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Stratégie d'Optimisation</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.tax_strategy}
                          onToggle={(visible) => handleVisibilityToggle('tax_strategy', visible)}
                          label="Stratégie"
                        />
                      )}
                    </div>
                    <EditableField
                      value={companyData.study.fiscal.fiscal_optimization}
                      field="fiscal_optimization"
                      multiline
                      icon={<Calculator className="h-4 w-4" />}
                    />
                    <EditableField
                      value={companyData.study.fiscal.tax_strategy}
                      field="tax_strategy"
                      multiline
                      icon={<TrendingUp className="h-4 w-4" />}
                    />
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Section Situation Financière */}
      {encartVisibility.financial && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Situation Financière</CardTitle>
                {getStatusBadge("bon")}
              </div>
              <div className="flex items-center space-x-2">
                {isEditing && (
                  <VisibilityToggle
                    isVisible={encartVisibility.financial}
                    onToggle={(visible) => handleVisibilityToggle('financial', visible)}
                    label="Financier"
                  />
                )}
                <Collapsible open={openSections.financial} onOpenChange={() => toggleSection('financial')}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center">
                      {openSections.financial ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
          </CardHeader>
          <Collapsible open={openSections.financial} onOpenChange={() => toggleSection('financial')}>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Analyses financières */}
                {encartVisibility.balance_analysis && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Analyses Financières Approfondies</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.balance_analysis}
                          onToggle={(visible) => handleVisibilityToggle('balance_analysis', visible)}
                          label="Analyses"
                        />
                      )}
                    </div>
                    <EditableField
                      value={companyData.study.financial.balance_analysis}
                      field="balance_analysis"
                      multiline
                      icon={<TrendingUp className="h-4 w-4" />}
                    />
                    <EditableField
                      value={companyData.study.financial.cash_flow_analysis}
                      field="cash_flow_analysis"
                      multiline
                      icon={<Calculator className="h-4 w-4" />}
                    />
                    <EditableField
                      value={companyData.study.financial.profitability_analysis}
                      field="profitability_analysis"
                      multiline
                      icon={<TrendingUp className="h-4 w-4" />}
                    />
                    <EditableField
                      value={companyData.study.financial.financial_recommendations}
                      field="financial_recommendations"
                      multiline
                      icon={<FileText className="h-4 w-4" />}
                    />
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Section Analyse Économique */}
      {encartVisibility.economic && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Analyse Économique et Commerciale</CardTitle>
                {getStatusBadge("bon")}
              </div>
              <div className="flex items-center space-x-2">
                {isEditing && (
                  <VisibilityToggle
                    isVisible={encartVisibility.economic}
                    onToggle={(visible) => handleVisibilityToggle('economic', visible)}
                    label="Économique"
                  />
                )}
                <Collapsible open={openSections.economic} onOpenChange={() => toggleSection('economic')}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center">
                      {openSections.economic ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
          </CardHeader>
          <Collapsible open={openSections.economic} onOpenChange={() => toggleSection('economic')}>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Positionnement marché */}
                {encartVisibility.market_position && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Positionnement Marché</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.market_position}
                          onToggle={(visible) => handleVisibilityToggle('market_position', visible)}
                          label="Position"
                        />
                      )}
                    </div>
                    <EditableField
                      value={companyData.study.economic.market_position}
                      field="market_position"
                      multiline
                      icon={<TrendingUp className="h-4 w-4" />}
                    />
                  </div>
                )}

                {/* Analyse concurrentielle */}
                {encartVisibility.competitive_analysis && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Analyse Concurrentielle</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.competitive_analysis}
                          onToggle={(visible) => handleVisibilityToggle('competitive_analysis', visible)}
                          label="Concurrence"
                        />
                      )}
                    </div>
                    <EditableField
                      value={companyData.study.economic.competitive_analysis}
                      field="competitive_analysis"
                      multiline
                      icon={<Building className="h-4 w-4" />}
                    />
                    <EditableField
                      value={companyData.study.economic.growth_strategy}
                      field="growth_strategy"
                      multiline
                      icon={<TrendingUp className="h-4 w-4" />}
                    />
                  </div>
                )}

                {/* Évolution du marché */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Évolution Performance vs Marché</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marketEvolution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="performance" stroke="#8884d8" strokeWidth={2} name="Performance Entreprise" />
                        <Line type="monotone" dataKey="marché" stroke="#82ca9d" strokeWidth={2} name="Moyenne Marché" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Section Gouvernance */}
      {encartVisibility.governance && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Structuration, Gouvernance et Management</CardTitle>
                <Badge variant="outline">{companyData.study.governance.governance_score}/10</Badge>
              </div>
              <div className="flex items-center space-x-2">
                {isEditing && (
                  <VisibilityToggle
                    isVisible={encartVisibility.governance}
                    onToggle={(visible) => handleVisibilityToggle('governance', visible)}
                    label="Gouvernance"
                  />
                )}
                <Collapsible open={openSections.governance} onOpenChange={() => toggleSection('governance')}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center">
                      {openSections.governance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
          </CardHeader>
          <Collapsible open={openSections.governance} onOpenChange={() => toggleSection('governance')}>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Qualité du management */}
                {encartVisibility.management_quality && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Qualité du Management</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.management_quality}
                          onToggle={(visible) => handleVisibilityToggle('management_quality', visible)}
                          label="Management"
                        />
                      )}
                    </div>
                    <EditableField
                      value={companyData.study.governance.management_quality}
                      field="management_quality"
                      multiline
                      icon={<Building className="h-4 w-4" />}
                    />
                    <EditableField
                      value={companyData.study.governance.leadership_analysis}
                      field="leadership_analysis"
                      multiline
                      icon={<FileText className="h-4 w-4" />}
                    />
                  </div>
                )}

                {/* Composition du conseil */}
                {encartVisibility.board_composition && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Composition du Conseil</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.board_composition}
                          onToggle={(visible) => handleVisibilityToggle('board_composition', visible)}
                          label="Conseil"
                        />
                      )}
                    </div>
                    <EditableField
                      value={companyData.study.governance.board_composition}
                      field="board_composition"
                      multiline
                      icon={<Building className="h-4 w-4" />}
                    />
                    <EditableField
                      value={companyData.study.governance.control_systems}
                      field="control_systems"
                      multiline
                      icon={<Shield className="h-4 w-4" />}
                    />
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}

      {/* Section Certifications et Agréments */}
      {encartVisibility.certifications && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Certifications et Agréments</CardTitle>
                {getStatusBadge("non_applicable")}
              </div>
              <div className="flex items-center space-x-2">
                {isEditing && (
                  <VisibilityToggle
                    isVisible={encartVisibility.certifications}
                    onToggle={(visible) => handleVisibilityToggle('certifications', visible)}
                    label="Certifications"
                  />
                )}
                <Collapsible open={openSections.certifications} onOpenChange={() => toggleSection('certifications')}>
                  <CollapsibleTrigger asChild>
                    <button className="flex items-center">
                      {openSections.certifications ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
          </CardHeader>
          <Collapsible open={openSections.certifications} onOpenChange={() => toggleSection('certifications')}>
            <CollapsibleContent>
              <CardContent className="space-y-6">
                {/* Certifications ISO */}
                {encartVisibility.iso_certifications && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Certifications ISO</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.iso_certifications}
                          onToggle={(visible) => handleVisibilityToggle('iso_certifications', visible)}
                          label="ISO"
                        />
                      )}
                    </div>
                    <EditableSelect
                      value={companyData.study.certifications.iso_certifications}
                      field="iso_certifications"
                      options={certificationStatusOptions}
                      icon={<Award className="h-4 w-4" />}
                      badge={<Badge variant="outline">ISO 9001/14001</Badge>}
                    />
                  </div>
                )}

                {/* Labels qualité */}
                {encartVisibility.quality_labels && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Labels Qualité</h4>
                      {isEditing && (
                        <VisibilityToggle
                          isVisible={encartVisibility.quality_labels}
                          onToggle={(visible) => handleVisibilityToggle('quality_labels', visible)}
                          label="Labels"
                        />
                      )}
                    </div>
                    <EditableSelect
                      value={companyData.study.certifications.quality_labels}
                      field="quality_labels"
                      options={certificationStatusOptions}
                      icon={<Award className="h-4 w-4" />}
                      badge={<Badge variant="outline">Qualité France</Badge>}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableSelect
                    value={companyData.study.certifications.industry_approvals}
                    field="industry_approvals"
                    options={certificationStatusOptions}
                    icon={<Award className="h-4 w-4" />}
                    badge={<Badge variant="outline">Agréments sectoriels</Badge>}
                  />
                  <EditableSelect
                    value={companyData.study.certifications.environmental_certifications}
                    field="environmental_certifications"
                    options={certificationStatusOptions}
                    icon={<Award className="h-4 w-4" />}
                    badge={<Badge variant="outline">Environnement</Badge>}
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      )}
    </div>
  );
}