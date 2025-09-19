import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAnalysisData, CompanyAnalysisData } from '@/hooks/useAnalysisData';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  BarChart3,
  Shield,
  Save,
  Wand2,
  Eye,
  Edit3,
  Loader2,
  Brain,
  Activity,
  LineChart as LineChartIcon,
  Download,
  Bell,
  Share,
  TrendingDown,
  CreditCard,
  Award
} from 'lucide-react';

const AdminAnalysis = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const { data, setData, saveData } = useAnalysisData();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Temporary state for editing
  const [tempData, setTempData] = useState<CompanyAnalysisData>(data);
  const [descriptions, setDescriptions] = useState({
    financial: "Résultats stables avec une croissance du CA de +12% sur l'exercice.",
    legal: "Excellent respect des obligations légales et réglementaires.",
    risk: "Probabilité de défaillance inférieure à 5% sur 12 mois.",
    aiAnalysis: "Tech Solutions France présente un profil d'entreprise solide avec une croissance soutenue et une gestion financière équilibrée. L'entreprise respecte ses obligations légales et fiscales, avec un historique de paiement exemplaire. Le léger retard URSSAF identifié reste mineur et ne constitue pas un facteur de risque significatif. Le secteur d'activité est porteur et l'entreprise bénéficie d'une position concurrentielle favorable."
  });

  // Additional data for missing elements
  const [additionalData, setAdditionalData] = useState({
    badges: [
      { text: "Bon payeur RubyPayeur", type: "success" },
      { text: "Conformité fiscale", type: "success" },
      { text: "Comptes à jour", type: "success" },
      { text: "Retard URSSAF mineur", type: "warning" }
    ],
    legalInfo: {
      formeJuridique: "SAS, société par actions simplifiée",
      numeroTVA: `FR${data.companyInfo.siren.replace(/\s/g, '')}`,
      inscriptionRCS: "INSCRIT (au greffe de PARIS, le 15/03/2015)",
      inscriptionRNE: "INSCRIT (le 15/03/2015)",
      numeroRCS: `${data.companyInfo.siren} R.C.S. Paris`,
      capitalSocial: "150 000,00 €"
    },
    activity: {
      activitePrincipale: "Conseil en systèmes et logiciels informatiques, développement de solutions digitales sur mesure",
      domaineActivite: "Services aux entreprises",
      formeExercice: "Commerciale",
      conventionCollective: "Syntec - IDCC 1486",
      dateCloture: "31/12/2024",
      dureeExercice: "12 mois",
      activitesSecondaires: [
        { nom: "Formation professionnelle", code: "8559A" },
        { nom: "Maintenance informatique", code: "9511Z" }
      ]
    }
  });

  const toggleEdit = (field: string) => {
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const updateField = (path: string, value: any) => {
    const keys = path.split('.');
    setTempData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const updateDescription = (key: string, value: string) => {
    setDescriptions(prev => ({ ...prev, [key]: value }));
  };

  const updateAdditionalData = (path: string, value: any) => {
    const keys = path.split('.');
    setAdditionalData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const generateDescriptionsFromScores = () => {
    const { financial, legal, global } = tempData.scores;
    
    let financialDesc = "";
    if (financial >= 8) {
      financialDesc = "Excellente santé financière avec une croissance soutenue et une rentabilité exceptionnelle.";
    } else if (financial >= 6) {
      financialDesc = "Résultats stables avec une croissance du CA de +12% sur l'exercice.";
    } else if (financial >= 4) {
      financialDesc = "Situation financière mitigée nécessitant une attention particulière sur la trésorerie.";
    } else {
      financialDesc = "Difficultés financières importantes avec des risques sur la continuité d'exploitation.";
    }

    let legalDesc = "";
    if (legal >= 8) {
      legalDesc = "Excellent respect des obligations légales et réglementaires.";
    } else if (legal >= 6) {
      legalDesc = "Bonne conformité avec quelques ajustements mineurs à prévoir.";
    } else if (legal >= 4) {
      legalDesc = "Conformité partielle avec des non-conformités à régulariser.";
    } else {
      legalDesc = "Problèmes de conformité significatifs nécessitant une action immédiate.";
    }

    let riskDesc = "";
    if (global >= 8) {
      riskDesc = "Probabilité de défaillance très faible, inférieure à 2% sur 12 mois.";
    } else if (global >= 6) {
      riskDesc = "Probabilité de défaillance inférieure à 5% sur 12 mois.";
    } else if (global >= 4) {
      riskDesc = "Risque modéré avec une probabilité de défaillance de 8-12% sur 12 mois.";
    } else {
      riskDesc = "Risque élevé avec une probabilité de défaillance supérieure à 15% sur 12 mois.";
    }

    let aiAnalysisDesc = "";
    if (global >= 7) {
      aiAnalysisDesc = `${tempData.companyInfo.name} présente un profil d'entreprise solide avec une croissance soutenue et une gestion financière équilibrée. L'entreprise respecte ses obligations légales et fiscales, avec un historique de paiement exemplaire. Le secteur d'activité est porteur et l'entreprise bénéficie d'une position concurrentielle favorable.`;
    } else if (global >= 5) {
      aiAnalysisDesc = `${tempData.companyInfo.name} présente un profil d'entreprise stable mais avec quelques points d'attention. La gestion financière nécessite un suivi régulier et certaines obligations réglementaires demandent une vigilance accrue. Le secteur reste porteur mais la concurrence s'intensifie.`;
    } else if (global >= 3) {
      aiAnalysisDesc = `${tempData.companyInfo.name} traverse une période difficile avec des défis importants sur plusieurs fronts. La situation financière est préoccupante et nécessite des mesures correctives rapides. Le respect des obligations légales et fiscales demande une attention immédiate.`;
    } else {
      aiAnalysisDesc = `${tempData.companyInfo.name} fait face à des difficultés majeures mettant en péril la continuité d'exploitation. La situation financière est critique et de nombreuses non-conformités ont été identifiées. Une restructuration d'urgence est recommandée.`;
    }

    setDescriptions({
      financial: financialDesc,
      legal: legalDesc,
      risk: riskDesc,
      aiAnalysis: aiAnalysisDesc
    });
  };

  const handleSave = () => {
    setData(tempData);
    saveData(tempData);
    setEditMode({});
    toast({
      title: "Modifications sauvegardées",
      description: "Toutes les données ont été mises à jour"
    });
  };

  const handleExtrapolateAI = async () => {
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const globalScore = tempData.scores.global;
    let updatedData = { ...tempData };
    
    if (globalScore >= 8) {
      updatedData.scores.defaultRisk = 'Très faible';
      updatedData.riskProfile = 'faible';
    } else if (globalScore >= 6) {
      updatedData.scores.defaultRisk = 'Faible';
      updatedData.riskProfile = 'modere';
    } else if (globalScore >= 4) {
      updatedData.scores.defaultRisk = 'Modéré';
      updatedData.riskProfile = 'modere';
    } else {
      updatedData.scores.defaultRisk = 'Élevé';
      updatedData.riskProfile = 'eleve';
    }

    setTempData(updatedData);
    generateDescriptionsFromScores();
    setIsGenerating(false);
    
    toast({
      title: "Extrapolation IA terminée",
      description: "Le contenu a été adapté selon les nouvelles données"
    });
  };

  const EditableField = ({ 
    field, 
    value, 
    onUpdate, 
    type = "text", 
    className = "",
    multiline = false 
  }: { 
    field: string; 
    value: string | number; 
    onUpdate: (value: any) => void; 
    type?: string; 
    className?: string;
    multiline?: boolean;
  }) => {
    const isEditing = editMode[field];
    
    if (isEditing) {
      if (multiline) {
        return (
          <Textarea
            value={value}
            onChange={(e) => onUpdate(e.target.value)}
            className={className}
            onBlur={() => toggleEdit(field)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                toggleEdit(field);
              }
            }}
            autoFocus
          />
        );
      }
      return (
        <Input
          type={type}
          value={value}
          onChange={(e) => onUpdate(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
          className={className}
          onBlur={() => toggleEdit(field)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              toggleEdit(field);
            }
          }}
          autoFocus
        />
      );
    }

    return (
      <div 
        className={`${className} cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group relative`}
        onClick={() => toggleEdit(field)}
      >
        {value}
        <Edit3 className="w-3 h-3 absolute top-1 right-1 opacity-0 group-hover:opacity-50" />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header avec mode admin */}
      <header className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Predicor</h1>
              <Badge variant="destructive">Mode Admin</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={handleExtrapolateAI} disabled={isGenerating} variant="secondary">
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4 mr-2" />
                )}
                Extrapoler IA
              </Button>
              <Button onClick={handleSave} variant="default">
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
              <Button variant="outline" onClick={() => navigate('/analysis')}>
                <Eye className="w-4 h-4 mr-2" />
                Voir résultat
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Company Header - Éditable */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-slate-600" />
              </div>
              <div>
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 mb-2">
                  <EditableField
                    field="company-name"
                    value={tempData.companyInfo.name}
                    onUpdate={(value) => updateField('companyInfo.name', value)}
                    className="text-xl md:text-2xl font-bold text-foreground"
                  />
                  <Badge variant="secondary" className="bg-success-light text-success w-fit">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <EditableField
                      field="company-status"
                      value={tempData.companyInfo.status}
                      onUpdate={(value) => updateField('companyInfo.status', value)}
                    />
                  </Badge>
                </div>
                <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
                  <span>SIREN: 
                    <EditableField
                      field="siren"
                      value={tempData.companyInfo.siren}
                      onUpdate={(value) => updateField('companyInfo.siren', value)}
                      className="inline ml-1"
                    />
                  </span>
                  <span>SIRET: 
                    <EditableField
                      field="siret"
                      value={tempData.companyInfo.siret}
                      onUpdate={(value) => updateField('companyInfo.siret', value)}
                      className="inline ml-1"
                    />
                  </span>
                  <EditableField
                    field="naf"
                    value={tempData.companyInfo.naf}
                    onUpdate={(value) => updateField('companyInfo.naf', value)}
                  />
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                <EditableField
                  field="global-score"
                  value={tempData.scores.global}
                  onUpdate={(value) => updateField('scores.global', value)}
                  type="number"
                />
                /10
              </div>
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
            {/* Company Details - Éditable */}
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
                      <EditableField
                        field="address"
                        value={tempData.companyInfo.address}
                        onUpdate={(value) => updateField('companyInfo.address', value)}
                        className="text-sm flex-1"
                        multiline
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Dirigeant: </span>
                      <EditableField
                        field="director"
                        value={tempData.companyInfo.director}
                        onUpdate={(value) => updateField('companyInfo.director', value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Créée en </span>
                      <EditableField
                        field="founded-year"
                        value={tempData.companyInfo.foundedYear}
                        onUpdate={(value) => updateField('companyInfo.foundedYear', value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <EditableField
                        field="phone"
                        value={tempData.companyInfo.phone}
                        onUpdate={(value) => updateField('companyInfo.phone', value)}
                        className="text-sm"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <EditableField
                        field="email"
                        value={tempData.companyInfo.email}
                        onUpdate={(value) => updateField('companyInfo.email', value)}
                        className="text-sm"
                        type="email"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Effectif: </span>
                      <EditableField
                        field="employees"
                        value={tempData.companyInfo.employees}
                        onUpdate={(value) => updateField('companyInfo.employees', value)}
                        className="text-sm"
                      />
                      <span className="text-sm"> salariés</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges and Status - Éditables */}
            <Card>
              <CardHeader>
                <CardTitle>Statuts et certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {additionalData.badges.map((badge, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className={badge.type === 'success' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}
                    >
                      {badge.type === 'success' ? 
                        <CheckCircle className="h-3 w-3 mr-1" /> : 
                        <AlertTriangle className="h-3 w-3 mr-1" />
                      }
                      <EditableField
                        field={`badge-${index}`}
                        value={badge.text}
                        onUpdate={(value) => {
                          const newBadges = [...additionalData.badges];
                          newBadges[index].text = value;
                          setAdditionalData(prev => ({ ...prev, badges: newBadges }));
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scores - Éditables */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-success" />
                    Santé financière
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success mb-2">
                    <EditableField
                      field="financial-score"
                      value={tempData.scores.financial}
                      onUpdate={(value) => updateField('scores.financial', value)}
                      type="number"
                    />
                    /10
                  </div>
                  <EditableField
                    field="financial-desc"
                    value={descriptions.financial}
                    onUpdate={(value) => updateDescription('financial', value)}
                    className="text-sm text-muted-foreground"
                    multiline
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    Conformité légale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-2">
                    <EditableField
                      field="legal-score"
                      value={tempData.scores.legal}
                      onUpdate={(value) => updateField('scores.legal', value)}
                      type="number"
                    />
                    /10
                  </div>
                  <EditableField
                    field="legal-desc"
                    value={descriptions.legal}
                    onUpdate={(value) => updateDescription('legal', value)}
                    className="text-sm text-muted-foreground"
                    multiline
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2 text-warning" />
                    Risque prédictif 12m
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success mb-2">
                    <EditableField
                      field="default-risk"
                      value={tempData.scores.defaultRisk}
                      onUpdate={(value) => updateField('scores.defaultRisk', value)}
                    />
                  </div>
                  <EditableField
                    field="risk-desc"
                    value={descriptions.risk}
                    onUpdate={(value) => updateDescription('risk', value)}
                    className="text-sm text-muted-foreground"
                    multiline
                  />
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis - Éditable */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analyse IA globale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-100 rounded-lg p-4">
                  <EditableField
                    field="ai-analysis"
                    value={descriptions.aiAnalysis}
                    onUpdate={(value) => updateDescription('aiAnalysis', value)}
                    className="text-sm leading-relaxed w-full"
                    multiline
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informations juridiques détaillées - Éditables */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Informations juridiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">SIREN :</span>
                      <EditableField
                        field="legal-siren"
                        value={tempData.companyInfo.siren}
                        onUpdate={(value) => updateField('companyInfo.siren', value)}
                        className="font-medium block mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">SIRET (siège) :</span>
                      <EditableField
                        field="legal-siret"
                        value={tempData.companyInfo.siret}
                        onUpdate={(value) => updateField('companyInfo.siret', value)}
                        className="font-medium block mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Forme juridique :</span>
                      <EditableField
                        field="forme-juridique"
                        value={additionalData.legalInfo.formeJuridique}
                        onUpdate={(value) => updateAdditionalData('legalInfo.formeJuridique', value)}
                        className="font-medium block mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Numéro de TVA :</span>
                      <EditableField
                        field="numero-tva"
                        value={additionalData.legalInfo.numeroTVA}
                        onUpdate={(value) => updateAdditionalData('legalInfo.numeroTVA', value)}
                        className="font-medium block mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capital social :</span>
                      <EditableField
                        field="capital-social"
                        value={additionalData.legalInfo.capitalSocial}
                        onUpdate={(value) => updateAdditionalData('legalInfo.capitalSocial', value)}
                        className="font-medium block mt-1"
                      />
                    </div>
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
                    <EditableField
                      field="activite-principale"
                      value={additionalData.activity.activitePrincipale}
                      onUpdate={(value) => updateAdditionalData('activity.activitePrincipale', value)}
                      className="font-medium mt-1 block"
                      multiline
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Domaine d'activité :</span>
                      <EditableField
                        field="domaine-activite"
                        value={additionalData.activity.domaineActivite}
                        onUpdate={(value) => updateAdditionalData('activity.domaineActivite', value)}
                        className="font-medium block mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Convention collective :</span>
                      <EditableField
                        field="convention-collective"
                        value={additionalData.activity.conventionCollective}
                        onUpdate={(value) => updateAdditionalData('activity.conventionCollective', value)}
                        className="font-medium block mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date de clôture exercice :</span>
                      <EditableField
                        field="date-cloture"
                        value={additionalData.activity.dateCloture}
                        onUpdate={(value) => updateAdditionalData('activity.dateCloture', value)}
                        className="font-medium block mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Durée exercice :</span>
                      <EditableField
                        field="duree-exercice"
                        value={additionalData.activity.dureeExercice}
                        onUpdate={(value) => updateAdditionalData('activity.dureeExercice', value)}
                        className="font-medium block mt-1"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Activités secondaires</h4>
                    <div className="space-y-2 text-sm">
                      {additionalData.activity.activitesSecondaires.map((activite, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <EditableField
                            field={`activite-sec-${index}`}
                            value={activite.nom}
                            onUpdate={(value) => {
                              const newActivites = [...additionalData.activity.activitesSecondaires];
                              newActivites[index].nom = value;
                              updateAdditionalData('activity.activitesSecondaires', newActivites);
                            }}
                          />
                          <Badge variant="outline" className="text-xs">
                            <EditableField
                              field={`code-sec-${index}`}
                              value={activite.code}
                              onUpdate={(value) => {
                                const newActivites = [...additionalData.activity.activitesSecondaires];
                                newActivites[index].code = value;
                                updateAdditionalData('activity.activitesSecondaires', newActivites);
                              }}
                            />
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instructions pour l'admin */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Edit3 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Instructions d'édition</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Cliquez sur n'importe quel champ pour l'éditer directement</li>
                      <li>• Appuyez sur Entrée ou cliquez ailleurs pour valider</li>
                      <li>• Utilisez "Extrapoler IA" pour adapter automatiquement le contenu selon vos modifications</li>
                      <li>• N'oubliez pas de "Sauvegarder" vos changements</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="study" className="space-y-6">
            {/* Étude approfondie complète - Version admin */}
            <Card>
              <CardHeader>
                <CardTitle>Étude Approfondie - Version Admin Complète</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg border border-primary/10">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3 text-primary">Synthèse Exécutive</h3>
                      <EditableField
                        field="executive-summary"
                        value="Profil d'excellence globale - L'entreprise présente un profil remarquablement équilibré avec une note moyenne de 8.4/10, plaçant l'organisation dans le quartile supérieur de son secteur. La conformité légale (9.1/10) constitue un avantage concurrentiel majeur, témoignant d'une culture de rigueur et de transparence exceptionnelle."
                        onUpdate={() => {}}
                        className="text-sm leading-relaxed text-muted-foreground"
                        multiline
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sections détaillées */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analyse Économique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success mb-2">
                    <EditableField
                      field="economic-score"
                      value="8.4"
                      onUpdate={() => {}}
                      type="number"
                    />
                    /10
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>Part de marché: <EditableField field="part-marche" value="3.1%" onUpdate={() => {}} className="font-semibold inline" /></div>
                    <div>Croissance 2023: <EditableField field="croissance-2023" value="6.7%" onUpdate={() => {}} className="font-semibold inline" /></div>
                    <div>Satisfaction client: <EditableField field="satisfaction-client" value="85%" onUpdate={() => {}} className="font-semibold inline" /></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Situation Financière
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-2">
                    <EditableField
                      field="financial-situation-score"
                      value="7.8"
                      onUpdate={() => {}}
                      type="number"
                    />
                    /10
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>Ratio liquidité: <EditableField field="ratio-liquidite" value="1.85" onUpdate={() => {}} className="font-semibold inline" /></div>
                    <div>Rentabilité nette: <EditableField field="rentabilite-nette" value="7.7%" onUpdate={() => {}} className="font-semibold inline" /></div>
                    <div>Taux endettement: <EditableField field="taux-endettement" value="35%" onUpdate={() => {}} className="font-semibold inline" /></div>
                    <div>Cash-flow 2023: <EditableField field="cashflow-2023" value="385K€" onUpdate={() => {}} className="font-semibold inline" /></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Conformité & Gouvernance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success mb-2">
                    <EditableField
                      field="compliance-score"
                      value="9.1"
                      onUpdate={() => {}}
                      type="number"
                    />
                    /10
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>Audit fiscal: <EditableField field="audit-fiscal" value="95/100" onUpdate={() => {}} className="font-semibold inline" /></div>
                    <div>Conformité RGPD: <EditableField field="conformite-rgpd" value="96/100" onUpdate={() => {}} className="font-semibold inline" /></div>
                    <div>Gouvernance: <EditableField field="gouvernance" value="8.7/10" onUpdate={() => {}} className="font-semibold inline" /></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            {/* Analyse prédictive complète */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success mb-2">
                      <EditableField field="risk-3m" value="2.1" onUpdate={() => {}} type="number" />%
                    </div>
                    <div className="text-sm font-medium mb-2">Risque 3 mois</div>
                    <Badge variant="secondary" className="bg-success-light text-success">
                      <EditableField field="risk-3m-level" value="Très faible" onUpdate={() => {}} />
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success mb-2">
                      <EditableField field="risk-6m" value="3.8" onUpdate={() => {}} type="number" />%
                    </div>
                    <div className="text-sm font-medium mb-2">Risque 6 mois</div>
                    <Badge variant="secondary" className="bg-success-light text-success">
                      <EditableField field="risk-6m-level" value="Faible" onUpdate={() => {}} />
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning mb-2">
                      <EditableField field="risk-12m" value="4.9" onUpdate={() => {}} type="number" />%
                    </div>
                    <div className="text-sm font-medium mb-2">Risque 12 mois</div>
                    <Badge variant="secondary" className="bg-warning-light text-warning">
                      <EditableField field="risk-12m-level" value="Modéré" onUpdate={() => {}} />
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">
                      <EditableField field="ai-confidence" value="85" onUpdate={() => {}} type="number" />%
                    </div>
                    <div className="text-sm font-medium mb-2">Confiance IA</div>
                    <Badge variant="secondary" className="bg-primary-light text-primary">Élevée</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tests de résistance et facteurs IA */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Tests de Résistance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Récession -10%', 'Perte client majeur', 'Crise secteur tech', 'Inflation +5%', 'Taux +3%'].map((scenario, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <EditableField
                            field={`scenario-${index}`}
                            value={scenario}
                            onUpdate={() => {}}
                            className="text-sm font-medium"
                          />
                          <Badge variant="secondary" className="bg-warning-light text-warning">
                            <EditableField
                              field={`scenario-impact-${index}`}
                              value={6.8 + index * 0.5}
                              onUpdate={() => {}}
                              type="number"
                            />%
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Probabilité: <EditableField field={`scenario-prob-${index}`} value={15 + index * 5} onUpdate={() => {}} type="number" className="inline" />%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Facteurs Discriminants IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { factor: 'Croissance CA', weight: 25, impact: 'positive', value: '+12%' },
                      { factor: 'Trésorerie', weight: 20, impact: 'positive', value: 'Forte' },
                      { factor: 'Retard URSSAF', weight: 15, impact: 'negative', value: 'Mineur' },
                      { factor: 'Secteur porteur', weight: 18, impact: 'positive', value: 'Tech' },
                      { factor: 'Dépendance clients', weight: 12, impact: 'negative', value: '45%' }
                    ].map((factor, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <EditableField
                            field={`factor-name-${index}`}
                            value={factor.factor}
                            onUpdate={() => {}}
                            className="text-sm font-medium"
                          />
                          <div className="flex items-center space-x-2">
                            {factor.impact === 'positive' ? 
                              <CheckCircle className="h-3 w-3 text-success" /> : 
                              <AlertTriangle className="h-3 w-3 text-warning" />
                            }
                            <EditableField
                              field={`factor-value-${index}`}
                              value={factor.value}
                              onUpdate={() => {}}
                              className="text-xs text-muted-foreground"
                            />
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Poids: <EditableField field={`factor-weight-${index}`} value={factor.weight} onUpdate={() => {}} type="number" className="inline" />%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Analyse du risque fiscal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Conformité et Santé Fiscale
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-success/5 to-primary/5 p-6 rounded-lg border border-success/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-success mb-2">Score de Risque Fiscal</h4>
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold text-success">
                          <EditableField field="fiscal-risk-score" value="12" onUpdate={() => {}} type="number" />%
                        </div>
                        <Badge variant="secondary" className="bg-success-light text-success">
                          <EditableField field="fiscal-risk-level" value="Risque Faible" onUpdate={() => {}} />
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-2">Secteur médian</div>
                      <div className="text-xl font-semibold text-muted-foreground">
                        <EditableField field="sector-median" value="18" onUpdate={() => {}} type="number" />%
                      </div>
                      <Badge variant="outline" className="mt-2">-6 pts</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2" />
                    Rapports Disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    'Télécharger rapport complet PDF',
                    'Rapport exécutif (2 pages)',
                    'Analyse prédictive détaillée',
                    'Rapport de conformité',
                    'Synthèse pour comité de crédit'
                  ].map((report, index) => (
                    <EditableField
                      key={index}
                      field={`report-${index}`}
                      value={report}
                      onUpdate={() => {}}
                      className="w-full p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    />
                  ))}
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
                  {[
                    'Configurer les alertes de monitoring',
                    'Partager l\'analyse avec équipe',
                    'Programmer suivi mensuel',
                    'Ajouter commentaire admin',
                    'Exporter vers système CRM'
                  ].map((action, index) => (
                    <EditableField
                      key={index}
                      field={`action-${index}`}
                      value={action}
                      onUpdate={() => {}}
                      className="w-full p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Section recommandations et monitoring */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recommandations Prioritaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Surveiller URSSAF mensuel - Délais critiques',
                      'Diversifier top 3 clients - Concentration 65%',
                      'Renforcer trésorerie Q4 - Saisonnalité détectée',
                      'Optimiser ratios financiers - Marge progression',
                      'Maintenir excellence conformité - Avantage concurrentiel'
                    ].map((rec, index) => (
                      <EditableField
                        key={index}
                        field={`recommendation-${index}`}
                        value={rec}
                        onUpdate={() => {}}
                        className="block text-sm p-3 border rounded-lg"
                        multiline
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Actions de Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Surveillance mensuelle URSSAF et charges sociales',
                      'Contrôle qualité client trimestriel - NPS tracking',
                      'Audit financier semestriel - Ratios et tendances',
                      'Veille réglementaire continue - Secteur tech',
                      'Review gouvernance annuelle - Politique risques'
                    ].map((monitoring, index) => (
                      <EditableField
                        key={index}
                        field={`monitoring-${index}`}
                        value={monitoring}
                        onUpdate={() => {}}
                        className="block text-sm p-3 border rounded-lg"
                        multiline
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalysis;