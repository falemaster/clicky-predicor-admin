import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building, DollarSign, Scale, TrendingUp, FileText, Save, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCompanyData } from "@/hooks/useCompanyData";
import { CompanyDataForm } from "./CompanyDataForm";
import { supabase } from "@/integrations/supabase/client";
import type { CompanyFullData } from "@/types/api";

interface CompanyWYSIWYGEditorProps {
  siren: string;
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

  const handleFormChange = (updatedData: CompanyFullData) => {
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
                <Building className="h-5 w-5" />
                {formData.sirene?.denomination || 'Entreprise inconnue'}
              </CardTitle>
              <CardDescription>
                SIREN: {siren} • Édition manuelle des données
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="warning" className="animate-pulse">
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
                className="bg-success hover:bg-success/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabbed editor interface */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Informations générales
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Données financières
          </TabsTrigger>
          <TabsTrigger value="legal" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Juridique
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Scores prédictifs
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes & Commentaires
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <CompanyDataForm
            section="general"
            data={formData}
            onChange={handleFormChange}
          />
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <CompanyDataForm
            section="financial"
            data={formData}
            onChange={handleFormChange}
          />
        </TabsContent>

        <TabsContent value="legal" className="space-y-4">
          <CompanyDataForm
            section="legal"
            data={formData}
            onChange={handleFormChange}
          />
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <CompanyDataForm
            section="predictive"
            data={formData}
            onChange={handleFormChange}
          />
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <CompanyDataForm
            section="notes"
            data={formData}
            onChange={handleFormChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}