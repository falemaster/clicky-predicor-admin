import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Save, Eye, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

interface CompanyAnalysisData {
  companyInfo: {
    name: string;
    siren: string;
    siret: string;
    naf: string;
    employees: string;
    address: string;
    director: string;
    phone: string;
    email: string;
    foundedYear: string;
    status: string;
  };
  scores: {
    global: number;
    financial: number;
    legal: number;
    fiscal: number;
    defaultRisk: string;
  };
  sector: string;
  riskProfile: string;
}

const AdminAnalysis = () => {
  const [data, setData] = useState<CompanyAnalysisData>({
    companyInfo: {
      name: 'TECH SOLUTIONS FRANCE',
      siren: '123 456 789',
      siret: '123 456 789 00012',
      naf: '6202A - Conseil en systèmes et logiciels informatiques',
      employees: '25-50',
      address: '25 Rue de la Paix, 75002 Paris',
      director: 'Jean MARTIN',
      phone: '01 42 96 12 34',
      email: 'contact@techsolutions.fr',
      foundedYear: '2015',
      status: 'Actif'
    },
    scores: {
      global: 7.2,
      financial: 6.8,
      legal: 8.1,
      fiscal: 7.5,
      defaultRisk: 'Faible'
    },
    sector: 'technologie',
    riskProfile: 'modere'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);  
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateAnalysisContent = async () => {
    setIsGenerating(true);
    
    // Simulation de génération IA basée sur les données saisies
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const generated = {
      riskFactors: generateRiskFactors(data.sector, data.riskProfile),
      financialMetrics: generateFinancialMetrics(data.sector, data.scores.financial),
      legalStatus: generateLegalStatus(data.scores.legal),
      predictions: generatePredictions(data.scores.global, data.sector),
      recommendations: generateRecommendations(data.riskProfile, data.scores.global),
      industryComparison: generateIndustryComparison(data.sector, data.scores.global)
    };

    setGeneratedContent(generated);
    setIsGenerating(false);
    
    toast({
      title: "Analyse générée avec succès",
      description: "L'IA a généré l'analyse complète basée sur vos données"
    });
  };

  const generateRiskFactors = (sector: string, riskProfile: string) => {
    const riskFactors = {
      'technologie': {
        'faible': ['Obsolescence technologique', 'Dépendance fournisseurs'],
        'modere': ['Concurrence accrue', 'Changements réglementaires', 'Cybersécurité'],
        'eleve': ['Volatilité marché', 'Pénurie talents', 'Disruption technologique']
      },
      'finance': {
        'faible': ['Réglementation bancaire', 'Taux d\'intérêt'],
        'modere': ['Risque crédit', 'Conformité réglementaire', 'Fraude'],
        'eleve': ['Crise systémique', 'Cyber-attaques', 'Sanctions réglementaires']
      },
      'retail': {
        'faible': ['Saisonnalité', 'Inflation'],
        'modere': ['E-commerce disruption', 'Supply chain', 'Comportement consommateur'],
        'eleve': ['Crise économique', 'Fermetures forcées', 'Concurrence en ligne']
      }
    };
    return riskFactors[sector as keyof typeof riskFactors]?.[riskProfile as keyof typeof riskFactors['technologie']] || 
           riskFactors['technologie']['modere'];
  };

  const generateFinancialMetrics = (sector: string, financialScore: number) => {
    const baseMetrics = {
      revenue: financialScore > 7 ? '2.5M€' : financialScore > 5 ? '1.8M€' : '1.2M€',
      growth: financialScore > 7 ? '+15%' : financialScore > 5 ? '+8%' : '+3%',
      margin: financialScore > 7 ? '12%' : financialScore > 5 ? '8%' : '4%',
      ebitda: financialScore > 7 ? '18%' : financialScore > 5 ? '12%' : '6%'
    };
    return baseMetrics;
  };

  const generateLegalStatus = (legalScore: number) => {
    return {
      compliance: legalScore > 8 ? 'Excellent' : legalScore > 6 ? 'Bon' : 'À surveiller',
      litigations: legalScore > 7 ? 'Aucune' : legalScore > 5 ? 'Mineures' : 'En cours',
      certifications: legalScore > 8 ? ['ISO 9001', 'ISO 27001'] : legalScore > 6 ? ['ISO 9001'] : []
    };
  };

  const generatePredictions = (globalScore: number, sector: string) => {
    return {
      probability_default: globalScore > 8 ? '1.2%' : globalScore > 6 ? '2.8%' : '5.4%',
      score_evolution: globalScore > 7 ? '+0.3 à +0.6' : globalScore > 5 ? '-0.1 à +0.2' : '-0.4 à -0.1',
      revenue_prediction: globalScore > 7 ? '+12% à +18%' : globalScore > 5 ? '+5% à +10%' : '-2% à +5%'
    };
  };

  const generateRecommendations = (riskProfile: string, globalScore: number) => {
    const recommendations = {
      'faible': ['Maintenir la surveillance', 'Optimiser les processus'],
      'modere': ['Renforcer les contrôles', 'Diversifier les sources de revenus', 'Améliorer la trésorerie'],
      'eleve': ['Action immédiate requise', 'Restructuration recommandée', 'Audit approfondi nécessaire']
    };
    return recommendations[riskProfile as keyof typeof recommendations] || recommendations['modere'];
  };

  const generateIndustryComparison = (sector: string, globalScore: number) => {
    const sectorAverages = {
      'technologie': 6.8,
      'finance': 7.2,
      'retail': 6.4,
      'industrie': 6.9
    };
    const average = sectorAverages[sector as keyof typeof sectorAverages] || 6.5;
    const position = globalScore > average ? 'Au-dessus' : globalScore === average ? 'Dans' : 'En-dessous';
    return {
      position,
      average,
      percentile: Math.round((globalScore / 10) * 100)
    };
  };

  const saveData = () => {
    localStorage.setItem('analysis-data', JSON.stringify(data));
    if (generatedContent) {
      localStorage.setItem('generated-analysis', JSON.stringify(generatedContent));
    }
    
    toast({
      title: "Données sauvegardées",
      description: "Les données d'analyse ont été mises à jour"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Administration - Analyse d'entreprise</h1>
            <p className="text-muted-foreground">Configurez les données d'analyse et générez le contenu automatiquement</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={saveData} variant="default">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder les modifications
            </Button>
            <Button variant="outline" onClick={() => navigate('/analysis')}>
              <Eye className="w-4 h-4 mr-2" />
              Voir l'analyse
            </Button>
          </div>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company">Entreprise</TabsTrigger>
            <TabsTrigger value="scores">Scores & Profil</TabsTrigger>
            <TabsTrigger value="generated">Contenu généré</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Informations de base
                  </CardTitle>
                  <CardDescription>Les éléments essentiels de l'entreprise analysée</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                    <Input
                      id="companyName"
                      value={data.companyInfo.name}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        companyInfo: { ...prev.companyInfo, name: e.target.value }
                      }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="siren">SIREN</Label>
                      <Input
                        id="siren"
                        value={data.companyInfo.siren}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          companyInfo: { ...prev.companyInfo, siren: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="siret">SIRET</Label>
                      <Input
                        id="siret"
                        value={data.companyInfo.siret}
                        onChange={(e) => setData(prev => ({
                          ...prev,
                          companyInfo: { ...prev.companyInfo, siret: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="naf">Code NAF</Label>
                    <Input
                      id="naf"
                      value={data.companyInfo.naf}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        companyInfo: { ...prev.companyInfo, naf: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="employees">Nombre d'employés</Label>
                    <Select value={data.companyInfo.employees} onValueChange={(value) => setData(prev => ({
                      ...prev,
                      companyInfo: { ...prev.companyInfo, employees: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5</SelectItem>
                        <SelectItem value="6-10">6-10</SelectItem>
                        <SelectItem value="11-25">11-25</SelectItem>
                        <SelectItem value="25-50">25-50</SelectItem>
                        <SelectItem value="50-100">50-100</SelectItem>
                        <SelectItem value="100+">100+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea
                      id="address"
                      value={data.companyInfo.address}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        companyInfo: { ...prev.companyInfo, address: e.target.value }
                      }))}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact & Dirigeant</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="director">Dirigeant</Label>
                    <Input
                      id="director"
                      value={data.companyInfo.director}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        companyInfo: { ...prev.companyInfo, director: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={data.companyInfo.phone}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        companyInfo: { ...prev.companyInfo, phone: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.companyInfo.email}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        companyInfo: { ...prev.companyInfo, email: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="foundedYear">Année de création</Label>
                    <Input
                      id="foundedYear"
                      value={data.companyInfo.foundedYear}
                      onChange={(e) => setData(prev => ({
                        ...prev,
                        companyInfo: { ...prev.companyInfo, foundedYear: e.target.value }
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select value={data.companyInfo.status} onValueChange={(value) => setData(prev => ({
                      ...prev,
                      companyInfo: { ...prev.companyInfo, status: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Suspendu">Suspendu</SelectItem>
                        <SelectItem value="En cessation">En cessation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scores" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scores d'évaluation</CardTitle>
                  <CardDescription>Ajustez les scores sur 10</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Score global: {data.scores.global}/10</Label>
                    <Slider
                      value={[data.scores.global]}
                      onValueChange={([value]) => setData(prev => ({
                        ...prev,
                        scores: { ...prev.scores, global: value }
                      }))}
                      max={10}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Score financier: {data.scores.financial}/10</Label>
                    <Slider
                      value={[data.scores.financial]}
                      onValueChange={([value]) => setData(prev => ({
                        ...prev,
                        scores: { ...prev.scores, financial: value }
                      }))}
                      max={10}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Score légal: {data.scores.legal}/10</Label>
                    <Slider
                      value={[data.scores.legal]}
                      onValueChange={([value]) => setData(prev => ({
                        ...prev,
                        scores: { ...prev.scores, legal: value }
                      }))}
                      max={10}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Score fiscal: {data.scores.fiscal}/10</Label>
                    <Slider
                      value={[data.scores.fiscal]}
                      onValueChange={([value]) => setData(prev => ({
                        ...prev,
                        scores: { ...prev.scores, fiscal: value }
                      }))}
                      max={10}
                      min={0}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="defaultRisk">Risque de défaillance</Label>
                    <Select value={data.scores.defaultRisk} onValueChange={(value) => setData(prev => ({
                      ...prev,
                      scores: { ...prev.scores, defaultRisk: value }
                    }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Très faible">Très faible</SelectItem>
                        <SelectItem value="Faible">Faible</SelectItem>
                        <SelectItem value="Modéré">Modéré</SelectItem>
                        <SelectItem value="Élevé">Élevé</SelectItem>
                        <SelectItem value="Très élevé">Très élevé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profil & Secteur</CardTitle>
                  <CardDescription>Configuration pour la génération IA</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="sector">Secteur d'activité</Label>
                    <Select value={data.sector} onValueChange={(value) => setData(prev => ({ ...prev, sector: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technologie">Technologie</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Commerce de détail</SelectItem>
                        <SelectItem value="industrie">Industrie</SelectItem>
                        <SelectItem value="sante">Santé</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="riskProfile">Profil de risque</Label>
                    <Select value={data.riskProfile} onValueChange={(value) => setData(prev => ({ ...prev, riskProfile: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="faible">Faible</SelectItem>
                        <SelectItem value="modere">Modéré</SelectItem>
                        <SelectItem value="eleve">Élevé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Card className="mt-6">
                    <CardContent className="pt-6">
                      <Button 
                        onClick={generateAnalysisContent} 
                        disabled={isGenerating}
                        className="w-full"
                        size="lg"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Génération en cours...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Générer l'analyse avec l'IA
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="generated" className="space-y-6">
            {generatedContent ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contenu généré par l'IA</CardTitle>
                    <CardDescription>Vous pouvez éditer chaque élément manuellement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Facteurs de risque identifiés</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {generatedContent.riskFactors.map((risk: string, index: number) => (
                          <Badge key={index} variant="outline">{risk}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Métriques financières</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <div className="text-center p-3 bg-muted/50 rounded">
                          <div className="font-bold">{generatedContent.financialMetrics.revenue}</div>
                          <div className="text-sm text-muted-foreground">CA</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded">
                          <div className="font-bold">{generatedContent.financialMetrics.growth}</div>
                          <div className="text-sm text-muted-foreground">Croissance</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded">
                          <div className="font-bold">{generatedContent.financialMetrics.margin}</div>
                          <div className="text-sm text-muted-foreground">Marge</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded">
                          <div className="font-bold">{generatedContent.financialMetrics.ebitda}</div>
                          <div className="text-sm text-muted-foreground">EBITDA</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Prédictions</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span>Probabilité de défaillance</span>
                          <Badge>{generatedContent.predictions.probability_default}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span>Évolution score</span>
                          <Badge>{generatedContent.predictions.score_evolution}</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <span>Prédiction CA</span>
                          <Badge>{generatedContent.predictions.revenue_prediction}</Badge>
                        </div>
                      </div>
                    </div>

                    <Button onClick={saveData} className="w-full" size="lg">
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder tout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Configurez d'abord les données puis générez le contenu</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardContent className="p-0">
                <iframe
                  src="/analysis"
                  className="w-full h-[800px] border-0"
                  title="Aperçu de l'analyse"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalysis;