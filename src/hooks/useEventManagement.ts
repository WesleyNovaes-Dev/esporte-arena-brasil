
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  joined_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface EventTeamInvitation {
  id: string;
  event_id: string;
  team_id: string;
  status: string;
  invited_at: string;
  responded_at: string | null;
  teams?: {
    name: string;
    logo_url: string | null;
  };
}

export interface EventCost {
  id: string;
  event_id: string;
  item_name: string;
  item_description: string | null;
  cost: number;
  category: string;
  created_at: string;
}

export interface EventMatch {
  id: string;
  event_id: string;
  participant1_type: string;
  participant1_id: string;
  participant2_type: string;
  participant2_id: string;
  round_number: number;
  match_date: string | null;
  participant1_score: number | null;
  participant2_score: number | null;
  participant1_sets: number;
  participant2_sets: number;
  status: string;
  observations: string | null;
  winner_type: string | null;
  winner_id: string | null;
}

export const useEventManagement = (eventId: string) => {
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [teamInvitations, setTeamInvitations] = useState<EventTeamInvitation[]>([]);
  const [costs, setCosts] = useState<EventCost[]>([]);
  const [matches, setMatches] = useState<EventMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadParticipants = useCallback(async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('event_participants')
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const loadTeamInvitations = useCallback(async () => {
    if (!eventId) return;
    
    try {
      const { data, error } = await supabase
        .from('event_team_invitations')
        .select(`
          *,
          teams(name, logo_url)
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      setTeamInvitations(data || []);
    } catch (error) {
      console.error('Erro ao carregar convites de times:', error);
    }
  }, [eventId]);

  const loadCosts = useCallback(async () => {
    if (!eventId) return;
    
    try {
      const { data, error } = await supabase
        .from('event_costs')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCosts(data || []);
    } catch (error) {
      console.error('Erro ao carregar custos:', error);
    }
  }, [eventId]);

  const loadMatches = useCallback(async () => {
    if (!eventId) return;
    
    try {
      const { data, error } = await supabase
        .from('event_matches')
        .select('*')
        .eq('event_id', eventId)
        .order('round_number', { ascending: true });

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
    }
  }, [eventId]);

  const inviteUser = useCallback(async (userId: string) => {
    if (!user) throw new Error('User must be logged in');

    const { error } = await supabase
      .from('event_user_invitations')
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          status: 'invited',
          invited_by: user.id
        }
      ]);

    if (error) throw error;
    await loadParticipants();
  }, [eventId, user, loadParticipants]);

  const inviteTeam = useCallback(async (teamId: string) => {
    if (!user) throw new Error('User must be logged in');

    const { error } = await supabase
      .from('event_team_invitations')
      .insert([
        {
          event_id: eventId,
          team_id: teamId,
          status: 'invited',
          invited_by: user.id
        }
      ]);

    if (error) throw error;
    await loadTeamInvitations();
  }, [eventId, user, loadTeamInvitations]);

  const addCost = useCallback(async (costData: {
    item_name: string;
    item_description?: string | null;
    cost: number;
    category: string;
  }) => {
    if (!user) throw new Error('User must be logged in');

    const { error } = await supabase
      .from('event_costs')
      .insert([
        {
          event_id: eventId,
          created_by: user.id,
          ...costData
        }
      ]);

    if (error) throw error;
    await loadCosts();
  }, [eventId, user, loadCosts]);

  const createMatch = useCallback(async (matchData: {
    participant1_type: string;
    participant1_id: string;
    participant2_type: string;
    participant2_id: string;
    round_number: number;
    match_date?: string | null;
  }) => {
    if (!user) throw new Error('User must be logged in');

    const { error } = await supabase
      .from('event_matches')
      .insert([
        {
          event_id: eventId,
          created_by: user.id,
          ...matchData
        }
      ]);

    if (error) throw error;
    await loadMatches();
  }, [eventId, user, loadMatches]);

  const updateMatch = useCallback(async (matchId: string, updates: {
    participant1_score?: number | null;
    participant2_score?: number | null;
    participant1_sets?: number;
    participant2_sets?: number;
    status?: string;
    observations?: string | null;
    winner_type?: string | null;
    winner_id?: string | null;
  }) => {
    const { error } = await supabase
      .from('event_matches')
      .update(updates)
      .eq('id', matchId);

    if (error) throw error;
    await loadMatches();
  }, [loadMatches]);

  return {
    participants,
    teamInvitations,
    costs,
    matches,
    loading,
    inviteUser,
    inviteTeam,
    addCost,
    createMatch,
    updateMatch,
    loadParticipants,
    loadTeamInvitations,
    loadCosts,
    loadMatches
  };
};
