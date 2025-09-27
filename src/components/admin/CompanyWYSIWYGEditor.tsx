import { useState, useEffect } from "react";
import { useCompanyData } from "@/hooks/useCompanyData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AIDataIndicator } from "@/components/ui/ai-data-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
  Loader2,
  RotateCw,
  Scale,
  Bot,
  Zap,
  Info,
  Save,
  RefreshCw,
  Edit,
  Check,
  X,
  Globe,
  Euro,
  Users,
  Crown,
  Award,
  Brain,
  Target,
  Activity,
  LineChart as LineChartIcon,
  Settings,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Gavel,
  Eye,
  EyeOff,
  Database,
  Clock
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { VisibilityToggle } from "./VisibilityToggle";
import { ScoreEditorModal } from "./ScoreEditorModal";
import { AlertBadge } from "./AlertBadge";
import { AlertSummaryBadge } from "./AlertSummaryBadge";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { calculateAlert, getGlobalAlertLevel, countAlertsByLevel } from "@/utils/alertUtils";
import type { CompanyFullData } from "@/types/api";

interface CompanyWYSIWYGEditorProps {
  siren: string;
}

interface EditableFieldProps {
  value: string;
  placeholder: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  icon?: React.ReactNode;
  badge?: string;
  type?: "text" | "number" | "email" | "tel" | "url";
  label?: string;
  isAIGenerated?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  value, 
  placeholder, 
  onSave, 
  multiline = false, 
  icon,
  badge,
  type = "text",
  label,
  isAIGenerated = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-1">
        {label && (
          <label className="text-xs font-medium text-foreground uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="flex items-center space-x-2 w-full">
          {icon && <div className="text-muted-foreground flex-shrink-0">{icon}</div>}
          {multiline ? (
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1 min-h-[80px]"
            />
          ) : (
            <Input
              type={type}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
          )}
          <div className="flex space-x-1 flex-shrink-0">
            <Button size="sm" variant="default" onClick={handleSave}>
              <Check className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const displayValue = value || placeholder;
  const isPlaceholder = !value;

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-xs font-medium text-foreground uppercase tracking-wide flex items-center gap-2">
          {label}
          {isAIGenerated && <AIDataIndicator variant="mini" />}
        </label>
      )}
      <div 
        className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded group transition-colors"
        onClick={() => setIsEditing(true)}
      >
        {icon && <div className="text-muted-foreground flex-shrink-0">{icon}</div>}
        <span className={`text-sm flex-1 ${isPlaceholder ? 'text-muted-foreground bg-muted px-2 py-1 rounded blur-sm' : ''}`}>
          {displayValue}
        </span>
        {badge && (
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            {badge}
          </Badge>
        )}
        <Edit className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>
    </div>
  );
};

