import { useState, useEffect, useCallback } from "react";
import { useCompanyData } from "@/hooks/useCompanyData";
import { useWYSIWYGTracking } from "@/hooks/useWYSIWYGTracking";
import { EditLogsDialog } from "./EditLogsDialog";
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
  Clock,
  FileCheck
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
  const { logEdit, logBatchEdits } = useWYSIWYGTracking(siren);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState<Partial<CompanyFullData>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    economic: false,
    financial: false,
    compliance: false,
    certifications: false,
    procedures: false,
    fiscal: false,
    governance: false
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

  // Fonction de mapping intelligente pour harmoniser l'accès aux données
  const getSmartValue = (fieldPath: string): string => {
    switch (fieldPath) {
      // Informations de base
      case 'sirene.denomination':
        return formData.sirene?.denomination || '';
      case 'sirene.siren':
        return formData.sirene?.siren || '';
      case 'sirene.siret':
        return formData.sirene?.siret || '';
      case 'sirene.naf':
        return formData.sirene?.naf || '';
      case 'sirene.adresse':
        return formData.sirene?.adresse || '';
      case 'sirene.statut':
        return formData.sirene?.statut || '';
      case 'sirene.effectifs':
        return formData.sirene?.effectifs || '';
      case 'sirene.dateCreation':
        return formData.sirene?.dateCreation || '';
      
      // Champs virtuels extraits de l'adresse ou autres sources
      case 'sirene.ville':
        // Essayer d'extraire la ville de l'adresse Sirene ou utiliser Pappers
        return formData.pappers?.ville || '';
      case 'sirene.codePostal':
        // Essayer d'extraire le code postal de l'adresse Sirene ou utiliser Pappers
        return formData.pappers?.codePostal || '';
      case 'sirene.activitePrincipale':
        // Utiliser le libellé NAF de Pappers plutôt que le code NAF
        return formData.pappers?.libelleNaf || formData.sirene?.naf || '';
      
      // Contact (priorité enriched > pappers)
      case 'enriched.contactInfo.phone':
        return formData.enriched?.contactInfo?.phone || formData.pappers?.telephone || '';
      case 'enriched.contactInfo.email':
        return formData.enriched?.contactInfo?.email || formData.pappers?.email || '';
      case 'enriched.contactInfo.website':
        return formData.enriched?.contactInfo?.website || formData.pappers?.siteWeb || '';
      
      // Capital social (priorité pappers > infogreffe)
      case 'pappers.capitalSocial':
        return formData.pappers?.capitalSocial ? formData.pappers.capitalSocial.toString() : 
               formData.infogreffe?.capitalSocial ? formData.infogreffe.capitalSocial.toString() : '';
      
      // Dirigeants
      case 'pappers.dirigeants[0].nom':
        return formData.pappers?.dirigeants?.[0]?.nom || '';
      case 'pappers.dirigeants[0].prenom':
        return formData.pappers?.dirigeants?.[0]?.prenom || '';
      case 'pappers.dirigeants[0].fonction':
        return formData.pappers?.dirigeants?.[0]?.fonction || '';
      
      // Enriched data
      case 'enriched.legalInfo.preciseForm':
        return formData.enriched?.legalInfo?.preciseForm || formData.pappers?.formeJuridique || '';
      case 'enriched.legalInfo.socialCapital':
        return formData.enriched?.legalInfo?.socialCapital || '';
      case 'enriched.legalInfo.rcsNumber':
        return formData.enriched?.legalInfo?.rcsNumber || formData.infogreffe?.numeroRcs || '';
      case 'enriched.legalInfo.fiscalYearEnd':
        return formData.enriched?.legalInfo?.fiscalYearEnd || formData.infogreffe?.dateClotureExercice || '';
      
      case 'enriched.businessInfo.detailedActivity':
        return formData.enriched?.businessInfo?.detailedActivity || '';
      case 'enriched.businessInfo.secondaryActivities':
        return formData.enriched?.businessInfo?.secondaryActivities?.join(', ') || '';
      case 'enriched.businessInfo.collectiveAgreement':
        return formData.enriched?.businessInfo?.collectiveAgreement || '';
      case 'enriched.businessInfo.mainClients':
        return formData.enriched?.businessInfo?.mainClients || '';
      
      case 'enriched.financialIndicators.estimatedRevenue':
        return formData.enriched?.financialIndicators?.estimatedRevenue || '';
      case 'enriched.financialIndicators.profitabilityRange':
        return formData.enriched?.financialIndicators?.profitabilityRange || '';
      case 'enriched.financialIndicators.growthTrend':
        return formData.enriched?.financialIndicators?.growthTrend || '';
      case 'enriched.financialIndicators.riskFactors':
        return formData.enriched?.financialIndicators?.riskFactors?.join(', ') || '';
      
      // Scores admin
      case 'enriched.adminScores.economic':
        return formData.enriched?.adminScores?.economic || '';
      case 'enriched.adminScores.financial':
        return formData.enriched?.adminScores?.financial || '';
      case 'enriched.adminScores.legal':
        return formData.enriched?.adminScores?.legal || '';
      case 'enriched.adminScores.fiscal':
        return formData.enriched?.adminScores?.fiscal || '';
      case 'enriched.adminScores.global':
        return formData.enriched?.adminScores?.global || '';
      
      // Fallback vers la méthode originale pour les chemins non mappés
      default:
        const pathArray = fieldPath.split('.');
        return pathArray.reduce((current, key) => current?.[key], formData) || '';
    }
  };

  const updateField = useCallback((fieldPath: string, value: string) => {
    const oldValue = getSmartValue(fieldPath);
    
    setFormData(prevData => {
      const newData = { ...prevData };
      const pathArray = fieldPath.split('.');
      let current: any = newData;
      
      for (let i = 0; i < pathArray.length - 1; i++) {
        if (!current[pathArray[i]]) {
          current[pathArray[i]] = {};
        }
        current = current[pathArray[i]];
      }
      
      current[pathArray[pathArray.length - 1]] = value;
      return newData;
    });

    // Log the field change
    if (oldValue !== value) {
      logEdit(fieldPath, oldValue, value);
    }

    setHasChanges(true);
  }, [formData, logEdit, getSmartValue]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('admin_companies')
        .upsert({
          siren: siren,
          company_name: getSmartValue('sirene.denomination') || 'Nom inconnu',
          siret: getSmartValue('sirene.siret'),
          naf_code: getSmartValue('sirene.naf'),
          activity: getSmartValue('sirene.activitePrincipale'),
          address: getSmartValue('sirene.adresse'),
          city: getSmartValue('sirene.ville'),
          postal_code: getSmartValue('sirene.codePostal'),
          status: getSmartValue('sirene.statut') || 'active',
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
    updateField('enriched.adminScores.economic', newScores.economic.toString());
    updateField('enriched.adminScores.financial', newScores.financial.toString());
    updateField('enriched.adminScores.legal', newScores.legal.toString());
    updateField('enriched.adminScores.fiscal', newScores.fiscal.toString());
    updateField('enriched.adminScores.global', newScores.global.toString());
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

  // Only show critical errors if no data is available at all
  if (errors.length > 0 && (!companyData || !companyData.sirene)) {
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
    name: getSmartValue('sirene.denomination'),
    siren: getSmartValue('sirene.siren'),
    siret: getSmartValue('sirene.siret'),
    naf: getSmartValue('sirene.naf'),
    employees: getSmartValue('sirene.effectifs'),
    address: getSmartValue('sirene.adresse'),
    director: (() => {
      const d = formData.pappers?.dirigeants?.[0];
      return d ? [d.prenom, d.nom].filter(Boolean).join(' ') : '';
    })(),
    phone: getSmartValue('enriched.contactInfo.phone'),
    email: getSmartValue('enriched.contactInfo.email'),
    website: getSmartValue('enriched.contactInfo.website'),
    foundedYear: formData.sirene?.dateCreation ? new Date(formData.sirene.dateCreation).getFullYear().toString() : '',
    status: getSmartValue('sirene.statut'),
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
    economic: getSmartValue('enriched.adminScores.economic') 
      ? parseFloat(getSmartValue('enriched.adminScores.economic')) 
      : (formData.predictor?.scores?.global || 6.0),
    financial: getSmartValue('enriched.adminScores.financial') 
      ? parseFloat(getSmartValue('enriched.adminScores.financial')) 
      : (formData.predictor?.scores?.financier || 6.0),
    legal: getSmartValue('enriched.adminScores.legal') 
      ? parseFloat(getSmartValue('enriched.adminScores.legal')) 
      : (formData.predictor?.scores?.legal || 7.5),
    fiscal: getSmartValue('enriched.adminScores.fiscal') 
      ? parseFloat(getSmartValue('enriched.adminScores.fiscal')) 
      : (formData.predictor?.scores?.fiscal || 6.8),
    global: getSmartValue('enriched.adminScores.global') 
      ? parseFloat(getSmartValue('enriched.adminScores.global')) 
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
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Company Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {displayCompanyData.name?.charAt(0) || 'E'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {displayCompanyData.name || 'Nom de l\'entreprise'}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>SIREN: {displayCompanyData.siren}</span>
                    {displayCompanyData.siret && <span>SIRET: {displayCompanyData.siret}</span>}
                    <Badge variant="outline">
                      {displayCompanyData.status || 'Actif'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="study">Étude</TabsTrigger>
            <TabsTrigger value="predictive">Prédictif</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Informations générales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <EditableField
                  value={getSmartValue('sirene.denomination')}
                  placeholder="Nom de l'entreprise"
                  onSave={(value) => updateField('sirene.denomination', value)}
                  icon={<Building2 className="h-4 w-4" />}
                  label="Dénomination"
                />
                <EditableField
                  value={getSmartValue('sirene.siren')}
                  placeholder="SIREN"
                  onSave={(value) => updateField('sirene.siren', value)}
                  icon={<FileText className="h-4 w-4" />}
                  label="SIREN"
                />
                <EditableField
                  value={getSmartValue('sirene.siret')}
                  placeholder="SIRET"
                  onSave={(value) => updateField('sirene.siret', value)}
                  icon={<FileText className="h-4 w-4" />}
                  label="SIRET"
                />
                <EditableField
                  value={getSmartValue('sirene.naf')}
                  placeholder="Code NAF"
                  onSave={(value) => updateField('sirene.naf', value)}
                  icon={<BarChart3 className="h-4 w-4" />}
                  label="Code NAF"
                />
                <EditableField
                  value={getSmartValue('sirene.activitePrincipale')}
                  placeholder="Activité principale"
                  onSave={(value) => updateField('sirene.activitePrincipale', value)}
                  icon={<Activity className="h-4 w-4" />}
                  label="Activité principale"
                  multiline
                />
                <EditableField
                  value={getSmartValue('sirene.adresse')}
                  placeholder="Adresse"
                  onSave={(value) => updateField('sirene.adresse', value)}
                  icon={<MapPin className="h-4 w-4" />}
                  label="Adresse"
                  multiline
                />
              </CardContent>
            </Card>

            {/* Contact et informations complémentaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contact et informations complémentaires</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <EditableField
                  value={getSmartValue('enriched.contactInfo.phone')}
                  placeholder="Téléphone"
                  onSave={(value) => updateField('enriched.contactInfo.phone', value)}
                  icon={<Phone className="h-4 w-4" />}
                  label="Téléphone"
                  type="tel"
                  isAIGenerated={!!formData.enriched?.contactInfo?.phone}
                />
                <EditableField
                  value={getSmartValue('enriched.contactInfo.email')}
                  placeholder="Email"
                  onSave={(value) => updateField('enriched.contactInfo.email', value)}
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  type="email"
                  isAIGenerated={!!formData.enriched?.contactInfo?.email}
                />
                <EditableField
                  value={getSmartValue('enriched.contactInfo.website')}
                  placeholder="Site web"
                  onSave={(value) => updateField('enriched.contactInfo.website', value)}
                  icon={<Globe className="h-4 w-4" />}
                  label="Site web"
                  type="url"
                  isAIGenerated={!!formData.enriched?.contactInfo?.website}
                />
                <EditableField
                  value={getSmartValue('pappers.capitalSocial')}
                  placeholder="Capital social"
                  onSave={(value) => updateField('pappers.capitalSocial', value)}
                  icon={<Euro className="h-4 w-4" />}
                  label="Capital social"
                  badge="€"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="study" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Étude détaillée</CardTitle>
                <CardDescription>
                  Analyse approfondie de l'entreprise avec données enrichies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Section d'étude détaillée - à implémenter avec tous les champs d'analyse
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyse prédictive</CardTitle>
                <CardDescription>
                  Scores et prédictions basés sur l'IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Section d'analyse prédictive - à implémenter avec les scores et insights IA
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration des rapports</CardTitle>
                <CardDescription>
                  Paramètres et alertes pour les rapports automatiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Section de configuration des rapports - à implémenter
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export { CompanyWYSIWYGEditor };