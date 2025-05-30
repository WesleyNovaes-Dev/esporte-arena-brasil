
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface Championship {
  id: string;
  name: string;
  description: string | null;
  sport_id: string;
  organizer_id: string;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  championship_type: string | null;
  created_at: string | null;
  prize_pool: number | null;
  scoring_system: string;
  match_generation: string;
  points_per_win: number;
  points_per_draw: number;
  points_per_loss: number;
  is_private: boolean;
  max_teams: number;
  current_round: number;
  sports?: {
    name: string;
    emoji: string;
  };
  profiles?: {
    full_name: string;
  };
}

interface CreateChampionshipData {
  name: string;
  description?: string | null;
  sport_id: string;
  start_date?: string | null;
  end_date?: string | null;
  championship_type?: string;
  prize_pool?: number;
  scoring_system?: string;
  match_generation?: string;
  points_per_win?: number;
  points_per_draw?: number;
  points_per_loss?: number;
  is_private?: boolean;
  max_teams?: number;
}

export const useChampionships = () => {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchChampionships = async () => {
    try {
      const { data, error } = await supabase
        .from('championships')
        .select(`
          *,
          sports(name, emoji),
          profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching championships:', error);
        return;
      }

      setChampionships(data || []);
    } catch (error) {
      console.error('Error fetching championships:', error);
    } finally {
      setLoading(false);
    }
  };

  const createChampionship = async (championshipData: CreateChampionshipData) => {
    if (!user) throw new Error('User must be logged in');

    const { data, error } = await supabase
      .from('championships')
      .insert([
        {
          ...championshipData,
          organizer_id: user.id,
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add user as admin of the championship
    await supabase
      .from('championship_admins')
      .insert([
        {
          championship_id: data.id,
          user_id: user.id,
          role: 'admin'
        }
      ]);

    fetchChampionships();
    return data;
  };

  useEffect(() => {
    fetchChampionships();
  }, []);

  return {
    championships,
    loading,
    createChampionship,
    refetch: fetchChampionships
  };
};
