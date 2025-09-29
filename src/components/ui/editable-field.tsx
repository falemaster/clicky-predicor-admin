import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Edit } from "lucide-react";
import { useEditing } from "@/components/result/EditingContext";

interface EditableFieldProps {
  value: string | number;
  field: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  multiline?: boolean;
  className?: string;
  displayValue?: string;
}

export function EditableField({ 
  value, 
  field, 
  icon, 
  badge, 
  multiline = false, 
  className = "",
  displayValue
}: EditableFieldProps) {
  const { isEditing, onEdit } = useEditing();
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value?.toString() || '');

  if (!isEditing) {
    // Mode lecture seule (user)
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {icon}
        <span className="text-sm">{displayValue || value}</span>
        {badge}
      </div>
    );
  }

  const handleSave = () => {
    onEdit?.(field, tempValue);
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value?.toString() || '');
    setIsLocalEditing(false);
  };

  const handleEdit = () => {
    setTempValue(value?.toString() || '');
    setIsLocalEditing(true);
  };

  if (isLocalEditing) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium">{field}:</span>
        </div>
        <div className="flex items-center space-x-2">
          {multiline ? (
            <Textarea
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1"
              rows={3}
            />
          ) : (
            <Input
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1"
            />
          )}
          <Button size="sm" onClick={handleSave}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-3 group ${className}`}>
      {icon}
      <span className="text-sm flex-1">{displayValue || value}</span>
      {badge}
      <Button
        size="sm"
        variant="ghost"
        onClick={handleEdit}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Edit className="h-3 w-3" />
      </Button>
    </div>
  );
}