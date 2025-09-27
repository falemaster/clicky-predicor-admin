import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building2, 
  Search, 
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Eye,
  Edit3,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalCompanies: number;
  totalSearches: number;
  todaySearches: number;
  editedCompanies: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'search' | 'user_register' | 'company_edit';
  description: string;
  timestamp: string;
  user?: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalCompanies: 0,
    totalSearches: 0,
    todaySearches: 0,
    editedCompanies: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('AdminDashboard: Starting to load data...');

      // Get users stats
      const { count: totalUsers, error: usersError } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });

      console.log('AdminDashboard: Total users:', totalUsers, 'Error:', usersError);

      const { count: activeUsers, error: activeUsersError } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      console.log('AdminDashboard: Active users:', activeUsers, 'Error:', activeUsersError);

      // Get companies stats
      const { count: totalCompanies, error: companiesError } = await supabase
        .from('admin_companies')
        .select('*', { count: 'exact', head: true });

      console.log('AdminDashboard: Total companies:', totalCompanies, 'Error:', companiesError);

      const { count: editedCompanies, error: editedCompaniesError } = await supabase
        .from('admin_companies')
        .select('*', { count: 'exact', head: true })
        .eq('is_manually_edited', true);

      console.log('AdminDashboard: Edited companies:', editedCompanies, 'Error:', editedCompaniesError);

      // Get search stats
      const { count: totalSearches, error: searchesError } = await supabase
        .from('admin_search_history')
        .select('*', { count: 'exact', head: true });

      console.log('AdminDashboard: Total searches:', totalSearches, 'Error:', searchesError);

      const today = new Date().toISOString().split('T')[0];
      const { count: todaySearches, error: todaySearchesError } = await supabase
        .from('admin_search_history')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);

      console.log('AdminDashboard: Today searches:', todaySearches, 'Error:', todaySearchesError);

      // Get recent activity from database
      const { data: searchHistory, error: searchError } = await supabase
        .from('admin_search_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('AdminDashboard: Search history:', searchHistory, 'Error:', searchError);

      let recentActivity: ActivityItem[] = [];
      
      if (searchHistory && !searchError) {
        recentActivity = searchHistory.map(search => ({
          id: search.id,
          type: 'search',
          description: `Recherche ${search.search_type} ${search.search_query}`,
          timestamp: search.created_at,
          user: search.user_id || 'Utilisateur anonyme'
        }));
      }

      // Add some simulated activity if no real data yet
      if (recentActivity.length === 0) {
        recentActivity = [
          {
            id: 'sim-1',
            type: 'search',
            description: 'Aucune activité récente',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            user: 'System'
          }
        ];
      }

      const newStats = {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalCompanies: totalCompanies || 0,
        totalSearches: totalSearches || 0,
        todaySearches: todaySearches || 0,
        editedCompanies: editedCompanies || 0,
        recentActivity
      };

      console.log('AdminDashboard: Setting stats:', newStats);
      setStats(newStats);

    } catch (error) {
      console.error('AdminDashboard: Error loading dashboard data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      console.log('AdminDashboard: Loading finished');
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'search':
        return <Search className="h-4 w-4 text-primary" />;
      case 'company_edit':
        return <Edit3 className="h-4 w-4 text-warning" />;
      case 'user_register':
        return <Users className="h-4 w-4 text-success" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `il y a ${hours}h`;
    if (minutes > 0) return `il y a ${minutes}min`;
    return 'maintenant';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
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
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de l'activité Predicor
          </p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entreprises</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              {stats.editedCompanies} modifiées manuellement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recherches Total</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSearches}</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              {stats.todaySearches} aujourd'hui
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activité</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.recentActivity.length}
            </div>
            <p className="text-xs text-muted-foreground">
              actions récentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Activité Récente</span>
            </CardTitle>
            <CardDescription>
              Les dernières actions sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} • {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Accès direct aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Gérer les utilisateurs
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building2 className="w-4 h-4 mr-2" />
              Voir les entreprises
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Edit3 className="w-4 h-4 mr-2" />
              Éditeur WYSIWYG
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics détaillées
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>État du Système</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-success-light text-success">
                <CheckCircle className="w-3 h-3 mr-1" />
                API Fonctionnelle
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-success-light text-success">
                <CheckCircle className="w-3 h-3 mr-1" />
                Base de données OK
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-warning-light text-warning">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Edge Functions
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}