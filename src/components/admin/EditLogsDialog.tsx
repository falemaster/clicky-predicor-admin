import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Edit3, User, Smartphone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EditLog {
  id: string;
  field_changed: string;
  old_value: any;
  new_value: any;
  change_type: string;
  created_at: string;
  user_agent?: string;
}

interface EditLogsDialogProps {
  siren: string;
  children: React.ReactNode;
}

export function EditLogsDialog({ siren, children }: EditLogsDialogProps) {
  const [editLogs, setEditLogs] = useState<EditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const loadEditLogs = async () => {
    if (!isOpen) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_edit_logs')
        .select('id, field_changed, old_value, new_value, change_type, created_at, user_agent')
        .eq('siren', siren)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEditLogs(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des logs d\'édition:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEditLogs();
  }, [isOpen]);

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'create': return 'default';
      case 'update': return 'secondary';
      case 'delete': return 'destructive';
      default: return 'outline';
    }
  };

  const formatFieldName = (field: string) => {
    const fieldMap: Record<string, string> = {
      'sirene.denomination': 'Dénomination',
      'sirene.activitePrincipale': 'Activité principale',
      'sirene.adresse': 'Adresse',
      'sirene.ville': 'Ville',
      'sirene.codePostal': 'Code postal',
      'scores.economic': 'Score économique',
      'scores.financial': 'Score financier',
      'scores.legal': 'Score légal',
      'scores.global': 'Score global',
      'aiAnalysis.executiveSummary': 'Résumé exécutif IA'
    };
    return fieldMap[field] || field;
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const getDeviceType = (userAgent?: string) => {
    if (!userAgent) return 'Inconnu';
    if (/mobile/i.test(userAgent)) return 'Mobile';
    if (/tablet/i.test(userAgent)) return 'Tablette';
    return 'Desktop';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Historique des modifications - SIREN {siren}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : editLogs.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Aucune modification enregistrée pour cette entreprise
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {editLogs.map((log) => (
                <Card key={log.id} className="border-l-4 border-l-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {formatFieldName(log.field_changed)}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={getChangeTypeColor(log.change_type)}>
                          {log.change_type}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(log.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground mb-1">Ancienne valeur :</div>
                        <div className="p-2 bg-muted/50 rounded text-xs max-h-20 overflow-y-auto">
                          {formatValue(log.old_value)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground mb-1">Nouvelle valeur :</div>
                        <div className="p-2 bg-primary/5 rounded text-xs max-h-20 overflow-y-auto">
                          {formatValue(log.new_value)}
                        </div>
                      </div>
                    </div>
                    
                    {log.user_agent && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Smartphone className="h-3 w-3" />
                          <span>{getDeviceType(log.user_agent)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}