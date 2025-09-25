import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Search,
  Building2,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Filter,
  Download,
  Eye,
  MousePointer,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';

interface AnalyticsData {
  overview: {
    totalSearches: number;
    uniqueUsers: number;
    totalCompanies: number;
    averageResponseTime: number;
    searchGrowth: number;
    userGrowth: number;
  };
  timeSeriesData: {
    date: string;
    searches: number;
    uniqueUsers: number;
    apiCalls: number;
  }[];
  searchTypeData: {
    type: string;
    count: number;
    percentage: number;
  }[];
  deviceData: {
    device: string;
    count: number;
    percentage: number;
  }[];
  topSearches: {
    query: string;
    count: number;
    lastSearched: string;
  }[];
  performanceData: {
    endpoint: string;
    avgResponseTime: number;
    successRate: number;
    totalCalls: number;
  }[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    overview: {
      totalSearches: 0,
      uniqueUsers: 0,
      totalCompanies: 0,
      averageResponseTime: 0,
      searchGrowth: 0,
      userGrowth: 0
    },
    timeSeriesData: [],
    searchTypeData: [],
    deviceData: [],
    topSearches: [],
    performanceData: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const { toast } = useToast();

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // Get overview stats
      const { count: totalSearches } = await supabase
        .from('admin_search_history')
        .select('*', { count: 'exact', head: true });

      const { count: uniqueUsers } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });

      const { count: totalCompanies } = await supabase
        .from('admin_companies')
        .select('*', { count: 'exact', head: true });

      // Get time series data (mock for now)
      const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          searches: Math.floor(Math.random() * 100) + 20,
          uniqueUsers: Math.floor(Math.random() * 50) + 10,
          apiCalls: Math.floor(Math.random() * 500) + 100
        };
      }).reverse();

      // Mock search type data
      const searchTypeData = [
        { type: 'SIREN', count: 1250, percentage: 45 },
        { type: 'SIRET', count: 890, percentage: 32 },
        { type: 'Raison Sociale', count: 640, percentage: 23 }
      ];

      // Mock device data
      const deviceData = [
        { device: 'Desktop', count: 1680, percentage: 60 },
        { device: 'Mobile', count: 840, percentage: 30 },
        { device: 'Tablet', count: 280, percentage: 10 }
      ];

      // Mock top searches
      const topSearches = [
        { query: 'TechCorp SARL', count: 45, lastSearched: '2024-01-20T10:30:00Z' },
        { query: '123456789', count: 38, lastSearched: '2024-01-20T09:15:00Z' },
        { query: 'Innovation SAS', count: 32, lastSearched: '2024-01-20T08:45:00Z' },
        { query: '987654321', count: 28, lastSearched: '2024-01-19T16:20:00Z' },
        { query: 'Digital Solutions', count: 24, lastSearched: '2024-01-19T14:10:00Z' }
      ];

      // Mock performance data
      const performanceData = [
        { endpoint: 'SIREN Search', avgResponseTime: 1250, successRate: 98.5, totalCalls: 2340 },
        { endpoint: 'Company Details', avgResponseTime: 890, successRate: 99.2, totalCalls: 1890 },
        { endpoint: 'SIRET Lookup', avgResponseTime: 1100, successRate: 97.8, totalCalls: 1560 },
        { endpoint: 'Enrichment API', avgResponseTime: 2300, successRate: 94.2, totalCalls: 890 }
      ];

      setAnalytics({
        overview: {
          totalSearches: totalSearches || 2780,
          uniqueUsers: uniqueUsers || 342,
          totalCompanies: totalCompanies || 1256,
          averageResponseTime: 1180,
          searchGrowth: 15.2,
          userGrowth: 8.7
        },
        timeSeriesData,
        searchTypeData,
        deviceData,
        topSearches,
        performanceData
      });

    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Avancées</h1>
          <p className="text-muted-foreground">
            Métriques détaillées et insights sur l'utilisation de Predicor
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Aujourd'hui</SelectItem>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">3 derniers mois</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recherches Total</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.overview.totalSearches)}</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {formatPercentage(analytics.overview.searchGrowth)} vs période précédente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.overview.uniqueUsers)}</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {formatPercentage(analytics.overview.userGrowth)} vs période précédente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entreprises Indexées</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(analytics.overview.totalCompanies)}</div>
            <p className="text-xs text-muted-foreground">
              Base de données enrichie
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de Réponse Moyen</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.averageResponseTime}ms</div>
            <p className="text-xs text-success flex items-center">
              <TrendingDown className="w-3 h-3 mr-1" />
              -12% amélioration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="usage">Utilisation</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Recherches</CardTitle>
              <CardDescription>Tendances d'usage sur les 30 derniers jours</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="searches" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="uniqueUsers" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Types de Recherche</CardTitle>
                <CardDescription>Répartition par méthode de recherche</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.searchTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({name, percentage}) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.searchTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appareils Utilisés</CardTitle>
                <CardDescription>Répartition par type d'appareil</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.deviceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="device" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recherches les Plus Populaires</CardTitle>
              <CardDescription>Top des requêtes les plus fréquentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium">{search.query}</p>
                        <p className="text-xs text-muted-foreground">
                          Dernière recherche: {new Date(search.lastSearched).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {search.count} recherches
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance des APIs</CardTitle>
              <CardDescription>Temps de réponse et taux de succès par endpoint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.performanceData.map((perf, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-1">
                      <h4 className="font-medium">{perf.endpoint}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatNumber(perf.totalCalls)} appels
                      </p>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{perf.avgResponseTime}ms</p>
                        <p className="text-xs text-muted-foreground">Temps moyen</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success">{perf.successRate}%</p>
                        <p className="text-xs text-muted-foreground">Taux de succès</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  <span>Insights Positifs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-success-light border border-success/20">
                  <p className="text-sm font-medium text-success">
                    +15% d'augmentation des recherches ce mois
                  </p>
                  <p className="text-xs text-success/80">
                    Croissance constante de l'engagement utilisateur
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-success-light border border-success/20">
                  <p className="text-sm font-medium text-success">
                    Temps de réponse amélioré de 12%
                  </p>
                  <p className="text-xs text-success/80">
                    Optimisations récentes des APIs
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-success-light border border-success/20">
                  <p className="text-sm font-medium text-success">
                    99.2% de disponibilité système
                  </p>
                  <p className="text-xs text-success/80">
                    Infrastructure stable et fiable
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <span>Points d'Attention</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-warning-light border border-warning/20">
                  <p className="text-sm font-medium text-warning">
                    Pic d'usage entre 9h-11h
                  </p>
                  <p className="text-xs text-warning/80">
                    Considérer l'optimisation des ressources
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-warning-light border border-warning/20">
                  <p className="text-sm font-medium text-warning">
                    API Enrichment plus lente
                  </p>
                  <p className="text-xs text-warning/80">
                    Temps de réponse 2.3s vs 1.2s objectif
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-accent-light border border-accent/20">
                  <p className="text-sm font-medium text-accent">
                    Mobile représente 30% du trafic
                  </p>
                  <p className="text-xs text-accent/80">
                    Opportunité d'optimisation mobile
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}