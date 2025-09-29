/**
 * ⚠️ COMPOSANT PARTAGÉ - SOURCE UNIQUE DE VÉRITÉ ⚠️
 * 
 * Ce composant contient l'UI complète de la page de résultats d'entreprise.
 * Il est utilisé IDENTIQUEMENT par:
 * - Analysis.tsx (mode user: lecture seule)
 * - CompanyWYSIWYGEditor.tsx (mode admin: avec capacités d'édition)
 * 
 * 🚫 NE JAMAIS modifier l'UI dans les fichiers wrappers !
 * ✅ Toute modification d'UI doit se faire ici pour garantir la synchronisation
 */

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewDisplay } from "@/components/analysis/OverviewDisplay";
import { StudyDisplay } from "@/components/analysis/StudyDisplay";
import PredictiveAnalysis from "@/components/predictive/PredictiveAnalysis";
import { RESULT_TABS } from "./resultTabs";
import { EditingProvider } from "./EditingContext";
import type { DisplayCompanyData, DisplayScores, DisplayEnrichedData } from "@/utils/buildCompanyDisplay";

export interface ResultPageProps {
  mode: 'user' | 'admin';
  companyData: DisplayCompanyData;
  scores: DisplayScores;
  enrichedData: DisplayEnrichedData;
  loading?: boolean;
  errors?: Array<{ source: string; message: string }>;
  onEdit?: (field: string, value: any) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function ResultPage({
  mode,
  companyData,
  scores,
  enrichedData,
  loading = false,
  errors = [],
  onEdit,
  activeTab = RESULT_TABS[0].key,
  onTabChange
}: ResultPageProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(activeTab);

  const handleTabChange = (tab: string) => {
    setInternalActiveTab(tab);
    onTabChange?.(tab);
  };

  const currentTab = onTabChange ? activeTab : internalActiveTab;

  return (
    <EditingProvider mode={mode} onEdit={onEdit}>
      <div className="w-full">
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            {RESULT_TABS.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewDisplay 
              companyData={enrichedData} 
              scores={scores}
            />
          </TabsContent>

          <TabsContent value="study" className="space-y-6">
            <StudyDisplay 
              companyData={enrichedData}
            />
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            <PredictiveAnalysis 
              companyData={enrichedData}
              scores={scores}
            />
          </TabsContent>
        </Tabs>

        {/* Debug info pour le mode admin */}
        {mode === 'admin' && process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            Mode: {mode} | Onglet actif: {currentTab} | Édition: {onEdit ? 'activée' : 'désactivée'}
          </div>
        )}
      </div>
    </EditingProvider>
  );
}