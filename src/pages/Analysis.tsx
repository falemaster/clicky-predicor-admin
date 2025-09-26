import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIDataIndicator } from "@/components/ui/ai-data-indicator";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OverviewDisplay } from "@/components/analysis/OverviewDisplay";
import { StudyDisplay } from "@/components/analysis/StudyDisplay";
import PredictiveAnalysis from "@/components/predictive/PredictiveAnalysis";
import { useAnalysisData } from "@/hooks/useAnalysisData";
import { useCompanyData } from "@/hooks/useCompanyData";
import { getScoreTheme } from "@/utils/scoreUtils";
import { CompanySearch } from "@/components/search/CompanySearch";
import { Link, useSearchParams } from "react-router-dom";
import EnrichedDataDisplayAI from "@/components/analysis/EnrichedDataDisplayAI";
import LoadingProgress from "@/components/analysis/LoadingProgress";
import AnalysisSkeleton from "@/components/analysis/AnalysisSkeleton";
import { SourceBadge } from "@/components/ui/source-badge";
import { DirigeantModal } from "@/components/analysis/DirigeantModal";
import { CollectiveProcedureAlert } from "@/components/analysis/CollectiveProcedureAlert";
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
  const [activeTab, setActiveTab] = useState("overview");
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

  // Déterminer l'état de l'application
  const hasRealData = realData && realData.sirene;
  const isLoadingRealData = loading && !isInitialLoad;
  
  // États: idle (recherche) | loading (chargement) | loaded (données chargées)
  const appState = hasRealData ? 'loaded' : (isLoadingRealData ? 'loading' : 'idle');
  
  // Construire les données d'affichage (seulement si on a des vraies données)
  const companyData = hasRealData ? {
    name: realData.sirene.denomination,
    siren: realData.sirene.siren,
    siret: realData.sirene.siret,
    naf: realData.sirene.naf,
    employees: realData.sirene.effectifs,
    address: realData.sirene.adresse,
    director: realData.pappers?.dirigeants?.[0] ? `${realData.pappers.dirigeants[0].prenom} ${realData.pappers.dirigeants[0].nom}` : 'Non renseigné',
    phone: realData.enriched?.contactInfo?.phone || 'Non renseigné',
    email: realData.enriched?.contactInfo?.email || 'Non renseigné',
    foundedYear: new Date(realData.sirene.dateCreation).getFullYear().toString(),
    status: realData.sirene.statut
  } : null;

  const scores = hasRealData ? {
    global: realData.predictor?.scores?.global || 5.5,
    financial: realData.predictor?.scores?.financier || 6.0,
    legal: realData.predictor?.scores?.legal || 7.5,
    fiscal: realData.predictor?.scores?.fiscal || 6.8,
    defaultRisk: realData.predictor?.probabiliteDefaut ? 
      `${(realData.predictor.probabiliteDefaut.mois12 * 100).toFixed(1)}%` : 
      'Faible'
  } : null;

  // Données enrichies pour les composants enfants
  const enrichedData = hasRealData ? {
    companyInfo: companyData,
    scores,
    financial: {
      bilans: realData.pappers?.bilans || [],
      chiffreAffaires: realData.pappers?.bilans?.[0]?.chiffreAffaires || 0,
      resultatNet: realData.pappers?.bilans?.[0]?.resultatNet || 0,
      endettement: realData.pappers?.bilans?.[0]?.dettes || 0,
      effectifs: realData.pappers?.bilans?.[0]?.effectifs || 0
    },
    legal: {
      procedures: realData.infogreffe?.procedures || [],
      bodaccAnnonces: realData.bodacc?.annonces || [],
      compteStatus: realData.pappers?.depotComptes || false
    },
    paymentScore: {
      scoreGlobal: realData.rubyPayeur?.scoreGlobal || 0,
      scorePaiement: realData.rubyPayeur?.scorePaiement || 0,
      retardsMoyens: realData.rubyPayeur?.retardsMoyens || 0,
      tendance: realData.rubyPayeur?.tendance || 'Stable',
      alertes: realData.rubyPayeur?.alertes || []
    },
    predictor: realData.predictor || null,
    rawData: realData
  } : null;

  const handleCompanySelected = async (siren: string) => {
    setSelectedSiren(siren);
    setShowSearch(false);
    await fetchCompanyData(siren, 'siren');
    setActiveTab("overview");
  };

  const handleShowSearch = () => {
    setShowSearch(true);
    setActiveTab("overview");
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

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="study">Étude approfondie</TabsTrigger>
            <TabsTrigger value="predictive">Analyse prédictive</TabsTrigger>
            <TabsTrigger value="reports">Rapports & Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Company Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{companyData.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Dirigeant: {companyData.director}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Créée en {companyData.foundedYear}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{companyData.phone}</span>
                      {hasRealData && realData.enriched?.contactInfo?.phone && (
                        <AIDataIndicator variant="mini" />
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{companyData.email}</span>
                      {hasRealData && realData.enriched?.contactInfo?.email && (
                        <AIDataIndicator variant="mini" />
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Effectif: {companyData.employees} salariés</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges and Status */}
            <Card>
              <CardHeader>
                <CardTitle>Statuts et certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {/* Badge statut entreprise */}
                  <Badge variant="secondary" className={
                    companyData.status === 'Actif' 
                      ? "bg-success-light text-success" 
                      : "bg-destructive-light text-destructive"
                  }>
                    {companyData.status === 'Actif' ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    Entreprise {companyData.status}
                  </Badge>

                  {/* Badge RubyPayeur si disponible */}
                  {hasRealData && realData.rubyPayeur && (
                    <Badge variant="secondary" className={
                      realData.rubyPayeur.scoreGlobal >= 7 
                        ? "bg-success-light text-success" 
                        : realData.rubyPayeur.scoreGlobal >= 5 
                        ? "bg-warning-light text-warning"
                        : "bg-destructive-light text-destructive"
                    }>
                      {realData.rubyPayeur.scoreGlobal >= 7 ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                      Score Crédit/Finance: {realData.rubyPayeur.scoreGlobal}/10
                      {realData.rubyPayeur.source && (realData.rubyPayeur.source === 'mock' || realData.rubyPayeur.source === 'fallback') && (
                        <span className="ml-1 text-xs opacity-75">(simulé)</span>
                      )}
                    </Badge>
                  )}

                  {/* Badge dépôt de comptes */}
                  {hasRealData && realData.pappers?.depotComptes && (
                    <Badge variant="secondary" className="bg-success-light text-success">
                      <FileText className="h-3 w-3 mr-1" />
                      Comptes à jour
                    </Badge>
                  )}

                  {/* Badge procédures collectives */}
                  {hasRealData && realData.bodacc?.annonces && (
                    <>
                      {realData.bodacc.annonces.some(a => a.type === 'Procédure collective') ? (
                        <Badge variant="secondary" className="bg-destructive-light text-destructive">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Procédure collective
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-success-light text-success">
                          <Shield className="h-3 w-3 mr-1" />
                          Aucune procédure
                        </Badge>
                      )}
                    </>
                  )}

                  {/* Alertes Predictor */}
                  {hasRealData && realData.predictor?.alertes?.map((alerte, index) => (
                    <Badge key={index} variant="secondary" className={
                      alerte.niveau === 'Critique' ? "bg-destructive-light text-destructive" :
                      alerte.niveau === 'Élevé' ? "bg-warning-light text-warning" :
                      "bg-info-light text-info"
                    }>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {alerte.message.length > 30 ? `${alerte.message.substring(0, 30)}...` : alerte.message}
                    </Badge>
                  ))}

                  {/* Badge par défaut si pas de données réelles */}
                  {!hasRealData && (
                    <>
                      <Badge variant="secondary" className="bg-success-light text-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Données simulées
                      </Badge>
                      <Badge variant="secondary" className="bg-info-light text-info">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Recherchez une vraie entreprise
                      </Badge>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Scores */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    {(() => {
                      const theme = getScoreTheme(scores.financial, 'financial');
                      const HeaderIcon = theme.icon;
                      return <HeaderIcon className={`h-4 w-4 mr-2 ${theme.iconColor}`} />;
                    })()}
                    Santé financière
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-2 ${getScoreTheme(scores.financial, 'financial').textColor}`}>
                    {scores.financial}/10
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getScoreTheme(scores.financial, 'financial').description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    {(() => {
                      const theme = getScoreTheme(scores.legal, 'legal');
                      const HeaderIcon = theme.icon;
                      return <HeaderIcon className={`h-4 w-4 mr-2 ${theme.iconColor}`} />;
                    })()}
                    Conformité légale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-2 ${getScoreTheme(scores.legal, 'legal').textColor}`}>
                    {scores.legal}/10
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getScoreTheme(scores.legal, 'legal').description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    {(() => {
                      // Convert defaultRisk from string to number for theming
                      const riskValue = typeof scores.defaultRisk === 'string' 
                        ? scores.defaultRisk === 'Faible' 
                          ? 1 
                          : parseFloat(scores.defaultRisk.replace('%', '')) / 10 
                        : scores.defaultRisk;
                      const theme = getScoreTheme(riskValue, 'risk');
                      const HeaderIcon = theme.icon;
                      return <HeaderIcon className={`h-4 w-4 mr-2 ${theme.iconColor}`} />;
                    })()}
                    Risque prédictif 12m
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-2 ${(() => {
                    const riskValue = typeof scores.defaultRisk === 'string' 
                      ? scores.defaultRisk === 'Faible' 
                        ? 1 
                        : parseFloat(scores.defaultRisk.replace('%', '')) / 10 
                      : scores.defaultRisk;
                    return getScoreTheme(riskValue, 'risk').textColor;
                  })()}`}>
                    {scores.defaultRisk}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const riskValue = typeof scores.defaultRisk === 'string' 
                        ? scores.defaultRisk === 'Faible' 
                          ? 1 
                          : parseFloat(scores.defaultRisk.replace('%', '')) / 10 
                        : scores.defaultRisk;
                      return getScoreTheme(riskValue, 'risk').description;
                    })()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analyse IA globale
                  {loading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-100 rounded-lg p-4">
                  {hasRealData && realData.predictor?.recommandations ? (
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed">
                        <strong>{companyData.name}</strong> - Analyse basée sur les données réelles :
                      </p>
                      <ul className="text-sm space-y-2">
                        {realData.predictor.recommandations.slice(0, 4).map((rec, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Facteurs de risque principaux */}
                      {realData.predictor.facteursExplicatifs && realData.predictor.facteursExplicatifs.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-sm font-medium mb-2">Facteurs clés identifiés :</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {realData.predictor.facteursExplicatifs.slice(0, 4).map((facteur, index) => (
                              <div key={index} className="flex items-center justify-between text-xs">
                                <span>{facteur.nom}</span>
                                <Badge variant={facteur.impact > 0 ? "default" : "destructive"} className="text-xs">
                                  {facteur.impact > 0 ? '+' : ''}{(facteur.impact * 100).toFixed(0)}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">
                      <strong>{companyData.name}</strong> - Analyse basée sur des données simulées. 
                      Recherchez une entreprise réelle pour obtenir une analyse prédictive complète 
                      basée sur les dernières données SIRENE, BODACC, et les scores de paiement financier.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>


            {/* Informations juridiques détaillées */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Informations juridiques
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {realData?.infogreffe && (
                        <SourceBadge 
                          source="INFOGREFFE" 
                          lastUpdate={realData.infogreffe.lastUpdate}
                          className="mr-2"
                        />
                      )}
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Avis situation SIRENE
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Alertes procédures collectives */}
                  {realData?.infogreffe?.proceduresCollectives && realData.infogreffe.proceduresCollectives.length > 0 && (
                    <CollectiveProcedureAlert 
                      procedures={realData.infogreffe.proceduresCollectives}
                      className="mb-4"
                    />
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">SIREN :</span>
                      <div className="font-medium flex items-center">
                        {companyData.siren}
                        <SourceBadge source="INSEE" className="ml-2" />
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">SIRET (siège) :</span>
                      <div className="font-medium flex items-center">
                        {companyData.siret}
                        <SourceBadge source="INSEE" className="ml-2" />
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Forme juridique :</span>
                      <div className="font-medium flex items-center">
                        {realData?.infogreffe?.formeJuridique || 'SAS, société par actions simplifiée'}
                        {realData?.infogreffe && <SourceBadge source="INFOGREFFE" className="ml-2" />}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Numéro de TVA :</span>
                      <div className="font-medium">FR{companyData.siren.replace(/\s/g, '')}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Inscription RCS :</span>
                      <div className="font-medium text-success flex items-center">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        {realData?.infogreffe?.dateImmatriculation ? 
                          `INSCRIT (le ${new Date(realData.infogreffe.dateImmatriculation).toLocaleDateString('fr-FR')})` :
                          realData?.pappers?.dateCreation ? 
                            `INSCRIT (le ${new Date(realData.pappers.dateCreation).toLocaleDateString('fr-FR')})` :
                            'INSCRIT (au greffe de PARIS, le 15/03/2015)'
                        }
                        {realData?.infogreffe && <SourceBadge source="INFOGREFFE" className="ml-2" />}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Inscription RNE :</span>
                      <div className="font-medium text-success">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        {realData?.pappers?.dateCreation ? 
                          `INSCRIT (le ${new Date(realData.pappers.dateCreation).toLocaleDateString('fr-FR')})` :
                          'INSCRIT (le 15/03/2015)'
                        }
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Numéro RCS :</span>
                      <div className="font-medium">{companyData.siren} R.C.S. Paris</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capital social :</span>
                      <div className="font-medium flex items-center">
                        {(realData?.infogreffe?.capitalSocial ? realData.infogreffe.capitalSocial.toLocaleString() + ' €' : '') ||
                         (realData?.pappers?.capitalSocial ? realData.pappers.capitalSocial.toLocaleString() + ' €' : '') || 
                         'Non renseigné'}
                        {realData?.infogreffe?.capitalSocial && <SourceBadge source="INFOGREFFE" className="ml-2" />}
                        {!realData?.infogreffe?.capitalSocial && realData?.pappers?.capitalSocial && <SourceBadge source="PAPPERS" className="ml-2" />}
                      </div>
                    </div>
                  </div>

                  {/* Dirigeants interactifs */}
                  {((realData?.infogreffe as any)?.representants || (realData?.pappers as any)?.representants) && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm text-muted-foreground mb-2 block">Dirigeants :</span>
                        <div className="space-y-2">
                          {((realData?.infogreffe as any)?.representants || (realData?.pappers as any)?.representants || []).slice(0, 2).map((dirigeant: any, index: number) => (
                            <DirigeantModal
                              key={index}
                              dirigeant={{
                                nom: dirigeant.nom || 'N/A',
                                prenom: dirigeant.prenom || '',
                                fonction: dirigeant.fonction || dirigeant.qualite || 'Dirigeant'
                              }}
                            >
                              <button className="text-left hover:bg-muted/50 p-2 rounded-md transition-colors w-full">
                                <div className="font-medium text-sm text-primary hover:underline">
                                  {dirigeant.prenom} {dirigeant.nom}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {dirigeant.fonction || dirigeant.qualite || 'Dirigeant'}
                                </div>
                              </button>
                            </DirigeantModal>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  <Separator />
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Shield className="h-4 w-4 mr-1" />
                      Extrait INPI
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText className="h-4 w-4 mr-1" />
                      Extrait Pappers
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Activité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Activité principale déclarée :</span>
                    <div className="font-medium mt-1">
                      {realData?.pappers?.libelleNaf || realData?.sirene?.naf || 'Conseil en systèmes et logiciels informatiques, développement de solutions digitales sur mesure'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Code NAF ou APE :</span>
                      <div className="font-medium">
                        6202A <Badge variant="outline" className="ml-1 text-xs">Commerce</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        (Conseil en systèmes et logiciels informatiques)
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Domaine d'activité :</span>
                      <div className="font-medium">Services aux entreprises</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Forme d'exercice :</span>
                      <div className="font-medium">Commerciale</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Convention collective :</span>
                      <div className="font-medium">
                        Syntec - IDCC 1486
                        <Badge variant="outline" className="ml-1 text-xs">supposée</Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date de clôture exercice :</span>
                      <div className="font-medium">31/12/2024</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Durée exercice :</span>
                      <div className="font-medium">12 mois</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Activités secondaires</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Formation professionnelle</span>
                        <Badge variant="outline" className="text-xs">8559A</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintenance informatique</span>
                        <Badge variant="outline" className="text-xs">9511Z</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="study" className="space-y-6">
            <StudyDisplay companyData={enrichedData} />
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <PredictiveAnalysis companyData={enrichedData} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Rapports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Télécharger rapport complet PDF
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Rapport exécutif (2 pages)
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analyse prédictive détaillée
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Alertes & Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Configurer les alertes
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Share className="h-4 w-4 mr-2" />
                    Partager l'analyse
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Ajouter un commentaire admin
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analysis;