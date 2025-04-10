export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          gender: string | null
          age: number | null
          height: number | null
          height_unit: 'cm' | 'ft' | null
          weight: number | null
          weight_unit: 'kg' | 'lbs' | null
          fitness_goals: Json | null
          sport_activity: string | null
          coach_notes: string | null
          cardio_level: number | null
          weightlifting_level: number | null
          fitness_notes: string | null
          avoided_exercises: string[] | null
          workout_environments: string[] | null
          workouts_per_week: number | null
          workout_duration: number | null
          additional_info: string | null
          onboarding_completed: boolean
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          gender?: string | null
          age?: number | null
          height?: number | null
          height_unit?: 'cm' | 'ft' | null
          weight?: number | null
          weight_unit?: 'kg' | 'lbs' | null
          fitness_goals?: Json | null
          sport_activity?: string | null
          coach_notes?: string | null
          cardio_level?: number | null
          weightlifting_level?: number | null
          fitness_notes?: string | null
          avoided_exercises?: string[] | null
          workout_environments?: string[] | null
          workouts_per_week?: number | null
          workout_duration?: number | null
          additional_info?: string | null
          onboarding_completed?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          gender?: string | null
          age?: number | null
          height?: number | null
          height_unit?: 'cm' | 'ft' | null
          weight?: number | null
          weight_unit?: 'kg' | 'lbs' | null
          fitness_goals?: Json | null
          sport_activity?: string | null
          coach_notes?: string | null
          cardio_level?: number | null
          weightlifting_level?: number | null
          fitness_notes?: string | null
          avoided_exercises?: string[] | null
          workout_environments?: string[] | null
          workouts_per_week?: number | null
          workout_duration?: number | null
          additional_info?: string | null
          onboarding_completed?: boolean
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      exercises: {
        Row: {
          id: string
          name: string
          description: string | null
          instructions: string | null
          primary_muscles: string[] | null
          secondary_muscles: string[] | null
          equipment_needed: string[] | null
          media_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          instructions?: string | null
          primary_muscles?: string[] | null
          secondary_muscles?: string[] | null
          equipment_needed?: string[] | null
          media_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          instructions?: string | null
          primary_muscles?: string[] | null
          secondary_muscles?: string[] | null
          equipment_needed?: string[] | null
          media_url?: string | null
          created_at?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          category: string | null
          is_template: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          category?: string | null
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          category?: string | null
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          sets: number | null
          reps: string | null
          rest_seconds: number | null
          order_index: number | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_id: string
          sets?: number | null
          reps?: string | null
          rest_seconds?: number | null
          order_index?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          exercise_id?: string
          sets?: number | null
          reps?: string | null
          rest_seconds?: number | null
          order_index?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          }
        ]
      }
      workout_logs: {
        Row: {
          id: string
          user_id: string
          workout_id: string | null
          start_time: string | null
          end_time: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_id?: string | null
          start_time?: string | null
          end_time?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_id?: string | null
          start_time?: string | null
          end_time?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_workout_id_fkey"
            columns: ["workout_id"]
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          }
        ]
      }
      completed_sets: {
        Row: {
          id: string
          workout_log_id: string
          exercise_id: string | null
          set_number: number | null
          reps: number | null
          weight: number | null
          weight_unit: 'kg' | 'lbs' | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_log_id: string
          exercise_id?: string | null
          set_number?: number | null
          reps?: number | null
          weight?: number | null
          weight_unit?: 'kg' | 'lbs' | null
          created_at?: string
        }
        Update: {
          id?: string
          workout_log_id?: string
          exercise_id?: string | null
          set_number?: number | null
          reps?: number | null
          weight?: number | null
          weight_unit?: 'kg' | 'lbs' | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "completed_sets_workout_log_id_fkey"
            columns: ["workout_log_id"]
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "completed_sets_exercise_id_fkey"
            columns: ["exercise_id"]
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          }
        ]
      }
      progress_photos: {
        Row: {
          id: string
          user_id: string
          photo_url: string | null
          notes: string | null
          taken_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          photo_url?: string | null
          notes?: string | null
          taken_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          photo_url?: string | null
          notes?: string | null
          taken_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_photos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      body_weight_logs: {
        Row: {
          id: string
          user_id: string
          weight: number | null
          weight_unit: 'kg' | 'lbs' | null
          date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          weight?: number | null
          weight_unit?: 'kg' | 'lbs' | null
          date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number | null
          weight_unit?: 'kg' | 'lbs' | null
          date?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "body_weight_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string | null
          description: string | null
          achieved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type?: string | null
          description?: string | null
          achieved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string | null
          description?: string | null
          achieved_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
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
  }
} 