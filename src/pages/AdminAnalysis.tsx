import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import AdvancedStudy from "@/components/study/AdvancedStudy";
import PredictiveAnalysis from "@/components/predictive/PredictiveAnalysis";
import { useAnalysisData } from "@/hooks/useAnalysisData";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
  Save,
  Wand2,
  Eye,
  Edit3,
  Loader2,
  Award
} from "lucide-react";

const AdminAnalysis = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  
  const { data, setData, saveData } = useAnalysisData();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Utiliser les données depuis le hook ou fallback vers les données par défaut
  const companyData = data.companyInfo;
  const scores = data.scores;

  // État temporaire pour l'édition
  const [tempData, setTempData] = useState(data);
  const [descriptions, setDescriptions] = useState({
    financial: "Résultats stables avec une croissance du CA de +12% sur l'exercice.",
    legal: "Excellent respect des obligations légales et réglementaires.",
    risk: "Probabilité de défaillance inférieure à 5% sur 12 mois.",
    aiAnalysis: "Tech Solutions France présente un profil d'entreprise solide avec une croissance soutenue et une gestion financière équilibrée. L'entreprise respecte ses obligations légales et fiscales, avec un historique de paiement exemplaire. Le léger retard URSSAF identifié reste mineur et ne constitue pas un facteur de risque significatif. Le secteur d'activité est porteur et l'entreprise bénéficie d'une position concurrentielle favorable."
  });

  const [additionalFields, setAdditionalFields] = useState({
    badges: [
      "Bon payeur RubyPayeur",
      "Conformité fiscale", 
      "Comptes à jour",
      "Retard URSSAF mineur"
    ],
    legalInfo: {
      formeJuridique: "SAS, société par actions simplifiée",
      numeroTVA: `FR${companyData.siren.replace(/\s/g, '')}`,
      inscriptionRCS: "INSCRIT (au greffe de PARIS, le 15/03/2015)",
      inscriptionRNE: "INSCRIT (le 15/03/2015)",
      numeroRCS: `${companyData.siren} R.C.S. Paris`,
      capitalSocial: "150 000,00 €"
    },
    activity: {
      activitePrincipale: "Conseil en systèmes et logiciels informatiques, développement de solutions digitales sur mesure",
      codeNAF: "6202A",
      categoryNAF: "Commerce",
      descriptionNAF: "(Conseil en systèmes et logiciels informatiques)",
      domaineActivite: "Services aux entreprises",
      formeExercice: "Commerciale", 
      conventionCollective: "Syntec - IDCC 1486",
      statutConvention: "supposée",
      dateCloture: "31/12/2024",
      dureeExercice: "12 mois",
      activitesSecondaires: [
        { nom: "Formation professionnelle", code: "8559A" },
        { nom: "Maintenance informatique", code: "9511Z" }
      ]
    },
    reports: [
      "Télécharger rapport complet PDF",
      "Rapport exécutif (2 pages)", 
      "Analyse prédictive détaillée"
    ],
    actions: [
      "Configurer les alertes",
      "Partager l'analyse",
      "Ajouter un commentaire admin"
    ]
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

  const updateAdditionalField = (path: string, value: any) => {
    const keys = path.split('.');
    setAdditionalFields(prev => {
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
    multiline = false,
    children
  }: { 
    field: string; 
    value: string | number; 
    onUpdate: (value: any) => void; 
    type?: string; 
    className?: string;
    multiline?: boolean;
    children?: React.ReactNode;
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
        className={`${className} cursor-pointer hover:bg-muted/50 rounded px-2 py-1 group relative inline-block`}
        onClick={() => toggleEdit(field)}
      >
        {children || value}
        <Edit3 className="w-3 h-3 absolute top-1 right-1 opacity-0 group-hover:opacity-50" />
      </div>
    );
  };

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

      {/* Company Header */}
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
                  <span>SIREN: <EditableField
                    field="header-siren"
                    value={tempData.companyInfo.siren}
                    onUpdate={(value) => updateField('companyInfo.siren', value)}
                    className="inline"
                  /></span>
                  <span>SIRET: <EditableField
                    field="header-siret"
                    value={tempData.companyInfo.siret}
                    onUpdate={(value) => updateField('companyInfo.siret', value)}
                    className="inline"
                  /></span>
                  <EditableField
                    field="header-naf"
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
                      <span className="text-sm">Dirigeant: <EditableField
                        field="director"
                        value={tempData.companyInfo.director}
                        onUpdate={(value) => updateField('companyInfo.director', value)}
                        className="inline"
                      /></span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Créée en <EditableField
                        field="founded-year"
                        value={tempData.companyInfo.foundedYear}
                        onUpdate={(value) => updateField('companyInfo.foundedYear', value)}
                        className="inline"
                      /></span>
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
                      <span className="text-sm">Effectif: <EditableField
                        field="employees"
                        value={tempData.companyInfo.employees}
                        onUpdate={(value) => updateField('companyInfo.employees', value)}
                        className="inline"
                      /> salariés</span>
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
                  <Badge variant="secondary" className="bg-success-light text-success">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <EditableField
                      field="badge-1"
                      value={additionalFields.badges[0]}
                      onUpdate={(value) => {
                        const newBadges = [...additionalFields.badges];
                        newBadges[0] = value;
                        updateAdditionalField('badges', newBadges);
                      }}
                    />
                  </Badge>
                  <Badge variant="secondary" className="bg-success-light text-success">
                    <Shield className="h-3 w-3 mr-1" />
                    <EditableField
                      field="badge-2"
                      value={additionalFields.badges[1]}
                      onUpdate={(value) => {
                        const newBadges = [...additionalFields.badges];
                        newBadges[1] = value;
                        updateAdditionalField('badges', newBadges);
                      }}
                    />
                  </Badge>
                  <Badge variant="secondary" className="bg-success-light text-success">
                    <FileText className="h-3 w-3 mr-1" />
                    <EditableField
                      field="badge-3"
                      value={additionalFields.badges[2]}
                      onUpdate={(value) => {
                        const newBadges = [...additionalFields.badges];
                        newBadges[2] = value;
                        updateAdditionalField('badges', newBadges);
                      }}
                    />
                  </Badge>
                  <Badge variant="secondary" className="bg-warning-light text-warning">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <EditableField
                      field="badge-4"
                      value={additionalFields.badges[3]}
                      onUpdate={(value) => {
                        const newBadges = [...additionalFields.badges];
                        newBadges[3] = value;
                        updateAdditionalField('badges', newBadges);
                      }}
                    />
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Scores */}
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
                    className="text-sm text-muted-foreground block"
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
                    className="text-sm text-muted-foreground block"
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
                    className="text-sm text-muted-foreground block"
                    multiline
                  />
                </CardContent>
              </Card>
            </div>

            {/* AI Analysis */}
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
                    className="text-sm leading-relaxed block w-full"
                    multiline
                  />
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
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Avis situation SIRENE
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">SIREN :</span>
                      <EditableField
                        field="legal-siren"
                        value={tempData.companyInfo.siren}
                        onUpdate={(value) => updateField('companyInfo.siren', value)}
                        className="font-medium block"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">SIRET (siège) :</span>
                      <EditableField
                        field="legal-siret"
                        value={tempData.companyInfo.siret}
                        onUpdate={(value) => updateField('companyInfo.siret', value)}
                        className="font-medium block"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Forme juridique :</span>
                      <EditableField
                        field="forme-juridique"
                        value={additionalFields.legalInfo.formeJuridique}
                        onUpdate={(value) => updateAdditionalField('legalInfo.formeJuridique', value)}
                        className="font-medium block"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Numéro de TVA :</span>
                      <EditableField
                        field="numero-tva"
                        value={additionalFields.legalInfo.numeroTVA}
                        onUpdate={(value) => updateAdditionalField('legalInfo.numeroTVA', value)}
                        className="font-medium block"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Inscription RCS :</span>
                      <div className="font-medium text-success">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        <EditableField
                          field="inscription-rcs"
                          value={additionalFields.legalInfo.inscriptionRCS}
                          onUpdate={(value) => updateAdditionalField('legalInfo.inscriptionRCS', value)}
                          className="inline"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Inscription RNE :</span>
                      <div className="font-medium text-success">
                        <CheckCircle className="h-3 w-3 inline mr-1" />
                        <EditableField
                          field="inscription-rne"
                          value={additionalFields.legalInfo.inscriptionRNE}
                          onUpdate={(value) => updateAdditionalField('legalInfo.inscriptionRNE', value)}
                          className="inline"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Numéro RCS :</span>
                      <EditableField
                        field="numero-rcs"
                        value={additionalFields.legalInfo.numeroRCS}
                        onUpdate={(value) => updateAdditionalField('legalInfo.numeroRCS', value)}
                        className="font-medium block"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capital social :</span>
                      <EditableField
                        field="capital-social"
                        value={additionalFields.legalInfo.capitalSocial}
                        onUpdate={(value) => updateAdditionalField('legalInfo.capitalSocial', value)}
                        className="font-medium block"
                      />
                    </div>
                  </div>
                  
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
                    <EditableField
                      field="activite-principale"
                      value={additionalFields.activity.activitePrincipale}
                      onUpdate={(value) => updateAdditionalField('activity.activitePrincipale', value)}
                      className="font-medium mt-1 block"
                      multiline
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Code NAF ou APE :</span>
                      <div className="font-medium">
                        <EditableField
                          field="code-naf"
                          value={additionalFields.activity.codeNAF}
                          onUpdate={(value) => updateAdditionalField('activity.codeNAF', value)}
                          className="inline"
                        /> <Badge variant="outline" className="ml-1 text-xs">
                          <EditableField
                            field="category-naf"
                            value={additionalFields.activity.categoryNAF}
                            onUpdate={(value) => updateAdditionalField('activity.categoryNAF', value)}
                            className="inline"
                          />
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        <EditableField
                          field="description-naf"
                          value={additionalFields.activity.descriptionNAF}
                          onUpdate={(value) => updateAdditionalField('activity.descriptionNAF', value)}
                          className="inline"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Domaine d'activité :</span>
                      <EditableField
                        field="domaine-activite"
                        value={additionalFields.activity.domaineActivite}
                        onUpdate={(value) => updateAdditionalField('activity.domaineActivite', value)}
                        className="font-medium block"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Forme d'exercice :</span>
                      <EditableField
                        field="forme-exercice"
                        value={additionalFields.activity.formeExercice}
                        onUpdate={(value) => updateAdditionalField('activity.formeExercice', value)}
                        className="font-medium block"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Convention collective :</span>
                      <div className="font-medium">
                        <EditableField
                          field="convention-collective"
                          value={additionalFields.activity.conventionCollective}
                          onUpdate={(value) => updateAdditionalField('activity.conventionCollective', value)}
                          className="inline"
                        />
                        <Badge variant="outline" className="ml-1 text-xs">
                          <EditableField
                            field="statut-convention"
                            value={additionalFields.activity.statutConvention}
                            onUpdate={(value) => updateAdditionalField('activity.statutConvention', value)}
                            className="inline"
                          />
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date de clôture exercice :</span>
                      <EditableField
                        field="date-cloture"
                        value={additionalFields.activity.dateCloture}
                        onUpdate={(value) => updateAdditionalField('activity.dateCloture', value)}
                        className="font-medium block"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground">Durée exercice :</span>
                      <EditableField
                        field="duree-exercice"
                        value={additionalFields.activity.dureeExercice}
                        onUpdate={(value) => updateAdditionalField('activity.dureeExercice', value)}
                        className="font-medium block"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-2">Activités secondaires</h4>
                    <div className="space-y-2 text-sm">
                      {additionalFields.activity.activitesSecondaires.map((activite, index) => (
                        <div key={index} className="flex justify-between">
                          <EditableField
                            field={`activite-sec-${index}`}
                            value={activite.nom}
                            onUpdate={(value) => {
                              const newActivites = [...additionalFields.activity.activitesSecondaires];
                              newActivites[index].nom = value;
                              updateAdditionalField('activity.activitesSecondaires', newActivites);
                            }}
                          />
                          <Badge variant="outline" className="text-xs">
                            <EditableField
                              field={`code-sec-${index}`}
                              value={activite.code}
                              onUpdate={(value) => {
                                const newActivites = [...additionalFields.activity.activitesSecondaires];
                                newActivites[index].code = value;
                                updateAdditionalField('activity.activitesSecondaires', newActivites);
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
                    <h4 className="font-semibold text-blue-900 mb-2">Mode édition WYSIWYG</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Cliquez sur n'importe quel texte pour l'éditer directement</li>
                      <li>• Les modifications apparaissent en temps réel</li>
                      <li>• "Extrapoler IA" adapte automatiquement tous les contenus selon vos changements</li>
                      <li>• "Sauvegarder" applique définitivement vos modifications</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="study" className="space-y-6">
            {/* Étude Approfondie - Version Admin WYSIWYG */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <EditableField
                    field="study-title"
                    value="Étude Approfondie"
                    onUpdate={() => {}}
                  />
                </CardTitle>
                <CardDescription>
                  <EditableField
                    field="study-description"
                    value="Analyse multidimensionnelle par volets spécialisés"
                    onUpdate={() => {}}
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-lg border border-primary/10">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3 text-primary">
                        <EditableField
                          field="executive-summary-title"
                          value="Synthèse Exécutive"
                          onUpdate={() => {}}
                        />
                      </h3>
                      <div className="prose prose-sm text-muted-foreground space-y-3">
                        <EditableField
                          field="executive-summary-full"
                          value="Profil d'excellence globale - L'entreprise présente un profil remarquablement équilibré avec une note moyenne de 8.4/10, plaçant l'organisation dans le quartile supérieur de son secteur.

Points forts critiques : La conformité légale (9.1/10) constitue un avantage concurrentiel majeur, témoignant d'une culture de rigueur et de transparence exceptionnelle. La performance économique (8.4/10) reflète une stratégie commerciale bien maîtrisée avec une croissance soutenue et un positionnement concurrentiel solide.

Axes d'optimisation : La solidité financière (7.8/10), bien que satisfaisante, présente un potentiel d'amélioration notable. L'optimisation de la structure de capital et l'amélioration des ratios de liquidité pourraient renforcer significativement la résilience financière.

Recommandation stratégique : Maintenir l'excellence opérationnelle actuelle tout en investissant dans le renforcement des fondamentaux financiers pour sécuriser la croissance à long terme."
                          onUpdate={() => {}}
                          className="block w-full min-h-[120px]"
                          multiline
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sections détaillées éditables */}
            <div className="space-y-4">
              {/* Analyse économique et commerciale */}
              <Card>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">
                          <EditableField
                            field="economic-title"
                            value="Analyse Économique et Commerciale"
                            onUpdate={() => {}}
                          />
                        </CardTitle>
                        <CardDescription>
                          <EditableField
                            field="economic-desc"
                            value="Performance marché et positionnement concurrentiel"
                            onUpdate={() => {}}
                          />
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="bg-success text-success-foreground">
                        <EditableField
                          field="economic-badge"
                          value="Excellent 8.4/10"
                          onUpdate={() => {}}
                        />
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary mb-2">
                        <EditableField
                          field="market-share"
                          value="3.1"
                          onUpdate={() => {}}
                          type="number"
                        />%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <EditableField
                          field="market-share-label"
                          value="Part de marché"
                          onUpdate={() => {}}
                        />
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        <EditableField
                          field="market-share-change"
                          value="+0.3pts vs 2022"
                          onUpdate={() => {}}
                        />
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-success mb-2">
                        <EditableField
                          field="growth-2023"
                          value="6.7"
                          onUpdate={() => {}}
                          type="number"
                        />%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <EditableField
                          field="growth-label"
                          value="Croissance 2023"
                          onUpdate={() => {}}
                        />
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        <EditableField
                          field="sector-growth"
                          value="Secteur: 4.2%"
                          onUpdate={() => {}}
                        />
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary mb-2">
                        <EditableField
                          field="satisfaction"
                          value="85"
                          onUpdate={() => {}}
                          type="number"
                        />%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <EditableField
                          field="satisfaction-label"
                          value="Satisfaction client"
                          onUpdate={() => {}}
                        />
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        <EditableField
                          field="nps-score"
                          value="NPS +52"
                          onUpdate={() => {}}
                        />
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Situation financière */}
              <Card>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">
                          <EditableField
                            field="financial-title"
                            value="Situation Financière"
                            onUpdate={() => {}}
                          />
                        </CardTitle>
                        <CardDescription>
                          <EditableField
                            field="financial-desc"
                            value="Santé financière et ratios de gestion"
                            onUpdate={() => {}}
                          />
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-primary-light text-primary">
                        <EditableField
                          field="financial-badge"
                          value="Solide 7.8/10"
                          onUpdate={() => {}}
                        />
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary mb-2">
                        <EditableField
                          field="liquidity-ratio"
                          value="1.85"
                          onUpdate={() => {}}
                          type="number"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <EditableField
                          field="liquidity-label"
                          value="Ratio liquidité"
                          onUpdate={() => {}}
                        />
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        <EditableField
                          field="liquidity-threshold"
                          value="Seuil: 1.5"
                          onUpdate={() => {}}
                        />
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-success mb-2">
                        <EditableField
                          field="profitability"
                          value="7.7"
                          onUpdate={() => {}}
                          type="number"
                        />%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <EditableField
                          field="profitability-label"
                          value="Rentabilité nette"
                          onUpdate={() => {}}
                        />
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        <EditableField
                          field="sector-profitability"
                          value="Secteur: 5.2%"
                          onUpdate={() => {}}
                        />
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary mb-2">
                        <EditableField
                          field="debt-ratio"
                          value="35"
                          onUpdate={() => {}}
                          type="number"
                        />%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <EditableField
                          field="debt-label"
                          value="Taux endettement"
                          onUpdate={() => {}}
                        />
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        <EditableField
                          field="debt-limit"
                          value="Limite: 60%"
                          onUpdate={() => {}}
                        />
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-success mb-2">
                        <EditableField
                          field="cashflow"
                          value="385K€"
                          onUpdate={() => {}}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <EditableField
                          field="cashflow-label"
                          value="Cash-flow 2023"
                          onUpdate={() => {}}
                        />
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        <EditableField
                          field="cashflow-change"
                          value="+22% vs 2022"
                          onUpdate={() => {}}
                        />
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conformités et obligations légales */}
              <Card>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">
                          <EditableField
                            field="compliance-title"
                            value="Conformités et Obligations Légales"
                            onUpdate={() => {}}
                          />
                        </CardTitle>
                        <CardDescription>
                          <EditableField
                            field="compliance-desc"
                            value="Respect des réglementations et audits de conformité"
                            onUpdate={() => {}}
                          />
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default" className="bg-success text-success-foreground">
                        <EditableField
                          field="compliance-badge"
                          value="Excellent 9.1/10"
                          onUpdate={() => {}}
                        />
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { domain: 'Fiscal', status: 'excellent', score: 95, lastAudit: '2023-11' },
                      { domain: 'Social', status: 'good', score: 88, lastAudit: '2023-09' },
                      { domain: 'Environnemental', status: 'good', score: 92, lastAudit: '2023-10' },
                      { domain: 'RGPD', status: 'excellent', score: 96, lastAudit: '2023-12' },
                      { domain: 'Secteur spécifique', status: 'good', score: 89, lastAudit: '2023-08' }
                    ].slice(0, 3).map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {item.status === 'excellent' ? 
                              <CheckCircle className="h-4 w-4 text-success" /> : 
                              <CheckCircle className="h-4 w-4 text-primary" />
                            }
                            <EditableField
                              field={`compliance-domain-${index}`}
                              value={item.domain}
                              onUpdate={() => {}}
                              className="font-medium"
                            />
                          </div>
                          <Badge variant={item.status === 'excellent' ? 'default' : 'secondary'}>
                            <EditableField
                              field={`compliance-score-${index}`}
                              value={item.score}
                              onUpdate={() => {}}
                              type="number"
                            />/100
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Dernier audit: <EditableField
                            field={`compliance-audit-${index}`}
                            value={item.lastAudit}
                            onUpdate={() => {}}
                            className="inline"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Gouvernance & Management */}
              <Card>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">
                          <EditableField
                            field="governance-title"
                            value="Gouvernance & Management"
                            onUpdate={() => {}}
                          />
                        </CardTitle>
                        <CardDescription>
                          <EditableField
                            field="governance-desc"
                            value="Structure organisationnelle et processus de décision"
                            onUpdate={() => {}}
                          />
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="bg-primary-light text-primary">
                        <EditableField
                          field="governance-badge"
                          value="Très bon 8.7/10"
                          onUpdate={() => {}}
                        />
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary mb-2">
                        <EditableField
                          field="board-members"
                          value="7"
                          onUpdate={() => {}}
                          type="number"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <EditableField
                          field="board-label"
                          value="Conseil Administration"
                          onUpdate={() => {}}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-success mb-2">
                        <EditableField
                          field="management-team"
                          value="3"
                          onUpdate={() => {}}
                          type="number"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <EditableField
                          field="management-label"
                          value="Direction Générale"
                          onUpdate={() => {}}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-primary mb-2">
                        <EditableField
                          field="committees"
                          value="4"
                          onUpdate={() => {}}
                          type="number"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <EditableField
                          field="committees-label"
                          value="Comités spécialisés"
                          onUpdate={() => {}}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold mb-3">
                      <EditableField
                        field="key-indicators-title"
                        value="Indicateurs clés de gouvernance"
                        onUpdate={() => {}}
                      />
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <EditableField
                          field="independence-label"
                          value="Indépendance du conseil"
                          onUpdate={() => {}}
                        />
                        <Badge variant="secondary" className="bg-success-light text-success">
                          <EditableField
                            field="independence-score"
                            value="85%"
                            onUpdate={() => {}}
                          />
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <EditableField
                          field="transparency-label"
                          value="Transparence reporting"
                          onUpdate={() => {}}
                        />
                        <Badge variant="secondary" className="bg-primary-light text-primary">
                          <EditableField
                            field="transparency-score"
                            value="A+"
                            onUpdate={() => {}}
                          />
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <EditableField
                          field="risk-management-label"
                          value="Gestion des risques"
                          onUpdate={() => {}}
                        />
                        <Badge variant="secondary" className="bg-success-light text-success">
                          <EditableField
                            field="risk-management-score"
                            value="Robuste"
                            onUpdate={() => {}}
                          />
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                        <EditableField
                          field="ethics-label"
                          value="Code éthique"
                          onUpdate={() => {}}
                        />
                        <Badge variant="secondary" className="bg-primary-light text-primary">
                          <EditableField
                            field="ethics-score"
                            value="Formalisé"
                            onUpdate={() => {}}
                          />
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <PredictiveAnalysis />
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
                  {additionalFields.reports.map((report, index) => (
                    <Button key={index} className="w-full justify-start" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      <EditableField
                        field={`report-${index}`}
                        value={report}
                        onUpdate={(value) => {
                          const newReports = [...additionalFields.reports];
                          newReports[index] = value;
                          updateAdditionalField('reports', newReports);
                        }}
                      />
                    </Button>
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
                  {additionalFields.actions.map((action, index) => (
                    <Button key={index} className="w-full justify-start" variant="outline">
                      <Bell className="h-4 w-4 mr-2" />
                      <EditableField
                        field={`action-${index}`}
                        value={action}
                        onUpdate={(value) => {
                          const newActions = [...additionalFields.actions];
                          newActions[index] = value;
                          updateAdditionalField('actions', newActions);
                        }}
                      />
                    </Button>
                  ))}
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