import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, XCircle } from "lucide-react";

interface CollectiveProcedure {
  type: string;
  status: string;
  dateDebut: string;
  dateFin?: string;
  description?: string;
}

interface CollectiveProcedureAlertProps {
  procedures: CollectiveProcedure[];
  className?: string;
}

export function CollectiveProcedureAlert({ procedures, className }: CollectiveProcedureAlertProps) {
  if (!procedures || procedures.length === 0) {
    return null;
  }

  const getAlertVariant = (procedure: CollectiveProcedure) => {
    const criticalTypes = ['liquidation judiciaire', 'redressement judiciaire'];
    const warningTypes = ['sauvegarde', 'procédure collective'];
    
    if (criticalTypes.some(type => procedure.type.toLowerCase().includes(type))) {
      return 'destructive';
    }
    if (warningTypes.some(type => procedure.type.toLowerCase().includes(type))) {
      return 'default';
    }
    return 'default';
  };

  const getIcon = (procedure: CollectiveProcedure) => {
    const variant = getAlertVariant(procedure);
    switch (variant) {
      case 'destructive':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {procedures.map((procedure, index) => (
        <Alert key={index} variant={getAlertVariant(procedure)}>
          {getIcon(procedure)}
          <AlertDescription>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {procedure.type}
                  </span>
                  <Badge 
                    variant={procedure.status === 'en cours' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {procedure.status}
                  </Badge>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Débutée le {formatDate(procedure.dateDebut)}
                  {procedure.dateFin && ` - Clôturée le ${formatDate(procedure.dateFin)}`}
                </div>
                
                {procedure.description && (
                  <p className="text-sm">
                    {procedure.description}
                  </p>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}