
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { PrivateMessage } from '@/types/chat';
import { fetchPrivateMessages, sendPrivateMessage } from '@/services/privateChatService';

export const usePrivateChatMessages = () => {
  const [conversations, setConversations] = useState<PrivateMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadMessages = async () => {
    if (!user) return;

    try {
      const data = await fetchPrivateMessages(user.id);
      setConversations(data);
    } catch (error) {
      console.error('Erro ao buscar mensagens privadas:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    receiverId: string,
    teamId: string,
    content: string,
    messageType: string = 'text'
  ) => {
    if (!user) return;

    try {
      const data = await sendPrivateMessage(receiverId, teamId, user.id, content, messageType);
      return data;
    } catch (error) {
      console.error('Erro ao enviar mensagem privada:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadMessages();

    // Listen to real-time messages
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
    sendMessage,
    refetch: loadMessages
  };
};
