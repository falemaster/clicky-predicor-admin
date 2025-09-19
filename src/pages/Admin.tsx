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
import { Loader2, Wand2, Save, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompanyConfig {
  companyName: string;
  industry: string;
  description: string;
  targetMarket: string;
  primaryServices: string[];
  tone: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

const Admin = () => {
  const [config, setConfig] = useState<CompanyConfig>({
    companyName: 'Predicor',
    industry: 'analyse-financiere',
    description: 'Plateforme d\'analyse prédictive et d\'évaluation des risques d\'entreprise',
    targetMarket: 'PME et grandes entreprises',
    primaryServices: ['Analyse prédictive', 'Évaluation des risques', 'Surveillance continue'],
    tone: 'professionnel',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981'
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleServiceAdd = (service: string) => {
    if (service && !config.primaryServices.includes(service)) {
      setConfig(prev => ({
        ...prev,
        primaryServices: [...prev.primaryServices, service]
      }));
    }
  };

  const handleServiceRemove = (service: string) => {
    setConfig(prev => ({
      ...prev,
      primaryServices: prev.primaryServices.filter(s => s !== service)
    }));
  };

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulation de génération IA - à remplacer par un vrai appel API
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const generated = {
      heroTitle: `${config.companyName} - ${config.description}`,
      heroSubtitle: `Solutions innovantes pour ${config.targetMarket}`,
      features: config.primaryServices.map((service, index) => ({
        title: service,
        description: `Description générée automatiquement pour ${service} adaptée à ${config.industry}`,
        benefits: [
          `Avantage 1 pour ${service}`,
          `Avantage 2 pour ${service}`,
          `Avantage 3 pour ${service}`
        ]
      })),
      demoData: {
        companyExample: `Exemple généré pour ${config.industry}`,
        metrics: generateMetrics(config.industry),
        riskFactors: generateRiskFactors(config.industry)
      }
    };

    setGeneratedContent(generated);
    setIsGenerating(false);
    
    toast({
      title: "Contenu généré avec succès",
      description: "L'IA a généré tout le contenu basé sur votre configuration"
    });
  };

  const generateMetrics = (industry: string) => {
    const baseMetrics = {
      'analyse-financiere': {
        revenue: '2.5M€',
        growth: '+15%',
        risk: 'Modéré',
        score: '7.2/10'
      },
      'tech': {
        revenue: '5.2M€',
        growth: '+28%',
        risk: 'Élevé',
        score: '6.8/10'
      },
      'retail': {
        revenue: '1.8M€',
        growth: '+8%',
        risk: 'Faible',
        score: '8.1/10'
      }
    };
    return baseMetrics[industry as keyof typeof baseMetrics] || baseMetrics['analyse-financiere'];
  };

  const generateRiskFactors = (industry: string) => {
    const riskFactors = {
      'analyse-financiere': ['Volatilité du marché', 'Réglementation', 'Concurrence'],
      'tech': ['Innovation rapide', 'Talent acquisition', 'Cybersécurité'],
      'retail': ['Saisonnalité', 'E-commerce', 'Supply chain']
    };
    return riskFactors[industry as keyof typeof riskFactors] || riskFactors['analyse-financiere'];
  };

  const saveAndApply = () => {
    // Sauvegarder la config et le contenu généré
    localStorage.setItem('admin-config', JSON.stringify(config));
    localStorage.setItem('generated-content', JSON.stringify(generatedContent));
    
    toast({
      title: "Configuration sauvegardée",
      description: "La nouvelle configuration a été appliquée au site"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Administration</h1>
            <p className="text-muted-foreground">Configurez votre site en quelques clics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Eye className="w-4 h-4 mr-2" />
              Voir le site
            </Button>
          </div>
        </div>

        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="content">Contenu généré</TabsTrigger>
            <TabsTrigger value="preview">Aperçu</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                  <CardDescription>Les éléments essentiels de votre entreprise</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                    <Input
                      id="companyName"
                      value={config.companyName}
                      onChange={(e) => setConfig(prev => ({ ...prev, companyName: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="industry">Secteur d'activité</Label>
                    <Select value={config.industry} onValueChange={(value) => setConfig(prev => ({ ...prev, industry: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="analyse-financiere">Analyse financière</SelectItem>
                        <SelectItem value="tech">Technologie</SelectItem>
                        <SelectItem value="retail">Commerce de détail</SelectItem>
                        <SelectItem value="manufacturing">Industrie</SelectItem>
                        <SelectItem value="healthcare">Santé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={config.description}
                      onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetMarket">Marché cible</Label>
                    <Input
                      id="targetMarket"
                      value={config.targetMarket}
                      onChange={(e) => setConfig(prev => ({ ...prev, targetMarket: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Services et style</CardTitle>
                  <CardDescription>Personnalisez vos services et votre identité</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Services principaux</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                      {config.primaryServices.map((service) => (
                        <Badge
                          key={service}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => handleServiceRemove(service)}
                        >
                          {service} ×
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Ajouter un service (Entrée pour valider)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleServiceAdd(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tone">Ton de communication</Label>
                    <Select value={config.tone} onValueChange={(value) => setConfig(prev => ({ ...prev, tone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professionnel">Professionnel</SelectItem>
                        <SelectItem value="moderne">Moderne</SelectItem>
                        <SelectItem value="accessible">Accessible</SelectItem>
                        <SelectItem value="technique">Technique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Couleur principale</Label>
                      <Input
                        id="primaryColor"
                        type="color"
                        value={config.colors.primary}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          colors: { ...prev.colors, primary: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Couleur secondaire</Label>
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={config.colors.secondary}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          colors: { ...prev.colors, secondary: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={generateContent} 
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
                      Générer le contenu avec l'IA
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            {generatedContent ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contenu généré</CardTitle>
                    <CardDescription>Vous pouvez éditer chaque élément manuellement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="heroTitle">Titre principal</Label>
                      <Input
                        id="heroTitle"
                        value={generatedContent.heroTitle}
                        onChange={(e) => setGeneratedContent(prev => ({ ...prev, heroTitle: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="heroSubtitle">Sous-titre</Label>
                      <Input
                        id="heroSubtitle"
                        value={generatedContent.heroSubtitle}
                        onChange={(e) => setGeneratedContent(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label>Fonctionnalités</Label>
                      {generatedContent.features.map((feature: any, index: number) => (
                        <Card key={index} className="mt-2">
                          <CardContent className="pt-4">
                            <Input
                              value={feature.title}
                              onChange={(e) => {
                                const newFeatures = [...generatedContent.features];
                                newFeatures[index].title = e.target.value;
                                setGeneratedContent(prev => ({ ...prev, features: newFeatures }));
                              }}
                              className="font-semibold mb-2"
                            />
                            <Textarea
                              value={feature.description}
                              onChange={(e) => {
                                const newFeatures = [...generatedContent.features];
                                newFeatures[index].description = e.target.value;
                                setGeneratedContent(prev => ({ ...prev, features: newFeatures }));
                              }}
                              rows={2}
                            />
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button onClick={saveAndApply} className="w-full" size="lg">
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder et appliquer
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Wand2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Générez d'abord le contenu dans l'onglet Configuration</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardContent className="p-0">
                <iframe
                  src="/"
                  className="w-full h-[800px] border-0"
                  title="Aperçu du site"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;