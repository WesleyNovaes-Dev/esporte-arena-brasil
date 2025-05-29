
import { supabase } from '@/integrations/supabase/client';
import { TeamMessage } from '@/types/chat';

export const fetchTeamMessages = async (teamId: string): Promise<TeamMessage[]> => {
  if (!teamId) return [];

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
  
  return (data || []) as TeamMessage[];
};

export const sendTeamMessage = async (
  teamId: string,
  senderId: string,
  content: string,
  messageType: string = 'text',
  mediaUrl?: string
) => {
  const { data, error } = await supabase
    .from('team_messages')
    .insert([{
      team_id: teamId,
      sender_id: senderId,
      content,
      message_type: messageType,
      media_url: mediaUrl,
      is_pinned: false
    }]);

  if (error) throw error;
  return data;
};
