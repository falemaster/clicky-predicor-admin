import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, TrendingUp, Target, Lightbulb, Edit, Check, X, RefreshCw } from "lucide-react";
import { generateExecutiveSummary, ScoreAnalysis, ExecutiveSummaryData } from "@/utils/executiveSummaryGenerator";

interface ExecutiveSummaryProps {
  scores: ScoreAnalysis;
  companyName?: string;
  existingSummary?: Partial<ExecutiveSummaryData>;
  onSummaryChange?: (summary: ExecutiveSummaryData) => void;
  editable?: boolean;
}

export function ExecutiveSummary({ 
  scores, 
  companyName = "L'entreprise", 
  existingSummary,
  onSummaryChange,
  editable = false
}: ExecutiveSummaryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSummary, setEditingSummary] = useState<ExecutiveSummaryData>();
  const [currentSummary, setCurrentSummary] = useState<ExecutiveSummaryData>();

  // Générer ou utiliser la synthèse existante
  useEffect(() => {
    const generatedSummary = generateExecutiveSummary(scores, companyName);
    
    // Utiliser la synthèse existante si disponible, sinon utiliser la générée
    const finalSummary: ExecutiveSummaryData = {
      profile: existingSummary?.profile || generatedSummary.profile,
      strengths: existingSummary?.strengths || generatedSummary.strengths,
      optimizationAreas: existingSummary?.optimizationAreas || generatedSummary.optimizationAreas,
      strategicRecommendation: existingSummary?.strategicRecommendation || generatedSummary.strategicRecommendation
    };
    
    setCurrentSummary(finalSummary);
  }, [scores, companyName, existingSummary]);

  const handleRegenerate = () => {
    const generatedSummary = generateExecutiveSummary(scores, companyName);
    setCurrentSummary(generatedSummary);
    onSummaryChange?.(generatedSummary);
  };

  const handleEdit = () => {
    setEditingSummary(currentSummary);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingSummary) {
      setCurrentSummary(editingSummary);
      onSummaryChange?.(editingSummary);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingSummary(undefined);
    setIsEditing(false);
  };

  if (!currentSummary) return null;

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-success";
    if (score >= 5.5) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10 mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl text-primary">Synthèse Exécutive</CardTitle>
          </div>
          {editable && (
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRegenerate}
                className="flex items-center space-x-1"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Régénérer IA</span>
              </Button>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleEdit}
                  className="flex items-center space-x-1"
                >
                  <Edit className="h-3 w-3" />
                  <span>Modifier</span>
                </Button>
              ) : (
                <div className="flex space-x-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSave}
                    className="flex items-center space-x-1"
                  >
                    <Check className="h-3 w-3" />
                    <span>Sauvegarder</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancel}
                    className="flex items-center space-x-1"
                  >
                    <X className="h-3 w-3" />
                    <span>Annuler</span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Executive Summary - Single paragraph format */}
        <div className="space-y-2">
          {isEditing ? (
            <Textarea
              value={editingSummary?.profile || ""}
              onChange={(e) => setEditingSummary(prev => prev ? {...prev, profile: e.target.value} : undefined)}
              className="min-h-[120px] text-muted-foreground leading-relaxed"
              placeholder="Synthèse exécutive en paragraphe libre (6-7 lignes maximum)..."
            />
          ) : (
            <p className="text-muted-foreground leading-relaxed">
              {currentSummary.profile}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}