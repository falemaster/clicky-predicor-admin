/**
 * ⚠️ NE PAS MODIFIER L'UI DES RÉSULTATS ICI !
 * L'UI des résultats est dans src/components/result/ResultPage.tsx
 * Ce fichier ne gère que la recherche et l'enveloppe utilisateur
 */

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AIDataIndicator } from "@/components/ui/ai-data-indicator";
import { Button } from "@/components/ui/button";
import { ResultPage } from "@/components/result/ResultPage";
import { RESULT_TABS } from "@/components/result/resultTabs";
import { buildCompanyDisplay } from "@/utils/buildCompanyDisplay";
import { FallbackScoreBadge } from "@/components/analysis/FallbackScoreBadge";
import { useAnalysisData } from "@/hooks/useAnalysisData";
import { useCompanyData } from "@/hooks/useCompanyData";
import { getScoreTheme } from "@/utils/scoreUtils";
import { CompanySearch } from "@/components/search/CompanySearch";
import { Link, useSearchParams } from "react-router-dom";
import LoadingProgress from "@/components/analysis/LoadingProgress";
import AnalysisSkeleton from "@/components/analysis/AnalysisSkeleton";
import { AlertSummaryBadge } from "@/components/admin/AlertSummaryBadge";
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
  Info
} from "lucide-react";

const Analysis = () => {
  const [activeTab, setActiveTab] = useState(RESULT_TABS[0].key);
  const [selectedSiren, setSelectedSiren] = useState<string>("");
  const [showSearch, setShowSearch] = useState(true);
  const [searchParams] = useSearchParams();
  
  // Hook pour les données mockées (fallback)
  const { data: mockData } = useAnalysisData();
  
  // Hook pour les vraies données API
  const { data: realData, loading, errors, fetchCompanyData, isInitialLoad, updateData } = useCompanyData();

  // Effet pour gérer l'auto-chargement depuis l'URL
  useEffect(() => {
    const sirenFromUrl = searchParams.get('siren');
    if (sirenFromUrl && !realData && !loading) {
      setSelectedSiren(sirenFromUrl);
      setShowSearch(false);
      fetchCompanyData(sirenFromUrl, 'siren');
    }
  }, [searchParams, realData, loading, fetchCompanyData]);

  // ⚠️ UTILISATION DU BUILDER PARTAGÉ - Ne pas dupliquer la logique de mapping !
  const { companyData, scores, enrichedData, hasRealData } = buildCompanyDisplay(realData);
  
  // Déterminer l'état de l'application
  const isLoadingRealData = loading && !isInitialLoad;
  
  // États: idle (recherche) | loading (chargement) | loaded (données chargées)
  const appState = hasRealData ? 'loaded' : (isLoadingRealData ? 'loading' : 'idle');

  const handleCompanySelected = async (siren: string) => {
    setSelectedSiren(siren);
    setShowSearch(false);
    await fetchCompanyData(siren, 'siren');
    setActiveTab(RESULT_TABS[0].key);
  };

  const handleShowSearch = () => {
    setShowSearch(true);
    setActiveTab(RESULT_TABS[0].key);
  };

  // États de l'application
  // État 1: Interface de recherche (idle)
  if (appState === 'idle' && showSearch) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-background border-b shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <h1 className="text-xl font-semibold text-foreground">Predicor</h1>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  APIs Intégrées
                </Badge>
              </div>
              <div className="flex items-center space-x-3">
                <Link to="/admin-analysis">
                  <Badge variant="outline" className="text-success border-success hover:bg-success/10 cursor-pointer transition-colors">Admin</Badge>
                </Link>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">J. Martin</span>
                  <span className="sm:hidden">JM</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Search Interface */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Analyse prédictive d'entreprise
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Recherchez une entreprise pour obtenir une analyse complète de ses risques et opportunités
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                  <RotateCw className="h-3 w-3" />
                  INSEE/SIRENE
                </Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 flex items-center gap-1">
                  <BarChart3 className="h-3 w-3" />
                  Pappers
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  Crédit/Finance
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
                  <Scale className="h-3 w-3" />
                  Infogreffe
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
                  <Bot className="h-3 w-3" />
                  IA GPT-5
                </Badge>
              </div>
            </div>
            
            <CompanySearch onCompanySelected={handleCompanySelected} />

            {errors.length > 0 && (
              <div className="mt-6 space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
                    <p className="text-sm text-destructive">
                      <strong>{error.source}:</strong> {error.message}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Indicateur de disponibilité des APIs */}
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold text-green-800">Système fonctionnel</h3>
              </div>
              <p className="text-sm text-green-700">
                Toutes les APIs sont intégrées et fonctionnelles. Recherchez une vraie entreprise française pour voir l'analyse complète.
              </p>
              <div className="flex items-start gap-2 mt-2">
                <Info className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-green-600">
                  Suggéré: Recherchez "Microsoft", "L'Oreal" ou "Total" pour des exemples complets
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État 2: Chargement des données (loading)
  if (appState === 'loading') {
    return (
      <LoadingProgress 
        companyName={selectedSiren ? `Entreprise ${selectedSiren}` : undefined}
        siren={selectedSiren}
      />
    );
  }

  // État 3: Données chargées mais pas encore prêtes pour affichage complet
  if (appState === 'loaded' && (!companyData || !scores)) {
    return <AnalysisSkeleton />;
  }

  // État 4: Affichage complet des données (loaded)
  if (appState !== 'loaded' || !companyData || !scores) {
    return <AnalysisSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Predicor</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Données Réelles
              </Badge>
              {loading && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyse en cours...</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleShowSearch}>
                <Search className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nouvelle recherche</span>
                <span className="sm:hidden">Recherche</span>
              </Button>
              {/* User authentication will be implemented here */}
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
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">{companyData.name}</h2>
                  <Badge variant="secondary" className="bg-success-light text-success w-fit">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {companyData.status}
                  </Badge>
                  {scores && (
                    <AlertSummaryBadge 
                      scores={{
                        economic: scores.global || 5.5,
                        financial: scores.financial || 6.0,
                        legal: scores.legal || 7.5,
                        fiscal: scores.fiscal || 6.8
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
                  <span>SIREN: {companyData.siren}</span>
                  <span>SIRET: {companyData.siret}</span>
                  <span>{companyData.naf}</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{scores.global}/10</div>
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
          mode="user"
          companyData={companyData}
          scores={scores}
          enrichedData={enrichedData}
          loading={loading}
          errors={errors}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default Analysis;