
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
  max_participants: number | null;
  price: number;
  event_type: string;
  status: string;
  created_at: string;
  sports?: {
    name: string;
    emoji: string;
  };
  profiles?: {
    full_name: string;
  };
  event_participants?: Array<{
    user_id: string;
    status: string;
  }>;
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
          profiles(full_name),
          event_participants(user_id, status)
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

  const createEvent = async (eventData: Partial<Event>) => {
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

    fetchEvents(); // Refresh events
    return data;
  };

  const joinEvent = async (eventId: string) => {
    if (!user) throw new Error('User must be logged in');

    const { error } = await supabase
      .from('event_participants')
      .insert([
        {
          event_id: eventId,
          user_id: user.id,
          status: 'confirmed'
        }
      ]);

    if (error) {
      throw error;
    }

    fetchEvents(); // Refresh events
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    createEvent,
    joinEvent,
    refetch: fetchEvents
  };
};
