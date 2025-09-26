import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Database, Clock, Shield } from "lucide-react";

interface DataQualitySource {
  name: string;
  description: string;
  status: 'operational' | 'warning' | 'error';
}

interface DataQualitySectionProps {
  data?: any;
  showEditableLabels?: boolean;
}

export function DataQualitySection({ data, showEditableLabels = false }: DataQualitySectionProps) {
  const defaultSources: DataQualitySource[] = [
    { name: 'INSEE/SIRENE', description: 'Données officielles', status: 'operational' },
    { name: 'INFOGREFFE', description: 'Données greffes', status: 'operational' },
    { name: 'PAPPERS', description: 'Données financières', status: 'operational' },
    { name: 'BODACC', description: 'Annonces légales', status: 'operational' },
    { name: 'RUBYPAYEUR', description: 'Score crédit', status: 'operational' },
    { name: 'SIRIUS', description: 'Données Banque de France', status: 'operational' },
    { name: 'DGFIP', description: 'Données fiscales', status: 'operational' },
    { name: 'PORTALIS', description: 'Données judiciaires', status: 'operational' },
    { name: 'IA Enrichissement', description: 'Données simulées', status: 'warning' }
  ];

  const sources = data?.enriched?.dataQuality?.sources ? 
    Object.values(data.enriched.dataQuality.sources).map((source: any) => ({
      name: source.name,
      description: source.description,
      status: source.status || 'operational'
    })) : defaultSources;

  const completeness = data?.enriched?.dataQuality?.completeness?.percentage || 85;
  const overallStatus = data?.enriched?.dataQuality?.overall?.status || 'Données fiables';
  const overallDescription = data?.enriched?.dataQuality?.overall?.description || 'Mix données officielles + enrichissement IA';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-primary/5';
      case 'warning':
        return 'bg-warning/5';
      case 'error':
        return 'bg-destructive/5';
      default:
        return 'bg-primary/5';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Qualité des données
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Data Completeness */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <span className="text-sm font-medium">Complétude des données</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success" style={{ width: `${completeness}%` }}></div>
              </div>
              <span className="text-sm font-semibold text-success">{completeness}%</span>
            </div>
          </div>

          {/* Data Freshness */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Dernière mise à jour</span>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              {new Date().toLocaleDateString('fr-FR')}
            </Badge>
          </div>

          {/* Data Sources Status */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {sources.map((source, index) => (
              <div key={index} className={`flex items-center space-x-2 p-2 rounded-lg ${getStatusBg(source.status)}`}>
                {getStatusIcon(source.status)}
                <div>
                  <p className="text-xs font-medium">{source.name}</p>
                  <p className="text-xs text-muted-foreground">{source.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Status */}
          <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="h-4 w-4 text-success" />
              <div>
                <p className="text-sm font-semibold text-success">{overallStatus}</p>
                <p className="text-xs text-muted-foreground">{overallDescription}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Entreprise Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}