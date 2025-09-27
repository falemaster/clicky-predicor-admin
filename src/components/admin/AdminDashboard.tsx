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
  BarChart3,
  CreditCard,
  History,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  sirenSearches: number;
  siretSearches: number;
  totalCompanies: number;
  infogreffeCredits: number | null;
  infogreffeStatus: 'active' | 'expired' | 'error';
  recentEditedCompanies: EditedCompany[];
}

interface EditedCompany {
  id: string;
  siren: string;
  company_name: string;
  edited_at: string;
  edited_by: string | null;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    sirenSearches: 0,
    siretSearches: 0,
    totalCompanies: 0,
    infogreffeCredits: null,
    infogreffeStatus: 'error',
    recentEditedCompanies: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const checkInfogreffeCredits = async () => {
    try {
      const response = await supabase.functions.invoke('infogreffe-api', {
        body: { 
          siren: '123456789', // Test SIREN
          endpoint: 'ficheidentite' 
        }
      });
      
      if (response.error) {
        if (response.error.message?.includes('402') || response.error.message?.includes('Payment Required')) {
          return { status: 'expired' as const, credits: 0 };
        }
        return { status: 'error' as const, credits: null };
      }
      
      return { status: 'active' as const, credits: null }; // Crédits disponibles mais nombre inconnu
    } catch (error) {
      console.error('Error checking Infogreffe credits:', error);
      return { status: 'error' as const, credits: null };
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get SIREN/SIRET searches
      const { count: sirenSearches } = await supabase
        .from('admin_search_history')
        .select('*', { count: 'exact', head: true })
        .eq('search_type', 'siren');

      const { count: siretSearches } = await supabase
        .from('admin_search_history')
        .select('*', { count: 'exact', head: true })
        .eq('search_type', 'siret');

      // Get total companies
      const { count: totalCompanies } = await supabase
        .from('admin_companies')
        .select('*', { count: 'exact', head: true });

      // Check Infogreffe credits
      const infogreffeStatus = await checkInfogreffeCredits();

      // Get recently edited companies
      const { data: recentEditedCompanies } = await supabase
        .from('admin_companies')
        .select('id, siren, company_name, edited_at, edited_by')
        .eq('is_manually_edited', true)
        .not('edited_at', 'is', null)
        .order('edited_at', { ascending: false })
        .limit(10);

      setStats({
        sirenSearches: sirenSearches || 0,
        siretSearches: siretSearches || 0,
        totalCompanies: totalCompanies || 0,
        infogreffeCredits: infogreffeStatus.credits,
        infogreffeStatus: infogreffeStatus.status,
        recentEditedCompanies: recentEditedCompanies || []
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleEditCompany = (companyId: string, siren: string) => {
    navigate(`/admin/editor?siren=${siren}`);
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `il y a ${days}j`;
    if (hours > 0) return `il y a ${hours}h`;
    if (minutes > 0) return `il y a ${minutes}min`;
    return 'maintenant';
  };

  const getInfogreffeStatusBadge = () => {
    switch (stats.infogreffeStatus) {
      case 'active':
        return (
          <Badge variant="secondary" className="bg-success-light text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Crédits disponibles
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Crédits épuisés
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-warning-light text-warning">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Statut inconnu
          </Badge>
        );
    }
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
            Métriques essentielles de l'activité Predicor
          </p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          <Activity className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Essential Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* SIREN Searches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recherches SIREN</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sirenSearches}</div>
            <p className="text-xs text-muted-foreground">
              Consultations via SIREN
            </p>
          </CardContent>
        </Card>

        {/* SIRET Searches */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recherches SIRET</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.siretSearches}</div>
            <p className="text-xs text-muted-foreground">
              Consultations via SIRET
            </p>
          </CardContent>
        </Card>

        {/* Total Companies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entreprises Indexées</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">
              Base de données
            </p>
          </CardContent>
        </Card>

        {/* Infogreffe Credits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Infogreffe</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.infogreffeStatus === 'active' ? '✓' : 
               stats.infogreffeStatus === 'expired' ? '✗' : '?'}
            </div>
            <div className="text-xs">
              {getInfogreffeStatusBadge()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recently Edited Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Entreprises Modifiées Récemment</span>
          </CardTitle>
          <CardDescription>
            Historique des entreprises éditées manuellement par les administrateurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.recentEditedCompanies.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Aucune entreprise modifiée récemment
            </div>
          ) : (
            stats.recentEditedCompanies.map((company) => (
              <div 
                key={company.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                onClick={() => handleEditCompany(company.id, company.siren)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{company.company_name}</p>
                    <p className="text-xs text-muted-foreground">
                      SIREN: {company.siren} • Modifié {formatTimeAgo(company.edited_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Édité</Badge>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

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
                Base de données OK
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              {getInfogreffeStatusBadge()}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-success-light text-success">
                <CheckCircle className="w-3 h-3 mr-1" />
                Edge Functions
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}