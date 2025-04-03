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
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          org_id: string | null
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
          role?: string | null
          team?: string | null
          updated_at?: string
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
          {
            foreignKeyName: "user_context_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
