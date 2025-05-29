
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { TeamMessage } from '@/types/chat';
import { fetchTeamMessages, sendTeamMessage } from '@/services/teamChatService';

export const useTeamChatMessages = (teamId: string) => {
  const [teamMessages, setTeamMessages] = useState<TeamMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadMessages = async () => {
    try {
      const data = await fetchTeamMessages(teamId);
      setTeamMessages(data);
    } catch (error) {
      console.error('Erro ao buscar mensagens do time:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string, messageType: string = 'text', mediaUrl?: string) => {
    if (!user || !teamId) return;

    try {
      const data = await sendTeamMessage(teamId, user.id, content, messageType, mediaUrl);
      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadMessages();

    // Listen to real-time messages
    const channel = supabase
      .channel(`team-chat-${teamId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'team_messages',
        filter: `team_id=eq.${teamId}`
      }, (payload) => {
        setTeamMessages(prev => [...prev, payload.new as TeamMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId]);

  return {
    teamMessages,
    loading,
    sendMessage,
    refetch: loadMessages
  };
};
