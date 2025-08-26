import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Client-side Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

// Server-side Supabase client with secret key
export function createServerClient() {
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;
  
  return createClient<Database>(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Type-safe table references
export const tables = {
  portfolios: 'portfolios' as const,
  positions: 'positions' as const,
  checklists: 'checklists' as const,
  position_checklist_results: 'position_checklist_results' as const,
  reports: 'reports' as const,
};

// Utility functions for common operations
export async function getPortfolios() {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPortfolioWithPositions(portfolioId: string) {
  const { data, error } = await supabase
    .from('portfolios')
    .select(
      `
      *,
      positions (*)
    `
    )
    .eq('id', portfolioId)
    .single();

  if (error) throw error;
  return data;
}

export async function getPositionsByPortfolio(portfolioId: string) {
  const { data, error } = await supabase
    .from('positions')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getChecklists() {
  const { data, error } = await supabase
    .from('checklists')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getChecklistResults(positionId: string) {
  const { data, error } = await supabase
    .from('position_checklist_results')
    .select(
      `
      *,
      checklist:checklists(*)
    `
    )
    .eq('position_id', positionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getReportsByPosition(positionId: string) {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('position_id', positionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Real-time subscriptions
export function subscribeToPortfolios(callback: (payload: any) => void) {
  return supabase
    .channel('portfolios')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'portfolios' },
      callback
    )
    .subscribe();
}

export function subscribeToPositions(
  portfolioId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`positions-${portfolioId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'positions',
        filter: `portfolio_id=eq.${portfolioId}`,
      },
      callback
    )
    .subscribe();
}
