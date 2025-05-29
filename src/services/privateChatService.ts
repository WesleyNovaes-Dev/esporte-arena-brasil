
import { supabase } from '@/integrations/supabase/client';
import { PrivateMessage } from '@/types/chat';

export const fetchPrivateMessages = async (userId: string): Promise<PrivateMessage[]> => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('private_messages')
    .select(`
      *,
      sender:profiles!private_messages_sender_id_fkey (
        full_name,
        avatar_url
      )
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  const formattedMessages: PrivateMessage[] = (data || []).map(message => ({
    ...message,
    profiles: message.sender || { full_name: '', avatar_url: null }
  })) as PrivateMessage[];
  
  return formattedMessages;
};

export const sendPrivateMessage = async (
  receiverId: string,
  teamId: string,
  senderId: string,
  content: string,
  messageType: string = 'text'
) => {
  const { data, error } = await supabase
    .from('private_messages')
    .insert([{
      sender_id: senderId,
      receiver_id: receiverId,
      team_id: teamId,
      content,
      message_type: messageType,
      is_read: false
    }]);

  if (error) throw error;
  return data;
};
