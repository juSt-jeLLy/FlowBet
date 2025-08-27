import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xmsiuvtwtahlliuusxis.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc2l1dnR3dGFobGxpdXVzeGlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyODg4MDYsImV4cCI6MjA3MTg2NDgwNn0.fIfh0seTw2fFrQipeUxRymsVGSMQmU1CzsnOT_SIUZk';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface LeaderboardEntry {
  id: string;
  wallet_address: string;
  total_winnings: number;
  win_streak: number;
  total_bets: number;
  quiz_score: number;
  rank: number;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  wallet_address: string;
  activity_type: 'bet' | 'claim' | 'daily_claim' | 'quiz' | 'deposit' | 'withdraw' | 'resolve_market';
  description: string;
  amount?: number;
  market_id?: number;
  transaction_hash?: string;
  created_at: string;
}

export interface MarketStats {
  id: string;
  market_id: number;
  total_volume: number;
  unique_bettors: number;
  yes_percentage: number;
  no_percentage: number;
  last_updated: string;
}

// Leaderboard functions
export async function getLeaderboard(limit = 100) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('total_winnings', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  return data || [];
}

export async function updateLeaderboard(
  walletAddress: string,
  updates: Partial<LeaderboardEntry>
) {
  const { error } = await supabase
    .from('leaderboard')
    .upsert({
      wallet_address: walletAddress,
      ...updates,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error updating leaderboard:', error);
  }
}

// User activity functions
export async function addUserActivity(activity: Omit<UserActivity, 'id' | 'created_at'>) {
  const { error } = await supabase
    .from('user_activity')
    .insert({
      ...activity,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error adding user activity:', error);
  }
}

export async function getUserActivity(walletAddress: string, limit = 50) {
  const { data, error } = await supabase
    .from('user_activity')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching user activity:', error);
    return [];
  }

  return data || [];
}

// Market stats functions
export async function updateMarketStats(
  marketId: number,
  stats: Omit<MarketStats, 'id' | 'market_id' | 'last_updated'>
) {
  const { error } = await supabase
    .from('market_stats')
    .upsert({
      market_id: marketId,
      ...stats,
      last_updated: new Date().toISOString(),
    });

  if (error) {
    console.error('Error updating market stats:', error);
  }
}

export async function getMarketStats(marketId: number) {
  const { data, error } = await supabase
    .from('market_stats')
    .select('*')
    .eq('market_id', marketId)
    .single();

  if (error) {
    console.error('Error fetching market stats:', error);
    return null;
  }

  return data;
}