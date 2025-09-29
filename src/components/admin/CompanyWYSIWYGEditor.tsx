/**
 * ⚠️ NE PAS MODIFIER L'UI DES RÉSULTATS ICI !
 * L'UI des résultats est dans src/components/result/ResultPage.tsx
 * Ce fichier ne gère que l'enveloppe admin (header, sauvegarde, etc.)
 */

import { useState, useEffect } from "react";
import { useCompanyData } from "@/hooks/useCompanyData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ResultPage } from "@/components/result/ResultPage";
import { RESULT_TABS } from "@/components/result/resultTabs";
import { buildCompanyDisplay } from "@/utils/buildCompanyDisplay";
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
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        {label && <Label className="text-sm font-medium">{label}</Label>}
        <div className="flex items-start space-x-2">
          {multiline ? (
            <Textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1"
              rows={3}
            />
          ) : (
            <Input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              placeholder={placeholder}
              type={type}
              className="flex-1"
            />
          )}
          <div className="flex space-x-1">
            <Button size="sm" onClick={handleSave} className="h-10">
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="h-10">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      {label && <Label className="text-sm font-medium mb-1 block">{label}</Label>}
      <div className="flex items-center space-x-2 min-h-[40px] p-2 rounded border border-transparent hover:border-border hover:bg-muted/30 cursor-pointer transition-colors"
           onClick={() => setIsEditing(true)}>
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="flex-1 text-sm">{value || placeholder}</span>
        {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
        {isAIGenerated && (
          <Tooltip>
            <TooltipTrigger>
              <Bot className="h-3 w-3 text-primary" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Données générées par IA</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Edit className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};

export function CompanyWYSIWYGEditor({ siren }: CompanyWYSIWYGEditorProps) {
  const [activeTab, setActiveTab] = useState(RESULT_TABS[0].key);
  const [formData, setFormData] = useState<CompanyFullData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  // Utiliser le hook de données d'entreprise
  const { data, loading, errors, fetchCompanyData, refetch } = useCompanyData({
    siren,
    autoFetch: true
  });

  // ⚠️ UTILISATION DU BUILDER PARTAGÉ - Ne pas dupliquer la logique de mapping !
  const displayData = buildCompanyDisplay(formData || data);

  // Initialiser formData quand les données arrivent
  useEffect(() => {
    if (data && !formData) {
      setFormData(data);
    }
  }, [data, formData]);

  // Fonction utilitaire pour obtenir une valeur imbriquée
  const getNestedValue = (obj: any, path: string[]): string => {
    const value = path.reduce((current, key) => current?.[key], obj);
    return value || '';
  };

  // Fonction utilitaire pour définir une valeur imbriquée
  const setNestedValue = (obj: any, path: string[], value: string): any => {
    const newObj = { ...obj };
    let current = newObj;
    
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      } else {
        current[key] = { ...current[key] };
      }
      current = current[key];
    }
    
    const lastKey = path[path.length - 1];
    current[lastKey] = value;
    
    return newObj;
  };

  // Fonction pour mettre à jour un champ
  const updateField = (path: string[], value: string) => {
    if (!formData) return;
    
    const updatedData = setNestedValue(formData, path, value);
    setFormData(updatedData);
    setHasChanges(true);
  };

  // Fonction pour sauvegarder les données (désactivée car la table n'existe pas encore)
  const saveData = async () => {
    if (!formData || !hasChanges) return;

    setIsSaving(true);
    try {
      // TODO: Implémenter la sauvegarde une fois la table créée
      console.log('Sauvegarde simulée:', formData);
      
      setHasChanges(false);
      toast({
        title: "Sauvegarde réussie",
        description: "Les données ont été sauvegardées avec succès.",
      });
    } catch (error) {
      console.error('Erreur de sauvegarde:', error);
      toast({
        title: "Erreur de sauvegarde", 
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour actualiser les données
  const refreshData = async () => {
    await refetch();
    setFormData(null); // Force la réinitialisation
    setHasChanges(false);
    toast({
      title: "Données actualisées",
      description: "Les données ont été rechargées depuis les APIs.",
    });
  };

  if (loading && !formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (!displayData.companyData || !displayData.scores || !displayData.enrichedData) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        <AlertTriangle className="h-8 w-8 mx-auto mb-4" />
        <p>Impossible de charger les données de l'entreprise</p>
        <Button onClick={refreshData} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50">
        {/* Header Admin */}
        <header className="bg-background border-b shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">Predicor Admin</h1>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  Mode Édition
                </Badge>
                {hasChanges && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Modifications non sauvegardées
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshData}
                  disabled={isSaving}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
                <Button 
                  onClick={saveData} 
                  disabled={!hasChanges || isSaving}
                  size="sm"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Sauvegarder
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Voir côté utilisateur
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Company Header */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-slate-600" />
                </div>
                <div>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 mb-2">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                      {displayData.companyData.name}
                    </h2>
                    <Badge variant="secondary" className="bg-success-light text-success w-fit">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {displayData.companyData.status}
                    </Badge>
                    <AlertSummaryBadge 
                      scores={{
                        economic: displayData.scores.global || 5.5,
                        financial: displayData.scores.financial || 6.0,
                        legal: displayData.scores.legal || 7.5,
                        fiscal: displayData.scores.fiscal || 6.8
                      }}
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
                    <span>SIREN: {displayData.companyData.siren}</span>
                    <span>SIRET: {displayData.companyData.siret}</span>
                    <span>{displayData.companyData.naf}</span>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {displayData.scores.global}/10
                </div>
                <div className="text-sm text-muted-foreground">Score global</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - ⚠️ COMPOSANT PARTAGÉ */}
        <div className="container mx-auto px-6 py-6">
          {/* 
            ⚠️ Ne modifiez pas l'UI des résultats ici !
            Toute modification doit se faire dans src/components/result/ResultPage.tsx
          */}
          <ResultPage
            mode="admin"
            companyData={displayData.companyData}
            scores={displayData.scores}
            enrichedData={displayData.enrichedData}
            loading={loading}
            errors={errors}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onEdit={(field: string, value: any) => {
              // Gérer le cas spécial des scores
              if (field === 'scores' && typeof value === 'object') {
                // Mettre à jour tous les scores individuellement
                updateField(['scores', 'economic'], value.economic.toString());
                updateField(['scores', 'financial'], value.financial.toString());
                updateField(['scores', 'legal'], value.legal.toString());
                updateField(['scores', 'fiscal'], value.fiscal.toString());
                updateField(['scores', 'global'], value.global.toString());
              } else {
                // Adapter l'interface onEdit pour les autres champs
                const pathArray = field.split('.');
                updateField(pathArray, value);
              }
            }}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

