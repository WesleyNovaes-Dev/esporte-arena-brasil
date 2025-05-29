
import { useTeamChatMessages } from './useTeamChatMessages';
import { usePrivateChatMessages } from './usePrivateChatMessages';

// Re-export types for backward compatibility
export type { TeamMessage, PrivateMessage } from '@/types/chat';

export const useTeamChat = (teamId: string) => {
  const { teamMessages, loading, sendMessage, refetch } = useTeamChatMessages(teamId);
  
  return {
    teamMessages,
    loading,
    sendTeamMessage: sendMessage,
    refetch
  };
};

export const usePrivateChat = () => {
  const { conversations, loading, sendMessage, refetch } = usePrivateChatMessages();
  
  return {
    conversations,
    loading,
    sendPrivateMessage: sendMessage,
    refetch
  };
};
