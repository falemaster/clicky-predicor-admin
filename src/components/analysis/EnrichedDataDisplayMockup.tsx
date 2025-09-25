/**
 * 🚨 COMPOSANT DE RÉFÉRENCE - NE PAS MODIFIER
 * 
 * Version maquette du composant d'affichage des données enrichies.
 * Sert de référence pour le design et ne doit pas être modifiée.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Phone, Mail, Globe, MapPin, Calendar, Users, Euro, FileText, AlertTriangle } from "lucide-react";

interface EnrichedDataDisplayMockupProps {
  companyData: any;
}

export const EnrichedDataDisplayMockup = ({ companyData }: EnrichedDataDisplayMockupProps) => {
  return (
    <div className="space-y-6">
      {/* Note explicative */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-blue-600 mt-1" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Données simulées de la maquette</p>
              <p>Cette section montre le design prévu pour l'affichage des données enrichies par les différentes APIs.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations de contact (simulées) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Coordonnées (Exemple)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>01 23 45 67 89</span>
            <Badge variant="outline" className="text-xs">Simulé</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>contact@entreprise-exemple.fr</span>
            <Badge variant="outline" className="text-xs">Simulé</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span>www.entreprise-exemple.fr</span>
            <Badge variant="outline" className="text-xs">Simulé</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Informations juridiques (simulées) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations Juridiques (Exemple)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium">Forme juridique:</span>
              <Badge variant="outline" className="ml-2">SAS</Badge>
              <Badge variant="outline" className="ml-1 text-xs">Simulé</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Capital: 50 000 €</span>
              <Badge variant="outline" className="text-xs">Simulé</Badge>
            </div>
            <div>
              <span className="text-sm font-medium">RCS:</span>
              <span className="ml-2 text-sm">Paris B 123 456 789</span>
              <Badge variant="outline" className="ml-1 text-xs">Simulé</Badge>
            </div>
            <div>
              <span className="text-sm font-medium">Greffe:</span>
              <span className="ml-2 text-sm">Paris</span>
              <Badge variant="outline" className="ml-1 text-xs">Simulé</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score de paiement (simulé) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Comportement de Paiement (Score Crédit/Finance)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">7/10</div>
              <div className="text-sm text-muted-foreground">Score Global</div>
              <Badge variant="outline" className="text-xs mt-1">Simulé</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">8/10</div>
              <div className="text-sm text-muted-foreground">Score Paiement</div>
              <Badge variant="outline" className="text-xs mt-1">Simulé</Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">15j</div>
              <div className="text-sm text-muted-foreground">Retards Moyens</div>
              <Badge variant="outline" className="text-xs mt-1">Simulé</Badge>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tendance:</span>
            <div className="flex items-center gap-2">
              <Badge variant="default">Amélioration</Badge>
              <Badge variant="outline" className="text-xs">Simulé</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Données financières (simulées) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Données Financières (Exemple Pappers)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">2 400 000 €</div>
              <div className="text-sm text-muted-foreground">Chiffre d'Affaires</div>
              <div className="text-xs text-muted-foreground">2023</div>
              <Badge variant="outline" className="text-xs mt-1">Simulé</Badge>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">180 000 €</div>
              <div className="text-sm text-muted-foreground">Résultat Net</div>
              <div className="text-xs text-muted-foreground">2023</div>
              <Badge variant="outline" className="text-xs mt-1">Simulé</Badge>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">850 000 €</div>
              <div className="text-sm text-muted-foreground">Fonds Propres</div>
              <div className="text-xs text-muted-foreground">2023</div>
              <Badge variant="outline" className="text-xs mt-1">Simulé</Badge>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">420 000 €</div>
              <div className="text-sm text-muted-foreground">Dettes</div>
              <div className="text-xs text-muted-foreground">2023</div>
              <Badge variant="outline" className="text-xs mt-1">Simulé</Badge>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">25 employés</span>
            <span className="text-sm text-muted-foreground">(2023)</span>
            <Badge variant="outline" className="text-xs">Simulé</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};