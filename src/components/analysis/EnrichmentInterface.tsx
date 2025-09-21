import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Globe, Search, Loader2, CheckCircle, AlertCircle, Users } from "lucide-react";

interface EnrichmentInterfaceProps {
  companyData: any;
  onDataEnriched: (enrichedData: any) => void;
}

export const EnrichmentInterface = ({ companyData, onDataEnriched }: EnrichmentInterfaceProps) => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isEnrichingWebsite, setIsEnrichingWebsite] = useState(false);
  const [isEnrichingOutscrapper, setIsEnrichingOutscrapper] = useState(false);
  const [isEnrichingApollo, setIsEnrichingApollo] = useState(false);
  const [enrichmentResults, setEnrichmentResults] = useState<any>(null);
  const { toast } = useToast();

  const handleWebsiteEnrichment = async () => {
    if (!websiteUrl.trim()) {
      toast({
        title: "URL requise",
        description: "Veuillez saisir l'URL du site web de l'entreprise",
        variant: "destructive",
      });
      return;
    }

    setIsEnrichingWebsite(true);
    try {
      const { data, error } = await supabase.functions.invoke('web-scraper', {
        body: { websiteUrl }
      });

      if (error) throw error;

      if (data.success) {
        const enrichedData = { ...companyData };
        if (!enrichedData.pappers) enrichedData.pappers = {};
        
        // Merge website data
        Object.assign(enrichedData.pappers, data.data);
        enrichedData.enrichmentSource = 'website';
        
        setEnrichmentResults(data.data);
        onDataEnriched(enrichedData);
        
        toast({
          title: "Enrichissement réussi",
          description: "Données extraites du site web avec succès",
        });
      } else {
        throw new Error(data.error || "Erreur lors de l'extraction");
      }
    } catch (error) {
      console.error('Website enrichment error:', error);
      toast({
        title: "Erreur d'enrichissement",
        description: "Impossible d'extraire les données du site web",
        variant: "destructive",
      });
    } finally {
      setIsEnrichingWebsite(false);
    }
  };

  const handleOutscrapperEnrichment = async () => {
    setIsEnrichingOutscrapper(true);
    try {
      const { data, error } = await supabase.functions.invoke('outscrapper-search', {
        body: {
          companyName: companyData.sirene?.denomination || companyData.sirene?.nom,
          address: companyData.sirene?.adresse,
          city: companyData.sirene?.ville
        }
      });

      if (error) throw error;

      if (data.success) {
        const enrichedData = { ...companyData };
        if (!enrichedData.pappers) enrichedData.pappers = {};
        
        // Merge Outscrapper data
        Object.assign(enrichedData.pappers, data.data);
        enrichedData.enrichmentSource = 'outscrapper';
        
        setEnrichmentResults(data.data);
        onDataEnriched(enrichedData);
        
        toast({
          title: "Enrichissement réussi",
          description: "Données trouvées via Outscrapper",
        });
      } else {
        throw new Error(data.error || "Aucune donnée trouvée");
      }
    } catch (error) {
      console.error('Outscrapper enrichment error:', error);
      toast({
        title: "Erreur d'enrichissement",
        description: "Impossible de trouver des données via Outscrapper",
        variant: "destructive",
      });
    } finally {
      setIsEnrichingOutscrapper(false);
    }
  };

  const handleApolloEnrichment = async () => {
    setIsEnrichingApollo(true);
    try {
      const { data, error } = await supabase.functions.invoke('apollo-search', {
        body: {
          companyName: companyData.sirene?.denomination || companyData.sirene?.nom,
          domain: websiteUrl || companyData.pappers?.siteWeb,
          address: companyData.sirene?.adresse
        }
      });

      if (error) throw error;

      if (data.success) {
        const enrichedData = { ...companyData };
        if (!enrichedData.pappers) enrichedData.pappers = {};
        
        // Merge Apollo data
        const apolloData = data.data;
        Object.assign(enrichedData.pappers, {
          telephone: apolloData.contacts?.[0]?.phone || enrichedData.pappers?.telephone,
          email: apolloData.contacts?.[0]?.email || enrichedData.pappers?.email,
          siteWeb: apolloData.companyInfo?.website || enrichedData.pappers?.siteWeb,
          contacts: apolloData.contacts,
          socialMedia: apolloData.socialMedia,
          industry: apolloData.companyInfo?.industry,
          description: apolloData.companyInfo?.description
        });
        enrichedData.enrichmentSource = 'apollo';
        
        setEnrichmentResults({
          telephone: apolloData.contacts?.[0]?.phone,
          email: apolloData.contacts?.[0]?.email,
          siteWeb: apolloData.companyInfo?.website,
          contactsCount: apolloData.contacts?.length || 0,
          confidence: '85'
        });
        onDataEnriched(enrichedData);
        
        toast({
          title: "Enrichissement réussi",
          description: `${apolloData.contacts?.length || 0} contacts trouvés via Apollo.io`,
        });
      } else {
        throw new Error(data.error || "Aucune donnée trouvée");
      }
    } catch (error) {
      console.error('Apollo enrichment error:', error);
      toast({
        title: "Erreur d'enrichissement",
        description: "Impossible de trouver des données via Apollo.io",
        variant: "destructive",
      });
    } finally {
      setIsEnrichingApollo(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-muted">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-muted-foreground">
          <Search className="h-5 w-5" />
          Enrichissement des données manquantes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Website enrichment */}
        <div className="space-y-3">
          <Label htmlFor="website">Site web de l'entreprise</Label>
          <div className="flex gap-2">
            <Input
              id="website"
              type="url"
              placeholder="https://www.exemple.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              disabled={isEnrichingWebsite}
            />
            <Button 
              onClick={handleWebsiteEnrichment}
              disabled={isEnrichingWebsite || !websiteUrl.trim()}
              variant="outline"
              size="sm"
            >
              {isEnrichingWebsite ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Globe className="h-4 w-4" />
              )}
              Extraire
            </Button>
          </div>
        </div>

        <div className="flex items-center">
          <Separator className="flex-1" />
          <span className="px-3 text-sm text-muted-foreground">ou</span>
          <Separator className="flex-1" />
        </div>

        {/* Enrichment buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            onClick={handleOutscrapperEnrichment}
            disabled={isEnrichingOutscrapper}
            variant="outline"
            className="w-full"
          >
            {isEnrichingOutscrapper ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Enrichir avec Outscrapper
          </Button>
          
          <Button 
            onClick={handleApolloEnrichment}
            disabled={isEnrichingApollo}
            variant="secondary"
            className="w-full"
          >
            {isEnrichingApollo ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Users className="h-4 w-4 mr-2" />
            )}
            Enrichir avec Apollo.io
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Recherche automatique basée sur le nom et l'adresse de l'entreprise
        </p>

        {/* Results preview */}
        {enrichmentResults && (
          <div className="mt-6 p-4 bg-success/5 rounded-lg border border-success/20">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">Données trouvées</span>
            </div>
            <div className="space-y-2 text-sm">
              {enrichmentResults.telephone && (
                <div>Téléphone: {enrichmentResults.telephone}</div>
              )}
              {enrichmentResults.email && (
                <div>Email: {enrichmentResults.email}</div>
              )}
              {enrichmentResults.siteWeb && (
                <div>Site web: {enrichmentResults.siteWeb}</div>
              )}
              {enrichmentResults.contactsCount !== undefined && (
                <div>Contacts trouvés: {enrichmentResults.contactsCount}</div>
              )}
              {enrichmentResults.confidence && (
                <Badge variant="outline" className="mt-2">
                  Confiance: {enrichmentResults.confidence}%
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};