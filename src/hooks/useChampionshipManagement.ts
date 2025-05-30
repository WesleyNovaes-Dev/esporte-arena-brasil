
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface ChampionshipTeam {
  id: string;
  championship_id: string;
  team_id: string;
  status: string;
  points: number;
  wins: number;
  losses: number;
  draws: number;
  goals_for: number;
  goals_against: number;
  invited_at: string;
  responded_at: string | null;
  teams?: {
    name: string;
    logo_url: string | null;
  };
}

export interface ChampionshipMatch {
  id: string;
  championship_id: string;
  home_team_id: string;
  away_team_id: string;
  round_number: number;
  match_date: string | null;
  location: string | null;
  home_score: number | null;
  away_score: number | null;
  home_sets: number;
  away_sets: number;
  status: string;
  observations: string | null;
  home_team?: {
    name: string;
  };
  away_team?: {
    name: string;
  };
}

export interface ChampionshipCost {
  id: string;
  championship_id: string;
  item_name: string;
  item_description: string | null;
  cost: number;
  category: string;
  created_at: string;
}

export const useChampionshipManagement = (championshipId: string) => {
  const [teams, setTeams] = useState<ChampionshipTeam[]>([]);
  const [matches, setMatches] = useState<ChampionshipMatch[]>([]);
  const [costs, setCosts] = useState<ChampionshipCost[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadTeams = useCallback(async () => {
    if (!championshipId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('championship_teams')
        .select(`
          *,
          teams(name, logo_url)
        `)
        .eq('championship_id', championshipId)
        .order('points', { ascending: false });

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
    } finally {
      setLoading(false);
    }
  }, [championshipId]);

  const loadMatches = useCallback(async () => {
    if (!championshipId) return;
    
    try {
      const { data, error } = await supabase
        .from('championship_matches')
        .select(`
          *,
          home_team:teams!championship_matches_home_team_id_fkey(name),
          away_team:teams!championship_matches_away_team_id_fkey(name)
        `)
        .eq('championship_id', championshipId)
        .order('round_number', { ascending: true });

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
    }
  }, [championshipId]);

  const loadCosts = useCallback(async () => {
    if (!championshipId) return;
    
    try {
      const { data, error } = await supabase
        .from('championship_costs')
        .select('*')
        .eq('championship_id', championshipId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCosts(data || []);
    } catch (error) {
      console.error('Erro ao carregar custos:', error);
    }
  }, [championshipId]);

  const inviteTeam = useCallback(async (teamId: string) => {
    if (!user) throw new Error('User must be logged in');

    const { error } = await supabase
      .from('championship_teams')
      .insert([
        {
          championship_id: championshipId,
          team_id: teamId,
          status: 'invited'
        }
      ]);

    if (error) throw error;
    await loadTeams();
  }, [championshipId, user, loadTeams]);

  const createMatch = useCallback(async (matchData: {
    home_team_id: string;
    away_team_id: string;
    round_number: number;
    match_date?: string | null;
    location?: string | null;
  }) => {
    if (!user) throw new Error('User must be logged in');

    const { error } = await supabase
      .from('championship_matches')
      .insert([
        {
          championship_id: championshipId,
          created_by: user.id,
          ...matchData
        }
      ]);

    if (error) throw error;
    await loadMatches();
  }, [championshipId, user, loadMatches]);

  const updateMatch = useCallback(async (matchId: string, updates: {
    home_score?: number | null;
    away_score?: number | null;
    home_sets?: number;
    away_sets?: number;
    status?: string;
    observations?: string | null;
  }) => {
    const { error } = await supabase
      .from('championship_matches')
      .update(updates)
      .eq('id', matchId);

    if (error) throw error;
    await loadMatches();
  }, [loadMatches]);

  const addCost = useCallback(async (costData: {
    item_name: string;
    item_description?: string | null;
    cost: number;
    category: string;
  }) => {
    if (!user) throw new Error('User must be logged in');

    const { error } = await supabase
      .from('championship_costs')
      .insert([
        {
          championship_id: championshipId,
          created_by: user.id,
          ...costData
        }
      ]);

    if (error) throw error;
    await loadCosts();
  }, [championshipId, user, loadCosts]);

  return {
    teams,
    matches,
    costs,
    loading,
    inviteTeam,
    createMatch,
    updateMatch,
    addCost,
    loadTeams,
    loadMatches,
    loadCosts
  };
};
