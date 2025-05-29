
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface TeamMessage {
  id: string;
  team_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  media_url: string | null;
  reply_to_id: string | null;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface PrivateMessage {
  id: string;
  team_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: string;
  media_url: string | null;
  is_read: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export const useTeamChat = (teamId: string) => {
  const [teamMessages, setTeamMessages] = useState<TeamMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTeamMessages = async () => {
    if (!teamId) return;

    try {
      const { data, error } = await supabase
        .from('team_messages')
        .select(`
          *,
          profiles:sender_id (
            full_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTeamMessages(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens do time:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendTeamMessage = async (content: string, messageType: string = 'text', mediaUrl?: string) => {
    if (!user || !teamId) return;

    try {
      const { data, error } = await supabase
        .from('team_messages')
        .insert([{
          team_id: teamId,
          sender_id: user.id,
          content,
          message_type: messageType,
          media_url: mediaUrl
        }])
        .select(`
          *,
          profiles:sender_id (
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTeamMessages();

    // Escutar mensagens em tempo real
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
    sendTeamMessage,
    refetch: fetchTeamMessages
  };
};

export const usePrivateChat = () => {
  const [conversations, setConversations] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPrivateMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('private_messages')
        .select(`
          id,
          team_id,
          sender_id,
          receiver_id,
          content,
          message_type,
          media_url,
          is_read,
          created_at,
          profiles!private_messages_sender_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setConversations(data || []);
    } catch (error) {
      console.error('Erro ao buscar mensagens privadas:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendPrivateMessage = async (
    receiverId: string,
    teamId: string,
    content: string,
    messageType: string = 'text'
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('private_messages')
        .insert([{
          team_id: teamId,
          sender_id: user.id,
          receiver_id: receiverId,
          content,
          message_type: messageType
        }])
        .select(`
          id,
          team_id,
          sender_id,
          receiver_id,
          content,
          message_type,
          media_url,
          is_read,
          created_at,
          profiles!private_messages_sender_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem privada:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPrivateMessages();

    // Escutar mensagens em tempo real
    const channel = supabase
      .channel('private-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'private_messages',
        filter: `receiver_id=eq.${user?.id}`
      }, (payload) => {
        const newMessage = payload.new as PrivateMessage;
        setConversations(prev => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    conversations,
    loading,
    sendPrivateMessage,
    refetch: fetchPrivateMessages
  };
};
