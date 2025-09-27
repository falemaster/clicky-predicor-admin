import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building, Users, Calendar, FileText, PieChart, TrendingUp } from "lucide-react";
import type { InfogreffeCompanyData, InfogreffeRepresentant, InfogreffeRepartitionCapital } from "@/types/api";

interface InfogreffeDataDisplayProps {
  data: InfogreffeCompanyData;
  fallbackCapital?: number;
  isInfogreffeUnavailable?: boolean;
}

export function InfogreffeDataDisplay({ data, fallbackCapital, isInfogreffeUnavailable }: InfogreffeDataDisplayProps) {
  if (!data && !isInfogreffeUnavailable) return null;
  
  // Show fallback message when Infogreffe is unavailable but we don't have Infogreffe data
  if (!data && isInfogreffeUnavailable) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Données juridiques Infogreffe
            <Badge variant="outline" className="text-xs ml-2">
              Indisponible - Voir Pappers
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Infogreffe temporairement indisponible (erreur 402). Les données juridiques sont disponibles via Pappers.
          </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Informations générales Infogreffe */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Données juridiques Infogreffe
            {isInfogreffeUnavailable && (
              <Badge variant="outline" className="text-xs ml-2">
                Indisponible - Pappers affiché
              </Badge>
            )}
          </CardTitle>
          {isInfogreffeUnavailable && (
            <p className="text-sm text-muted-foreground mt-2">
              Infogreffe indisponible (erreur 402) - Données issues de Pappers quand disponible
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.formeJuridique && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Forme juridique</span>
                <p className="text-sm">{data.formeJuridique}</p>
              </div>
            )}
            {(data?.capitalSocial || fallbackCapital) && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Capital social</span>
                <p className="text-sm font-semibold">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(data?.capitalSocial || fallbackCapital || 0)}
                  {isInfogreffeUnavailable && fallbackCapital && (
                    <span className="text-xs text-muted-foreground ml-1">(Pappers)</span>
                  )}
                </p>
              </div>
            )}
            {data.numeroRcs && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">N° RCS</span>
                <p className="text-sm">{data.numeroRcs}</p>
              </div>
            )}
            {data.greffe && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Greffe</span>
                <p className="text-sm">{data.greffe}</p>
              </div>
            )}
            {data.dateImmatriculation && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Date d'immatriculation</span>
                <p className="text-sm">{new Date(data.dateImmatriculation).toLocaleDateString('fr-FR')}</p>
              </div>
            )}
            {data.dureePersonneMorale && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Durée</span>
                <p className="text-sm">{data.dureePersonneMorale}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Représentants et dirigeants */}
      {data.representants && data.representants.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Représentants et dirigeants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.representants.map((rep, index) => (
                <div key={index} className="flex justify-between items-start p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">
                      {rep.prenom ? `${rep.prenom} ${rep.nom}` : rep.nom}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {rep.qualite}
                    </Badge>
                    {rep.dateNaissance && (
                      <p className="text-xs text-muted-foreground">
                        Né(e) le {new Date(rep.dateNaissance).toLocaleDateString('fr-FR')}
                        {rep.lieuNaissance && ` à ${rep.lieuNaissance}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>Depuis le {new Date(rep.dateDebut).toLocaleDateString('fr-FR')}</p>
                    {rep.dateFin && (
                      <p>Jusqu'au {new Date(rep.dateFin).toLocaleDateString('fr-FR')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Répartition du capital */}
      {data.repartitionCapital && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Répartition du capital
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Capital</p>
                <p className="font-semibold">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR'
                  }).format(data.repartitionCapital.montant)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Parts</p>
                <p className="font-semibold">{data.repartitionCapital.nombreParts.toLocaleString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Personnes physiques</p>
                <p className="font-semibold">{data.repartitionCapital.pourcentageDetentionPP}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Personnes morales</p>
                <p className="font-semibold">{data.repartitionCapital.pourcentageDetentionPM}%</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Détail des associés</h4>
              {data.repartitionCapital.detention.map((detenteur, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <div>
                    <p className="font-medium text-sm">
                      {detenteur.typePersonne === 'PP' 
                        ? `${detenteur.prenom || ''} ${detenteur.nom || ''}`.trim()
                        : detenteur.denomination
                      }
                    </p>
                    {detenteur.siren && (
                      <p className="text-xs text-muted-foreground">SIREN: {detenteur.siren}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{detenteur.pourcentage}%</p>
                    <p className="text-xs text-muted-foreground">
                      {detenteur.nombreParts.toLocaleString('fr-FR')} parts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comptes annuels */}
      {data.comptes && data.comptes.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Comptes annuels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.comptes.map((compte, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Exercice {compte.annee}</h4>
                    <Badge variant={compte.statut === 'Déposé' ? 'default' : 'destructive'}>
                      {compte.statut}
                    </Badge>
                  </div>
                  {compte.dateDepot && (
                    <p className="text-xs text-muted-foreground mb-2">
                      Déposé le {new Date(compte.dateDepot).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                  {compte.postes && compte.postes.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium">Principaux postes comptables:</p>
                      {compte.postes.slice(0, 3).map((poste, pIndex) => (
                        <div key={pIndex} className="flex justify-between text-xs">
                          <span>{poste.libelle}</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: 'EUR'
                            }).format(poste.valeur)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Procédures collectives */}
      {data.procedures && data.procedures.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Procédures collectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.procedures.map((proc, index) => (
                <div key={index} className="p-2 border-l-4 border-destructive bg-destructive/5 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="destructive" className="mb-1">
                        {proc.type}
                      </Badge>
                      <p className="text-sm font-medium">{proc.statut}</p>
                      <p className="text-xs text-muted-foreground">{proc.tribunal}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(proc.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}