/**
 * 🚨 COMPOSANT DE RÉFÉRENCE - NE PAS MODIFIER
 * 
 * Version maquette du composant de recherche d'entreprise.
 * Sert de référence pour le design et ne doit pas être modifiée.
 */

import React, { useState } from 'react';
import { Search, Building2, AlertCircle, Hash, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CompanySearchMockupProps {
  onCompanySelected?: (siren: string) => void;
  className?: string;
}

export const CompanySearchMockup: React.FC<CompanySearchMockupProps> = ({ 
  onCompanySelected,
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'identifier' | 'name'>('identifier');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCompanySelected) {
      onCompanySelected('123456789'); // SIREN fictif
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Recherche d'entreprise (Maquette)
          </CardTitle>
          <CardDescription>
            Interface de recherche simulée - données fictives uniquement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Maquette de référence :</strong> Cette interface de recherche est simulée. 
              Pour tester avec de vraies données, utilisez la version fonctionnelle.
            </AlertDescription>
          </Alert>

          <Tabs value={searchType} onValueChange={(value) => setSearchType(value as 'identifier' | 'name')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="identifier" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                SIREN / SIRET
              </TabsTrigger>
              <TabsTrigger value="name" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Raison sociale
              </TabsTrigger>
            </TabsList>

            <TabsContent value="identifier">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ex: 123456789 ou 12345678900123 (simulé)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                  maxLength={14}
                />
                <Button type="submit" disabled={!searchTerm.trim()}>
                  <Search className="h-4 w-4" />
                  Rechercher (Simulé)
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Saisissez un SIREN (9 chiffres) ou SIRET (14 chiffres) - Mode maquette
              </p>
            </TabsContent>

            <TabsContent value="name">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ex: Microsoft France, Total Energies... (simulé)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSubmit} disabled={!searchTerm.trim()}>
                  <Search className="h-4 w-4" />
                  Rechercher (Simulé)
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Recherche par nom commercial - Mode maquette
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Résultat simulé */}
      {searchTerm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-between justify-between">
              <span>Entreprise Exemple SARL</span>
              <Badge variant="secondary">
                Actif (Simulé)
              </Badge>
            </CardTitle>
            <CardDescription>
              SIREN: 123456789 • SIRET: 12345678900123
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Résultat simulé pour démonstration du design
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Secteur d'activité:</strong>
                <p className="text-muted-foreground">62.01Z - Programmation informatique</p>
              </div>
              <div>
                <strong>Effectifs:</strong>
                <p className="text-muted-foreground">20 à 49 salariés</p>
              </div>
              <div className="md:col-span-2">
                <strong>Adresse:</strong>
                <p className="text-muted-foreground">123 RUE DE LA PAIX 75001 PARIS</p>
              </div>
              <div>
                <strong>Date de création:</strong>
                <p className="text-muted-foreground">15/06/2010</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Données SIRENE ✓ (Simulé)</Badge>
              <Badge variant="outline">Données Pappers ✓ (Simulé)</Badge>
              <Badge variant="outline">Score Crédit/Finance ✓ (Simulé)</Badge>
              <Badge variant="outline">Analyse IA ✓ (Simulé)</Badge>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Aperçu des scores (simulés)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">7.2</div>
                  <div className="text-muted-foreground">Global</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">6.8</div>
                  <div className="text-muted-foreground">Financier</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8.1</div>
                  <div className="text-muted-foreground">Légal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">2.3%</div>
                  <div className="text-muted-foreground">Risque 12M</div>
                </div>
              </div>
            </div>

            <Button onClick={() => onCompanySelected?.('123456789')} className="w-full">
              Analyser cette entreprise (Mode Maquette)
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};