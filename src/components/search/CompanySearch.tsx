import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2, Loader2, AlertCircle, Hash, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompanyData } from '@/hooks/useCompanyData';
import { SireneApiService } from '@/services/sireneApi';
import type { ApiError, SireneCompanyData } from '@/types/api';

interface CompanySearchProps {
  onCompanySelected?: (siren: string) => void;
  className?: string;
}

export const CompanySearch: React.FC<CompanySearchProps> = ({ 
  onCompanySelected,
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'identifier' | 'name'>('identifier');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SireneCompanyData[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState<ApiError | null>(null);
  
  const { data, loading, errors, fetchCompanyData } = useCompanyData();
  const sireneService = SireneApiService.getInstance();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Recherche par identifiant (SIREN/SIRET)
  const handleIdentifierSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    const cleanTerm = searchTerm.replace(/\s/g, '');
    const type = cleanTerm.length === 14 ? 'siret' : 'siren';
    
    await fetchCompanyData(cleanTerm, type);
  };

  // Autocomplétion par nom
  const handleNameSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const { data: companies, error } = await sireneService.searchCompaniesByName(query, 8);
      
      if (error) {
        setSearchError(error);
        setSearchResults([]);
      } else {
        setSearchResults(companies || []);
        setShowDropdown(true);
      }
    } catch (error) {
      setSearchError({
        code: 'SEARCH_ERROR',
        message: 'Erreur lors de la recherche',
        source: 'SIRENE'
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search pour l'autocomplétion
  const handleNameInputChange = (value: string) => {
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleNameSearch(value);
    }, 300);
  };

  const handleCompanySelectFromDropdown = (company: SireneCompanyData) => {
    setSearchTerm(company.denomination);
    setShowDropdown(false);
    if (onCompanySelected) {
      onCompanySelected(company.siren);
    }
  };

  const handleDirectSelect = () => {
    if (data?.sirene?.siren && onCompanySelected) {
      onCompanySelected(data.sirene.siren);
    }
  };

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Nettoyer le timeout au démontage
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Recherche d'entreprise
          </CardTitle>
          <CardDescription>
            Recherchez une entreprise par identifiant ou par nom commercial
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <form onSubmit={handleIdentifierSearch} className="flex gap-2">
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
              <p className="text-xs text-muted-foreground mt-2">
                Saisissez un SIREN (9 chiffres) ou SIRET (14 chiffres)
              </p>
            </TabsContent>

            <TabsContent value="name">
              <div className="relative" ref={dropdownRef}>
                
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Ex: Microsoft France, Total Energies..."
                      value={searchTerm}
                      onChange={(e) => handleNameInputChange(e.target.value)}
                      className="w-full"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                
                {searchError && (
                  <div className="mt-2">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {searchError.message}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
                
                {/* Dropdown d'autocomplétion */}
                {showDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    <div className="py-2">
                      {searchResults.map((company, index) => (
                        <button
                          key={`${company.siren}-${index}`}
                          onClick={() => handleCompanySelectFromDropdown(company)}
                          className="w-full px-4 py-3 text-left hover:bg-muted transition-colors focus:bg-muted focus:outline-none"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {company.denomination}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                SIREN: {company.siren} • {company.naf}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {company.adresse}
                              </div>
                            </div>
                            <Badge 
                              variant={company.statut === 'Actif' ? 'default' : 'secondary'}
                              className="ml-2 text-xs flex-shrink-0"
                            >
                              {company.statut}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Message si pas de résultats */}
                {showDropdown && searchResults.length === 0 && searchTerm.length >= 2 && !isSearching && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg">
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                      Aucune entreprise trouvée pour "{searchTerm}"
                      <br />
                      <span className="text-xs">Essayez "Apple", "Microsoft", "Total", "L'Oreal", "Carrefour"</span>
                    </div>
                  </div>
                )}

              </div>
            </TabsContent>
          </Tabs>
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
                <Badge variant="outline">Score Crédit/Finance ✓</Badge>
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
              <Button onClick={handleDirectSelect} className="w-full">
                Analyser cette entreprise
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};