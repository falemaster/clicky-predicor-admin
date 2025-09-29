import { createContext, useContext, ReactNode } from 'react';

export interface EditingContextType {
  isEditing: boolean;
  onEdit?: (field: string, value: any) => void;
}

const EditingContext = createContext<EditingContextType>({
  isEditing: false,
  onEdit: undefined
});

export function useEditing() {
  return useContext(EditingContext);
}

interface EditingProviderProps {
  children: ReactNode;
  mode: 'user' | 'admin';
  onEdit?: (field: string, value: any) => void;
}

export function EditingProvider({ children, mode, onEdit }: EditingProviderProps) {
  return (
    <EditingContext.Provider value={{
      isEditing: mode === 'admin',
      onEdit
    }}>
      {children}
    </EditingContext.Provider>
  );
}