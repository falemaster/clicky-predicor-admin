import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VisibilityToggleProps {
  isVisible: boolean;
  onToggle: (visible: boolean) => void;
  label: string;
  className?: string;
}

export const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
  isVisible,
  onToggle,
  label,
  className
}) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex items-center space-x-2">
        {isVisible ? (
          <Eye className="h-4 w-4 text-success" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        )}
        <Switch
          checked={isVisible}
          onCheckedChange={onToggle}
        />
      </div>
      <Label className="text-sm font-medium cursor-pointer" onClick={() => onToggle(!isVisible)}>
        {label}
      </Label>
      <Badge 
        variant={isVisible ? "default" : "secondary"}
        className="text-xs"
      >
        {isVisible ? "Visible" : "Masqué"}
      </Badge>
    </div>
  );
};