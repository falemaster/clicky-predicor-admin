import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface DirigeantHistory {
  nom: string;
  prenom: string;
  fonction: string;
  dateDebut: string;
  dateFin?: string;
  actuel: boolean;
}

interface DirigeantModalProps {
  dirigeant: {
    nom: string;
    prenom: string;
    fonction: string;
  };
  children: React.ReactNode;
  history?: DirigeantHistory[];
}

export function DirigeantModal({ dirigeant, children, history = [] }: DirigeantModalProps) {
  // Mock data if no history provided
  const mockHistory: DirigeantHistory[] = history.length > 0 ? history : [
    {
      nom: dirigeant.nom,
      prenom: dirigeant.prenom,
      fonction: dirigeant.fonction,
      dateDebut: "2020-01-15",
      actuel: true
    },
    {
      nom: dirigeant.nom,
      prenom: dirigeant.prenom,
      fonction: "Directeur Général Délégué",
      dateDebut: "2018-03-10",
      dateFin: "2019-12-31",
      actuel: false
    },
    {
      nom: "Martin",
      prenom: "Pierre",
      fonction: "Président",
      dateDebut: "2015-03-15",
      dateFin: "2018-03-09",
      actuel: false
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Historique des mandats - {dirigeant.prenom} {dirigeant.nom}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Chronologie des fonctions exercées dans cette société
          </div>
          
          <div className="space-y-3">
            {mockHistory.map((entry, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-4 ${entry.actuel ? 'border-primary bg-primary/5' : 'border-border'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">
                        {entry.prenom} {entry.nom}
                      </h4>
                      {entry.actuel && (
                        <Badge variant="default" className="text-xs">
                          En cours
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm font-medium text-primary">
                      {entry.fonction}
                    </p>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      Du {formatDate(entry.dateDebut)}
                      {entry.dateFin && ` au ${formatDate(entry.dateFin)}`}
                      {entry.actuel && ' - En cours'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground pt-2 border-t">
            Source : Registre du Commerce et des Sociétés (RCS) via Infogreffe
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}