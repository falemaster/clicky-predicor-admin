import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { 
  Building2, 
  Search, 
  Filter,
  Edit3,
  Trash2,
  Plus,
  Download,
  Upload,
  Eye,
  MapPin,
  Calendar,
  Activity,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
  Clock,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Company {
  id: string;
  siren: string;
  company_name: string;
  siret?: string;
  naf_code?: string;
  activity?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  status: string;
  search_count: number;
  last_searched?: string;
  is_manually_edited: boolean;
  edited_by?: string;
  edited_at?: string;
  created_at: string;
  updated_at: string;
}

export function AdminCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editedFilter, setEditedFilter] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    edited: 0,
    recent: 0
  });
  const { toast } = useToast();

  const loadCompanies = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('admin_companies')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setCompanies(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const active = data?.filter(c => c.status === 'active').length || 0;
      const edited = data?.filter(c => c.is_manually_edited).length || 0;
      const recent = data?.filter(c => {
        const lastSearched = c.last_searched ? new Date(c.last_searched) : null;
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return lastSearched && lastSearched > dayAgo;
      }).length || 0;
      
      setStats({ total, active, edited, recent });

    } catch (error) {
      console.error('Error loading companies:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les entreprises",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.siren.includes(searchTerm) ||
      company.siret?.includes(searchTerm) ||
      company.activity?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || company.status === statusFilter;
    const matchesEdited = 
      editedFilter === "all" || 
      (editedFilter === "edited" && company.is_manually_edited) ||
      (editedFilter === "not_edited" && !company.is_manually_edited);
    
    return matchesSearch && matchesStatus && matchesEdited;
  });

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData({ ...company });
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!selectedCompany || !formData) return;

    try {
      const { error } = await supabase
        .from('admin_companies')
        .update({
          ...formData,
          is_manually_edited: true,
          edited_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCompany.id);

      if (error) throw error;

      await loadCompanies();
      setEditMode(false);
      setSelectedCompany(null);
      setFormData({});
      
      toast({
        title: "Entreprise mise à jour",
        description: "Les modifications ont été sauvegardées"
      });
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (company: Company) => {
    try {
      const { error } = await supabase
        .from('admin_companies')
        .delete()
        .eq('id', company.id);

      if (error) throw error;

      await loadCompanies();
      
      toast({
        title: "Entreprise supprimée",
        description: `${company.company_name} a été supprimée`
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entreprise",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="secondary" className="bg-success-light text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Actif
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Inactif
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-warning-light text-warning">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-16"></div>
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
          <h1 className="text-3xl font-bold text-foreground">Gestion des Entreprises</h1>
          <p className="text-muted-foreground">
            Base de données des entreprises recherchées et analysées
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadCompanies}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entreprises</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Dans la base de données
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entreprises Actives</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.active / stats.total) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modifiées Manuellement</CardTitle>
            <Edit3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.edited}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.edited / stats.total) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recherchées (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recent}</div>
            <p className="text-xs text-muted-foreground">
              Activité récente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, SIREN, SIRET, activité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status">Statut</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="edited">Édition</Label>
              <Select value={editedFilter} onValueChange={setEditedFilter}>
                <SelectTrigger id="edited">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="edited">Modifiées</SelectItem>
                  <SelectItem value="not_edited">Non modifiées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Entreprises ({filteredCompanies.length})</span>
            <Badge variant="outline">
              {filteredCompanies.length} / {companies.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>SIREN/SIRET</TableHead>
                  <TableHead>Activité</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Recherches</TableHead>
                  <TableHead>Dernière recherche</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{company.company_name}</p>
                          {company.is_manually_edited && (
                            <Badge variant="outline" className="text-xs mt-1">
                              <Edit3 className="w-3 h-3 mr-1" />
                              Modifiée
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>SIREN: {company.siren}</p>
                        {company.siret && <p className="text-muted-foreground">SIRET: {company.siret}</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{company.activity || "Non renseignée"}</p>
                        {company.naf_code && (
                          <p className="text-muted-foreground">Code NAF: {company.naf_code}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {company.city && company.postal_code ? (
                          <>
                            <p>{company.city}</p>
                            <p className="text-muted-foreground">{company.postal_code}</p>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Non renseignée</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(company.status)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {company.search_count}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {company.last_searched ? (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {format(new Date(company.last_searched), 'dd/MM/yyyy HH:mm', { locale: fr })}
                          </span>
                        </div>
                      ) : (
                        "Jamais"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(company)}
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Éditer
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer l'entreprise</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer "{company.company_name}" ? 
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(company)}>
                                Supprimer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredCompanies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm || statusFilter !== "all" || editedFilter !== "all" ? (
                  <>
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune entreprise ne correspond aux critères de recherche</p>
                  </>
                ) : (
                  <>
                    <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune entreprise dans la base de données</p>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'entreprise</DialogTitle>
            <DialogDescription>
              Mise à jour des informations de {selectedCompany?.company_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nom de l'entreprise</Label>
                <Input
                  id="edit-name"
                  value={formData.company_name || ""}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Statut</Label>
                <Select 
                  value={formData.status || "active"} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-siren">SIREN</Label>
                <Input
                  id="edit-siren"
                  value={formData.siren || ""}
                  onChange={(e) => setFormData({ ...formData, siren: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-siret">SIRET</Label>
                <Input
                  id="edit-siret"
                  value={formData.siret || ""}
                  onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-naf">Code NAF</Label>
                <Input
                  id="edit-naf"
                  value={formData.naf_code || ""}
                  onChange={(e) => setFormData({ ...formData, naf_code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-postal">Code postal</Label>
                <Input
                  id="edit-postal"
                  value={formData.postal_code || ""}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-activity">Activité</Label>
              <Input
                id="edit-activity"
                value={formData.activity || ""}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-address">Adresse</Label>
              <Textarea
                id="edit-address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-city">Ville</Label>
              <Input
                id="edit-city"
                value={formData.city || ""}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMode(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}