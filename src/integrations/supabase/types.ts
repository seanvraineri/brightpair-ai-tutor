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
      appointments: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          starts_at: string
          status: string
          student_id: string
          tutor_id: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          starts_at: string
          status: string
          student_id: string
          tutor_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          starts_at?: string
          status?: string
          student_id?: string
          tutor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          content_md: string | null
          created_at: string
          due_at: string | null
          id: string
          status: string
          student_id: string
          title: string
          tutor_id: string | null
          type: string
        }
        Insert: {
          content_md?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          status?: string
          student_id: string
          title: string
          tutor_id?: string | null
          type?: string
        }
        Update: {
          content_md?: string | null
          created_at?: string
          due_at?: string | null
          id?: string
          status?: string
          student_id?: string
          title?: string
          tutor_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_logs: {
        Row: {
          created_at: string | null
          id: string
          message: string
          response: string
          skills_addressed: Json | null
          student_id: string | null
          track_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          response: string
          skills_addressed?: Json | null
          student_id?: string | null
          track_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          response?: string
          skills_addressed?: Json | null
          student_id?: string | null
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_logs_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "learning_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards_sets: {
        Row: {
          cards: Json
          created_at: string | null
          description: string | null
          id: string
          name: string
          student_id: string | null
          track_id: string | null
          updated_at: string | null
        }
        Insert: {
          cards: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          student_id?: string | null
          track_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cards?: Json
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          student_id?: string | null
          track_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_sets_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "learning_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      homework: {
        Row: {
          content_md: string | null
          created_at: string
          description: string | null
          documents: Json | null
          due_at: string | null
          due_date: string | null
          id: string
          num_questions: number | null
          questions: Json | null
          source_pdf_provided: boolean | null
          status: string
          student_id: string
          subject: string
          title: string
          track_id: string | null
          tutor_id: string | null
          updated_at: string
        }
        Insert: {
          content_md?: string | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          due_at?: string | null
          due_date?: string | null
          id?: string
          num_questions?: number | null
          questions?: Json | null
          source_pdf_provided?: boolean | null
          status?: string
          student_id: string
          subject: string
          title: string
          track_id?: string | null
          tutor_id?: string | null
          updated_at?: string
        }
        Update: {
          content_md?: string | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          due_at?: string | null
          due_date?: string | null
          id?: string
          num_questions?: number | null
          questions?: Json | null
          source_pdf_provided?: boolean | null
          status?: string
          student_id?: string
          subject?: string
          title?: string
          track_id?: string | null
          tutor_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "learning_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_tracks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          tutor_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          tutor_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          tutor_id?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          completed_at: string | null
          content: string | null
          content_md: string | null
          created_at: string
          id: string
          notes: string | null
          resources: Json | null
          status: string
          student_id: string
          subject: string
          title: string
          track_id: string | null
          tutor_id: string | null
        }
        Insert: {
          completed_at?: string | null
          content?: string | null
          content_md?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          resources?: Json | null
          status?: string
          student_id: string
          subject: string
          title: string
          track_id?: string | null
          tutor_id?: string | null
        }
        Update: {
          completed_at?: string | null
          content?: string | null
          content_md?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          resources?: Json | null
          status?: string
          student_id?: string
          subject?: string
          title?: string
          track_id?: string | null
          tutor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "learning_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          receiver_id: string
          role: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          receiver_id: string
          role: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          receiver_id?: string
          role?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_students: {
        Row: {
          assigned_at: string | null
          parent_id: string
          student_id: string
        }
        Insert: {
          assigned_at?: string | null
          parent_id: string
          student_id: string
        }
        Update: {
          assigned_at?: string | null
          parent_id?: string
          student_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          profile_id: string
          stripe_session: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          id?: string
          profile_id: string
          stripe_session: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          profile_id?: string
          stripe_session?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_staff: boolean
          learning_preferences: Json | null
          mastery_level: number | null
          name: string | null
          next_consultation_date: string | null
          onboarding_status: string
          role: string
          strengths: string | null
          updated_at: string
          weaknesses: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_staff?: boolean
          learning_preferences?: Json | null
          mastery_level?: number | null
          name?: string | null
          next_consultation_date?: string | null
          onboarding_status?: string
          role?: string
          strengths?: string | null
          updated_at?: string
          weaknesses?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_staff?: boolean
          learning_preferences?: Json | null
          mastery_level?: number | null
          name?: string | null
          next_consultation_date?: string | null
          onboarding_status?: string
          role?: string
          strengths?: string | null
          updated_at?: string
          weaknesses?: string | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          answers: Json | null
          completed_at: string | null
          created_at: string
          id: string
          questions: Json | null
          quiz_json: Json
          score: number | null
          skill_id: string | null
          student_id: string
          subject: string
          title: string
          track_id: string | null
        }
        Insert: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          questions?: Json | null
          quiz_json?: Json
          score?: number | null
          skill_id?: string | null
          student_id: string
          subject: string
          title: string
          track_id?: string | null
        }
        Update: {
          answers?: Json | null
          completed_at?: string | null
          created_at?: string
          id?: string
          questions?: Json | null
          quiz_json?: Json
          score?: number | null
          skill_id?: string | null
          student_id?: string
          subject?: string
          title?: string
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "learning_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          description: string | null
          id: string
          name: string
          track_id: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          track_id?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skills_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "learning_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      student_parent_relationships: {
        Row: {
          created_at: string
          id: string
          parent_id: string
          student_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parent_id: string
          student_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parent_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_parent_relationships_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_parent_relationships_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_skills: {
        Row: {
          last_assessed: string | null
          mastery_level: number | null
          skill_id: string
          student_id: string
        }
        Insert: {
          last_assessed?: string | null
          mastery_level?: number | null
          skill_id: string
          student_id: string
        }
        Update: {
          last_assessed?: string | null
          mastery_level?: number | null
          skill_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      student_tracks: {
        Row: {
          completed_at: string | null
          progress: number | null
          started_at: string | null
          student_id: string
          track_id: string
        }
        Insert: {
          completed_at?: string | null
          progress?: number | null
          started_at?: string | null
          student_id: string
          track_id: string
        }
        Update: {
          completed_at?: string | null
          progress?: number | null
          started_at?: string | null
          student_id?: string
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "learning_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          content: string | null
          embedding: string | null
          id: string
          title: string
          track_id: string | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: string
          title: string
          track_id?: string | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: string
          title?: string
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "learning_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          student_id: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          student_id: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          student_id?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_notes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tutor_notes_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_students: {
        Row: {
          assigned_at: string | null
          student_id: string
          tutor_id: string
        }
        Insert: {
          assigned_at?: string | null
          student_id: string
          tutor_id: string
        }
        Update: {
          assigned_at?: string | null
          student_id?: string
          tutor_id?: string
        }
        Relationships: []
      }
      user_documents: {
        Row: {
          content: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          student_id: string
          subject: string | null
          title: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          student_id: string
          subject?: string | null
          title: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          student_id?: string
          subject?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_gamification: {
        Row: {
          learning_goals: string[] | null
          learning_style: string | null
          user_id: string
        }
        Insert: {
          learning_goals?: string[] | null
          learning_style?: string | null
          user_id: string
        }
        Update: {
          learning_goals?: string[] | null
          learning_style?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role: Database["public"]["Enums"]["role_type"]
          user_id: string
        }
        Insert: {
          role: Database["public"]["Enums"]["role_type"]
          user_id: string
        }
        Update: {
          role?: Database["public"]["Enums"]["role_type"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      build_student_snapshot: {
        Args: { p_student: string }
        Returns: Json
      }
      current_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      decay_mastery: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_user_roles: {
        Args: { user_id: string }
        Returns: {
          role: Database["public"]["Enums"]["role_type"]
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_parent_of: {
        Args: { p_student: string }
        Returns: boolean
      }
      is_staff: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      role_type: "student" | "tutor" | "parent"
    }
    CompositeTypes: {
      [_ in never]: never
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
    Enums: {
      role_type: ["student", "tutor", "parent"],
    },
  },
} as const
