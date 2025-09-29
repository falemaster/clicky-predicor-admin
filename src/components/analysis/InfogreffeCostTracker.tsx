import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfogreffeOptimizedService } from '@/services/infogreffeOptimized';
import { Euro, CreditCard, Clock, TrendingUp } from 'lucide-react';

interface InfogreffeCostTrackerProps {
  className?: string;
}

export const InfogreffeCostTracker = ({ className }: InfogreffeCostTrackerProps) => {
  const [costs, setCosts] = useState({ total_credits: 0, total_euros: 0, details: [] });
  const [loading, setLoading] = useState(true);

  const infogreffeService = InfogreffeOptimizedService.getInstance();

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const sessionCosts = await infogreffeService.getSessionCosts();
        setCosts(sessionCosts);
      } catch (error) {
        console.error('Failed to fetch session costs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCosts();
    
    // Refresh costs every 30 seconds
    const interval = setInterval(fetchCosts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Coûts Infogreffe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-32 mb-2"></div>
            <div className="h-4 bg-muted rounded w-24"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Coûts Infogreffe - Session
        </CardTitle>
        <CardDescription>
          Crédits consommés pendant cette session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium">{costs.total_credits} crédits</p>
              <p className="text-xs text-muted-foreground">Total consommé</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">€{costs.total_euros.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Coût total</p>
            </div>
          </div>
        </div>

        {costs.details.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Dernières requêtes
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {costs.details.slice(0, 5).map((detail: any, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {detail.endpoint}
                    </Badge>
                    <span className="text-muted-foreground">
                      {detail.siren}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{detail.credits_used}c</span>
                    <span className="text-muted-foreground">
                      €{parseFloat(detail.cost_euros).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {costs.total_credits === 0 && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Aucun crédit consommé dans cette session
          </p>
        )}
      </CardContent>
    </Card>
  );
};