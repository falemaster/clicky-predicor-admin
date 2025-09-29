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
import { VisibilityToggle } from "@/components/admin/VisibilityToggle";
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
            {mode === 'admin' && (
              <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Gestion de la visibilité - Vue d'ensemble</h3>
                <div className="space-y-2">
                  <VisibilityToggle
                    isVisible={enrichedData?.encartVisibility?.overview?.company_info !== false}
                    onToggle={(visible) => onEdit?.('encartVisibility.overview.company_info', visible)}
                    label="Informations entreprise"
                  />
                  <VisibilityToggle
                    isVisible={enrichedData?.encartVisibility?.overview?.scores !== false}
                    onToggle={(visible) => onEdit?.('encartVisibility.overview.scores', visible)}
                    label="Scores et surveillance"
                  />
                  <VisibilityToggle
                    isVisible={enrichedData?.encartVisibility?.overview?.data_quality !== false}
                    onToggle={(visible) => onEdit?.('encartVisibility.overview.data_quality', visible)}
                    label="Qualité des données"
                  />
                </div>
              </div>
            )}
            <OverviewDisplay 
              companyData={enrichedData} 
              scores={scores}
            />
          </TabsContent>

          <TabsContent value="study" className="space-y-6">
            {mode === 'admin' && (
              <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Gestion de la visibilité - Étude approfondie</h3>
                <div className="space-y-2">
                  <VisibilityToggle
                    isVisible={enrichedData?.encartVisibility?.study?.compliance !== false}
                    onToggle={(visible) => onEdit?.('encartVisibility.study.compliance', visible)}
                    label="Conformités et Obligations Légales"
                  />
                  <VisibilityToggle
                    isVisible={enrichedData?.encartVisibility?.study?.fiscal !== false}
                    onToggle={(visible) => onEdit?.('encartVisibility.study.fiscal', visible)}
                    label="Situation Fiscale"
                  />
                  <VisibilityToggle
                    isVisible={enrichedData?.encartVisibility?.study?.financial !== false}
                    onToggle={(visible) => onEdit?.('encartVisibility.study.financial', visible)}
                    label="Analyse Financière"
                  />
                  <VisibilityToggle
                    isVisible={enrichedData?.encartVisibility?.study?.economic !== false}
                    onToggle={(visible) => onEdit?.('encartVisibility.study.economic', visible)}
                    label="Contexte Économique"
                  />
                  <VisibilityToggle
                    isVisible={enrichedData?.encartVisibility?.study?.governance !== false}
                    onToggle={(visible) => onEdit?.('encartVisibility.study.governance', visible)}
                    label="Gouvernance"
                  />
                </div>
              </div>
            )}
            <StudyDisplay 
              companyData={enrichedData}
            />
          </TabsContent>

          <TabsContent value="predictive" className="space-y-6">
            {mode === 'admin' && (
              <div className="mb-4 p-4 bg-muted/30 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Gestion de la visibilité - Analyse prédictive</h3>
                <div className="space-y-2">
                  <VisibilityToggle
                    isVisible={enrichedData?.encartVisibility?.predictive?.risk_analysis !== false}
                    onToggle={(visible) => onEdit?.('encartVisibility.predictive.risk_analysis', visible)}
                    label="Analyse des risques"
                  />
                  <VisibilityToggle
                    isVisible={enrichedData?.encartVisibility?.predictive?.explanatory_factors !== false}
                    onToggle={(visible) => onEdit?.('encartVisibility.predictive.explanatory_factors', visible)}
                    label="Facteurs explicatifs"
                  />
                  <VisibilityToggle
                    isVisible={enrichedData?.encartVisibility?.predictive?.alerts !== false}
                    onToggle={(visible) => onEdit?.('encartVisibility.predictive.alerts', visible)}
                    label="Alertes & Recommandations"
                  />
                </div>
              </div>
            )}
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