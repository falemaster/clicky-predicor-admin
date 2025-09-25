import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building, MapPin, Phone, Mail, Users, Calendar, DollarSign, TrendingUp, FileText, AlertTriangle } from "lucide-react";
import type { CompanyFullData } from "@/types/api";

interface CompanyDataFormProps {
  section: "general" | "financial" | "legal" | "predictive" | "notes";
  data: CompanyFullData;
  onChange: (updatedData: CompanyFullData) => void;
}

export function CompanyDataForm({ section, data, onChange }: CompanyDataFormProps) {
  const [notes, setNotes] = useState("");

  const handleInputChange = (field: string, value: string) => {
    // Create a deep copy of the data and update the specific field
    const updatedData = { ...data };
    
    // Parse the field path (e.g., "sirene.denomination")
    const fieldParts = field.split('.');
    let current: any = updatedData;
    
    for (let i = 0; i < fieldParts.length - 1; i++) {
      if (!current[fieldParts[i]]) {
        current[fieldParts[i]] = {};
      }
      current = current[fieldParts[i]];
    }
    
    current[fieldParts[fieldParts.length - 1]] = value;
    onChange(updatedData);
  };

  const getFieldValue = (field: string): string => {
    const fieldParts = field.split('.');
    let current: any = data;
    
    for (const part of fieldParts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        return "";
      }
    }
    
    return current?.toString() || "";
  };

  if (section === "general") {
    return (
      <div className="space-y-6">
        {/* Basic Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Informations de base
            </CardTitle>
            <CardDescription>
              Données principales de l'entreprise issues du registre SIRENE
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="denomination">Dénomination sociale</Label>
                <Input
                  id="denomination"
                  value={getFieldValue("sirene.denomination")}
                  onChange={(e) => handleInputChange("sirene.denomination", e.target.value)}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateCreation">Date de création</Label>
                <Input
                  id="dateCreation"
                  value={getFieldValue("sirene.dateCreation")}
                  onChange={(e) => handleInputChange("sirene.dateCreation", e.target.value)}
                  placeholder="2020-01-01"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siren">SIREN</Label>
                <Input
                  id="siren"
                  value={getFieldValue("sirene.siren")}
                  onChange={(e) => handleInputChange("sirene.siren", e.target.value)}
                  placeholder="123456789"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siret">SIRET</Label>
                <Input
                  id="siret"
                  value={getFieldValue("sirene.siret")}
                  onChange={(e) => handleInputChange("sirene.siret", e.target.value)}
                  placeholder="12345678900001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nic">NIC</Label>
                <Input
                  id="nic"
                  value={getFieldValue("sirene.nic")}
                  onChange={(e) => handleInputChange("sirene.nic", e.target.value)}
                  placeholder="00001"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adresse
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse complète</Label>
                  <Input
                    id="address"
                    value={getFieldValue("sirene.adresse")}
                    onChange={(e) => handleInputChange("sirene.adresse", e.target.value)}
                    placeholder="123 Rue de l'Exemple, 75001 Paris"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="effectifs">Effectifs</Label>
                  <Input
                    id="effectifs"
                    value={getFieldValue("sirene.effectifs")}
                    onChange={(e) => handleInputChange("sirene.effectifs", e.target.value)}
                    placeholder="10-19 salariés"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nafCode">Code NAF</Label>
                  <Input
                    id="nafCode"
                    value={getFieldValue("sirene.naf")}
                    onChange={(e) => handleInputChange("sirene.naf", e.target.value)}
                    placeholder="6201Z"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Statut</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant={getFieldValue("sirene.statut") === "Actif" ? "success" : "destructive"}>
                      {getFieldValue("sirene.statut") || "Inconnu"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity and Legal Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Activité et statut juridique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dateCreationComplete">Date de création complète</Label>
              <Input
                id="dateCreationComplete"
                value={getFieldValue("sirene.dateCreation")}
                onChange={(e) => handleInputChange("sirene.dateCreation", e.target.value)}
                placeholder="2020-01-01"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (section === "financial") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Données financières
          </CardTitle>
          <CardDescription>
            Informations financières de l'entreprise (Pappers, bilans)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.pappers ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capitalSocial">Capital social</Label>
                  <Input
                    id="capitalSocial"
                    value={data.pappers.capitalSocial?.toString() || ""}
                    onChange={(e) => handleInputChange("pappers.capitalSocial", e.target.value)}
                    placeholder="100000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chiffreAffaires">Chiffre d'affaires (dernier bilan)</Label>
                  <Input
                    id="chiffreAffaires"
                    value={data.pappers.bilans?.[0]?.chiffreAffaires?.toString() || ""}
                    onChange={(e) => {
                      if (data.pappers.bilans?.[0]) {
                        handleInputChange("pappers.bilans.0.chiffreAffaires", e.target.value);
                      }
                    }}
                    placeholder="1000000"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="financialNotes">Notes financières</Label>
                <Textarea
                  id="financialNotes"
                  placeholder="Ajoutez des observations sur la situation financière..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune donnée financière disponible</p>
              <p className="text-sm">Les informations financières apparaîtront ici lorsqu'elles seront disponibles.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (section === "legal") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informations juridiques
          </CardTitle>
          <CardDescription>
            Données juridiques et procédures (Infogreffe, BODACC)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Section juridique en cours de développement</p>
            <p className="text-sm">Les informations juridiques seront bientôt disponibles.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (section === "predictive") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Scores prédictifs
          </CardTitle>
          <CardDescription>
            Scores de risque et analyses prédictives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.predictor ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scoreGlobal">Score global</Label>
                  <Input
                    id="scoreGlobal"
                    type="number"
                    min="0"
                    max="100"
                    value={data.predictor.scores?.global?.toString() || ""}
                    onChange={(e) => handleInputChange("predictor.scores.global", e.target.value)}
                    placeholder="75"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scoreFinancier">Score financier</Label>
                  <Input
                    id="scoreFinancier"
                    type="number"
                    min="0"
                    max="100"
                    value={data.predictor.scores?.financier?.toString() || ""}
                    onChange={(e) => handleInputChange("predictor.scores.financier", e.target.value)}
                    placeholder="80"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scoreJuridique">Score juridique</Label>
                  <Input
                    id="scoreJuridique"
                    type="number"
                    min="0"
                    max="100"
                    value={data.predictor.scores?.legal?.toString() || ""}
                    onChange={(e) => handleInputChange("predictor.scores.legal", e.target.value)}
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risque12Mois">Risque 12 mois (%)</Label>
                  <Input
                    id="risque12Mois"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={data.predictor.probabiliteDefaut?.mois12?.toString() || ""}
                    onChange={(e) => handleInputChange("predictor.probabiliteDefaut.mois12", e.target.value)}
                    placeholder="5.2"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun score prédictif disponible</p>
              <p className="text-sm">Les scores apparaîtront ici lorsqu'ils seront calculés.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (section === "notes") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notes et commentaires
          </CardTitle>
          <CardDescription>
            Ajoutez des notes administratives et commentaires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminNotes">Notes administratives</Label>
            <Textarea
              id="adminNotes"
              placeholder="Ajoutez vos observations, commentaires ou notes importantes sur cette entreprise..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
            />
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Traçabilité des modifications</h4>
                <p className="text-sm text-muted-foreground">
                  Toutes les modifications seront automatiquement horodatées et associées à votre compte utilisateur.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}