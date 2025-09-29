/**
 * Configuration partagée des onglets de la page de résultats
 * ⚠️ Ne modifiez jamais cette configuration sans impact sur TOUTES les vues (user et admin)
 * Les deux pages (Analysis.tsx et CompanyWYSIWYGEditor.tsx) utilisent cette même configuration
 */

export interface ResultTab {
  key: string;
  label: string;
}

export const RESULT_TABS: ResultTab[] = [
  { key: 'overview', label: 'Vue d\'ensemble' },
  { key: 'study', label: 'Étude approfondie' },
  { key: 'predictive', label: 'Analyse prédictive' }
];

// Vérification de cohérence pour éviter les erreurs de synchronisation
export const getTabByKey = (key: string): ResultTab | undefined => {
  return RESULT_TABS.find(tab => tab.key === key);
};

export const getDefaultTab = (): string => {
  return RESULT_TABS[0]?.key || 'overview';
};