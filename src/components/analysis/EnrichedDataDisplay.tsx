import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Phone, Mail, Globe, MapPin, Calendar, Users, Euro, FileText, AlertTriangle } from "lucide-react";

interface EnrichedDataProps {
  companyData: any;
}

export const EnrichedDataDisplay = ({ companyData }: EnrichedDataProps) => {
  if (!companyData) return null;

  const { sirene, pappers, infogreffe, rubyPayeur, predictor } = companyData;

  return (
    <div className="space-y-6">
      {/* Informations de contact enrichies */}
      {(pappers?.telephone || pappers?.email || pappers?.siteWeb) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Coordonnées
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pappers?.telephone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{pappers.telephone}</span>
              </div>
            )}
            {pappers?.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{pappers.email}</span>
              </div>
            )}
            {pappers?.siteWeb && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a href={pappers.siteWeb} target="_blank" rel="noopener noreferrer" 
                   className="text-primary hover:underline">
                  {pappers.siteWeb}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informations juridiques enrichies */}
      {infogreffe && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informations Juridiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              {infogreffe.formeJuridique && (
                <div>
                  <span className="text-sm font-medium">Forme juridique:</span>
                  <Badge variant="outline" className="ml-2">{infogreffe.formeJuridique}</Badge>
                </div>
              )}
              {infogreffe.capitalSocial && (
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Capital: {infogreffe.capitalSocial.toLocaleString()} €</span>
                </div>
              )}
              {infogreffe.numeroRcs && (
                <div>
                  <span className="text-sm font-medium">RCS:</span>
                  <span className="ml-2 text-sm">{infogreffe.numeroRcs}</span>
                </div>
              )}
              {infogreffe.greffe && (
                <div>
                  <span className="text-sm font-medium">Greffe:</span>
                  <span className="ml-2 text-sm">{infogreffe.greffe}</span>
                </div>
              )}
              {infogreffe.dateImmatriculation && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreference" />
                  <span className="text-sm">Immatriculé le: {new Date(infogreffe.dateImmatriculation).toLocaleDateString()}</span>
                </div>
              )}
              {infogreffe.dateClotureExercice && (
                <div>
                  <span className="text-sm font-medium">Clôture exercice:</span>
                  <span className="ml-2 text-sm">{infogreffe.dateClotureExercice}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Score de paiement enrichi */}
      {rubyPayeur && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Comportement de Paiement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{rubyPayeur.scoreGlobal}/10</div>
                <div className="text-sm text-muted-foreground">Score Global</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{rubyPayeur.scorePaiement}/10</div>
                <div className="text-sm text-muted-foreground">Score Paiement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{rubyPayeur.retardsMoyens}j</div>
                <div className="text-sm text-muted-foreground">Retards Moyens</div>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tendance:</span>
              <Badge 
                variant={rubyPayeur.tendance === 'Amélioration' ? 'default' : 
                        rubyPayeur.tendance === 'Dégradation' ? 'destructive' : 'secondary'}
              >
                {rubyPayeur.tendance}
              </Badge>
            </div>
            {rubyPayeur.alertes && rubyPayeur.alertes.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Alertes récentes:
                </span>
                {rubyPayeur.alertes.slice(0, 3).map((alerte: any, index: number) => (
                  <div key={index} className="text-sm p-2 bg-orange-50 rounded border-l-4 border-orange-200">
                    <div className="font-medium">{alerte.type}</div>
                    <div className="text-muted-foreground">{alerte.description}</div>
                    {alerte.montant && (
                      <div className="text-orange-600 font-medium">{alerte.montant.toLocaleString()} €</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Données financières enrichies */}
      {pappers?.bilans && pappers.bilans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              Données Financières Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {pappers.bilans[0].chiffreAffaires.toLocaleString()} €
                </div>
                <div className="text-sm text-muted-foreground">Chiffre d'Affaires</div>
                <div className="text-xs text-muted-foreground">{pappers.bilans[0].annee}</div>
              </div>
              <div className="text-center">
                <div className={`text-xl font-bold ${pappers.bilans[0].resultatNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {pappers.bilans[0].resultatNet.toLocaleString()} €
                </div>
                <div className="text-sm text-muted-foreground">Résultat Net</div>
                <div className="text-xs text-muted-foreground">{pappers.bilans[0].annee}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {pappers.bilans[0].fondsPropresBruts.toLocaleString()} €
                </div>
                <div className="text-sm text-muted-foreground">Fonds Propres</div>
                <div className="text-xs text-muted-foreground">{pappers.bilans[0].annee}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">
                  {pappers.bilans[0].dettes.toLocaleString()} €
                </div>
                <div className="text-sm text-muted-foreground">Dettes</div>
                <div className="text-xs text-muted-foreground">{pappers.bilans[0].annee}</div>
              </div>
            </div>
            {pappers.bilans[0].effectifs > 0 && (
              <>
                <Separator className="my-4" />
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{pappers.bilans[0].effectifs} employés</span>
                  <span className="text-sm text-muted-foreground">({pappers.bilans[0].annee})</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Évolution sur plusieurs années */}
      {pappers?.bilans && pappers.bilans.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Évolution Financière</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pappers.bilans.slice(0, 3).map((bilan: any, index: number) => (
                <div key={bilan.annee} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                  <div className="font-medium">{bilan.annee}</div>
                  <div className="flex gap-4 text-sm">
                    <div>CA: {bilan.chiffreAffaires.toLocaleString()} €</div>
                    <div className={bilan.resultatNet >= 0 ? 'text-green-600' : 'text-red-600'}>
                      RN: {bilan.resultatNet.toLocaleString()} €
                    </div>
                    {bilan.effectifs > 0 && (
                      <div>{bilan.effectifs} emp.</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};