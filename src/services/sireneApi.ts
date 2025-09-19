import type { SireneCompanyData, ApiError } from '@/types/api';

const SIRENE_API_BASE = 'https://api.insee.fr/entreprises/sirene/V3.11';

export class SireneApiService {
  private static instance: SireneApiService;
  
  public static getInstance(): SireneApiService {
    if (!SireneApiService.instance) {
      SireneApiService.instance = new SireneApiService();
    }
    return SireneApiService.instance;
  }

  async searchCompaniesByName(query: string, limit: number = 10): Promise<{ data: SireneCompanyData[] | null; error: ApiError | null }> {
    try {
      // Nettoyer et encoder la requête
      const cleanQuery = query.trim().replace(/[^\w\s]/gi, '').substring(0, 50);
      if (cleanQuery.length < 2) {
        return { data: [], error: null };
      }

      const searchQuery = `denominationUniteLegale:"${cleanQuery}"*`;
      const response = await fetch(`${SIRENE_API_BASE}/siret?q=${encodeURIComponent(searchQuery)}&nombre=${limit}&tri=denominationUniteLegale`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          data: null,
          error: {
            code: `SIRENE_SEARCH_${response.status}`,
            message: `Erreur API SIRENE recherche: ${response.statusText}`,
            source: 'SIRENE'
          }
        };
      }

      const result = await response.json();
      
      if (!result.etablissements || result.etablissements.length === 0) {
        return { data: [], error: null };
      }

      // Transformer les résultats et dédupliquer par SIREN
      const seenSirens = new Set();
      const companies: SireneCompanyData[] = result.etablissements
        .filter((etablissement: any) => {
          const siren = etablissement.uniteLegale.siren;
          if (seenSirens.has(siren)) return false;
          seenSirens.add(siren);
          return true;
        })
        .map((etablissement: any) => {
          const uniteLegale = etablissement.uniteLegale;
          return {
            siren: uniteLegale.siren,
            siret: etablissement.siret,
            denomination: uniteLegale.denominationUniteLegale || `${uniteLegale.prenom1UniteLegale} ${uniteLegale.nomUniteLegale}`,
            naf: etablissement.activitePrincipaleEtablissement,
            effectifs: this.mapEffectifs(uniteLegale.trancheEffectifsUniteLegale),
            adresse: this.formatAdresse(etablissement.adresseEtablissement),
            statut: etablissement.etatAdministratifEtablissement === 'A' ? 'Actif' : 'Cessé',
            dateCreation: uniteLegale.dateCreationUniteLegale
          };
        });

      return { data: companies, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'SIRENE_SEARCH_NETWORK_ERROR',
          message: `Erreur réseau SIRENE recherche: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'SIRENE'
        }
      };
    }
  }

  async getCompanyBySiren(siren: string): Promise<{ data: SireneCompanyData | null; error: ApiError | null }> {
    try {
      const response = await fetch(`${SIRENE_API_BASE}/siret?q=siren:${siren}&nombre=1`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          data: null,
          error: {
            code: `SIRENE_${response.status}`,
            message: `Erreur API SIRENE: ${response.statusText}`,
            source: 'SIRENE'
          }
        };
      }

      const result = await response.json();
      
      if (!result.etablissements || result.etablissements.length === 0) {
        return {
          data: null,
          error: {
            code: 'SIRENE_NOT_FOUND',
            message: 'Entreprise non trouvée dans la base SIRENE',
            source: 'SIRENE'
          }
        };
      }

      const etablissement = result.etablissements[0];
      const uniteLegale = etablissement.uniteLegale;

      const data: SireneCompanyData = {
        siren: uniteLegale.siren,
        siret: etablissement.siret,
        denomination: uniteLegale.denominationUniteLegale || uniteLegale.prenom1UniteLegale + ' ' + uniteLegale.nomUniteLegale,
        naf: etablissement.activitePrincipaleEtablissement,
        effectifs: this.mapEffectifs(uniteLegale.trancheEffectifsUniteLegale),
        adresse: this.formatAdresse(etablissement.adresseEtablissement),
        statut: etablissement.etatAdministratifEtablissement === 'A' ? 'Actif' : 'Cessé',
        dateCreation: uniteLegale.dateCreationUniteLegale
      };

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'SIRENE_NETWORK_ERROR',
          message: `Erreur réseau SIRENE: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'SIRENE'
        }
      };
    }
  }

  async getCompanyBySiret(siret: string): Promise<{ data: SireneCompanyData | null; error: ApiError | null }> {
    try {
      const response = await fetch(`${SIRENE_API_BASE}/siret/${siret}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          data: null,
          error: {
            code: `SIRENE_${response.status}`,
            message: `Erreur API SIRENE: ${response.statusText}`,
            source: 'SIRENE'
          }
        };
      }

      const result = await response.json();
      const etablissement = result.etablissement;
      const uniteLegale = etablissement.uniteLegale;

      const data: SireneCompanyData = {
        siren: uniteLegale.siren,
        siret: etablissement.siret,
        denomination: uniteLegale.denominationUniteLegale || uniteLegale.prenom1UniteLegale + ' ' + uniteLegale.nomUniteLegale,
        naf: etablissement.activitePrincipaleEtablissement,
        effectifs: this.mapEffectifs(uniteLegale.trancheEffectifsUniteLegale),
        adresse: this.formatAdresse(etablissement.adresseEtablissement),
        statut: etablissement.etatAdministratifEtablissement === 'A' ? 'Actif' : 'Cessé',
        dateCreation: uniteLegale.dateCreationUniteLegale
      };

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          code: 'SIRENE_NETWORK_ERROR',
          message: `Erreur réseau SIRENE: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          source: 'SIRENE'
        }
      };
    }
  }

  private mapEffectifs(tranche: string): string {
    const mapping: Record<string, string> = {
      '00': '0 salarié',
      '01': '1 ou 2 salariés',
      '02': '3 à 5 salariés',
      '03': '6 à 9 salariés',
      '11': '10 à 19 salariés',
      '12': '20 à 49 salariés',
      '21': '50 à 99 salariés',
      '22': '100 à 199 salariés',
      '31': '200 à 249 salariés',
      '32': '250 à 499 salariés',
      '41': '500 à 999 salariés',
      '42': '1000 à 1999 salariés',
      '51': '2000 à 4999 salariés',
      '52': '5000 à 9999 salariés',
      '53': '10000 salariés et plus'
    };
    return mapping[tranche] || 'Non renseigné';
  }

  private formatAdresse(adresse: any): string {
    const parts = [
      adresse.numeroVoieEtablissement,
      adresse.typeVoieEtablissement,
      adresse.libelleVoieEtablissement,
      adresse.codePostalEtablissement,
      adresse.libelleCommuneEtablissement
    ].filter(Boolean);
    
    return parts.join(' ');
  }
}