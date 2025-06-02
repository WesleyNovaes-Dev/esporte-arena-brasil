
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface Event {
  id: string;
  title: string;
  description: string | null;
  sport_id: string;
  organizer_id: string;
  event_date: string;
  event_time: string;
  location: string;
  price: number | null;
  status: string | null;
  event_type: string | null;
  max_participants: number | null;
  scoring_system: string;
  match_generation: string;
  points_per_win: number;
  points_per_draw: number;
  points_per_loss: number;
  is_private: boolean;
  allows_teams: boolean;
  allows_individual: boolean;
  registration_deadline: string | null;
  current_round: number;
  created_at: string | null;
  updated_at: string | null;
  sports?: {
    name: string;
    emoji: string;
  };
  profiles?: {
    full_name: string;
  };
}

interface CreateEventData {
  title: string;
  description?: string | null;
  sport_id: string;
  event_date: string;
  event_time: string;
  location: string;
  price?: number;
  event_type?: string;
  max_participants?: number;
  scoring_system?: string;
  match_generation?: string;
  points_per_win?: number;
  points_per_draw?: number;
  points_per_loss?: number;
  is_private?: boolean;
  allows_teams?: boolean;
  allows_individual?: boolean;
  registration_deadline?: string | null;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          sports(name, emoji),
          profiles(full_name)
        `)
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: CreateEventData) => {
    if (!user) throw new Error('User must be logged in');

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          ...eventData,
          organizer_id: user.id,
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add user as admin of the event
    await supabase
      .from('event_admins')
      .insert([
        {
          event_id: data.id,
          user_id: user.id,
          role: 'admin'
        }
      ]);

    fetchEvents();
    return data;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    createEvent,
    refetch: fetchEvents
  };
};
