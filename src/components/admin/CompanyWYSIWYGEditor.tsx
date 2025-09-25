import { useState, useEffect } from "react";
import { useCompanyData } from "@/hooks/useCompanyData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
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
  EyeOff
} from "lucide-react";
import { Label } from "@/components/ui/label";
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
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  value, 
  placeholder, 
  onSave, 
  multiline = false, 
  icon,
  badge,
  type = "text"
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
    );
  }

  const displayValue = value || placeholder;
  const isPlaceholder = !value;

  return (
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
    governance: false
  });

  useEffect(() => {
    if (companyData) {
      setFormData(companyData);
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
          edited_at: new Date().toISOString()
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
        description: "Impossible de sauvegarder les modifications",
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
    director: formData.pappers?.dirigeants?.[0] ? `${formData.pappers.dirigeants[0].prenom} ${formData.pappers.dirigeants[0].nom}` : '',
    phone: getNestedValue(formData, ['enriched', 'contactInfo', 'phone']) || getNestedValue(formData, ['pappers', 'telephone']),
    email: getNestedValue(formData, ['enriched', 'contactInfo', 'email']) || getNestedValue(formData, ['pappers', 'email']),
    website: getNestedValue(formData, ['pappers', 'siteWeb']),
    foundedYear: formData.sirene?.dateCreation ? new Date(formData.sirene.dateCreation).getFullYear().toString() : '',
    status: getNestedValue(formData, ['sirene', 'statut']),
    capitalSocial: getNestedValue(formData, ['enriched', 'legalInfo', 'socialCapital']) || 
                  formData.pappers?.capitalSocial?.toLocaleString() + ' €' ||
                  formData.infogreffe?.capitalSocial?.toLocaleString() + ' €' || 
                  ''
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
      <header className="bg-background border-b shadow-sm">
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
      <div className="bg-background border-b">
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="study">Étude approfondie</TabsTrigger>
            <TabsTrigger value="predictive">Analyse prédictive</TabsTrigger>
            <TabsTrigger value="reports">Rapports & Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                      value={displayCompanyData.address}
                      placeholder="Adresse complète"
                      onSave={(value) => updateField(['sirene', 'adresse'], value)}
                      icon={<MapPin className="h-4 w-4" />}
                    />
                    <EditableField
                      value={displayCompanyData.director}
                      placeholder="Nom du dirigeant"
                      onSave={(value) => updateField(['pappers', 'dirigeants', '0', 'nom'], value)}
                      icon={<User className="h-4 w-4" />}
                    />
                    <EditableField
                      value={displayCompanyData.foundedYear}
                      placeholder="Année de création"
                      onSave={(value) => updateField(['sirene', 'dateCreation'], value)}
                      icon={<Calendar className="h-4 w-4" />}
                      type="number"
                    />
                  </div>
                  <div className="space-y-4">
                    <EditableField
                      value={displayCompanyData.phone}
                      placeholder="+33 X XX XX XX XX"
                      onSave={(value) => updateField(['pappers', 'telephone'], value)}
                      icon={<Phone className="h-4 w-4" />}
                      type="tel"
                    />
                    <EditableField
                      value={displayCompanyData.email}
                      placeholder="contact@entreprise.com"
                      onSave={(value) => updateField(['pappers', 'email'], value)}
                      icon={<Mail className="h-4 w-4" />}
                      type="email"
                    />
                    <EditableField
                      value={displayCompanyData.capitalSocial}
                      placeholder="Capital social (€)"
                      onSave={(value) => updateField(['enriched', 'legalInfo', 'socialCapital'], value)}
                      icon={<Users className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges and Status */}
            <Card>
              <CardHeader>
                <CardTitle>Statuts et certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="bg-success-light text-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Entreprise {displayCompanyData.status || 'Active'}
                  </Badge>
                  
                  {formData.rubyPayeur && (
                    <Badge variant="secondary" className={
                      formData.rubyPayeur.scoreGlobal >= 7 
                        ? "bg-success-light text-success" 
                        : formData.rubyPayeur.scoreGlobal >= 5 
                        ? "bg-warning-light text-warning"
                        : "bg-destructive-light text-destructive"
                    }>
                      {formData.rubyPayeur.scoreGlobal >= 7 ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                      Score Crédit/Finance: {formData.rubyPayeur.scoreGlobal}/10
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <RotateCw className="h-3 w-3 mr-1" />
                    INSEE/SIRENE
                  </Badge>
                  
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Pappers
                  </Badge>
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
                          <div className="grid md:grid-cols-2 gap-4">
                            <EditableField
                              value={getNestedValue(formData, ['enriched', 'economic', 'marketShare'])}
                              placeholder="Part de marché (%)"
                              onSave={(value) => updateField(['enriched', 'economic', 'marketShare'], value)}
                              type="number"
                            />
                            <EditableField
                              value={getNestedValue(formData, ['enriched', 'economic', 'competitivePosition'])}
                              placeholder="Position concurrentielle"
                              onSave={(value) => updateField(['enriched', 'economic', 'competitivePosition'], value)}
                            />
                          </div>
                          <EditableField
                            value={getNestedValue(formData, ['enriched', 'economic', 'analysis'])}
                            placeholder="Analyse économique et commerciale détaillée..."
                            onSave={(value) => updateField(['enriched', 'economic', 'analysis'], value)}
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
                          <div className="grid md:grid-cols-3 gap-4">
                            <EditableField
                              value={getNestedValue(formData, ['enriched', 'financial', 'liquidityRatio'])}
                              placeholder="Ratio liquidité"
                              onSave={(value) => updateField(['enriched', 'financial', 'liquidityRatio'], value)}
                              type="number"
                            />
                            <EditableField
                              value={getNestedValue(formData, ['enriched', 'financial', 'profitabilityRate'])}
                              placeholder="Rentabilité nette (%)"
                              onSave={(value) => updateField(['enriched', 'financial', 'profitabilityRate'], value)}
                              type="number"
                            />
                            <EditableField
                              value={getNestedValue(formData, ['enriched', 'financial', 'debtRatio'])}
                              placeholder="Taux endettement (%)"
                              onSave={(value) => updateField(['enriched', 'financial', 'debtRatio'], value)}
                              type="number"
                            />
                          </div>
                          <EditableField
                            value={getNestedValue(formData, ['enriched', 'financial', 'analysis'])}
                            placeholder="Analyse financière détaillée des ratios, flux de trésorerie et performance..."
                            onSave={(value) => updateField(['enriched', 'financial', 'analysis'], value)}
                            multiline
                          />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>

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
                          {/* Visibility Controls */}
                          <div className="bg-muted/30 p-4 rounded-lg border border-dashed">
                            <h4 className="font-semibold mb-3 flex items-center">
                              <Eye className="h-4 w-4 mr-2" />
                              Contrôles de visibilité
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <VisibilityToggle
                                isVisible={getNestedValue(formData, ['enriched', 'uiSettings', 'sectionVisibility', 'compliance', 'fiscalStatus']) !== "false"}
                                onToggle={(visible) => updateField(['enriched', 'uiSettings', 'sectionVisibility', 'compliance', 'fiscalStatus'], visible.toString())}
                                label="Statuts de conformité"
                              />
                              <VisibilityToggle
                                isVisible={getNestedValue(formData, ['enriched', 'uiSettings', 'sectionVisibility', 'compliance', 'judicialCompliance']) !== "false"}
                                onToggle={(visible) => updateField(['enriched', 'uiSettings', 'sectionVisibility', 'compliance', 'judicialCompliance'], visible.toString())}
                                label="Conformité judiciaire"
                              />
                              <VisibilityToggle
                                isVisible={getNestedValue(formData, ['enriched', 'uiSettings', 'sectionVisibility', 'compliance', 'legalProcedures']) !== "false"}
                                onToggle={(visible) => updateField(['enriched', 'uiSettings', 'sectionVisibility', 'compliance', 'legalProcedures'], visible.toString())}
                                label="Procédures juridiques"
                              />
                              <VisibilityToggle
                                isVisible={getNestedValue(formData, ['enriched', 'uiSettings', 'sectionVisibility', 'compliance', 'riskAnalysis']) !== "false"}
                                onToggle={(visible) => updateField(['enriched', 'uiSettings', 'sectionVisibility', 'compliance', 'riskAnalysis'], visible.toString())}
                                label="Analyse de risque juridique"
                              />
                            </div>
                          </div>

                          {/* Scores de conformité par domaine */}
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center">
                              <Shield className="h-4 w-4 mr-2" />
                              Scores de Conformité par Domaine
                            </h4>
                            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Fiscal</Label>
                                <EditableField
                                  value={getNestedValue(formData, ['enriched', 'compliance', 'domainScores', 'fiscal'])}
                                  placeholder="8.5"
                                  onSave={(value) => updateField(['enriched', 'compliance', 'domainScores', 'fiscal'], value)}
                                  type="number"
                                />
                                <EditableField
                                  value={getNestedValue(formData, ['enriched', 'compliance', 'lastAudits', 'fiscal'])}
                                  placeholder="12/2023"
                                  onSave={(value) => updateField(['enriched', 'compliance', 'lastAudits', 'fiscal'], value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Social</Label>
                                <EditableField
                                  value={getNestedValue(formData, ['enriched', 'compliance', 'domainScores', 'social'])}
                                  placeholder="9.2"
                                  onSave={(value) => updateField(['enriched', 'compliance', 'domainScores', 'social'], value)}
                                  type="number"
                                />
                                <EditableField
                                  value={getNestedValue(formData, ['enriched', 'compliance', 'lastAudits', 'social'])}
                                  placeholder="03/2024"
                                  onSave={(value) => updateField(['enriched', 'compliance', 'lastAudits', 'social'], value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Environnemental</Label>
                                <EditableField
                                  value={getNestedValue(formData, ['enriched', 'compliance', 'domainScores', 'environmental'])}
                                  placeholder="7.8"
                                  onSave={(value) => updateField(['enriched', 'compliance', 'domainScores', 'environmental'], value)}
                                  type="number"
                                />
                                <EditableField
                                  value={getNestedValue(formData, ['enriched', 'compliance', 'lastAudits', 'environmental'])}
                                  placeholder="06/2023"
                                  onSave={(value) => updateField(['enriched', 'compliance', 'lastAudits', 'environmental'], value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">RGPD</Label>
                                <EditableField
                                  value={getNestedValue(formData, ['enriched', 'compliance', 'domainScores', 'gdpr'])}
                                  placeholder="8.9"
                                  onSave={(value) => updateField(['enriched', 'compliance', 'domainScores', 'gdpr'], value)}
                                  type="number"
                                />
                                <EditableField
                                  value={getNestedValue(formData, ['enriched', 'compliance', 'lastAudits', 'gdpr'])}
                                  placeholder="01/2024"
                                  onSave={(value) => updateField(['enriched', 'compliance', 'lastAudits', 'gdpr'], value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Secteur</Label>
                                <EditableField
                                  value={getNestedValue(formData, ['enriched', 'compliance', 'domainScores', 'sector'])}
                                  placeholder="8.1"
                                  onSave={(value) => updateField(['enriched', 'compliance', 'domainScores', 'sector'], value)}
                                  type="number"
                                />
                                <EditableField
                                  value={getNestedValue(formData, ['enriched', 'compliance', 'lastAudits', 'sector'])}
                                  placeholder="09/2023"
                                  onSave={(value) => updateField(['enriched', 'compliance', 'lastAudits', 'sector'], value)}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Conformité Judiciaire */}
                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center">
                              <Gavel className="h-4 w-4 mr-2" />
                              Conformité Judiciaire
                            </h4>
                            <div className="grid md:grid-cols-2 gap-6">
                              <Card className="p-4">
                                <h5 className="font-medium mb-3 text-warning">Contentieux Fiscal</h5>
                                <div className="space-y-2">
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'fiscalLitigation', 'redressements'])}
                                    placeholder="Redressements en cours"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'fiscalLitigation', 'redressements'], value)}
                                  />
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'fiscalLitigation', 'controls'])}
                                    placeholder="Contrôles fiscaux"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'fiscalLitigation', 'controls'], value)}
                                  />
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'fiscalLitigation', 'penalties'])}
                                    placeholder="Pénalités (K€)"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'fiscalLitigation', 'penalties'], value)}
                                    type="number"
                                  />
                                </div>
                              </Card>
                              <Card className="p-4">
                                <h5 className="font-medium mb-3 text-destructive">Contentieux Judiciaire</h5>
                                <div className="space-y-2">
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'judicialLitigation', 'procedures'])}
                                    placeholder="Procédures en cours"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'judicialLitigation', 'procedures'], value)}
                                  />
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'judicialLitigation', 'amounts'])}
                                    placeholder="Montants (K€)"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'judicialLitigation', 'amounts'], value)}
                                    type="number"
                                  />
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'judicialLitigation', 'provisions'])}
                                    placeholder="Provisions (K€)"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'judicialLitigation', 'provisions'], value)}
                                    type="number"
                                  />
                                </div>
                              </Card>
                            </div>
                          </div>

                          {/* Procédures */}
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-6">
                              <Card className="p-4">
                                <h5 className="font-medium mb-3 flex items-center">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Procédures Juridiques
                                </h5>
                                <div className="space-y-2">
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'legalProcedures', 'sauvegarde'])}
                                    placeholder="Sauvegarde"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'legalProcedures', 'sauvegarde'], value)}
                                  />
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'legalProcedures', 'redressement'])}
                                    placeholder="Redressement"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'legalProcedures', 'redressement'], value)}
                                  />
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'legalProcedures', 'liquidation'])}
                                    placeholder="Liquidation"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'legalProcedures', 'liquidation'], value)}
                                  />
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'legalProcedures', 'mandataire'])}
                                    placeholder="Mandataire ad-hoc"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'legalProcedures', 'mandataire'], value)}
                                  />
                                </div>
                              </Card>
                              <Card className="p-4">
                                <h5 className="font-medium mb-3 flex items-center">
                                  <Scale className="h-4 w-4 mr-2" />
                                  Procédures Judiciaires
                                </h5>
                                <div className="space-y-2">
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'judicialProcedures', 'commercial'])}
                                    placeholder="Commercial"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'judicialProcedures', 'commercial'], value)}
                                  />
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'judicialProcedures', 'civil'])}
                                    placeholder="Civil"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'judicialProcedures', 'civil'], value)}
                                  />
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'judicialProcedures', 'penal'])}
                                    placeholder="Pénal"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'judicialProcedures', 'penal'], value)}
                                  />
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'judicialProcedures', 'administratif'])}
                                    placeholder="Administratif"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'judicialProcedures', 'administratif'], value)}
                                  />
                                </div>
                              </Card>
                            </div>
                          </div>

                          {/* Analyse de Risque Juridique */}
                          <Card className="bg-gradient-to-r from-destructive/5 to-warning/5 border-destructive/10">
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
                                Analyse de Risque Juridique
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">Profil de risque</Label>
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'riskAnalysis', 'profile'])}
                                    placeholder="L'entreprise présente une exposition modérée aux risques juridiques avec une vigilance particulière sur les aspects contractuels et réglementaires de son secteur..."
                                    onSave={(value) => updateField(['enriched', 'compliance', 'riskAnalysis', 'profile'], value)}
                                    multiline
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">Recommandations de gestion juridique</Label>
                                  <EditableField
                                    value={getNestedValue(formData, ['enriched', 'compliance', 'riskAnalysis', 'recommendations'])}
                                    placeholder="• Mettre à jour la veille réglementaire sectorielle\n• Renforcer les clauses contractuelles\n• Effectuer un audit de conformité RGPD"
                                    onSave={(value) => updateField(['enriched', 'compliance', 'riskAnalysis', 'recommendations'], value)}
                                    multiline
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Legacy Compliance Fields */}
                          <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-semibold">Obligations Fiscales (Legacy)</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'compliance', 'fiscalStatus'])}
                                placeholder="TVA, IS, CET - À jour"
                                onSave={(value) => updateField(['enriched', 'compliance', 'fiscalStatus'], value)}
                              />
                              <h4 className="font-semibold">Obligations Sociales</h4>
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'compliance', 'socialStatus'])}
                                placeholder="URSSAF, Retraite, Mutuelle - À jour"
                                onSave={(value) => updateField(['enriched', 'compliance', 'socialStatus'], value)}
                              />
                            </div>
                            <div className="space-y-4">
                              <h4 className="font-semibold">Certifications</h4>
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'compliance', 'certifications'])}
                                placeholder="ISO 27001, RGPD, Qualiopi"
                                onSave={(value) => updateField(['enriched', 'compliance', 'certifications'], value)}
                              />
                              <h4 className="font-semibold">Contentieux</h4>
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'compliance', 'litigation'])}
                                placeholder="Statut des litiges et procédures"
                                onSave={(value) => updateField(['enriched', 'compliance', 'litigation'], value)}
                              />
                            </div>
                          </div>
                          <EditableField
                            value={getNestedValue(formData, ['enriched', 'compliance', 'analysis'])}
                            placeholder="Analyse détaillée de la conformité réglementaire et des risques juridiques..."
                            onSave={(value) => updateField(['enriched', 'compliance', 'analysis'], value)}
                            multiline
                          />
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
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <h4 className="font-semibold">Optimisation Actuelle</h4>
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'fiscal', 'currentOptimization'])}
                                placeholder="Taux IS effectif, CIR, CVAE économisée"
                                onSave={(value) => updateField(['enriched', 'fiscal', 'currentOptimization'], value)}
                              />
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'fiscal', 'totalSavings'])}
                                placeholder="Économies totales 2023 (K€)"
                                onSave={(value) => updateField(['enriched', 'fiscal', 'totalSavings'], value)}
                                type="number"
                              />
                            </div>
                            <div className="space-y-4">
                              <h4 className="font-semibold">Potentiel d'Optimisation</h4>
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'fiscal', 'optimizationPotential'])}
                                placeholder="Report déficitaire, optimisation TVA"
                                onSave={(value) => updateField(['enriched', 'fiscal', 'optimizationPotential'], value)}
                              />
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'fiscal', 'potentialSavings'])}
                                placeholder="Potentiel total (K€)"
                                onSave={(value) => updateField(['enriched', 'fiscal', 'potentialSavings'], value)}
                                type="number"
                              />
                            </div>
                          </div>
                          <EditableField
                            value={getNestedValue(formData, ['enriched', 'fiscal', 'recommendations'])}
                            placeholder="Stratégies de mitigation recommandées et plan d'action fiscal..."
                            onSave={(value) => updateField(['enriched', 'fiscal', 'recommendations'], value)}
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
                              <Badge variant="secondary" className="bg-primary-light text-primary">
                                Gouvernance 8.2/10
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
                        <CardContent className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <h4 className="font-semibold">Structure de Gouvernance</h4>
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'governance', 'boardMembers'])}
                                placeholder="Nombre de membres CA"
                                onSave={(value) => updateField(['enriched', 'governance', 'boardMembers'], value)}
                                type="number"
                              />
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'governance', 'committees'])}
                                placeholder="Comités spécialisés (Audit, RH, Tech)"
                                onSave={(value) => updateField(['enriched', 'governance', 'committees'], value)}
                              />
                            </div>
                            <div className="space-y-4">
                              <h4 className="font-semibold">Indicateurs Management</h4>
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'governance', 'autonomyLevel'])}
                                placeholder="Autonomie équipes (%)"
                                onSave={(value) => updateField(['enriched', 'governance', 'autonomyLevel'], value)}
                                type="number"
                              />
                              <EditableField
                                value={getNestedValue(formData, ['enriched', 'governance', 'processQuality'])}
                                placeholder="Processus documentés (%)"
                                onSave={(value) => updateField(['enriched', 'governance', 'processQuality'], value)}
                                type="number"
                              />
                            </div>
                          </div>
                          <EditableField
                            value={getNestedValue(formData, ['enriched', 'governance', 'analysis'])}
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