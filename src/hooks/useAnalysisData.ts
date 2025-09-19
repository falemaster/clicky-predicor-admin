import { useState, useEffect } from 'react';

export interface CompanyAnalysisData {
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

const defaultData: CompanyAnalysisData = {
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
};

export const useAnalysisData = () => {
  const [data, setData] = useState<CompanyAnalysisData>(defaultData);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  useEffect(() => {
    // Charger les données depuis localStorage
    const savedData = localStorage.getItem('analysis-data');
    const savedGenerated = localStorage.getItem('generated-analysis');

    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing saved analysis data:', error);
      }
    }

    if (savedGenerated) {
      try {
        setGeneratedContent(JSON.parse(savedGenerated));
      } catch (error) {
        console.error('Error parsing saved generated content:', error);
      }
    }
  }, []);

  const saveData = (newData: CompanyAnalysisData) => {
    setData(newData);
    localStorage.setItem('analysis-data', JSON.stringify(newData));
  };

  const saveGeneratedContent = (content: any) => {
    setGeneratedContent(content);
    localStorage.setItem('generated-analysis', JSON.stringify(content));
  };

  return {
    data,
    generatedContent,
    saveData,
    saveGeneratedContent,
    setData,
    setGeneratedContent
  };
};