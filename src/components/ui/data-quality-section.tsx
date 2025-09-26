import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle 
} from "lucide-react";

interface DataQualityConfig {
  completeness: number;
  lastUpdate: string;
  apis: {
    [key: string]: {
      status: 'active' | 'warning' | 'inactive';
      label: string;
      category: string;
    };
  };
  overallStatus: string;
  isVisible?: boolean;
}

interface DataQualitySectionProps {
  config?: DataQualityConfig;
  className?: string;
}

// Configuration par défaut
const defaultConfig: DataQualityConfig = {
  completeness: 85,
  lastUpdate: new Date().toISOString(),
  apis: {
    insee: { status: 'active', label: 'INSEE/SIRENE', category: 'Données officielles' },
    pappers: { status: 'active', label: 'Pappers API', category: 'Données financières' },
    rubypayeur: { status: 'active', label: 'RubyPayeur', category: 'Score crédit' },
    infogreffe: { status: 'active', label: 'Infogreffe', category: 'Données juridiques' },
    ai_enrichment: { status: 'warning', label: 'IA Enrichissement', category: 'Données simulées' },
    sirius: { status: 'active', label: 'SIRIUS', category: 'Données fiscales' },
    dgfip: { status: 'active', label: 'DGFIP', category: 'Données fiscales' },
    portalis: { status: 'active', label: 'PORTALIS', category: 'Données judiciaires' },
    opale: { status: 'active', label: 'OPALE', category: 'Données sociales' }
  },
  overallStatus: 'Données fiables',
  isVisible: true
};

const getStatusIcon = (status: 'active' | 'warning' | 'inactive') => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-3 w-3 text-success" />;
    case 'warning':
      return <AlertTriangle className="h-3 w-3 text-warning" />;
    case 'inactive':
      return <XCircle className="h-3 w-3 text-destructive" />;
    default:
      return <CheckCircle className="h-3 w-3 text-success" />;
  }
};

const formatLastUpdate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `Mis à jour il y a ${diffMinutes}min`;
    } else if (diffMinutes < 1440) {
      const hours = Math.floor(diffMinutes / 60);
      return `Mis à jour il y a ${hours}h`;
    } else {
      const days = Math.floor(diffMinutes / 1440);
      return `Mis à jour il y a ${days}j`;
    }
  } catch {
    return "Mis à jour récemment";
  }
};

export const DataQualitySection: React.FC<DataQualitySectionProps> = ({ 
  config = defaultConfig,
  className = ""
}) => {
  // Fusionner la configuration par défaut avec la configuration fournie
  const mergedConfig = {
    ...defaultConfig,
    ...config,
    apis: { ...defaultConfig.apis, ...config?.apis }
  };

  if (mergedConfig.isVisible === false) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Qualité des données
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barre de progression complétude */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Complétude des données</span>
            <span className="text-muted-foreground">{mergedConfig.completeness}%</span>
          </div>
          <Progress 
            value={mergedConfig.completeness} 
            className="h-2"
            style={{
              background: 'hsl(var(--muted))'
            }}
          />
        </div>

        {/* Dernière mise à jour */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatLastUpdate(mergedConfig.lastUpdate)}</span>
        </div>

        {/* Grid des APIs */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(mergedConfig.apis).map(([key, api]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2">
                {getStatusIcon(api.status)}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{api.label}</span>
                  <span className="text-xs text-muted-foreground">{api.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statut global */}
        <div className="flex items-center justify-center">
          <Badge 
            variant="secondary" 
            className="bg-success-light text-success border border-success/20 px-4 py-2"
          >
            <CheckCircle className="h-3 w-3 mr-2" />
            {mergedConfig.overallStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataQualitySection;