import React, { useState } from 'react';
import { Search, Building2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useCompanyData } from '@/hooks/useCompanyData';
import type { ApiError } from '@/types/api';

interface CompanySearchProps {
  onCompanySelected?: (siren: string) => void;
  className?: string;
}

export const CompanySearch: React.FC<CompanySearchProps> = ({ 
  onCompanySelected,
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'siren' | 'siret'>('siren');
  const { data, loading, errors, fetchCompanyData } = useCompanyData();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    // Déterminer automatiquement le type basé sur la longueur
    const cleanTerm = searchTerm.replace(/\s/g, '');
    const type = cleanTerm.length === 14 ? 'siret' : 'siren';
    setSearchType(type);
    
    await fetchCompanyData(cleanTerm, type);
  };

  const handleCompanySelect = () => {
    if (data?.sirene?.siren && onCompanySelected) {
      onCompanySelected(data.sirene.siren);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Formulaire de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Recherche d'entreprise
          </CardTitle>
          <CardDescription>
            Recherchez une entreprise par SIREN (9 chiffres) ou SIRET (14 chiffres)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Ex: 123456789 ou 12345678900123"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              maxLength={14}
            />
            <Button type="submit" disabled={loading || !searchTerm.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {loading ? 'Recherche...' : 'Rechercher'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Affichage des erreurs */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error: ApiError, index: number) => (
            <Alert key={index} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{error.source}:</strong> {error.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Résultats de la recherche */}
      {data?.sirene && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-between justify-between">
              <span>{data.sirene.denomination}</span>
              <Badge variant={data.sirene.statut === 'Actif' ? 'default' : 'secondary'}>
                {data.sirene.statut}
              </Badge>
            </CardTitle>
            <CardDescription>
              SIREN: {data.sirene.siren} • SIRET: {data.sirene.siret}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Secteur d'activité:</strong>
                <p className="text-muted-foreground">{data.sirene.naf}</p>
              </div>
              <div>
                <strong>Effectifs:</strong>
                <p className="text-muted-foreground">{data.sirene.effectifs}</p>
              </div>
              <div className="md:col-span-2">
                <strong>Adresse:</strong>
                <p className="text-muted-foreground">{data.sirene.adresse}</p>
              </div>
              <div>
                <strong>Date de création:</strong>
                <p className="text-muted-foreground">
                  {new Date(data.sirene.dateCreation).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Informations additionnelles disponibles */}
            <div className="flex flex-wrap gap-2">
              {data.pappers && (
                <Badge variant="outline">Données Pappers ✓</Badge>
              )}
              {data.bodacc && (
                <Badge variant="outline">Données BODACC ✓</Badge>
              )}
              {data.rubyPayeur && (
                <Badge variant="outline">Score RubyPayeur ✓</Badge>
              )}
              {data.predictor && (
                <Badge variant="outline">Analyse Predictor ✓</Badge>
              )}
            </div>

            {/* Scores rapides si disponibles */}
            {data.predictor && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Aperçu des scores</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {data.predictor.scores.global.toFixed(1)}
                    </div>
                    <div className="text-muted-foreground">Global</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {data.predictor.scores.financier.toFixed(1)}
                    </div>
                    <div className="text-muted-foreground">Financier</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {data.predictor.scores.legal.toFixed(1)}
                    </div>
                    <div className="text-muted-foreground">Légal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {(data.predictor.probabiliteDefaut.mois12 * 100).toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground">Risque 12M</div>
                  </div>
                </div>
              </div>
            )}

            {onCompanySelected && (
              <Button onClick={handleCompanySelect} className="w-full">
                Analyser cette entreprise
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};