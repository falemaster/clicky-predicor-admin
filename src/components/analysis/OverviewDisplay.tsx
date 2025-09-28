import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExecutiveSummary } from "@/components/admin/ExecutiveSummary";
import { FallbackScoreBadge } from "./FallbackScoreBadge";
import { calculateFinancialScore, calculateRiskScore, getRubyPayeurStatus } from "@/utils/scoreCalculator";
import { DataQualitySection } from "@/components/ui/data-quality-section";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Calendar,
  Euro,
  FileText,
  Shield,
  Scale,
  Globe,
  Briefcase,
  Users,
  Building,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface OverviewDisplayProps {
  companyData: any;
  scores: any;
}

export function OverviewDisplay({ companyData, scores }: OverviewDisplayProps) {
  if (!companyData) return null;

  // Calculer les nouveaux scores basés sur la prioritisation Infogreffe
  const financialScore = calculateFinancialScore(companyData);
  const riskScore = calculateRiskScore(companyData);
  const rubyPayeurStatus = getRubyPayeurStatus(companyData);

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <ExecutiveSummary 
        scores={{
          economic: scores?.global || 5.5,
          financial: scores?.financial || 6.0,
          legal: scores?.legal || 7.5,
          fiscal: scores?.fiscal || 6.8,
          global: scores?.global || 5.5
        }}
        companyName={companyData?.name}
      />

      {/* Company Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{companyData.address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Dirigeant: {companyData.director}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Créée en {companyData.foundedYear}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{companyData.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{companyData.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Effectif: {companyData.employees} salariés</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Surveillance des risques
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                Score Global: {scores?.global || '5.5'}/10
              </Badge>
              <FallbackScoreBadge 
                isFallback={companyData?.predictor?.isFallbackScore}
                fallbackReason={companyData?.predictor?.fallbackReason}
                fallbackExplanation={companyData?.predictor?.fallbackExplanation}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Building className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Économique</span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">
                {scores?.global || '5.5'}/10
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Badge variant="secondary" className="text-xs">
                  {scores?.global >= 7 ? 'Bon' : scores?.global >= 5 ? 'Moyen' : 'Faible'}
                </Badge>
                {companyData?.predictor?.isFallbackScore && (
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-3 w-3 text-warning" />
                    <span className="text-xs text-warning">Signaux faibles</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Euro className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Financier</span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">
                {financialScore.score > 0 ? `${financialScore.score}/10` : 'N/A'}
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Badge variant="secondary" className="text-xs">
                  {financialScore.score >= 7 ? 'Bon' : financialScore.score >= 5 ? 'Moyen' : financialScore.score > 0 ? 'Faible' : 'N/A'}
                </Badge>
                <div className="flex items-center space-x-1">
                  {financialScore.source === 'infogreffe' ? (
                    <CheckCircle className="h-3 w-3 text-success" />
                  ) : financialScore.source === 'unavailable' ? (
                    <AlertTriangle className="h-3 w-3 text-warning" />
                  ) : null}
                  <span className="text-xs text-muted-foreground">
                    {financialScore.sourceLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Scale className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Risque</span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">
                {riskScore.score > 0 ? `${riskScore.score}/10` : 'N/A'}
              </div>
              <div className="flex flex-col items-center space-y-1">
                <Badge variant="secondary" className="text-xs">
                  {riskScore.score >= 7 ? 'Faible' : riskScore.score >= 5 ? 'Modéré' : riskScore.score > 0 ? 'Élevé' : 'N/A'}
                </Badge>
                <div className="flex items-center space-x-1">
                  {riskScore.source === 'infogreffe' ? (
                    <CheckCircle className="h-3 w-3 text-success" />
                  ) : riskScore.source === 'unavailable' ? (
                    <AlertTriangle className="h-3 w-3 text-warning" />
                  ) : null}
                  <span className="text-xs text-muted-foreground">
                    {riskScore.sourceLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">RubyPayeur</span>
              </div>
              <div className="text-xs text-center mb-2">
                {rubyPayeurStatus === 'Service opérationnel' ? (
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span className="text-success">Opérationnel</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-1">
                    <AlertTriangle className="h-3 w-3 text-warning" />
                    <span className="text-warning">Indisponible</span>
                  </div>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {rubyPayeurStatus}
              </Badge>
            </div>
          </div>
          
          {/* Afficher les détails NOTAPME si disponibles */}
          {financialScore.details?.notapme && (
            <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-success">Scores NOTAPME Infogreffe</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="font-medium">Performance:</span>
                  <span className="ml-1">{financialScore.details.notapme.performance}/10</span>
                </div>
                <div>
                  <span className="font-medium">Solvabilité:</span>
                  <span className="ml-1">{financialScore.details.notapme.solvabilite}/10</span>
                </div>
                <div>
                  <span className="font-medium">Rentabilité:</span>
                  <span className="ml-1">{financialScore.details.notapme.rentabilite}/10</span>
                </div>
                <div>
                  <span className="font-medium">Robustesse:</span>
                  <span className="ml-1">{financialScore.details.notapme.robustesse}/10</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Information Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Legal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="h-5 w-5 mr-2" />
              Informations Juridiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium">Forme juridique:</span>
              <span className="ml-2 text-sm">
                {companyData?.pappers?.formeJuridique || companyData?.sirene?.formeJuridique || 'Non renseigné'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium">Capital social:</span>
              <span className="ml-2 text-sm">
                {companyData?.pappers?.capitalSocial 
                  ? `${companyData.pappers.capitalSocial.toLocaleString('fr-FR')} €`
                  : 'Non renseigné'
                }
              </span>
            </div>
            <div>
              <span className="text-sm font-medium">RCS:</span>
              <span className="ml-2 text-sm">{companyData.siren}</span>
            </div>
            <div>
              <span className="text-sm font-medium">NAF:</span>
              <span className="ml-2 text-sm">{companyData.naf}</span>
            </div>
          </CardContent>
        </Card>

        {/* Activity Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Activité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium">Secteur d'activité:</span>
              <span className="ml-2 text-sm">
                {companyData?.pappers?.libelleNaf || 
                 companyData?.sirene?.activitePrincipale || 
                 'Non renseigné'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium">Code NAF:</span>
              <span className="ml-2 text-sm">{companyData.naf}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Effectif:</span>
              <span className="ml-2 text-sm">
                {companyData?.pappers?.bilans?.[0]?.effectifs || 
                 companyData.employees || 
                 'Non renseigné'} 
                {(companyData?.pappers?.bilans?.[0]?.effectifs || companyData.employees) && ' salariés'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium">Statut:</span>
              <Badge variant="secondary" className="ml-2 bg-success-light text-success">
                {companyData.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Qualité des données - Synchronisée avec admin */}
      {companyData?.adminSettings?.showDataQualitySection !== false && (
        <DataQualitySection 
          config={{
            completeness: companyData?.enriched?.dataQuality?.completeness || 85,
            lastUpdate: companyData?.enriched?.dataQuality?.lastUpdate || new Date().toISOString(),
            apis: companyData?.enriched?.dataQuality?.apis || {
              insee: { status: 'active', label: 'INSEE/SIRENE', category: 'Données officielles' },
              pappers: { status: 'active', label: 'Pappers API', category: 'Données financières' },
              rubypayeur: { status: 'active', label: 'RubyPayeur', category: 'Score crédit' },
              infogreffe: { status: 'active', label: 'Infogreffe', category: 'Données juridiques' },
              ai_enrichment: { status: 'warning', label: 'IA Enrichissement', category: 'Données simulées' },
              sirius: { status: 'active', label: 'SIRIUS', category: 'Données fiscales' },
              dgfip: { status: 'active', label: 'DGFIP', category: 'Données fiscales' },
              portalis: { status: 'active', label: 'PORTALIS', category: 'Données judiciaires' },
              opale: { status: 'active', label: 'OPALE', category: 'Données sociales' }
            },
            overallStatus: companyData?.enriched?.dataQuality?.overallStatus || 'Données fiables',
            isVisible: companyData?.adminSettings?.showDataQualitySection !== false
          }}
        />
      )}
    </div>
  );
}