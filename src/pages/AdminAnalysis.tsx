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
  Loader2
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
    
    // Simulation de génération IA basée sur les scores
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Logique d'extrapolation basée sur les scores
    const globalScore = tempData.scores.global;
    let updatedData = { ...tempData };
    
    // Adapter le contenu selon le score global
    if (globalScore >= 8) {
      // Entreprise en excellente santé
      updatedData.scores.defaultRisk = 'Très faible';
      updatedData.riskProfile = 'faible';
    } else if (globalScore >= 6) {
      // Entreprise stable
      updatedData.scores.defaultRisk = 'Faible';
      updatedData.riskProfile = 'modere';
    } else if (globalScore >= 4) {
      // Entreprise en difficulté modérée
      updatedData.scores.defaultRisk = 'Modéré';
      updatedData.riskProfile = 'modere';
    } else {
      // Entreprise en grande difficulté
      updatedData.scores.defaultRisk = 'Élevé';
      updatedData.riskProfile = 'eleve';
    }

    setTempData(updatedData);
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
                    value="Résultats stables avec une croissance du CA de +12% sur l'exercice."
                    onUpdate={() => {}} // TODO: Add to data structure
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
                    value="Excellent respect des obligations légales et réglementaires."
                    onUpdate={() => {}} // TODO: Add to data structure
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
                    value="Probabilité de défaillance inférieure à 5% sur 12 mois."
                    onUpdate={() => {}} // TODO: Add to data structure
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
                    value="Tech Solutions France présente un profil d'entreprise solide avec une croissance soutenue et une gestion financière équilibrée. L'entreprise respecte ses obligations légales et fiscales, avec un historique de paiement exemplaire. Le léger retard URSSAF identifié reste mineur et ne constitue pas un facteur de risque significatif. Le secteur d'activité est porteur et l'entreprise bénéficie d'une position concurrentielle favorable."
                    onUpdate={() => {}} // TODO: Add to data structure
                    className="text-sm leading-relaxed w-full"
                    multiline
                  />
                </div>
              </CardContent>
            </Card>

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
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Section d'étude approfondie - En cours de développement</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Section d'analyse prédictive - En cours de développement</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Section rapports et actions - En cours de développement</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAnalysis;