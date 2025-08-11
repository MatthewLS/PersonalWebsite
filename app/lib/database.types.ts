// export type Json =
//   | string
//   | number
//   | boolean
//   | null
//   | { [key: string]: Json | undefined }
//   | Json[]

// export type Database = {
//   public: {
//     Tables: {
//       article_images: {
//         Row: {
//           article_id: number | null
//           id: number
//           image_id: string | null
//           position: number | null
//         }
//         Insert: {
//           article_id?: number | null
//           id?: number
//           image_id?: string | null
//           position?: number | null
//         }
//         Update: {
//           article_id?: number | null
//           id?: number
//           image_id?: string | null
//           position?: number | null
//         }
//         Relationships: [
//           {
//             foreignKeyName: "article_images_article_id_fkey"
//             columns: ["article_id"]
//             isOneToOne: false
//             referencedRelation: "articles"
//             referencedColumns: ["id"]
//           },
//           {
//             foreignKeyName: "article_images_image_id_fkey"
//             columns: ["image_id"]
//             isOneToOne: false
//             referencedRelation: "images"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       articles: {
//         Row: {
//           author_id: number | null
//           created_at: string
//           excerpt: string | null
//           id: number
//           layout_config: string | null
//           slug: string | null
//           text: string | null
//           title: string
//           view_count: number
//           visibile: boolean
//         }
//         Insert: {
//           author_id?: number | null
//           created_at?: string
//           excerpt?: string | null
//           id?: number
//           layout_config?: string | null
//           slug?: string | null
//           text?: string | null
//           title?: string
//           view_count?: number
//           visibile?: boolean
//         }
//         Update: {
//           author_id?: number | null
//           created_at?: string
//           excerpt?: string | null
//           id?: number
//           layout_config?: string | null
//           slug?: string | null
//           text?: string | null
//           title?: string
//           view_count?: number
//           visibile?: boolean
//         }
//         Relationships: [
//           {
//             foreignKeyName: "articles_author_id_fkey"
//             columns: ["author_id"]
//             isOneToOne: false
//             referencedRelation: "authors"
//             referencedColumns: ["id"]
//           },
//         ]
//       }
//       authors: {
//         Row: {
//           article_count: number | null
//           bio: string | null
//           created_at: string
//           email: string | null
//           id: number
//           name: string
//           profile_picture: string | null
//           slug: string | null
//           social_links: Json | null
//           username: string | null
//         }
//         Insert: {
//           article_count?: number | null
//           bio?: string | null
//           created_at?: string
//           email?: string | null
//           id?: number
//           name?: string
//           profile_picture?: string | null
//           slug?: string | null
//           social_links?: Json | null
//           username?: string | null
//         }
//         Update: {
//           article_count?: number | null
//           bio?: string | null
//           created_at?: string
//           email?: string | null
//           id?: number
//           name?: string
//           profile_picture?: string | null
//           slug?: string | null
//           social_links?: Json | null
//           username?: string | null
//         }
//         Relationships: []
//       }
//       images: {
//         Row: {
//           alt_text: string | null
//           camera_model: string | null
//           date: string
//           f_number: number | null
//           id: string
//           iso: number | null
//           latitude: number | null
//           lens_model: string | null
//           longitude: number | null
//           shutter_speed: number | null
//           url: string | null
//         }
//         Insert: {
//           alt_text?: string | null
//           camera_model?: string | null
//           date: string
//           f_number?: number | null
//           id?: string
//           iso?: number | null
//           latitude?: number | null
//           lens_model?: string | null
//           longitude?: number | null
//           shutter_speed?: number | null
//           url?: string | null
//         }
//         Update: {
//           alt_text?: string | null
//           camera_model?: string | null
//           date?: string
//           f_number?: number | null
//           id?: string
//           iso?: number | null
//           latitude?: number | null
//           lens_model?: string | null
//           longitude?: number | null
//           shutter_speed?: number | null
//           url?: string | null
//         }
//         Relationships: []
//       }
//     }
//     Views: {
//       [_ in never]: never
//     }
//     Functions: {
//       [_ in never]: never
//     }
//     Enums: {
//       [_ in never]: never
//     }
//     CompositeTypes: {
//       [_ in never]: never
//     }
//   }
// }

// type DefaultSchema = Database[Extract<keyof Database, "public">]

// export type Tables<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
//     | { schema: keyof Database },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof Database
//   }
//     ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
//         Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
//   ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
//       Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
//       Row: infer R
//     }
//     ? R
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
//         DefaultSchema["Views"])
//     ? (DefaultSchema["Tables"] &
//         DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
//         Row: infer R
//       }
//       ? R
//       : never
//     : never

// export type TablesInsert<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof DefaultSchema["Tables"]
//     | { schema: keyof Database },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof Database
//   }
//     ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
//   ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
//       Insert: infer I
//     }
//     ? I
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
//     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
//         Insert: infer I
//       }
//       ? I
//       : never
//     : never

// export type TablesUpdate<
//   DefaultSchemaTableNameOrOptions extends
//     | keyof DefaultSchema["Tables"]
//     | { schema: keyof Database },
//   TableName extends DefaultSchemaTableNameOrOptions extends {
//     schema: keyof Database
//   }
//     ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
//     : never = never,
// > = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
//   ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
//       Update: infer U
//     }
//     ? U
//     : never
//   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
//     ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
//         Update: infer U
//       }
//       ? U
//       : never
//     : never

// export type Enums<
//   DefaultSchemaEnumNameOrOptions extends
//     | keyof DefaultSchema["Enums"]
//     | { schema: keyof Database },
//   EnumName extends DefaultSchemaEnumNameOrOptions extends {
//     schema: keyof Database
//   }
//     ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
//     : never = never,
// > = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
//   ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
//   : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
//     ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
//     : never

// export type CompositeTypes<
//   PublicCompositeTypeNameOrOptions extends
//     | keyof DefaultSchema["CompositeTypes"]
//     | { schema: keyof Database },
//   CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
//     schema: keyof Database
//   }
//     ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
//     : never = never,
// > = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
//   ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
//   : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
//     ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
//     : never

// export const Constants = {
//   public: {
//     Enums: {},
//   },
// } as const