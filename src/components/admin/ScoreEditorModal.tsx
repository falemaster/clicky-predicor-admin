import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CreditCard, Shield, Scale, Edit } from "lucide-react";

interface ScoreEditorModalProps {
  globalScore: number;
  economicScore?: number;
  financialScore?: number;
  legalScore?: number;
  fiscalScore?: number;
  onScoresChange: (scores: {
    economic: number;
    financial: number;
    legal: number;
    fiscal: number;
    global: number;
  }) => void;
  children: React.ReactNode;
}

export const ScoreEditorModal: React.FC<ScoreEditorModalProps> = ({
  globalScore,
  economicScore = 6.0,
  financialScore = 6.0,
  legalScore = 7.5,
  fiscalScore = 6.8,
  onScoresChange,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scores, setScores] = useState({
    economic: economicScore,
    financial: financialScore,
    legal: legalScore,
    fiscal: fiscalScore
  });

  useEffect(() => {
    setScores({
      economic: economicScore,
      financial: financialScore,
      legal: legalScore,
      fiscal: fiscalScore
    });
  }, [economicScore, financialScore, legalScore, fiscalScore, isOpen]);

  const calculateGlobalScore = (newScores: typeof scores) => {
    // Formule: (Économique × 25%) + (Financière × 25%) + (Juridique × 25%) + (Fiscale × 25%)
    return (newScores.economic * 0.25) + (newScores.financial * 0.25) + (newScores.legal * 0.25) + (newScores.fiscal * 0.25);
  };

  const handleScoreChange = (scoreType: keyof typeof scores, value: string) => {
    const numValue = parseFloat(value) || 0;
    const clampedValue = Math.max(0, Math.min(10, numValue)); // Clamp entre 0 et 10
    
    setScores(prev => ({
      ...prev,
      [scoreType]: clampedValue
    }));
  };

  const handleSave = () => {
    const globalScore = calculateGlobalScore(scores);
    onScoresChange({
      ...scores,
      global: globalScore
    });
    setIsOpen(false);
  };

  const currentGlobalScore = calculateGlobalScore(scores);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Edit className="h-5 w-5 mr-2" />
            Modifier les notes individuelles
          </DialogTitle>
          <DialogDescription>
            Ajustez les 4 notes individuelles. La note globale sera automatiquement recalculée.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Economic Score */}
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              Note Économique
            </Label>
            <Input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={scores.economic}
              onChange={(e) => handleScoreChange('economic', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Financial Score */}
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <CreditCard className="h-4 w-4 mr-2 text-primary" />
              Note Financière
            </Label>
            <Input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={scores.financial}
              onChange={(e) => handleScoreChange('financial', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Legal Score */}
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              Note Juridique
            </Label>
            <Input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={scores.legal}
              onChange={(e) => handleScoreChange('legal', e.target.value)}
              className="w-full"
            />
          </div>

          {/* Fiscal Score */}
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              <Scale className="h-4 w-4 mr-2 text-primary" />
              Note Fiscale
            </Label>
            <Input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={scores.fiscal}
              onChange={(e) => handleScoreChange('fiscal', e.target.value)}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Global Score Preview */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Note globale calculée:</span>
              <Badge variant="default" className="text-lg px-3 py-1">
                {currentGlobalScore.toFixed(1)}/10
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Formule: (Économique + Financière + Juridique + Fiscale) ÷ 4
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              Sauvegarder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};