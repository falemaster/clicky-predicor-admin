import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Edit3 } from "lucide-react";
import { CompanySearch } from "@/components/search/CompanySearch";
import { CompanyWYSIWYGEditor } from "./CompanyWYSIWYGEditor";

export function AdminEditor() {
  const { siren } = useParams<{ siren: string }>();
  const navigate = useNavigate();
  const [selectedSiren, setSelectedSiren] = useState<string | undefined>(siren);

  const handleCompanySelected = (companyId: string) => {
    setSelectedSiren(companyId);
    navigate(`/admin/editor/${companyId}`);
  };

  const handleBackToSearch = () => {
    setSelectedSiren(undefined);
    navigate("/admin/editor");
  };

  if (selectedSiren) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToSearch}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la recherche
            </Button>
            <div className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-muted-foreground" />
              <h1 className="text-2xl font-bold">Éditeur d'entreprise</h1>
              <Badge variant="secondary">SIREN: {selectedSiren}</Badge>
            </div>
          </div>
        </div>

        <CompanyWYSIWYGEditor siren={selectedSiren} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Éditeur d'entreprise</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rechercher une entreprise à éditer</CardTitle>
          <CardDescription>
            Recherchez une entreprise par son SIREN/SIRET ou par son nom pour commencer l'édition de ses données.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompanySearch onCompanySelected={handleCompanySelected} />
        </CardContent>
      </Card>
    </div>
  );
}