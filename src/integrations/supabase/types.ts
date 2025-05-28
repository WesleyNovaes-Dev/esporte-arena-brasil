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
      championships: {
        Row: {
          championship_type: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          organizer_id: string | null
          prize_pool: number | null
          sport_id: string | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          championship_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          organizer_id?: string | null
          prize_pool?: number | null
          sport_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          championship_type?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          organizer_id?: string | null
          prize_pool?: number | null
          sport_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "championships_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "championships_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          event_id: string | null
          id: string
          joined_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          event_id?: string | null
          id?: string
          joined_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          event_id?: string | null
          id?: string
          joined_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          event_date: string
          event_time: string
          event_type: string | null
          id: string
          location: string
          max_participants: number | null
          organizer_id: string | null
          price: number | null
          sport_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_date: string
          event_time: string
          event_type?: string | null
          id?: string
          location: string
          max_participants?: number | null
          organizer_id?: string | null
          price?: number | null
          sport_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_date?: string
          event_time?: string
          event_type?: string | null
          id?: string
          location?: string
          max_participants?: number | null
          organizer_id?: string | null
          price?: number | null
          sport_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number | null
          away_team_id: string | null
          created_at: string | null
          event_id: string | null
          home_score: number | null
          home_team_id: string | null
          id: string
          location: string | null
          match_date: string
          status: string | null
        }
        Insert: {
          away_score?: number | null
          away_team_id?: string | null
          created_at?: string | null
          event_id?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          location?: string | null
          match_date: string
          status?: string | null
        }
        Update: {
          away_score?: number | null
          away_team_id?: string | null
          created_at?: string | null
          event_id?: string | null
          home_score?: number | null
          home_team_id?: string | null
          id?: string
          location?: string | null
          match_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          related_id: string | null
          related_type: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      player_stats: {
        Row: {
          assists: number | null
          attendance: boolean | null
          created_at: string | null
          goals: number | null
          id: string
          match_id: string | null
          red_cards: number | null
          team_id: string | null
          user_id: string | null
          yellow_cards: number | null
        }
        Insert: {
          assists?: number | null
          attendance?: boolean | null
          created_at?: string | null
          goals?: number | null
          id?: string
          match_id?: string | null
          red_cards?: number | null
          team_id?: string | null
          user_id?: string | null
          yellow_cards?: number | null
        }
        Update: {
          assists?: number | null
          attendance?: boolean | null
          created_at?: string | null
          goals?: number | null
          id?: string
          match_id?: string | null
          red_cards?: number | null
          team_id?: string | null
          user_id?: string | null
          yellow_cards?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "player_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      private_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          media_url: string | null
          message_type: string | null
          receiver_id: string | null
          sender_id: string | null
          team_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          media_url?: string | null
          message_type?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          team_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          media_url?: string | null
          message_type?: string | null
          receiver_id?: string | null
          sender_id?: string | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "private_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "private_messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          city: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          state: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          city?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      sports: {
        Row: {
          created_at: string | null
          description: string | null
          emoji: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          emoji?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      team_invitations: {
        Row: {
          created_at: string | null
          id: string
          profile_id: string | null
          status: string | null
          team_id: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          status?: string | null
          team_id?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          profile_id?: string | null
          status?: string | null
          team_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invitations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          custom_role_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          status: string | null
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          custom_role_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          custom_role_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_custom_role_id_fkey"
            columns: ["custom_role_id"]
            isOneToOne: false
            referencedRelation: "team_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          media_url: string | null
          message_type: string | null
          reply_to_id: string | null
          sender_id: string | null
          team_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          media_url?: string | null
          message_type?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          media_url?: string | null
          message_type?: string | null
          reply_to_id?: string | null
          sender_id?: string | null
          team_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "team_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: Json | null
          team_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
          team_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
          team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_roles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          accepts_public_requests: boolean | null
          capacity: number | null
          city: string | null
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          max_members: number | null
          name: string
          owner_id: string | null
          recruitment_open: boolean | null
          social_media: Json | null
          sport_id: string | null
          state: string | null
          team_type: string | null
          updated_at: string | null
        }
        Insert: {
          accepts_public_requests?: boolean | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          max_members?: number | null
          name: string
          owner_id?: string | null
          recruitment_open?: boolean | null
          social_media?: Json | null
          sport_id?: string | null
          state?: string | null
          team_type?: string | null
          updated_at?: string | null
        }
        Update: {
          accepts_public_requests?: boolean | null
          capacity?: number | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          max_members?: number | null
          name?: string
          owner_id?: string | null
          recruitment_open?: boolean | null
          social_media?: Json | null
          sport_id?: string | null
          state?: string | null
          team_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_sport_id_fkey"
            columns: ["sport_id"]
            isOneToOne: false
            referencedRelation: "sports"
            referencedColumns: ["id"]
          },
        ]
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
