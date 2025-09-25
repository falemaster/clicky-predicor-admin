import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Calendar, 
  Users, 
  Euro, 
  FileText, 
  AlertTriangle, 
  Save, 
  RefreshCw, 
  AlertCircle,
  Edit3,
  Check,
  X 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCompanyData } from "@/hooks/useCompanyData";
import { supabase } from "@/integrations/supabase/client";
import type { CompanyFullData } from "@/types/api";

interface CompanyWYSIWYGEditorProps {
  siren: string;
}

interface EditableFieldProps {
  value: string | undefined;
  placeholder: string;
  onSave: (value: string) => void;
  multiline?: boolean;
  icon?: React.ReactNode;
  badge?: string;
  type?: 'text' | 'email' | 'tel' | 'url';
}

function EditableField({ 
  value, 
  placeholder, 
  onSave, 
  multiline = false, 
  icon, 
  badge, 
  type = 'text' 
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || '');

  const hasValue = value && value.trim() !== '';

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        {icon}
        {multiline ? (
          <Textarea 
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1"
            rows={3}
          />
        ) : (
          <Input 
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1"
            placeholder={placeholder}
          />
        )}
        <Button size="sm" onClick={handleSave}>
          <Check className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center gap-2 group cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors ${
        !hasValue ? 'opacity-50' : ''
      }`}
      onClick={() => setIsEditing(true)}
    >
      {icon}
      <span className={`flex-1 ${!hasValue ? 'text-muted-foreground bg-muted px-2 py-1 rounded blur-sm' : ''}`}>
        {hasValue ? value : placeholder}
      </span>
      {badge && (
        <Badge variant={hasValue ? "success" : "secondary"} className="text-xs">
          {hasValue ? badge : "Non disponible"}
        </Badge>
      )}
      <Edit3 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

export function CompanyWYSIWYGEditor({ siren }: CompanyWYSIWYGEditorProps) {
  const { toast } = useToast();
  const { data, loading, refetch } = useCompanyData({ siren, autoFetch: true });
  const [formData, setFormData] = useState<CompanyFullData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const updateField = (field: string, value: string) => {
    if (!formData) return;
    
    // Handle nested field updates
    const fieldParts = field.split('.');
    const updatedData = { ...formData };
    
    if (fieldParts.length === 2) {
      if (!updatedData[fieldParts[0] as keyof CompanyFullData]) {
        (updatedData as any)[fieldParts[0]] = {};
      }
      (updatedData as any)[fieldParts[0]][fieldParts[1]] = value;
    } else {
      (updatedData as any)[field] = value;
    }
    
    setFormData(updatedData);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!formData || !formData.sirene) return;

    setIsSaving(true);
    try {
      // Check if company exists in admin_companies
      const { data: existingCompany } = await supabase
        .from('admin_companies')
        .select('id')
        .eq('siren', siren)
        .maybeSingle();

      const companyUpdateData = {
        siren: formData.sirene.siren,
        siret: formData.sirene.siret || null,
        company_name: formData.sirene.denomination || '',
        naf_code: formData.sirene.naf || null,
        activity: formData.sirene.naf || null,
        address: formData.sirene.adresse || null,
        city: formData.sirene.adresse || null,
        postal_code: null, // Not available in SireneCompanyData
        status: formData.sirene.statut === 'Actif' ? 'active' : 'inactive',
        is_manually_edited: true,
        edited_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (existingCompany) {
        // Update existing company
        const { error } = await supabase
          .from('admin_companies')
          .update(companyUpdateData)
          .eq('id', existingCompany.id);

        if (error) throw error;
      } else {
        // Insert new company
        const { error } = await supabase
          .from('admin_companies')
          .insert([companyUpdateData]);

        if (error) throw error;
      }

      setHasChanges(false);
      toast({
        title: "Données sauvegardées",
        description: "Les informations de l'entreprise ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error('Error saving company data:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde des données.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = () => {
    refetch();
    setHasChanges(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Chargement des données...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!formData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Impossible de charger les données de l'entreprise. Vérifiez le SIREN et réessayez.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with save controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {formData.sirene?.denomination || 'Entreprise inconnue'}
              </CardTitle>
              <CardDescription>
                SIREN: {siren} • Édition WYSIWYG des données
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="outline" className="animate-pulse border-warning text-warning">
                  Modifications non sauvegardées
                </Badge>
              )}
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
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Coordonnées enrichies - Identique au front */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Coordonnées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <EditableField
            value={formData.pappers?.telephone}
            placeholder="+33 X XX XX XX XX"
            onSave={(value) => updateField('pappers.telephone', value)}
            icon={<Phone className="h-4 w-4 text-muted-foreground" />}
            badge="Pappers"
            type="tel"
          />
          <EditableField
            value={formData.pappers?.email}
            placeholder="contact@entreprise.com"
            onSave={(value) => updateField('pappers.email', value)}
            icon={<Mail className="h-4 w-4 text-muted-foreground" />}
            badge="Pappers"
            type="email"
          />
          <EditableField
            value={formData.pappers?.siteWeb}
            placeholder="www.entreprise.com"
            onSave={(value) => updateField('pappers.siteWeb', value)}
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
            badge="Pappers"
            type="url"
          />
        </CardContent>
      </Card>

      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <EditableField
                value={formData.sirene?.adresse}
                placeholder="Adresse de l'entreprise"
                onSave={(value) => updateField('sirene.adresse', value)}
                icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                badge="SIRENE"
                multiline
              />
              <EditableField
                value={formData.sirene?.dateCreation ? new Date(formData.sirene.dateCreation).getFullYear().toString() : undefined}
                placeholder="Année de création"
                onSave={(value) => updateField('sirene.dateCreation', `${value}-01-01`)}
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                badge="SIRENE"
              />
            </div>
            <div className="space-y-4">
              <EditableField
                value={formData.sirene?.effectifs?.toString()}
                placeholder="Nombre d'employés"
                onSave={(value) => updateField('sirene.effectifs', value)}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
                badge="SIRENE"
              />
              <EditableField
                value={formData.sirene?.naf}
                placeholder="Code NAF"
                onSave={(value) => updateField('sirene.naf', value)}
                icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                badge="SIRENE"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations juridiques enrichies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations Juridiques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <EditableField
              value={formData.infogreffe?.formeJuridique}
              placeholder="Forme juridique"
              onSave={(value) => updateField('infogreffe.formeJuridique', value)}
              badge="Infogreffe"
            />
            <EditableField
              value={formData.infogreffe?.capitalSocial?.toString()}
              placeholder="Capital social (€)"
              onSave={(value) => updateField('infogreffe.capitalSocial', value)}
              icon={<Euro className="h-4 w-4 text-muted-foreground" />}
              badge="Infogreffe"
            />
            <EditableField
              value={formData.infogreffe?.numeroRcs}
              placeholder="Numéro RCS"
              onSave={(value) => updateField('infogreffe.numeroRcs', value)}
              badge="Infogreffe"
            />
            <EditableField
              value={formData.infogreffe?.greffe}
              placeholder="Greffe"
              onSave={(value) => updateField('infogreffe.greffe', value)}
              badge="Infogreffe"
            />
          </div>
        </CardContent>
      </Card>

      {/* Score de paiement enrichi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Comportement de Paiement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <EditableField
                value={formData.rubyPayeur?.scoreGlobal?.toString()}
                placeholder="Score Global (/10)"
                onSave={(value) => updateField('rubyPayeur.scoreGlobal', value)}
              />
              <div className="text-sm text-muted-foreground mt-1">Score Global</div>
            </div>
            <div className="text-center">
              <EditableField
                value={formData.rubyPayeur?.scorePaiement?.toString()}
                placeholder="Score Paiement (/10)"
                onSave={(value) => updateField('rubyPayeur.scorePaiement', value)}
              />
              <div className="text-sm text-muted-foreground mt-1">Score Paiement</div>
            </div>
            <div className="text-center">
              <EditableField
                value={formData.rubyPayeur?.retardsMoyens?.toString()}
                placeholder="Retards moyens (j)"
                onSave={(value) => updateField('rubyPayeur.retardsMoyens', value)}
              />
              <div className="text-sm text-muted-foreground mt-1">Retards Moyens</div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tendance:</span>
            <EditableField
              value={formData.rubyPayeur?.tendance}
              placeholder="Tendance"
              onSave={(value) => updateField('rubyPayeur.tendance', value)}
              badge="RubyPayeur"
            />
          </div>
        </CardContent>
      </Card>

      {/* Données financières enrichies */}
      {formData.pappers?.bilans && formData.pappers.bilans.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              Données Financières Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <EditableField
                  value={formData.pappers.bilans[0]?.chiffreAffaires?.toString()}
                  placeholder="Chiffre d'affaires (€)"
                  onSave={(value) => updateField('pappers.bilans.0.chiffreAffaires', value)}
                />
                <div className="text-sm text-muted-foreground">Chiffre d'Affaires</div>
              </div>
              <div className="text-center">
                <EditableField
                  value={formData.pappers.bilans[0]?.resultatNet?.toString()}
                  placeholder="Résultat net (€)"
                  onSave={(value) => updateField('pappers.bilans.0.resultatNet', value)}
                />
                <div className="text-sm text-muted-foreground">Résultat Net</div>
              </div>
              <div className="text-center">
                <EditableField
                  value={formData.pappers.bilans[0]?.fondsPropresBruts?.toString()}
                  placeholder="Fonds propres (€)"
                  onSave={(value) => updateField('pappers.bilans.0.fondsPropresBruts', value)}
                />
                <div className="text-sm text-muted-foreground">Fonds Propres</div>
              </div>
              <div className="text-center">
                <EditableField
                  value={formData.pappers.bilans[0]?.dettes?.toString()}
                  placeholder="Dettes (€)"
                  onSave={(value) => updateField('pappers.bilans.0.dettes', value)}
                />
                <div className="text-sm text-muted-foreground">Dettes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              Données Financières
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucune donnée financière disponible</p>
              <p className="text-sm">Cliquez pour ajouter des informations financières</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes administratives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notes Administratives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EditableField
            value={(formData as any).adminNotes || ''}
            placeholder="Ajouter des notes administratives sur cette entreprise..."
            onSave={(value) => updateField('adminNotes', value)}
            multiline
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Toutes les modifications sont tracées avec l'horodatage et l'utilisateur.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}