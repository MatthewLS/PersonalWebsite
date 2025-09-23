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
      article_images: {
        Row: {
          article_id: number | null
          id: number
          image_id: string | null
          position: number | null
        }
        Insert: {
          article_id?: number | null
          id?: number
          image_id?: string | null
          position?: number | null
        }
        Update: {
          article_id?: number | null
          id?: number
          image_id?: string | null
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "article_images_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_images_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: number | null
          created_at: string
          excerpt: string | null
          id: number
          layout_config: string | null
          slug: string | null
          text: string | null
          title: string
          view_count: number
          visibile: boolean
        }
        Insert: {
          author_id?: number | null
          created_at?: string
          excerpt?: string | null
          id?: number
          layout_config?: string | null
          slug?: string | null
          text?: string | null
          title?: string
          view_count?: number
          visibile?: boolean
        }
        Update: {
          author_id?: number | null
          created_at?: string
          excerpt?: string | null
          id?: number
          layout_config?: string | null
          slug?: string | null
          text?: string | null
          title?: string
          view_count?: number
          visibile?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      authors: {
        Row: {
          article_count: number | null
          bio: string | null
          created_at: string
          email: string | null
          id: number
          name: string
          profile_picture: string | null
          slug: string | null
          social_links: Json | null
          username: string | null
        }
        Insert: {
          article_count?: number | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name?: string
          profile_picture?: string | null
          slug?: string | null
          social_links?: Json | null
          username?: string | null
        }
        Update: {
          article_count?: number | null
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: number
          name?: string
          profile_picture?: string | null
          slug?: string | null
          social_links?: Json | null
          username?: string | null
        }
        Relationships: []
      }
      image_tags: {
        Row: {
          image_id: string
          tag_id: string
        }
        Insert: {
          image_id: string
          tag_id: string
        }
        Update: {
          image_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_tags_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "images"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "image_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      images: {
        Row: {
          alt_text: string | null
          aperture: number | null
          camera_model: string | null
          id: string
          image_date: string | null
          iso: number | null
          latitude: number | null
          lens_model: string | null
          longitude: number | null
          shutter_speed: string | null
          upload_date: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          aperture?: number | null
          camera_model?: string | null
          id?: string
          image_date?: string | null
          iso?: number | null
          latitude?: number | null
          lens_model?: string | null
          longitude?: number | null
          shutter_speed?: string | null
          upload_date?: string
          url: string
        }
        Update: {
          alt_text?: string | null
          aperture?: number | null
          camera_model?: string | null
          id?: string
          image_date?: string | null
          iso?: number | null
          latitude?: number | null
          lens_model?: string | null
          longitude?: number | null
          shutter_speed?: string | null
          upload_date?: string
          url?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_sub_tags: {
        Args: { tag_name: string }
        Returns: {
          id: string
          name: string
          parent_id: string
        }[]
      }
      images_with_hierarchical_tag: {
        Args: { tag_name: string }
        Returns: {
          alt_text: string | null
          aperture: number | null
          camera_model: string | null
          id: string
          image_date: string | null
          iso: number | null
          latitude: number | null
          lens_model: string | null
          longitude: number | null
          shutter_speed: string | null
          upload_date: string
          url: string
        }[]
      }
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

