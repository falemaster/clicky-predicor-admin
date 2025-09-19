import { useState, useEffect } from 'react';

export interface CompanyConfig {
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

export interface GeneratedContent {
  heroTitle: string;
  heroSubtitle: string;
  features: Array<{
    title: string;
    description: string;
    benefits: string[];
  }>;
  demoData: {
    companyExample: string;
    metrics: {
      revenue: string;
      growth: string;
      risk: string;
      score: string;
    };
    riskFactors: string[];
  };
}

const defaultConfig: CompanyConfig = {
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
};

const defaultContent: GeneratedContent = {
  heroTitle: 'Predicor - Analyse prédictive des risques d\'entreprise',
  heroSubtitle: 'Anticipez les risques, optimisez vos décisions avec notre plateforme d\'analyse avancée',
  features: [
    {
      title: 'Analyse prédictive',
      description: 'Algorithmes avancés pour anticiper les risques financiers',
      benefits: ['Prédictions précises', 'Modèles adaptatifs', 'Analyses en temps réel']
    },
    {
      title: 'Évaluation des risques',
      description: 'Évaluation complète de la santé financière des entreprises',
      benefits: ['Scoring automatisé', 'Rapports détaillés', 'Alertes personnalisées']
    },
    {
      title: 'Surveillance continue',
      description: 'Monitoring permanent des indicateurs clés',
      benefits: ['Surveillance 24/7', 'Notifications instantanées', 'Tableaux de bord']
    }
  ],
  demoData: {
    companyExample: 'TechCorp Solutions',
    metrics: {
      revenue: '2.5M€',
      growth: '+15%',
      risk: 'Modéré',
      score: '7.2/10'
    },
    riskFactors: ['Volatilité du marché', 'Réglementation', 'Concurrence']
  }
};

export const useAdminConfig = () => {
  const [config, setConfig] = useState<CompanyConfig>(defaultConfig);
  const [content, setContent] = useState<GeneratedContent>(defaultContent);

  useEffect(() => {
    // Charger la configuration depuis localStorage
    const savedConfig = localStorage.getItem('admin-config');
    const savedContent = localStorage.getItem('generated-content');

    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Error parsing saved config:', error);
      }
    }

    if (savedContent) {
      try {
        setContent(JSON.parse(savedContent));
      } catch (error) {
        console.error('Error parsing saved content:', error);
      }
    }
  }, []);

  const saveConfig = (newConfig: CompanyConfig) => {
    setConfig(newConfig);
    localStorage.setItem('admin-config', JSON.stringify(newConfig));
  };

  const saveContent = (newContent: GeneratedContent) => {
    setContent(newContent);
    localStorage.setItem('generated-content', JSON.stringify(newContent));
  };

  return {
    config,
    content,
    saveConfig,
    saveContent,
    setConfig,
    setContent
  };
};