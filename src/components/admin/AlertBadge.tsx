import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertTriangle, Shield, AlertCircle, CheckCircle } from "lucide-react";

export type AlertLevel = 'critical' | 'high' | 'medium' | 'low' | 'good';

export interface AlertBadgeProps {
  level: AlertLevel;
  message: string;
  score: number;
  className?: string;
}

const alertConfig = {
  critical: {
    icon: AlertTriangle,
    className: "border-transparent bg-alert-critical text-alert-critical-foreground hover:bg-alert-critical/80",
    bgClass: "bg-red-50 border-red-200",
  },
  high: {
    icon: AlertTriangle,
    className: "border-transparent bg-alert-high text-alert-high-foreground hover:bg-alert-high/80",
    bgClass: "bg-orange-50 border-orange-200",
  },
  medium: {
    icon: AlertCircle,
    className: "border-transparent bg-alert-medium text-alert-medium-foreground hover:bg-alert-medium/80",
    bgClass: "bg-yellow-50 border-yellow-200",
  },
  low: {
    icon: Shield,
    className: "border-transparent bg-alert-low text-alert-low-foreground hover:bg-alert-low/80",
    bgClass: "bg-green-50 border-green-200",
  },
  good: {
    icon: CheckCircle,
    className: "border-transparent bg-success text-success-foreground hover:bg-success/80",
    bgClass: "bg-green-50 border-green-200",
  },
};

export function AlertBadge({ level, message, score, className }: AlertBadgeProps) {
  const config = alertConfig[level];
  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center space-x-1", className)}>
      <Badge className={cn(config.className, "flex items-center space-x-1")}>
        <Icon className="h-3 w-3" />
        <span>{message}</span>
      </Badge>
      <Badge variant="outline" className="text-xs">
        {score.toFixed(1)}/10
      </Badge>
    </div>
  );
}