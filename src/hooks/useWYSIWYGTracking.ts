import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EditLog {
  fieldChanged: string;
  oldValue: any;
  newValue: any;
  changeType?: 'update' | 'create' | 'delete';
}

export function useWYSIWYGTracking(siren: string) {
  const [sessionId] = useState(() => crypto.randomUUID());

  const logEdit = useCallback(async (
    fieldChanged: string,
    oldValue: any,
    newValue: any,
    changeType: 'update' | 'create' | 'delete' = 'update'
  ) => {
    try {
      // Get user agent and IP (IP will be null on client side but that's ok)
      const userAgent = navigator.userAgent;
      
      await supabase.rpc('log_admin_edit', {
        p_siren: siren,
        p_field_changed: fieldChanged,
        p_old_value: oldValue ? JSON.stringify(oldValue) : null,
        p_new_value: newValue ? JSON.stringify(newValue) : null,
        p_change_type: changeType,
        p_session_id: sessionId,
        p_user_agent: userAgent
      });
    } catch (error) {
      console.error('Erreur lors du logging de l\'édition:', error);
    }
  }, [siren, sessionId]);

  const logBatchEdits = useCallback(async (edits: EditLog[]) => {
    try {
      const promises = edits.map(edit => 
        logEdit(edit.fieldChanged, edit.oldValue, edit.newValue, edit.changeType)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Erreur lors du logging des éditions en lot:', error);
    }
  }, [logEdit]);

  return {
    logEdit,
    logBatchEdits,
    sessionId
  };
}