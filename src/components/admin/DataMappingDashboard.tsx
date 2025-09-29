import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  Layers, 
  Activity, 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Edit,
  RotateCcw
} from "lucide-react";
import { useCompanyData } from "@/hooks/useCompanyData";
import { supabase } from "@/integrations/supabase/client";

interface DataSourceInfo {
  name: string;
  icon: any;
  color: string;
  priority: number;
  fields: string[];
  status: 'active' | 'fallback' | 'error';
}

type StatusType = 'active' | 'fallback' | 'error';

interface MappingRule {
  field: string;
  sources: DataSourceInfo[];
  currentValue: any;
  fallbackChain: string[];
  isVisible: boolean;
  isEditable: boolean;
}

interface EditLog {
  id: string;
  field_changed: string;
  old_value: any;
  new_value: any;
  change_type: string;
  created_at: string;
  user_agent?: string;
}

export function DataMappingDashboard() {
  const { siren } = useParams();
  const { data: companyData, loading } = useCompanyData({ siren, autoFetch: true });
  const [editLogs, setEditLogs] = useState<EditLog[]>([]);
  const [mappingRules, setMappingRules] = useState<MappingRule[]>([]);

  // Fonction pour déterminer le statut d'une source API
  const getAPIStatus = (source: string): StatusType => {
    if (!companyData) return 'error';

    // Vérifier s'il y a des erreurs spécifiques pour cette source
    const hasError = companyData.errors?.some(error => 
      error.source?.toLowerCase().includes(source.toLowerCase())
    );
    if (hasError) return 'error';

    switch (source) {
      case 'admin':
        return companyData?.enriched?.adminScores ? 'active' : 'fallback';
      
      case 'sirene':
        return companyData?.sirene?.siren ? 'active' : 'error';
      
      case 'pappers':
        // Pappers peut avoir des données même sans dirigeants
        return companyData?.pappers?.siren ? 'active' : 'error';
      
      case 'infogreffe':
        // Vérifier si Infogreffe a des données réelles (pas juste un objet vide)
        const infogreffeData = companyData?.infogreffe;
        const hasInfogreffeData = infogreffeData && (
          infogreffeData.comptes?.length > 0 ||
          infogreffeData.procedures?.length > 0 ||
          infogreffeData.siren !== undefined
        );
        return hasInfogreffeData ? 'active' : 'fallback';
      
      case 'bodacc':
        // Bodacc peut avoir des records vides, c'est normal
        const bodaccData = companyData?.bodacc;
        return bodaccData ? 'active' : 'fallback';
      
      default:
        return 'error';
    }
  };

  const dataSources: DataSourceInfo[] = [
    {
      name: "Données Admin",
      icon: Edit,
      color: "bg-purple-500",
      priority: 1,
      fields: ["company_name", "activity", "address", "scores", "financial_data"],
      status: getAPIStatus('admin')
    },
    {
      name: "API Sirene",
      icon: Database,
      color: "bg-blue-500",
      priority: 2,
      fields: ["company_name", "siret", "naf_code", "legal_form", "activity"],
      status: getAPIStatus('sirene')
    },
    {
      name: "API Pappers",
      icon: Layers,
      color: "bg-green-500",
      priority: 3,
      fields: ["financial_data", "dirigeants", "effectifs", "creation_date"],
      status: getAPIStatus('pappers')
    },
    {
      name: "API Infogreffe",
      icon: Activity,
      color: "bg-orange-500",
      priority: 4,
      fields: ["bilans", "comptes", "procedures", "score_infogreffe"],
      status: getAPIStatus('infogreffe')
    },
    {
      name: "API Bodacc",
      icon: Clock,
      color: "bg-red-500",
      priority: 5,
      fields: ["procedures_collectives", "annonces", "events"],
      status: getAPIStatus('bodacc')
    }
  ];

  // Charger les logs d'édition
  useEffect(() => {
    if (!siren) return;

    const loadEditLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_edit_logs')
          .select('*')
          .eq('siren', siren)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setEditLogs(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des logs:', error);
      }
    };

    loadEditLogs();
  }, [siren]);

  // Générer les règles de mapping
  useEffect(() => {
    if (!companyData) return;

    const generateMappingRules = (): MappingRule[] => {
      const fields = [
        { field: 'company_name', path: 'sirene.denomination' },
        { field: 'activity', path: 'pappers.libelleNaf' },
        { field: 'address', path: 'sirene.adresse' },
        { field: 'siret', path: 'sirene.siret' },
        { field: 'naf_code', path: 'sirene.naf' },
        { field: 'dirigeants', path: 'pappers.dirigeants' },
        { field: 'financial_data', path: 'pappers.bilans' },
        { field: 'score_predictor', path: 'predictor.score' },
        { field: 'score_infogreffe', path: 'infogreffe.score' },
      ];

      return fields.map(({ field, path }) => {
        const availableSources = dataSources.filter(source => 
          source.fields.includes(field) && source.status === 'active'
        );

        const getValue = (obj: any, path: string) => {
          return path.split('.').reduce((curr, prop) => curr?.[prop], obj);
        };

        return {
          field,
          sources: availableSources,
          currentValue: getValue(companyData, path),
          fallbackChain: availableSources.map(s => s.name),
          isVisible: !!getValue(companyData, path),
          isEditable: true
        };
      });
    };

    setMappingRules(generateMappingRules());
  }, [companyData]);

  const getSourceIcon = (source: DataSourceInfo) => {
    const Icon = source.icon;
    return <Icon className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: { 
        variant: "default" as const, 
        icon: CheckCircle2, 
        color: "text-green-600",
        label: "Actif",
        description: "API fonctionnelle avec données"
      },
      fallback: { 
        variant: "secondary" as const, 
        icon: AlertCircle, 
        color: "text-yellow-600",
        label: "Aucune donnée",
        description: "API fonctionnelle mais sans données pour cette entreprise"
      },
      error: { 
        variant: "destructive" as const, 
        icon: XCircle, 
        color: "text-red-600",
        label: "Erreur",
        description: "Erreur lors de l'appel API"
      }
    };

    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;

    return (
      <Tooltip>
        <TooltipTrigger>
          <Badge variant={config.variant} className="text-xs">
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.description}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Mapping Dashboard</h1>
          <p className="text-muted-foreground">
            Visualisation complète des sources de données et règles d'affichage pour {siren}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Temps réel
        </Badge>
      </div>

      <Tabs defaultValue="mapping" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mapping">Mapping des Données</TabsTrigger>
          <TabsTrigger value="sources">Sources & Statuts</TabsTrigger>
          <TabsTrigger value="rules">Règles d'Affichage</TabsTrigger>
          <TabsTrigger value="logs">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Mapping par Champ
              </CardTitle>
              <CardDescription>
                Visualisation des sources de données utilisées pour chaque champ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {mappingRules.map((rule) => (
                    <Card key={rule.field} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{rule.field}</h3>
                            {rule.isVisible ? (
                              <Eye className="h-4 w-4 text-green-600" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <Badge variant={rule.currentValue ? "default" : "destructive"}>
                            {rule.currentValue ? "Valeur présente" : "Pas de valeur"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Sources disponibles:</h4>
                            <div className="space-y-2">
                              {rule.sources.map((source, index) => (
                                <div key={source.name} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                                    {getSourceIcon(source)}
                                    <span className="text-sm font-medium">{source.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      Priorité {source.priority}
                                    </Badge>
                                  </div>
                                  {getStatusBadge(source.status)}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Valeur actuelle:</h4>
                            <div className="p-3 rounded-lg bg-accent">
                              <code className="text-sm">
                                {rule.currentValue ? 
                                  (typeof rule.currentValue === 'object' ? 
                                    JSON.stringify(rule.currentValue, null, 2) : 
                                    rule.currentValue
                                  ) : 
                                  'Aucune valeur'
                                }
                              </code>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <h4 className="text-sm font-medium mb-2">Chaîne de fallback:</h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            {rule.fallbackChain.map((source, index) => (
                              <div key={index} className="flex items-center gap-1">
                                <Badge variant="outline" className="text-xs">{source}</Badge>
                                {index < rule.fallbackChain.length - 1 && (
                                  <span className="text-muted-foreground">→</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSources.map((source) => (
              <Card key={source.name} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                      {getSourceIcon(source)}
                      <CardTitle className="text-lg">{source.name}</CardTitle>
                    </div>
                    {getStatusBadge(source.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="text-xs">
                        Priorité {source.priority}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Champs disponibles:</h4>
                      <div className="flex flex-wrap gap-1">
                        {source.fields.map((field) => (
                          <Badge key={field} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Règles d'Affichage Actives
              </CardTitle>
              <CardDescription>
                Configuration des règles de priorité et de fallback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Règle principale:</strong> Les données Admin ont toujours la priorité la plus élevée (priorité 1)
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Fallback intelligent:</strong> Si une source n'est pas disponible, le système utilise automatiquement la source suivante dans l'ordre de priorité
                  </AlertDescription>
                </Alert>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Champs floutés:</strong> Un champ est flouté si aucune source n'a de valeur disponible pour ce champ
                  </AlertDescription>
                </Alert>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Ordre de priorité des sources:</h3>
                  <div className="space-y-2">
                    {dataSources.sort((a, b) => a.priority - b.priority).map((source) => (
                      <div key={source.name} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{source.priority}</Badge>
                          <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                          {getSourceIcon(source)}
                          <span className="font-medium">{source.name}</span>
                        </div>
                        {getStatusBadge(source.status)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Historique des Modifications
              </CardTitle>
              <CardDescription>
                Toutes les modifications apportées aux données (temps réel)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {editLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucune modification enregistrée pour cette entreprise
                  </div>
                ) : (
                  <div className="space-y-3">
                    {editLogs.map((log) => (
                      <Card key={log.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {log.change_type}
                              </Badge>
                              <span className="font-medium">{log.field_changed}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-red-600">Ancienne valeur:</span>
                              <div className="mt-1 p-2 rounded bg-red-50 border">
                                <code>{log.old_value || 'null'}</code>
                              </div>
                            </div>
                            <div>
                              <span className="font-medium text-green-600">Nouvelle valeur:</span>
                              <div className="mt-1 p-2 rounded bg-green-50 border">
                                <code>{log.new_value || 'null'}</code>
                              </div>
                            </div>
                          </div>

                          {log.user_agent && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Navigateur: {log.user_agent.substring(0, 100)}...
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}