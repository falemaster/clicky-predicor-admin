import { useState, useEffect } from "react";
import { DataQualitySection } from "@/components/ui/data-quality-section";

export default function Analysis() {
  const [companyData] = useState({
    siren: "405391129",
    name: "EXEMPLE ENTREPRISE",
    status: "Actif",
    naf: "6202A",
    address: "123 rue de la République, 75001 Paris",
    director: "Jean Dupont",
    employees: 25,
    phone: "+33 1 23 45 67 89",
    email: "contact@exemple.fr"
  });

  const [scores] = useState({
    financial: 7.2,
    legal: 8.5,
    fiscal: 6.8,
    global: 7.5
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">{companyData.name}</h1>
            <p className="text-muted-foreground">SIREN: {companyData.siren}</p>
          </div>

          {/* Data Quality Section */}
          <DataQualitySection data={companyData} />

          {/* Scores */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-success/10 rounded-lg">
              <h3 className="font-semibold mb-2">Santé Financière</h3>
              <div className="text-3xl font-bold text-success">{scores.financial}/10</div>
            </div>
            <div className="text-center p-6 bg-primary/10 rounded-lg">
              <h3 className="font-semibold mb-2">Conformité Légale</h3>
              <div className="text-3xl font-bold text-primary">{scores.legal}/10</div>
            </div>
            <div className="text-center p-6 bg-warning/10 rounded-lg">
              <h3 className="font-semibold mb-2">Score Global</h3>
              <div className="text-3xl font-bold text-warning">{scores.global}/10</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}