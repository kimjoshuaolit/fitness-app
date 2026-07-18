export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      daily_weights: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          user_id: string
          weight_lbs: number
        }
        Insert: {
          created_at?: string
          entry_date: string
          id?: string
          user_id: string
          weight_lbs: number
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          user_id?: string
          weight_lbs?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_weights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          created_at: string
          decided_on: string
          decision: string
          id: string
          phase_id: string
          rationale: string
          status: string
        }
        Insert: {
          created_at?: string
          decided_on?: string
          decision: string
          id?: string
          phase_id: string
          rationale?: string
          status?: string
        }
        Update: {
          created_at?: string
          decided_on?: string
          decision?: string
          id?: string
          phase_id?: string
          rationale?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "decisions_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decisions_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "v_phase_summary"
            referencedColumns: ["phase_id"]
          },
        ]
      }
      phases: {
        Row: {
          calorie_high: number | null
          calorie_low: number | null
          created_at: string
          end_date: string | null
          goal_waist_cm: number | null
          goal_weight_high_lbs: number | null
          goal_weight_low_lbs: number | null
          id: string
          name: string
          notes: string | null
          protein_floor_g: number | null
          start_date: string
          status: string
          user_id: string
        }
        Insert: {
          calorie_high?: number | null
          calorie_low?: number | null
          created_at?: string
          end_date?: string | null
          goal_waist_cm?: number | null
          goal_weight_high_lbs?: number | null
          goal_weight_low_lbs?: number | null
          id?: string
          name: string
          notes?: string | null
          protein_floor_g?: number | null
          start_date: string
          status?: string
          user_id: string
        }
        Update: {
          calorie_high?: number | null
          calorie_low?: number | null
          created_at?: string
          end_date?: string | null
          goal_waist_cm?: number | null
          goal_weight_high_lbs?: number | null
          goal_weight_low_lbs?: number | null
          id?: string
          name?: string
          notes?: string | null
          protein_floor_g?: number | null
          start_date?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "phases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          height_cm: number | null
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          height_cm?: number | null
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          height_cm?: number | null
          id?: string
          role?: string
        }
        Relationships: []
      }
      weekly_entries: {
        Row: {
          calories_avg: number | null
          carbs_avg_g: number | null
          created_at: string
          fats_avg_g: number | null
          id: string
          notes: string
          performance_notes: string
          phase_id: string
          protein_avg_g: number | null
          sleep_avg_hrs: number | null
          steps_avg: number | null
          waist_cm: number | null
          week_start: string
        }
        Insert: {
          calories_avg?: number | null
          carbs_avg_g?: number | null
          created_at?: string
          fats_avg_g?: number | null
          id?: string
          notes?: string
          performance_notes?: string
          phase_id: string
          protein_avg_g?: number | null
          sleep_avg_hrs?: number | null
          steps_avg?: number | null
          waist_cm?: number | null
          week_start: string
        }
        Update: {
          calories_avg?: number | null
          carbs_avg_g?: number | null
          created_at?: string
          fats_avg_g?: number | null
          id?: string
          notes?: string
          performance_notes?: string
          phase_id?: string
          protein_avg_g?: number | null
          sleep_avg_hrs?: number | null
          steps_avg?: number | null
          waist_cm?: number | null
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_entries_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_entries_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "v_phase_summary"
            referencedColumns: ["phase_id"]
          },
        ]
      }
    }
    Views: {
      v_daily_weights: {
        Row: {
          avg_7d: number | null
          delta_prev: number | null
          entry_date: string | null
          user_id: string | null
          weight_lbs: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_weights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_phase_summary: {
        Row: {
          current_waist_cm: number | null
          end_date: string | null
          goal_waist_cm: number | null
          goal_weight_high_lbs: number | null
          goal_weight_low_lbs: number | null
          name: string | null
          phase_id: string | null
          start_date: string | null
          start_waist_cm: number | null
          status: string | null
          user_id: string | null
          weeks_logged: number | null
        }
        Insert: {
          current_waist_cm?: never
          end_date?: string | null
          goal_waist_cm?: number | null
          goal_weight_high_lbs?: number | null
          goal_weight_low_lbs?: number | null
          name?: string | null
          phase_id?: string | null
          start_date?: string | null
          start_waist_cm?: never
          status?: string | null
          user_id?: string | null
          weeks_logged?: never
        }
        Update: {
          current_waist_cm?: never
          end_date?: string | null
          goal_waist_cm?: number | null
          goal_weight_high_lbs?: number | null
          goal_weight_low_lbs?: number | null
          name?: string | null
          phase_id?: string | null
          start_date?: string | null
          start_waist_cm?: never
          status?: string | null
          user_id?: string | null
          weeks_logged?: never
        }
        Relationships: [
          {
            foreignKeyName: "phases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      v_weekly_status: {
        Row: {
          calories_avg: number | null
          calories_ok: boolean | null
          carbs_avg_g: number | null
          created_at: string | null
          fats_avg_g: number | null
          id: string | null
          notes: string | null
          performance_notes: string | null
          phase_id: string | null
          phase_name: string | null
          protein_avg_g: number | null
          protein_ok: boolean | null
          sleep_avg_hrs: number | null
          steps_avg: number | null
          user_id: string | null
          waist_cm: number | null
          week_start: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_entries_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_entries_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "v_phase_summary"
            referencedColumns: ["phase_id"]
          },
        ]
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

