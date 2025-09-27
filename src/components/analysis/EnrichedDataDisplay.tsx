import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Phone, Mail, Globe, MapPin, Calendar, Users, Euro, FileText, AlertTriangle, Shield, Gavel } from "lucide-react";
import { EnrichmentInterface } from "./EnrichmentInterface";

interface EnrichedDataProps {
  companyData: any;
  onDataEnriched?: (enrichedData: any) => void;
}

export const EnrichedDataDisplay = ({ companyData, onDataEnriched }: EnrichedDataProps) => {
  if (!companyData) return null;

  const { sirene, pappers, infogreffe, rubyPayeur, predictor, enriched } = companyData;

  // Check visibility settings
  const isVisible = (section: string, subsection?: string) => {
    const sectionPath = subsection 
      ? enriched?.uiSettings?.sectionVisibility?.[section]?.[subsection]
      : enriched?.uiSettings?.sectionVisibility?.[section];
    
    // Default to visible if not explicitly set to "false"
    return sectionPath !== "false";
  };

  // Check if contact data is missing or incomplete
  const hasContactData = pappers?.telephone || pappers?.email || pappers?.siteWeb;
  const isContactDataIncomplete = !pappers?.telephone || !pappers?.email || !pappers?.siteWeb;

  return (
    <div className="space-y-6">
      {/* Informations de contact enrichies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Coordonnées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Existing contact data */}
          {pappers?.telephone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{pappers.telephone}</span>
              <Badge variant="success" className="text-xs">Pappers</Badge>
            </div>
          )}
          {pappers?.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{pappers.email}</span>
              <Badge variant="success" className="text-xs">Pappers</Badge>
            </div>
          )}
          {pappers?.siteWeb && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={pappers.siteWeb} target="_blank" rel="noopener noreferrer" 
                 className="text-primary hover:underline">
                {pappers.siteWeb}
              </a>
              <Badge variant="success" className="text-xs">Pappers</Badge>
            </div>
          )}

          {/* Missing data placeholders */}
          {!pappers?.telephone && (
            <div className="flex items-center gap-2 opacity-50">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground bg-muted px-2 py-1 rounded blur-sm">+33 X XX XX XX XX</span>
              <Badge variant="secondary" className="text-xs">Non disponible</Badge>
            </div>
          )}
          {!pappers?.email && (
            <div className="flex items-center gap-2 opacity-50">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground bg-muted px-2 py-1 rounded blur-sm">contact@entreprise.com</span>
              <Badge variant="secondary" className="text-xs">Non disponible</Badge>
            </div>
          )}
          {!pappers?.siteWeb && (
            <div className="flex items-center gap-2 opacity-50">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground bg-muted px-2 py-1 rounded blur-sm">www.entreprise.com</span>
              <Badge variant="secondary" className="text-xs">Non disponible</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrichment interface when data is missing */}
      {isContactDataIncomplete && onDataEnriched && (
        <EnrichmentInterface 
          companyData={companyData} 
          onDataEnriched={onDataEnriched}
        />
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
                  <Badge variant="success" className="ml-1 text-xs">Infogreffe</Badge>
                </div>
              )}
              {(() => {
                // Prioritize Pappers for capital social if Infogreffe is unavailable
                const isInfogreffeUnavailable = (companyData as any)?.flags?.infogreffeUnavailable;
                const pappersCapital = pappers?.capitalSocial;
                const infogreffeCapital = infogreffe.capitalSocial;
                
                const capital = (isInfogreffeUnavailable && pappersCapital) ? pappersCapital : infogreffeCapital;
                const source = (isInfogreffeUnavailable && pappersCapital) ? "Pappers" : "Infogreffe";
                
                return capital ? (
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Capital: {capital.toLocaleString()} €</span>
                    <Badge variant="success" className="text-xs">{source}</Badge>
                  </div>
                ) : null;
              })()}
              {infogreffe.numeroRcs && (
                <div>
                  <span className="text-sm font-medium">RCS:</span>
                  <span className="ml-2 text-sm">{infogreffe.numeroRcs}</span>
                  <Badge variant="success" className="ml-1 text-xs">Infogreffe</Badge>
                </div>
              )}
              {infogreffe.greffe && (
                <div>
                  <span className="text-sm font-medium">Greffe:</span>
                  <span className="ml-2 text-sm">{infogreffe.greffe}</span>
                  <Badge variant="success" className="ml-1 text-xs">Infogreffe</Badge>
                </div>
              )}
              {infogreffe.dateImmatriculation && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
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
      {rubyPayeur && isVisible('compliance', 'creditScore') && (
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
                <Badge variant="success" className="text-xs mt-1">Crédit/Finance</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{rubyPayeur.scorePaiement}/10</div>
                <div className="text-sm text-muted-foreground">Score Paiement</div>
                <Badge variant="success" className="text-xs mt-1">Crédit/Finance</Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{rubyPayeur.retardsMoyens}j</div>
                <div className="text-sm text-muted-foreground">Retards Moyens</div>
                <Badge variant="success" className="text-xs mt-1">Crédit/Finance</Badge>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tendance:</span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={rubyPayeur.tendance === 'Amélioration' ? 'default' : 
                          rubyPayeur.tendance === 'Dégradation' ? 'destructive' : 'secondary'}
                >
                  {rubyPayeur.tendance}
                </Badge>
                <Badge variant="success" className="text-xs">Crédit/Finance</Badge>
              </div>
            </div>
            {rubyPayeur.alertes && rubyPayeur.alertes.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Alertes récentes:
                </span>
                {rubyPayeur.alertes.slice(0, 3).map((alerte: any, index: number) => (
                  <div key={index} className="text-sm p-2 bg-warning-light rounded border-l-4 border-warning">
                    <div className="font-medium">{alerte.type}</div>
                    <div className="text-muted-foreground">{alerte.description}</div>
                    {alerte.montant && (
                      <div className="text-warning font-medium">{alerte.montant.toLocaleString()} €</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Conformité et obligations légales enrichies */}
      {enriched?.compliance && isVisible('compliance', 'complianceCards') && (
        <div className="space-y-4">
          {/* Scores de conformité par domaine */}
          {(enriched.compliance.domainScores || enriched.compliance.lastAudits) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Conformité par Domaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['fiscal', 'social', 'environmental', 'gdpr', 'sector'].map((domain) => {
                    const score = enriched.compliance.domainScores?.[domain];
                    const lastAudit = enriched.compliance.lastAudits?.[domain];
                    if (!score && !lastAudit) return null;
                    
                    return (
                      <div key={domain} className="text-center p-3 bg-muted/50 rounded">
                        <div className="font-medium capitalize text-sm mb-1">{domain === 'gdpr' ? 'RGPD' : domain}</div>
                        {score && (
                          <div className="text-lg font-bold text-primary">{score}/10</div>
                        )}
                        {lastAudit && (
                          <div className="text-xs text-muted-foreground">Audit: {lastAudit}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conformité judiciaire */}
          {(enriched.compliance.fiscalLitigation || enriched.compliance.judicialLitigation) && isVisible('compliance', 'judicialCompliance') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  Conformité Judiciaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {enriched.compliance.fiscalLitigation && (
                    <div className="p-3 bg-warning-light rounded border-l-4 border-warning">
                      <h4 className="font-medium text-warning-dark mb-2">Contentieux Fiscal</h4>
                      {enriched.compliance.fiscalLitigation.redressements && (
                        <div className="text-sm mb-1">Redressements: {enriched.compliance.fiscalLitigation.redressements}</div>
                      )}
                      {enriched.compliance.fiscalLitigation.penalties && (
                        <div className="text-sm font-medium text-warning">Pénalités: {enriched.compliance.fiscalLitigation.penalties} K€</div>
                      )}
                    </div>
                  )}
                  {enriched.compliance.judicialLitigation && (
                    <div className="p-3 bg-destructive-light rounded border-l-4 border-destructive">
                      <h4 className="font-medium text-destructive-dark mb-2">Contentieux Judiciaire</h4>
                      {enriched.compliance.judicialLitigation.procedures && (
                        <div className="text-sm mb-1">Procédures: {enriched.compliance.judicialLitigation.procedures}</div>
                      )}
                      {enriched.compliance.judicialLitigation.amounts && (
                        <div className="text-sm font-medium text-destructive">Montants: {enriched.compliance.judicialLitigation.amounts} K€</div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Procédures */}
          {(enriched.compliance.legalProcedures || enriched.compliance.judicialProcedures) && isVisible('compliance', 'legalProcedures') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Procédures en Cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {enriched.compliance.legalProcedures && (
                    <div>
                      <h4 className="font-medium mb-2">Procédures Juridiques</h4>
                      <div className="space-y-2">
                        {Object.entries(enriched.compliance.legalProcedures).map(([key, value]) => {
                          if (!value || value === 'Aucune') return null;
                          return (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="capitalize">{key}:</span>
                              <Badge variant={value === 'Aucune' ? 'default' : 'destructive'}>
                                {String(value)}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {enriched.compliance.judicialProcedures && (
                    <div>
                      <h4 className="font-medium mb-2">Procédures Judiciaires</h4>
                      <div className="space-y-2">
                        {Object.entries(enriched.compliance.judicialProcedures).map(([key, value]) => {
                          if (!value || value === 'Aucune') return null;
                          return (
                            <div key={key} className="flex justify-between text-sm">
                              <span className="capitalize">{key}:</span>
                              <Badge variant={value === 'Aucune' ? 'default' : 'destructive'}>
                                {String(value)}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analyse de risque juridique */}
          {enriched.compliance.riskAnalysis && isVisible('compliance', 'riskAnalysis') && (
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Analyse de Risque Juridique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {enriched.compliance.riskAnalysis.profile && (
                  <div>
                    <h4 className="font-medium mb-2">Profil de risque</h4>
                    <p className="text-sm text-muted-foreground">{enriched.compliance.riskAnalysis.profile}</p>
                  </div>
                )}
                {enriched.compliance.riskAnalysis.recommendations && (
                  <div>
                    <h4 className="font-medium mb-2">Recommandations</h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-line">
                      {enriched.compliance.riskAnalysis.recommendations}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
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
                <div className="text-xl font-bold text-success">
                  {pappers.bilans[0].chiffreAffaires.toLocaleString()} €
                </div>
                <div className="text-sm text-muted-foreground">Chiffre d'Affaires</div>
                <div className="text-xs text-muted-foreground">{pappers.bilans[0].annee}</div>
                <Badge variant="success" className="text-xs mt-1">Pappers</Badge>
              </div>
              <div className="text-center">
                <div className={`text-xl font-bold ${pappers.bilans[0].resultatNet >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {pappers.bilans[0].resultatNet.toLocaleString()} €
                </div>
                <div className="text-sm text-muted-foreground">Résultat Net</div>
                <div className="text-xs text-muted-foreground">{pappers.bilans[0].annee}</div>
                <Badge variant="success" className="text-xs mt-1">Pappers</Badge>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-primary">
                  {pappers.bilans[0].fondsPropresBruts.toLocaleString()} €
                </div>
                <div className="text-sm text-muted-foreground">Fonds Propres</div>
                <div className="text-xs text-muted-foreground">{pappers.bilans[0].annee}</div>
                <Badge variant="success" className="text-xs mt-1">Pappers</Badge>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-warning">
                  {pappers.bilans[0].dettes.toLocaleString()} €
                </div>
                <div className="text-sm text-muted-foreground">Dettes</div>
                <div className="text-xs text-muted-foreground">{pappers.bilans[0].annee}</div>
                <Badge variant="success" className="text-xs mt-1">Pappers</Badge>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{pappers.bilans[0].effectifs} employés</span>
              <span className="text-sm text-muted-foreground">({pappers.bilans[0].annee})</span>
              <Badge variant="success" className="text-xs">Pappers</Badge>
            </div>
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
                    <div className={bilan.resultatNet >= 0 ? 'text-success' : 'text-destructive'}>
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