const CompanyWYSIWYGEditor: React.FC<CompanyWYSIWYGEditorProps> = ({ siren }) => {
  const { data: companyData, loading, errors, refetch } = useCompanyData({ 
    siren, 
    autoFetch: true 
  });
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState<Partial<CompanyFullData>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    economic: false,
    financial: false,
    compliance: false,
    fiscal: false,
    governance: false,
    procedures: false
  });

  useEffect(() => {
    if (companyData) {
      // Initialize formData with company data and admin settings
      const formDataWithAdminSettings = {
        ...companyData,
        adminSettings: {
          showDataQualityDashboard: (companyData as any)?.adminSettings?.showDataQualityDashboard || false,
          ...(companyData as any)?.adminSettings
        }
      } as any;
      setFormData(formDataWithAdminSettings);
    }
  }, [companyData]);

  const updateField = (path: string[], value: string) => {
    setFormData(prevData => {
      const newData = { ...prevData };
      let current: any = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newData;
    });
    setHasChanges(true);
  };

  const getNestedValue = (obj: any, path: string[]): string => {
    return path.reduce((current, key) => current?.[key], obj) || '';
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('admin_companies')
        .upsert({
          siren: siren,
          company_name: getNestedValue(formData, ['sirene', 'denomination']) || 'Nom inconnu',
          siret: getNestedValue(formData, ['sirene', 'siret']),
          naf_code: getNestedValue(formData, ['sirene', 'naf']),
          activity: getNestedValue(formData, ['sirene', 'activitePrincipale']),
          address: getNestedValue(formData, ['sirene', 'adresse']),
          city: getNestedValue(formData, ['sirene', 'ville']),
          postal_code: getNestedValue(formData, ['sirene', 'codePostal']),
          status: getNestedValue(formData, ['sirene', 'statut']) || 'active',
          enriched_data: JSON.parse(JSON.stringify(formData)),
          is_manually_edited: true,
          edited_at: new Date().toISOString(),
          show_data_quality_dashboard: (formData as any)?.adminSettings?.showDataQualityDashboard || false
        }, {
          onConflict: 'siren'
        })
        .select()
        .single();

      if (error) throw error;

      setHasChanges(false);
      toast({
        title: "Sauvegardé",
        description: "Les modifications ont été enregistrées avec succès"
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Actualisé",
      description: "Les données ont été rechargées depuis les APIs"
    });
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleScoresChange = (newScores: {
    economic: number;
    financial: number;
    legal: number;
    fiscal: number;
    global: number;
  }) => {
    // Sauvegarder les nouvelles notes dans formData
    updateField(['enriched', 'adminScores', 'economic'], newScores.economic.toString());
    updateField(['enriched', 'adminScores', 'financial'], newScores.financial.toString());
    updateField(['enriched', 'adminScores', 'legal'], newScores.legal.toString());
    updateField(['enriched', 'adminScores', 'fiscal'], newScores.fiscal.toString());
    updateField(['enriched', 'adminScores', 'global'], newScores.global.toString());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Chargement des données...</span>
        </div>
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Erreurs de chargement</CardTitle>
          </CardHeader>
          <CardContent>
            {errors.map((error, index) => (
              <div key={index} className="text-sm text-destructive">
                <strong>{error.source}:</strong> {error.message}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formData || !formData.sirene) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    );
  }

  // Build display data similar to Analysis.tsx
  const displayCompanyData = {
    name: getNestedValue(formData, ['sirene', 'denomination']),
    siren: getNestedValue(formData, ['sirene', 'siren']),
    siret: getNestedValue(formData, ['sirene', 'siret']),
    naf: getNestedValue(formData, ['sirene', 'naf']),
    employees: getNestedValue(formData, ['sirene', 'effectifs']),
    address: getNestedValue(formData, ['sirene', 'adresse']),
    director: (() => {
      const d = formData.pappers?.dirigeants?.[0];
      return d ? [d.prenom, d.nom].filter(Boolean).join(' ') : '';
    })(),
    phone: getNestedValue(formData, ['enriched', 'contactInfo', 'phone']) || getNestedValue(formData, ['pappers', 'telephone']),
    email: getNestedValue(formData, ['enriched', 'contactInfo', 'email']) || getNestedValue(formData, ['pappers', 'email']),
    website: getNestedValue(formData, ['pappers', 'siteWeb']),
    foundedYear: formData.sirene?.dateCreation ? new Date(formData.sirene.dateCreation).getFullYear().toString() : '',
    status: getNestedValue(formData, ['sirene', 'statut']),
    capitalSocial: (() => {
      const pappersCapital = formData.pappers?.capitalSocial;
      const infogreffeCapital = formData.infogreffe?.capitalSocial;
      
      if (pappersCapital) return `${pappersCapital.toLocaleString()} €`;
      if (infogreffeCapital) return `${infogreffeCapital.toLocaleString()} €`;
      return '';
    })()
  };

  const displayScores = {
    // Priorité aux scores admin-édités, sinon scores API
    economic: getNestedValue(formData, ['enriched', 'adminScores', 'economic']) 
      ? parseFloat(getNestedValue(formData, ['enriched', 'adminScores', 'economic'])) 
      : (formData.predictor?.scores?.global || 6.0),
    financial: getNestedValue(formData, ['enriched', 'adminScores', 'financial']) 
      ? parseFloat(getNestedValue(formData, ['enriched', 'adminScores', 'financial'])) 
      : (formData.predictor?.scores?.financier || 6.0),
    legal: getNestedValue(formData, ['enriched', 'adminScores', 'legal']) 
      ? parseFloat(getNestedValue(formData, ['enriched', 'adminScores', 'legal'])) 
      : (formData.predictor?.scores?.legal || 7.5),
    fiscal: getNestedValue(formData, ['enriched', 'adminScores', 'fiscal']) 
      ? parseFloat(getNestedValue(formData, ['enriched', 'adminScores', 'fiscal'])) 
      : (formData.predictor?.scores?.fiscal || 6.8),
    global: getNestedValue(formData, ['enriched', 'adminScores', 'global']) 
      ? parseFloat(getNestedValue(formData, ['enriched', 'adminScores', 'global'])) 
      : (formData.predictor?.scores?.global || 6.0),
    defaultRisk: formData.predictor?.probabiliteDefaut ? 
      `${(formData.predictor.probabiliteDefaut.mois12 * 100).toFixed(1)}%` : 
      'Faible'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-background border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Predicor Admin</h1>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                Mode Édition
              </Badge>
              {(() => {
                const alertCounts = countAlertsByLevel(displayScores);
                const globalLevel = getGlobalAlertLevel(displayScores);
                
                if (alertCounts.total > 0) {
                  return (
                    <Badge 
                      className={
                        globalLevel === 'critical' 
                          ? "bg-alert-critical text-alert-critical-foreground border-transparent" 
                          : globalLevel === 'high'
                          ? "bg-alert-high text-alert-high-foreground border-transparent"
                          : "bg-alert-medium text-alert-medium-foreground border-transparent"
                      }
                    >
                      {alertCounts.critical > 0 && `${alertCounts.critical} Critique${alertCounts.critical > 1 ? 's' : ''}`}
                      {alertCounts.critical === 0 && alertCounts.high > 0 && `${alertCounts.high} Alerte${alertCounts.high > 1 ? 's' : ''}`}
                      {alertCounts.critical === 0 && alertCounts.high === 0 && `${alertCounts.medium} Vigilance${alertCounts.medium > 1 ? 's' : ''}`}
                    </Badge>
                  );
                }
                return null;
              })()}
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`/analysis?siren=${siren}`, '_blank')}
                className="text-primary border-primary hover:bg-primary/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir côté utilisateur
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isSaving}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className={hasChanges ? "bg-primary hover:bg-primary/90" : ""}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? "Sauvegarde..." : hasChanges ? "Sauvegarder" : "Sauvegardé"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Company Header */}
      <div className="bg-background border-b sticky top-[73px] z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 mb-2">
                  <EditableField
                    value={displayCompanyData.name}
                    placeholder="Nom de l'entreprise"
                    onSave={(value) => updateField(['sirene', 'denomination'], value)}
                  />
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-success-light text-success w-fit">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {displayCompanyData.status || 'Actif'}
                    </Badge>
                    <AlertSummaryBadge 
                      scores={displayScores}
                      className="shrink-0"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
                  <span>SIREN: {displayCompanyData.siren}</span>
                  <span>SIRET: {displayCompanyData.siret}</span>
                  <span>{displayCompanyData.naf}</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <ScoreEditorModal
                globalScore={displayScores.global}
                economicScore={displayScores.economic}
                financialScore={displayScores.financial}
                legalScore={displayScores.legal}
                fiscalScore={displayScores.fiscal}
                onScoresChange={handleScoresChange}
              >
                <div className="cursor-pointer hover:bg-muted/20 p-2 rounded-lg transition-colors group">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1 group-hover:text-primary/80">
                    {displayScores.global.toFixed(1)}/10
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center justify-center md:justify-end">
                    Score global
                    <Edit className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </ScoreEditorModal>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="sticky top-[183px] z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b mb-6 pb-2">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="study">Étude approfondie</TabsTrigger>
              <TabsTrigger value="predictive">Analyse prédictive</TabsTrigger>
              <TabsTrigger value="reports">Rapports & Actions</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Section Qualité des données - Admin Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    Qualité des données (Configuration Admin)
                  </div>
                  <VisibilityToggle
                    isVisible={(formData as any)?.adminSettings?.showDataQualitySection !== false}
                    onToggle={(visible) => updateField(['adminSettings', 'showDataQualitySection'], visible.toString())}
                    label="Afficher la section"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="data-completeness">Complétude des données (%)</Label>
                      <EditableField
                        value={getNestedValue(formData, ['enriched', 'dataQuality', 'completeness']) || '85'}
                        placeholder="85"
                        onSave={(value) => updateField(['enriched', 'dataQuality', 'completeness'], value)}
                        type="number"
                        label="Pourcentage de complétude"
                      />
                    </div>
                    <div>
                      <Label htmlFor="overall-status">Statut global</Label>
                      <EditableField
                        value={getNestedValue(formData, ['enriched', 'dataQuality', 'overallStatus']) || 'Données fiables'}
                        placeholder="Données fiables"
                        onSave={(value) => updateField(['enriched', 'dataQuality', 'overallStatus'], value)}
                        label="Statut affiché en bas de section"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Configuration des APIs</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {[
                        { key: 'insee', label: 'INSEE/SIRENE', category: 'Données officielles' },
                        { key: 'pappers', label: 'Pappers API', category: 'Données financières' },
                        { key: 'rubypayeur', label: 'RubyPayeur', category: 'Score crédit' },
                        { key: 'infogreffe', label: 'Infogreffe', category: 'Données juridiques' },
                        { key: 'ai_enrichment', label: 'IA Enrichissement', category: 'Données simulées' },
                        { key: 'sirius', label: 'SIRIUS', category: 'Données fiscales' },
                        { key: 'dgfip', label: 'DGFIP', category: 'Données fiscales' },
                        { key: 'portalis', label: 'PORTALIS', category: 'Données judiciaires' },
                        { key: 'opale', label: 'OPALE', category: 'Données sociales' }
                      ].map(api => (
                        <div key={api.key} className="flex items-center justify-between p-2 border rounded">
                          <div className="text-sm">
                            <div className="font-medium">{api.label}</div>
                            <div className="text-xs text-muted-foreground">{api.category}</div>
                          </div>
                          <Select 
                            value={getNestedValue(formData, ['enriched', 'dataQuality', 'apis', api.key, 'status']) || 'active'}
                            onValueChange={(value) => updateField(['enriched', 'dataQuality', 'apis', api.key, 'status'], value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="h-3 w-3 text-success" />
                                  <span>Actif</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="warning">
                                <div className="flex items-center space-x-1">
                                  <AlertTriangle className="h-3 w-3 text-warning" />
                                  <span>Alerte</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="inactive">
                                <div className="flex items-center space-x-1">
                                  <XCircle className="h-3 w-3 text-destructive" />
                                  <span>Inactif</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <EditableField
                      label="Adresse"
                      value={displayCompanyData.address}
                      placeholder="Adresse complète"
                      onSave={(value) => updateField(['sirene', 'adresse'], value)}
                      icon={<MapPin className="h-4 w-4" />}
                    />
                    <EditableField
                      label="Dirigeant"
                      value={displayCompanyData.director}
                      placeholder="Nom du dirigeant"
                      onSave={(value) => {
                        const parts = value.trim().split(/\s+/);
                        if (parts.length === 1) {
                          // Un seul mot => nom seulement
                          updateField(['pappers', 'dirigeants', '0', 'prenom'], '');
                          updateField(['pappers', 'dirigeants', '0', 'nom'], parts[0]);
                        } else {
                          // Plusieurs mots => premier = prénom, reste = nom
                          const first = parts.shift() || '';
                          const last = parts.join(' ');
                          updateField(['pappers', 'dirigeants', '0', 'prenom'], first);
                          updateField(['pappers', 'dirigeants', '0', 'nom'], last);
                        }
                      }}
                      icon={<User className="h-4 w-4" />}
                    />
                    <EditableField
                      label="Année de création"
                      value={displayCompanyData.foundedYear}
                      placeholder="Année de création"
                      onSave={(value) => updateField(['sirene', 'dateCreation'], value)}
                      icon={<Calendar className="h-4 w-4" />}
                      type="number"
                    />
                  </div>
                  <div className="space-y-4">
                    <EditableField
                      label="Téléphone"
                      value={displayCompanyData.phone}
                      placeholder="+33 X XX XX XX XX"
                      onSave={(value) => updateField(['pappers', 'telephone'], value)}
                      icon={<Phone className="h-4 w-4" />}
                      type="tel"
                      isAIGenerated={!!getNestedValue(formData, ['enriched', 'contactInfo', 'phone'])}
                    />
                    <EditableField
                      label="Email"
                      value={displayCompanyData.email}
                      placeholder="contact@entreprise.com"
                      onSave={(value) => updateField(['pappers', 'email'], value)}
                      icon={<Mail className="h-4 w-4" />}
                      type="email"
                      isAIGenerated={!!getNestedValue(formData, ['enriched', 'contactInfo', 'email'])}
                    />
                    <EditableField
                      label="Capital social"
                      value={displayCompanyData.capitalSocial}
                      placeholder="Capital social (€)"
                      onSave={(value) => updateField(['pappers', 'capitalSocial'], value)}
                      icon={<Euro className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Informations juridiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Forme juridique</label>
                      <div className="font-medium mt-1">SAS, société par actions simplifiée</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Numéro de TVA</label>
                      <div className="font-medium mt-1">FR{displayCompanyData.siren.replace(/\s/g, '')}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Capital social</label>
                      <div className="font-medium mt-1">{displayCompanyData.capitalSocial || 'Non renseigné'}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Inscription RCS</label>
                      <div className="font-medium text-success mt-1 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {getNestedValue(formData, ['pappers', 'dateCreation']) ? 
                          `INSCRIT (le ${new Date(formData.pappers.dateCreation).toLocaleDateString('fr-FR')})` :
                          'INSCRIT (au greffe de PARIS, le 15/03/2015)'
                        }
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Inscription RNE</label>
                      <div className="font-medium text-success mt-1 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {getNestedValue(formData, ['pappers', 'dateCreation']) ? 
                          `INSCRIT (le ${new Date(formData.pappers.dateCreation).toLocaleDateString('fr-FR')})` :
                          'INSCRIT (le 15/03/2015)'
                        }
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Numéro RCS</label>
                      <div className="font-medium mt-1">{displayCompanyData.siren} R.C.S. Paris</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Activités
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Activité principale déclarée</label>
                    <div className="font-medium mt-1">
                      {getNestedValue(formData, ['pappers', 'libelleNaf']) || 
                       getNestedValue(formData, ['sirene', 'naf']) || 
                       'Conseil en systèmes et logiciels informatiques, développement de solutions digitales sur mesure'}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Code NAF</label>
                      <div className="font-medium mt-1">{getNestedValue(formData, ['sirene', 'naf']) || '6202A'}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Catégorie NAF</label>
                      <div className="font-medium mt-1">Services aux entreprises</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description NAF</label>
                    <div className="text-sm text-muted-foreground mt-1">(Conseil en systèmes et logiciels informatiques)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-success-light to-success/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-success" />
                    Santé Financière
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success mb-2">{displayScores.financial.toFixed(1)}/10</div>
                  <p className="text-sm text-success-dark">Performance financière solide avec des indicateurs positifs</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary-light to-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Conformité Légale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{displayScores.legal.toFixed(1)}/10</div>
                  <p className="text-sm text-primary-dark">Conformité réglementaire excellente</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-warning-light to-warning/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
                    Risque Prédictif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-warning mb-2">{displayScores.defaultRisk}</div>
                  <p className="text-sm text-warning-dark">Probabilité de défaut sur 12 mois</p>
                </CardContent>
              </Card>
            </div>

            {/* Data Quality Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Qualité des données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Data Completeness */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-2 w-2 rounded-full bg-success"></div>
                      <span className="text-sm font-medium">Complétude des données</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-success" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-sm font-semibold text-success">85%</span>
                    </div>
                  </div>

                  {/* Data Freshness */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Dernière mise à jour</span>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      {new Date().toLocaleDateString('fr-FR')}
                    </Badge>
                  </div>

                  {/* Data Sources Status */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <div>
                        <p className="text-xs font-medium">INSEE/SIRENE</p>
                        <p className="text-xs text-muted-foreground">Données officielles</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <div>
                        <p className="text-xs font-medium">Pappers API</p>
                        <p className="text-xs text-muted-foreground">Données financières</p>
                      </div>
                    </div>
                    
                    {formData.rubyPayeur && (
                      <div className="flex items-center space-x-2 p-2 bg-primary/5 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <div>
                          <p className="text-xs font-medium">RubyPayeur</p>
                          <p className="text-xs text-muted-foreground">Score crédit</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 p-2 bg-warning/5 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <div>
                        <p className="text-xs font-medium">IA Enrichissement</p>
                        <p className="text-xs text-muted-foreground">Données simulées</p>
                      </div>
                    </div>
                  </div>

                  {/* Overall Status */}
                  <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-4 w-4 text-success" />
                      <div>
                        <p className="text-sm font-semibold text-success">Données fiables</p>
                        <p className="text-xs text-muted-foreground">Mix données officielles + enrichissement IA</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Entreprise {displayCompanyData.status || 'Active'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-primary" />
                  Analyse IA Globale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EditableField
                  value={getNestedValue(formData, ['enriched', 'aiAnalysis', 'summary'])}
                  placeholder="L'entreprise présente un profil avec une performance correcte dans son secteur. Les indicateurs montrent une santé financière stable avec des opportunités d'amélioration identifiées."
                  onSave={(value) => updateField(['enriched', 'aiAnalysis', 'summary'], value)}
                  multiline
                  badge="IA GPT-5"
                />
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Recommandations prioritaires
                  </h4>
                  <EditableField
                    value={getNestedValue(formData, ['enriched', 'aiAnalysis', 'recommendations'])}
                    placeholder="• Améliorer la trésorerie à court terme\n• Diversifier le portefeuille client\n• Renforcer les processus de conformité"
                    onSave={(value) => updateField(['enriched', 'aiAnalysis', 'recommendations'], value)}
                    multiline
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="study" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Étude Approfondie - Mode Édition</CardTitle>
                <CardDescription>Configuration avancée des analyses sectorielles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Executive Summary */}
                <ExecutiveSummary
                  scores={{
                    economic: displayScores.economic,
                    financial: displayScores.financial,
                    legal: displayScores.legal,
                    fiscal: displayScores.fiscal,
                    global: displayScores.global
                  }}
                  companyName={displayCompanyData.name}
                  existingSummary={{
                    profile: getNestedValue(formData, ['enriched', 'executiveSummary', 'profile'])
                  }}
                  onSummaryChange={(summary) => {
                    updateField(['enriched', 'executiveSummary', 'profile'], summary.profile);
                  }}
                  editable={true}
                />

                <div className="space-y-4">
                  {/* Compliance Section */}
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
                              <AlertBadge 
                                {...calculateAlert(displayScores.legal, 'legal')}
                                score={displayScores.legal}
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
                          <EditableField
                            value={getNestedValue(formData, ['enriched', 'compliance', 'analysis']) || ''}
                            placeholder="Analyse de conformité réglementaire..."
                            onSave={(value) => updateField(['enriched', 'compliance', 'analysis'], value)}
                            multiline
                          />
                          
                          {/* Procédures Judiciaires et Légales */}
                          <Card>
                            <Collapsible 
                              open={openSections.procedures} 
                              onOpenChange={() => toggleSection('procedures')}
                            >
                              <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <Scale className="h-5 w-5 text-primary" />
                                      <div>
                                        <CardTitle className="text-lg">Procédures Judiciaires et Légales</CardTitle>
                                        <CardDescription>Gestion des procédures précontentieuses et judiciaires</CardDescription>
                                      </div>
                                    </div>
                                    {openSections.procedures ? 
                                      <ChevronDown className="h-4 w-4" /> : 
                                      <ChevronRight className="h-4 w-4" />
                                    }
                                  </div>
                                </CardHeader>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent>
                                <CardContent className="space-y-6">
                                  <div className="grid md:grid-cols-2 gap-6">
                                    {/* Procédures Précontentieuses */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-base flex items-center">
                                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                                          Procédures Précontentieuses
                                        </CardTitle>
                                        <CardDescription>Source affichée: BODACC</CardDescription>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-3">
                                          {[
                                            { label: 'Mise en demeure', slug: 'mise_en_demeure' },
                                            { label: 'Commandement de payer par huissier', slug: 'commandement_de_payer_par_huissier' },
                                            { label: 'Résiliation de contrat', slug: 'resiliation_de_contrat' },
                                            { label: 'Inscription privilèges/nantissements', slug: 'inscription_privileges_nantissements' },
                                            { label: 'Radiation d\'office du RCS', slug: 'radiation_doffice_du_rcs' },
                                            { label: 'Procédure amiable', slug: 'procedure_amiable' },
                                            { label: 'Déclaration de créance', slug: 'declaration_de_creance' }
                                          ].map(({ label, slug }) => (
                                            <div key={slug} className="flex items-center justify-between space-x-2">
                                              <span className="text-sm font-medium flex-1">{label}</span>
                                              <Select
                                                value={getNestedValue(formData, ['enriched', 'compliance', 'legalProcedures', slug]) || 'NC'}
                                                onValueChange={(value) => updateField(['enriched', 'compliance', 'legalProcedures', slug], value)}
                                              >
                                                <SelectTrigger className="w-32">
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="NC">NC</SelectItem>
                                                  <SelectItem value="Aucune">Aucune</SelectItem>
                                                  <SelectItem value="1 en cours">1 en cours</SelectItem>
                                                  <SelectItem value="1 active">1 active</SelectItem>
                                                  <SelectItem value="2 actives">2 actives</SelectItem>
                                                  <SelectItem value="3+ actives">3+ actives</SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    {/* Procédures Judiciaires */}
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-base flex items-center">
                                          <Gavel className="h-4 w-4 mr-2 text-red-500" />
                                          Procédures Judiciaires
                                        </CardTitle>
                                        <CardDescription>Source affichée: PORTALIS</CardDescription>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-3">
                                          {[
                                            { label: 'Assignation Tribunal de commerce', slug: 'assignation_tribunal_de_commerce' },
                                            { label: 'Injonction de payer', slug: 'injonction_de_payer' },
                                            { label: 'Référé commercial', slug: 'refere_commercial' },
                                            { label: 'Redressement judiciaire', slug: 'redressement_judiciaire' },
                                            { label: 'Liquidation judiciaire', slug: 'liquidation_judiciaire' },
                                            { label: 'Sauvegarde', slug: 'sauvegarde' },
                                            { label: 'Appel des décisions', slug: 'appel_des_decisions' },
                                            { label: 'Contentieux prud\'homal', slug: 'contentieux_prudhomal' },
                                            { label: 'Contentieux administratif', slug: 'contentieux_administratif' }
                                          ].map(({ label, slug }) => (
                                            <div key={slug} className="flex items-center justify-between space-x-2">
                                              <span className="text-sm font-medium flex-1">{label}</span>
                                              <Select
                                                value={getNestedValue(formData, ['enriched', 'compliance', 'judicialProcedures', slug]) || 'NC'}
                                                onValueChange={(value) => updateField(['enriched', 'compliance', 'judicialProcedures', slug], value)}
                                              >
                                                <SelectTrigger className="w-32">
                                                  <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  <SelectItem value="NC">NC</SelectItem>
                                                  <SelectItem value="Aucun">Aucun</SelectItem>
                                                  <SelectItem value="Non">Non</SelectItem>
                                                  <SelectItem value="1 en cours">1 en cours</SelectItem>
                                                  <SelectItem value="1 active">1 active</SelectItem>
                                                  <SelectItem value="2 actives">2 actives</SelectItem>
                                                  <SelectItem value="3+ actives">3+ actives</SelectItem>
                                                </SelectContent>
                                              </Select>
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
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Fiscal Mitigation Section */}
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
                              <AlertBadge 
                                {...calculateAlert(displayScores.fiscal, 'fiscal')}
                                score={displayScores.fiscal}
                              />
                              {openSections.fiscal ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <EditableField
                            value={getNestedValue(formData, ['enriched', 'fiscal', 'strategies']) || ''}
                            placeholder="Stratégies fiscales et optimisations..."
                            onSave={(value) => updateField(['enriched', 'fiscal', 'strategies'], value)}
                            multiline
                          />
                          <EditableField
                            value={getNestedValue(formData, ['enriched', 'fiscal', 'recommendations']) || ''}
                            placeholder="Recommandations fiscales..."
                            onSave={(value) => updateField(['enriched', 'fiscal', 'recommendations'], value)}
                            multiline
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Financial Analysis Section */}
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
                              <AlertBadge 
                                {...calculateAlert(displayScores.financial, 'financial')}
                                score={displayScores.financial}
                              />
                              {openSections.financial ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <EditableField
                            value={getNestedValue(formData, ['enriched', 'financial', 'analysis']) || ''}
                            placeholder="Analyse de la situation financière..."
                            onSave={(value) => updateField(['enriched', 'financial', 'analysis'], value)}
                            multiline
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Economic Analysis Section */}
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
                                <CardDescription>Configuration des données de marché</CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <AlertBadge 
                                {...calculateAlert(displayScores.economic, 'economic')}
                                score={displayScores.economic}
                              />
                              {openSections.economic ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <EditableField
                            value={getNestedValue(formData, ['enriched', 'economic', 'analysis']) || ''}
                            placeholder="Analyse économique et commerciale..."
                            onSave={(value) => updateField(['enriched', 'economic', 'analysis'], value)}
                            multiline
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

                  {/* Governance Section */}
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
                              <AlertBadge 
                                {...calculateAlert(displayScores.legal, 'legal')}
                                score={displayScores.legal}
                              />
                              {openSections.governance ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="space-y-4">
                          <EditableField
                            value={getNestedValue(formData, ['enriched', 'governance', 'analysis']) || ''}
                            placeholder="Analyse des risques organisationnels, points forts et axes d'amélioration..."
                            onSave={(value) => updateField(['enriched', 'governance', 'analysis'], value)}
                            multiline
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>

           <TabsContent value="predictive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyse Prédictive - Mode Édition</CardTitle>
                <CardDescription>Configuration des modèles et paramètres prédictifs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Risque 3 mois (%)</label>
                    <EditableField
                      value={formData.predictor?.probabiliteDefaut?.mois3 ? (formData.predictor.probabiliteDefaut.mois3 * 100).toFixed(1) : ''}
                      placeholder="2.1"
                      onSave={(value) => updateField(['predictor', 'probabiliteDefaut', 'mois3'], (parseFloat(value) / 100).toString())}
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Risque 6 mois (%)</label>
                    <EditableField
                      value={formData.predictor?.probabiliteDefaut?.mois6 ? (formData.predictor.probabiliteDefaut.mois6 * 100).toFixed(1) : ''}
                      placeholder="3.8"
                      onSave={(value) => updateField(['predictor', 'probabiliteDefaut', 'mois6'], (parseFloat(value) / 100).toString())}
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Risque 12 mois (%)</label>
                    <EditableField
                      value={formData.predictor?.probabiliteDefaut?.mois12 ? (formData.predictor.probabiliteDefaut.mois12 * 100).toFixed(1) : ''}
                      placeholder="4.9"
                      onSave={(value) => updateField(['predictor', 'probabiliteDefaut', 'mois12'], (parseFloat(value) / 100).toString())}
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confiance IA (%)</label>
                    <EditableField
                      value={getNestedValue(formData, ['predictor', 'confidence'])}
                      placeholder="85"
                      onSave={(value) => updateField(['predictor', 'confidence'], value)}
                      type="number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rapports & Actions - Mode Édition</CardTitle>
                <CardDescription>Configuration des rapports et actions disponibles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Configuration des rapports
                    </h4>
                    <EditableField
                      value={getNestedValue(formData, ['enriched', 'reports', 'executiveSummary'])}
                      placeholder="Résumé exécutif personnalisé..."
                      onSave={(value) => updateField(['enriched', 'reports', 'executiveSummary'], value)}
                      multiline
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      Alertes et notifications
                    </h4>
                    <EditableField
                      value={getNestedValue(formData, ['enriched', 'alerts', 'settings'])}
                      placeholder="Configuration des seuils d'alerte..."
                      onSave={(value) => updateField(['enriched', 'alerts', 'settings'], value)}
                      multiline
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export { CompanyWYSIWYGEditor };