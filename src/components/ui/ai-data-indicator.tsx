import * as React from "react";
import { Bot, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AIDataIndicatorProps {
  variant?: "mini" | "inline" | "badge";
  className?: string;
  showTooltip?: boolean;
  tooltipText?: string;
}

const AIDataIndicator: React.FC<AIDataIndicatorProps> = ({
  variant = "mini",
  className,
  showTooltip = true,
  tooltipText = "Donnée générée par intelligence artificielle"
}) => {
  const indicatorContent = (() => {
    switch (variant) {
      case "mini":
        return (
          <div className={cn(
            "inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-600",
            "dark:bg-blue-900 dark:text-blue-400",
            className
          )}>
            <Bot className="h-2.5 w-2.5" />
          </div>
        );
      case "inline":
        return (
          <div className={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
            "bg-blue-50 text-blue-700 border border-blue-200",
            "dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
            className
          )}>
            <Bot className="h-3 w-3" />
            <span>IA</span>
          </div>
        );
      case "badge":
        return (
          <div className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
            "bg-blue-100 text-blue-800 border border-blue-300",
            "dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
            className
          )}>
            <Bot className="h-3 w-3" />
            <span>Généré par IA</span>
          </div>
        );
    }
  })();

  if (!showTooltip) {
    return indicatorContent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {indicatorContent}
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2 max-w-xs">
            <Info className="h-3 w-3 flex-shrink-0" />
            <span className="text-xs">{tooltipText}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { AIDataIndicator };