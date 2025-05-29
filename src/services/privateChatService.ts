
import { supabase } from '@/integrations/supabase/client';
import { PrivateMessage } from '@/types/chat';

export const fetchPrivateMessages = async (userId: string): Promise<PrivateMessage[]> => {
  if (!userId) return [];

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
      sender_profile:profiles!private_messages_sender_id_fkey (
        full_name,
        avatar_url
      )
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) throw error;
  
  return (data || []).map(message => ({
    id: message.id,
    team_id: message.team_id,
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    content: message.content,
    message_type: message.message_type,
    media_url: message.media_url,
    is_read: message.is_read,
    created_at: message.created_at,
    profiles: message.sender_profile as { full_name: string; avatar_url: string | null }
  })) as PrivateMessage[];
};

export const sendPrivateMessage = async (
  receiverId: string,
  teamId: string,
  senderId: string,
  content: string,
  messageType: string = 'text'
): Promise<PrivateMessage> => {
  const { data, error } = await supabase
    .from('private_messages')
    .insert([{
      team_id: teamId,
      sender_id: senderId,
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
      sender_profile:profiles!private_messages_sender_id_fkey (
        full_name,
        avatar_url
      )
    `)
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    team_id: data.team_id,
    sender_id: data.sender_id,
    receiver_id: data.receiver_id,
    content: data.content,
    message_type: data.message_type,
    media_url: data.media_url,
    is_read: data.is_read,
    created_at: data.created_at,
    profiles: data.sender_profile as { full_name: string; avatar_url: string | null }
  } as PrivateMessage;
};
