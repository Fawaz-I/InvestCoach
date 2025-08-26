export interface Database {
  public: {
    Tables: {
      portfolios: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      positions: {
        Row: {
          id: string;
          portfolio_id: string;
          ticker: string;
          shares: number;
          entry_price: number;
          thesis: string | null;
          theme: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          portfolio_id: string;
          ticker: string;
          shares: number;
          entry_price: number;
          thesis?: string | null;
          theme?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          portfolio_id?: string;
          ticker?: string;
          shares?: number;
          entry_price?: number;
          thesis?: string | null;
          theme?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'positions_portfolio_id_fkey';
            columns: ['portfolio_id'];
            isOneToOne: false;
            referencedRelation: 'portfolios';
            referencedColumns: ['id'];
          }
        ];
      };
      checklists: {
        Row: {
          id: string;
          name: string;
          strategy: string;
          questions_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          strategy: string;
          questions_json: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          strategy?: string;
          questions_json?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      position_checklist_results: {
        Row: {
          id: string;
          position_id: string;
          checklist_id: string;
          results_json: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          position_id: string;
          checklist_id: string;
          results_json: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          position_id?: string;
          checklist_id?: string;
          results_json?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'position_checklist_results_position_id_fkey';
            columns: ['position_id'];
            isOneToOne: false;
            referencedRelation: 'positions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'position_checklist_results_checklist_id_fkey';
            columns: ['checklist_id'];
            isOneToOne: false;
            referencedRelation: 'checklists';
            referencedColumns: ['id'];
          }
        ];
      };
      reports: {
        Row: {
          id: string;
          position_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          position_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          position_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reports_position_id_fkey';
            columns: ['position_id'];
            isOneToOne: false;
            referencedRelation: 'positions';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Type helpers for easier usage
export type Portfolio = Database['public']['Tables']['portfolios']['Row'];
export type Position = Database['public']['Tables']['positions']['Row'];
export type Checklist = Database['public']['Tables']['checklists']['Row'];
export type PositionChecklistResult =
  Database['public']['Tables']['position_checklist_results']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];

// Insert types
export type PortfolioInsert =
  Database['public']['Tables']['portfolios']['Insert'];
export type PositionInsert =
  Database['public']['Tables']['positions']['Insert'];
export type ChecklistInsert =
  Database['public']['Tables']['checklists']['Insert'];
export type PositionChecklistResultInsert =
  Database['public']['Tables']['position_checklist_results']['Insert'];
export type ReportInsert = Database['public']['Tables']['reports']['Insert'];

// Update types
export type PortfolioUpdate =
  Database['public']['Tables']['portfolios']['Update'];
export type PositionUpdate =
  Database['public']['Tables']['positions']['Update'];
export type ChecklistUpdate =
  Database['public']['Tables']['checklists']['Update'];
export type PositionChecklistResultUpdate =
  Database['public']['Tables']['position_checklist_results']['Update'];
export type ReportUpdate = Database['public']['Tables']['reports']['Update'];

// JSON type for checklist questions and results
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Application-specific types
export interface ChecklistQuestion {
  id: string;
  question: string;
  type: 'boolean' | 'rating' | 'text' | 'number';
  required: boolean;
  options?: string[]; // for rating type
  weight?: number; // for scoring
}

export interface ChecklistQuestions {
  questions: ChecklistQuestion[];
  version: string;
  description?: string;
}

export interface ChecklistAnswer {
  question_id: string;
  answer: boolean | number | string;
  notes?: string;
}

export interface ChecklistResult {
  answers: ChecklistAnswer[];
  score?: number;
  completed_at: string;
  version: string;
  recommendation?: 'buy' | 'hold' | 'sell' | 'watch';
}

// Extended types with calculated fields
export interface PositionWithMetrics extends Position {
  current_price?: number;
  market_value?: number;
  unrealized_pnl?: number;
  unrealized_pnl_percent?: number;
  total_return?: number;
  total_return_percent?: number;
  portfolio_weight?: number;
}

export interface PortfolioWithMetrics extends Portfolio {
  total_value?: number;
  total_positions?: number;
  total_return?: number;
  total_return_percent?: number;
  positions?: PositionWithMetrics[];
}
