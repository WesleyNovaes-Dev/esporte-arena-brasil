
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ArrowLeft } from 'lucide-react';
import { PrivateMessage } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface ConversationSidebarProps {
  conversations: PrivateMessage[];
  loading: boolean;
  selectedUserId: string | null;
  searchTerm: string;
  userId?: string;
  onSelectUser: (userId: string) => void;
  onSearchChange: (term: string) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  loading,
  selectedUserId,
  searchTerm,
  userId,
  onSelectUser,
  onSearchChange
}) => {
  const navigate = useNavigate();

  // Group conversations by users
  const groupedConversations = conversations.reduce((acc, msg) => {
    const otherUserId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
    if (!acc[otherUserId]) {
      acc[otherUserId] = [];
    }
    acc[otherUserId].push(msg);
    return acc;
  }, {} as Record<string, PrivateMessage[]>);

  // Get user list with latest message
  const userList = Object.entries(groupedConversations).map(([userIdKey, messages]) => {
    const latestMessage = messages.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    return {
      userId: userIdKey,
      latestMessage,
      userName: latestMessage.profiles?.full_name || 'Usuário',
      avatar: latestMessage.profiles?.avatar_url,
      unreadCount: messages.filter(msg => !msg.is_read && msg.receiver_id === userId).length
    };
  }).filter(user => 
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-1/3 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-green-600 text-white">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-green-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">Chat Privado</h2>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Carregando conversas...</div>
        ) : userList.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>Nenhuma conversa encontrada</p>
            <p className="text-sm mt-1">Inicie uma conversa em um time!</p>
          </div>
        ) : (
          userList.map(({ userId: userIdKey, userName, avatar, latestMessage, unreadCount }) => (
            <div
              key={userIdKey}
              onClick={() => onSelectUser(userIdKey)}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                selectedUserId === userIdKey ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={avatar || ''} />
                  <AvatarFallback>
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 truncate">{userName}</p>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {latestMessage.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(latestMessage.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;
