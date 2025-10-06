export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_analytics: {
        Row: {
          anonymous_searches: number | null
          api_calls: number | null
          created_at: string
          date: string
          id: string
          registered_users: number | null
          total_searches: number | null
          unique_users: number | null
        }
        Insert: {
          anonymous_searches?: number | null
          api_calls?: number | null
          created_at?: string
          date: string
          id?: string
          registered_users?: number | null
          total_searches?: number | null
          unique_users?: number | null
        }
        Update: {
          anonymous_searches?: number | null
          api_calls?: number | null
          created_at?: string
          date?: string
          id?: string
          registered_users?: number | null
          total_searches?: number | null
          unique_users?: number | null
        }
        Relationships: []
      }
      admin_companies: {
        Row: {
          activity: string | null
          address: string | null
          city: string | null
          company_name: string
          created_at: string
          edited_at: string | null
          edited_by: string | null
          encart_visibility: Json | null
          enriched_data: Json | null
          id: string
          is_manually_edited: boolean | null
          last_searched: string | null
          naf_code: string | null
          postal_code: string | null
          search_count: number | null
          show_data_quality_dashboard: boolean
          siren: string
          siret: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          activity?: string | null
          address?: string | null
          city?: string | null
          company_name: string
          created_at?: string
          edited_at?: string | null
          edited_by?: string | null
          encart_visibility?: Json | null
          enriched_data?: Json | null
          id?: string
          is_manually_edited?: boolean | null
          last_searched?: string | null
          naf_code?: string | null
          postal_code?: string | null
          search_count?: number | null
          show_data_quality_dashboard?: boolean
          siren: string
          siret?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          activity?: string | null
          address?: string | null
          city?: string | null
          company_name?: string
          created_at?: string
          edited_at?: string | null
          edited_by?: string | null
          encart_visibility?: Json | null
          enriched_data?: Json | null
          id?: string
          is_manually_edited?: boolean | null
          last_searched?: string | null
          naf_code?: string | null
          postal_code?: string | null
          search_count?: number | null
          show_data_quality_dashboard?: boolean
          siren?: string
          siret?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_edit_logs: {
        Row: {
          change_type: string
          company_id: string | null
          created_at: string
          editor_id: string | null
          field_changed: string
          id: string
          ip_address: unknown | null
          new_value: Json | null
          old_value: Json | null
          session_id: string | null
          siren: string
          user_agent: string | null
        }
        Insert: {
          change_type?: string
          company_id?: string | null
          created_at?: string
          editor_id?: string | null
          field_changed: string
          id?: string
          ip_address?: unknown | null
          new_value?: Json | null
          old_value?: Json | null
          session_id?: string | null
          siren: string
          user_agent?: string | null
        }
        Update: {
          change_type?: string
          company_id?: string | null
          created_at?: string
          editor_id?: string | null
          field_changed?: string
          id?: string
          ip_address?: unknown | null
          new_value?: Json | null
          old_value?: Json | null
          session_id?: string | null
          siren?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_edit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "admin_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_search_history: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          ip_address: unknown | null
          results_found: boolean | null
          search_query: string
          search_type: string
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          results_found?: boolean | null
          search_query: string
          search_type: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown | null
          results_found?: boolean | null
          search_query?: string
          search_type?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_search_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "admin_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          subscription_status: string | null
          total_searches: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          subscription_status?: string | null
          total_searches?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          subscription_status?: string | null
          total_searches?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      infogreffe_cache: {
        Row: {
          created_at: string
          credits_used: number
          data: Json
          endpoint: string
          expires_at: string
          id: string
          millesime: number | null
          siren: string
        }
        Insert: {
          created_at?: string
          credits_used?: number
          data: Json
          endpoint: string
          expires_at: string
          id?: string
          millesime?: number | null
          siren: string
        }
        Update: {
          created_at?: string
          credits_used?: number
          data?: Json
          endpoint?: string
          expires_at?: string
          id?: string
          millesime?: number | null
          siren?: string
        }
        Relationships: []
      }
      infogreffe_costs: {
        Row: {
          cost_euros: number
          created_at: string
          credits_used: number
          endpoint: string
          id: string
          ip_address: unknown | null
          session_id: string
          siren: string
          user_agent: string | null
        }
        Insert: {
          cost_euros?: number
          created_at?: string
          credits_used?: number
          endpoint: string
          id?: string
          ip_address?: unknown | null
          session_id: string
          siren: string
          user_agent?: string | null
        }
        Update: {
          cost_euros?: number
          created_at?: string
          credits_used?: number
          endpoint?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string
          siren?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      clean_expired_infogreffe_cache: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_infogreffe_cache: {
        Args: { p_endpoint: string; p_millesime?: number; p_siren: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_edit: {
        Args: {
          p_change_type?: string
          p_editor_id?: string
          p_field_changed: string
          p_ip_address?: unknown
          p_new_value?: Json
          p_old_value?: Json
          p_session_id?: string
          p_siren: string
          p_user_agent?: string
        }
        Returns: string
      }
      log_search_activity: {
        Args: {
          p_company_id?: string
          p_ip_address?: unknown
          p_results_found?: boolean
          p_search_query: string
          p_search_type: string
          p_user_agent?: string
        }
        Returns: string
      }
      set_infogreffe_cache: {
        Args: {
          p_credits_used?: number
          p_data: Json
          p_endpoint: string
          p_millesime?: number
          p_siren: string
          p_ttl_hours?: number
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
