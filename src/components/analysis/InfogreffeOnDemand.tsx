import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfogreffeOptimizedService } from '@/services/infogreffeOptimized';
import { 
  Users, 
  FileText, 
  PieChart, 
  TrendingUp, 
  AlertTriangle,
  CreditCard,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InfogreffeOnDemandProps {
  siren: string;
  onDataFetched?: (endpoint: string, data: any) => void;
  className?: string;
}

export const InfogreffeOnDemand = ({ siren, onDataFetched, className }: InfogreffeOnDemandProps) => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const infogreffeService = InfogreffeOptimizedService.getInstance();

  const endpoints = [
    {
      key: 'representants',
      title: 'Représentants & Dirigeants',
      description: 'Liste des dirigeants et représentants légaux',
      icon: Users,
      cost: infogreffeService.getEndpointCost('representants'),
      handler: () => infogreffeService.getRepresentants(siren)
    },
    {
      key: 'comptesannuels',
      title: 'Comptes Annuels',
      description: 'Données financières détaillées (dernière année)',
      icon: FileText,
      cost: infogreffeService.getEndpointCost('comptesannuels'),
      handler: () => infogreffeService.getComptesAnnuels(siren)
    },
    {
      key: 'repartitioncapital',
      title: 'Répartition du Capital',
      description: 'Structure actionnariale et associés',
      icon: PieChart,
      cost: infogreffeService.getEndpointCost('repartitioncapital'),
      handler: () => infogreffeService.getRepartitionCapital(siren)
    },
    {
      key: 'notapme-essentiel',
      title: 'Diagnostic Financier (Essentiel)',
      description: 'Ratios financiers et analyse de performance',
      icon: TrendingUp,
      cost: infogreffeService.getEndpointCost('notapme-essentiel'),
      handler: () => infogreffeService.getNotapmeEssentiel(siren),
      premium: true
    },
    {
      key: 'notapme-performance',
      title: 'Diagnostic Financier (Performance)',
      description: 'Analyse financière complète et prédictive',
      icon: TrendingUp,
      cost: infogreffeService.getEndpointCost('notapme-performance'),
      handler: () => infogreffeService.getNotapmePerformance(siren),
      premium: true
    },
    {
      key: 'afdcc',
      title: 'Score de Risque AFDCC',
      description: 'Évaluation du risque de défaillance',
      icon: AlertTriangle,
      cost: infogreffeService.getEndpointCost('afdcc'),
      handler: () => infogreffeService.getAfdccScore(siren),
      premium: true
    }
  ];

  const handleFetchData = async (endpoint: any) => {
    setLoading(prev => ({ ...prev, [endpoint.key]: true }));
    setErrors(prev => ({ ...prev, [endpoint.key]: '' }));

    try {
      const result = await endpoint.handler();
      
      if (result.error) {
        setErrors(prev => ({ ...prev, [endpoint.key]: result.error.message }));
        toast({
          title: "Erreur",
          description: result.error.message,
          variant: "destructive"
        });
      } else {
        setData(prev => ({ ...prev, [endpoint.key]: result.data }));
        onDataFetched?.(endpoint.key, result.data);
        toast({
          title: "Données récupérées",
          description: `${endpoint.title} - ${result.cost.credits} crédits utilisés (€${result.cost.euros.toFixed(2)})`,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setErrors(prev => ({ ...prev, [endpoint.key]: errorMessage }));
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, [endpoint.key]: false }));
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Données Infogreffe À la Demande
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Les données ci-dessous sont payantes. Le coût en crédits est affiché pour chaque requête.
          </AlertDescription>
        </Alert>

        <div className="grid gap-3">
          {endpoints.map((endpoint) => (
            <div 
              key={endpoint.key}
              className={`border rounded-lg p-4 ${endpoint.premium ? 'border-amber-200 bg-amber-50/50' : 'border-border'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <endpoint.icon className={`h-5 w-5 ${endpoint.premium ? 'text-amber-600' : 'text-primary'}`} />
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {endpoint.title}
                      {endpoint.premium && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                          Premium
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">{endpoint.cost.credits} crédits</p>
                    <p className="text-xs text-muted-foreground">€{endpoint.cost.euros.toFixed(2)}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleFetchData(endpoint)}
                    disabled={loading[endpoint.key] || !!data[endpoint.key]}
                    variant={data[endpoint.key] ? "secondary" : "default"}
                  >
                    {loading[endpoint.key] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : data[endpoint.key] ? (
                      'Récupéré'
                    ) : (
                      'Récupérer'
                    )}
                  </Button>
                </div>
              </div>
              
              {errors[endpoint.key] && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors[endpoint.key]}</AlertDescription>
                </Alert>
              )}
              
              {data[endpoint.key] && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                  ✅ Données récupérées avec succès
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};