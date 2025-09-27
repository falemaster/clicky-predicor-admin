import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertTriangle, BarChart3, CreditCard, Scale, Bot, RotateCw, Database, Gavel, FileText, Receipt, Building2, Shield } from "lucide-react";

interface LoadingStep {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'pending' | 'loading' | 'success' | 'error';
  duration?: number;
}

interface LoadingProgressProps {
  companyName?: string;
  siren?: string;
}

export default function LoadingProgress({ companyName, siren }: LoadingProgressProps) {
  const [steps, setSteps] = useState<LoadingStep[]>([
    {
      id: 'sirene',
      name: 'INSEE/SIRENE',
      description: 'Récupération des données officielles',
      icon: RotateCw,
      status: 'loading'
    },
    {
      id: 'sirius',
      name: 'SIRIUS',
      description: 'Données fiscales DGFiP',
      icon: Building2,
      status: 'pending'
    },
    {
      id: 'dgfip',
      name: 'DGFIP',
      description: 'Finances publiques',
      icon: Receipt,
      status: 'pending'
    },
    {
      id: 'ficoba',
      name: 'FICOBA',
      description: 'Fichier des comptes bancaires',
      icon: Database,
      status: 'pending'
    },
    {
      id: 'pappers',
      name: 'Pappers',
      description: 'Données financières et dirigeants',
      icon: BarChart3,
      status: 'pending'
    },
    {
      id: 'rubypayeur',
      name: 'Score Crédit/Finance',
      description: 'Analyse comportement paiement',
      icon: CreditCard,
      status: 'pending'
    },
    {
      id: 'infogreffe',
      name: 'Infogreffe',
      description: 'Procédures légales et greffes',
      icon: Scale,
      status: 'pending'
    },
    {
      id: 'portalis',
      name: 'Portalis',
      description: 'Données tribunaux et justice',
      icon: Gavel,
      status: 'pending'
    },
    {
      id: 'alpage',
      name: 'ALPAGE',
      description: 'Administration fiscale',
      icon: FileText,
      status: 'pending'
    },
    {
      id: 'opale',
      name: 'OPALE',
      description: 'Procédures administratives',
      icon: Shield,
      status: 'pending'
    },
    {
      id: 'ai-analysis',
      name: 'Analyse IA',
      description: 'Enrichissement et prédictions',
      icon: Bot,
      status: 'pending'
    }
  ]);

  useEffect(() => {
    // Simuler la progression des étapes
    const simulateProgress = async () => {
      const stepOrder = ['sirene', 'sirius', 'dgfip', 'ficoba', 'pappers', 'rubypayeur', 'infogreffe', 'portalis', 'alpage', 'opale', 'ai-analysis'];
      
      for (let i = 0; i < stepOrder.length; i++) {
        const currentStepId = stepOrder[i];
        const nextStepId = stepOrder[i + 1];
        
        // Démarrer l'étape suivante
        if (nextStepId) {
          setTimeout(() => {
            setSteps(prev => prev.map(step => 
              step.id === nextStepId 
                ? { ...step, status: 'loading' }
                : step
            ));
          }, (i + 1) * 1200);
        }
        
        // Compléter l'étape actuelle
        setTimeout(() => {
          setSteps(prev => prev.map(step => 
            step.id === currentStepId 
              ? { ...step, status: Math.random() > 0.1 ? 'success' : 'error' }
              : step
          ));
        }, (i + 1) * 1200 + 800);
      }
    };

    simulateProgress();
  }, []);

  const getStatusIcon = (status: LoadingStep['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  const getStatusBadge = (status: LoadingStep['status']) => {
    switch (status) {
      case 'loading':
        return <Badge variant="outline" className="text-primary border-primary">En cours</Badge>;
      case 'success':
        return <Badge variant="outline" className="text-success border-success">Terminé</Badge>;
      case 'error':
        return <Badge variant="outline" className="text-warning border-warning">Partiel</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">En attente</Badge>;
    }
  };

  const completedSteps = steps.filter(step => step.status === 'success').length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header avec info entreprise */}
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto">
            <BarChart3 className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Analyse en cours...
            </h1>
            {companyName && (
              <p className="text-lg text-muted-foreground">
                {companyName}
              </p>
            )}
            {siren && (
              <p className="text-sm text-muted-foreground">
                SIREN: {siren}
              </p>
            )}
          </div>
        </div>

        {/* Barre de progression globale */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progression globale</span>
                <span className="text-sm text-muted-foreground">{completedSteps}/{totalSteps}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Étapes détaillées */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sources de données</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-shrink-0">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <p className="text-sm font-medium text-foreground">{step.name}</p>
                      {getStatusBadge(step.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Message d'information */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Cette analyse peut prendre quelques instants.</p>
          <p>Nous collectons les données depuis plusieurs sources officielles.</p>
        </div>
      </div>
    </div>
  );
}