export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      "Beta Signups": {
        Row: {
          company: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_beta_client: boolean
          last_name: string
          message: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_beta_client?: boolean
          last_name: string
          message: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_beta_client?: boolean
          last_name?: string
          message?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          id: string
          name: string | null
          org_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          org_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          org_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      org_context: {
        Row: {
          created_at: string | null
          culture: string | null
          departments: string | null
          executives: Json | null
          glossary: Json | null
          history: string | null
          id: string
          known_pain_points: Json | null
          leadership_style: string | null
          mission: string | null
          name: string
          onboarding_processes: string | null
          org_id: string | null
          org_kpis: string | null
          policies: Json | null
          tools_and_systems: string | null
          values: Json | null
        }
        Insert: {
          created_at?: string | null
          culture?: string | null
          departments?: string | null
          executives?: Json | null
          glossary?: Json | null
          history?: string | null
          id?: string
          known_pain_points?: Json | null
          leadership_style?: string | null
          mission?: string | null
          name: string
          onboarding_processes?: string | null
          org_id?: string | null
          org_kpis?: string | null
          policies?: Json | null
          tools_and_systems?: string | null
          values?: Json | null
        }
        Update: {
          created_at?: string | null
          culture?: string | null
          departments?: string | null
          executives?: Json | null
          glossary?: Json | null
          history?: string | null
          id?: string
          known_pain_points?: Json | null
          leadership_style?: string | null
          mission?: string | null
          name?: string
          onboarding_processes?: string | null
          org_id?: string | null
          org_kpis?: string | null
          policies?: Json | null
          tools_and_systems?: string | null
          values?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "org_context_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      org_knowledge: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          org_id: string
          summary: string | null
          title: string | null
          visibility: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          org_id: string
          summary?: string | null
          title?: string | null
          visibility?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          org_id?: string
          summary?: string | null
          title?: string | null
          visibility?: string | null
        }
        Relationships: []
      }
      orgs: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      roadmaps: {
        Row: {
          created_at: string
          department_id: string | null
          description: string | null
          id: string
          org_id: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          description?: string | null
          id?: string
          org_id?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          department_id?: string | null
          description?: string | null
          id?: string
          org_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmaps_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "roadmaps_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      role_sync_log: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          new_role: string
          old_role: string | null
          user_id: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role: string
          old_role?: string | null
          user_id: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          new_role?: string
          old_role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_context: {
        Row: {
          created_at: string | null
          department: string | null
          feedback_given: Json | null
          goals: Json | null
          id: string
          introvert_extrovert: string | null
          learning_style: string | null
          location: string | null
          manager_name: string | null
          org_id: string | null
          personality_notes: string | null
          questions_asked: Json | null
          role: string | null
          start_date: string | null
          timezone: string | null
          user_id: string | null
          working_hours: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          feedback_given?: Json | null
          goals?: Json | null
          id?: string
          introvert_extrovert?: string | null
          learning_style?: string | null
          location?: string | null
          manager_name?: string | null
          org_id?: string | null
          personality_notes?: string | null
          questions_asked?: Json | null
          role?: string | null
          start_date?: string | null
          timezone?: string | null
          user_id?: string | null
          working_hours?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          feedback_given?: Json | null
          goals?: Json | null
          id?: string
          introvert_extrovert?: string | null
          learning_style?: string | null
          location?: string | null
          manager_name?: string | null
          org_id?: string | null
          personality_notes?: string | null
          questions_asked?: Json | null
          role?: string | null
          start_date?: string | null
          timezone?: string | null
          user_id?: string | null
          working_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_context_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          org_id: string | null
          org_role: string | null
          role: string | null
          team: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          interests?: string[] | null
          org_id?: string | null
          org_role?: string | null
          role?: string | null
          team?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          org_id?: string | null
          org_role?: string | null
          role?: string | null
          team?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "orgs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bytea_to_text: {
        Args: { data: string }
        Returns: string
      }
      http: {
        Args: { request: Database["public"]["CompositeTypes"]["http_request"] }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete: {
        Args:
          | { uri: string }
          | { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_get: {
        Args: { uri: string } | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_head: {
        Args: { uri: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: { field: string; value: string }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post: {
        Args:
          | { uri: string; content: string; content_type: string }
          | { uri: string; data: Json }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_put: {
        Args: { uri: string; content: string; content_type: string }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: { curlopt: string; value: string }
        Returns: boolean
      }
      text_to_bytea: {
        Args: { data: string }
        Returns: string
      }
      urlencode: {
        Args: { string: string } | { string: string } | { data: Json }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
