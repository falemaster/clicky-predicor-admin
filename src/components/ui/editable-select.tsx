import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Edit } from "lucide-react";
import { useEditing } from "@/components/result/EditingContext";

interface EditableSelectProps {
  value: string;
  field: string;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
  placeholder?: string;
}

export function EditableSelect({ 
  value, 
  field, 
  options,
  icon, 
  badge, 
  className = "",
  placeholder = "Sélectionner..."
}: EditableSelectProps) {
  const { isEditing, onEdit } = useEditing();
  const [isLocalEditing, setIsLocalEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');

  if (!isEditing) {
    // Mode lecture seule (user)
    const selectedOption = options.find(opt => opt.value === value);
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {icon}
        <span className="text-sm">{selectedOption?.label || value || "Non défini"}</span>
        {badge}
      </div>
    );
  }

  const handleSave = () => {
    onEdit?.(field, tempValue);
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value || '');
    setIsLocalEditing(false);
  };

  const handleEdit = () => {
    setTempValue(value || '');
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
          <Select value={tempValue} onValueChange={setTempValue}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

  const selectedOption = options.find(opt => opt.value === value);
  
  return (
    <div className={`flex items-center space-x-3 group ${className}`}>
      {icon}
      <span className="text-sm flex-1">{selectedOption?.label || value || "Non défini"}</span>
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