import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExecutiveSummary } from "@/components/admin/ExecutiveSummary";
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
  Building
} from "lucide-react";

interface OverviewDisplayProps {
  companyData: any;
  scores: any;
}

export function OverviewDisplay({ companyData, scores }: OverviewDisplayProps) {
  if (!companyData) return null;

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
            <Badge variant="outline">
              Score Global: {scores?.global || '5.5'}/10
            </Badge>
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
              <Badge variant="secondary" className="text-xs">
                {scores?.global >= 7 ? 'Bon' : scores?.global >= 5 ? 'Moyen' : 'Faible'}
              </Badge>
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Euro className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Financier</span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">
                {scores?.financial || '6.0'}/10
              </div>
              <Badge variant="secondary" className="text-xs">
                {scores?.financial >= 7 ? 'Bon' : scores?.financial >= 5 ? 'Moyen' : 'Faible'}
              </Badge>
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Scale className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Juridique</span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">
                {scores?.legal || '7.5'}/10
              </div>
              <Badge variant="secondary" className="text-xs">
                {scores?.legal >= 7 ? 'Bon' : scores?.legal >= 5 ? 'Moyen' : 'Faible'}
              </Badge>
            </div>

            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Fiscal</span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">
                {scores?.fiscal || '6.8'}/10
              </div>
              <Badge variant="secondary" className="text-xs">
                {scores?.fiscal >= 7 ? 'Bon' : scores?.fiscal >= 5 ? 'Moyen' : 'Faible'}
              </Badge>
            </div>
          </div>
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
              <span className="ml-2 text-sm">SAS</span>
            </div>
            <div>
              <span className="text-sm font-medium">Capital social:</span>
              <span className="ml-2 text-sm">50 000 €</span>
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
              <span className="ml-2 text-sm">Services aux entreprises</span>
            </div>
            <div>
              <span className="text-sm font-medium">Code NAF:</span>
              <span className="ml-2 text-sm">{companyData.naf}</span>
            </div>
            <div>
              <span className="text-sm font-medium">Effectif:</span>
              <span className="ml-2 text-sm">{companyData.employees} salariés</span>
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
    </div>
  );
}