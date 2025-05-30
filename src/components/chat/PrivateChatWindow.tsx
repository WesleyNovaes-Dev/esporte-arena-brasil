
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth/AuthProvider';
import { usePrivateChat } from '@/hooks/useTeamChat';
import { PrivateMessage } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PrivateChatWindowProps {
  onClose: () => void;
  conversations: PrivateMessage[];
  loading: boolean;
}

const PrivateChatWindow: React.FC<PrivateChatWindowProps> = ({ 
  onClose, 
  conversations, 
  loading 
}) => {
  const { user } = useAuth();
  const { sendPrivateMessage } = usePrivateChat();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Group conversations by users
  const groupedConversations = conversations.reduce((acc, msg) => {
    const otherUserId = msg.sender_id === user?.id ? msg.receiver_id : msg.sender_id;
    if (!acc[otherUserId]) {
      acc[otherUserId] = [];
    }
    acc[otherUserId].push(msg);
    return acc;
  }, {} as Record<string, PrivateMessage[]>);

  // Get current conversation
  const currentConversation = selectedUserId ? 
    (groupedConversations[selectedUserId] || []).sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ) : [];

  // Get user list with latest message
  const userList = Object.entries(groupedConversations).map(([userId, messages]) => {
    const latestMessage = messages.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];
    return {
      userId,
      latestMessage,
      userName: latestMessage.profiles?.full_name || 'Usuário',
      avatar: latestMessage.profiles?.avatar_url,
      unreadCount: messages.filter(msg => !msg.is_read && msg.receiver_id === user?.id).length
    };
  }).filter(user => 
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId || !user) return;

    try {
      await sendPrivateMessage(selectedUserId, '', newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-green-600 text-white rounded-t-lg">
        <h3 className="font-semibold">Chat Privado</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-green-700">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* User List */}
        <div className="w-1/3 border-r bg-gray-50 flex flex-col">
          {/* Search */}
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-2 text-xs text-gray-500">Carregando...</div>
            ) : userList.length === 0 ? (
              <div className="p-2 text-xs text-gray-500">Nenhuma conversa</div>
            ) : (
              userList.map(({ userId, userName, avatar, latestMessage, unreadCount }) => (
                <div
                  key={userId}
                  onClick={() => setSelectedUserId(userId)}
                  className={`p-2 cursor-pointer hover:bg-gray-100 border-b ${
                    selectedUserId === userId ? 'bg-green-100' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={avatar || ''} />
                      <AvatarFallback className="text-xs">
                        {userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium truncate">{userName}</p>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-1">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {latestMessage.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedUserId ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {currentConversation.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-2 rounded-lg text-xs ${
                        message.sender_id === user?.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_id === user?.id ? 'text-green-200' : 'text-gray-500'
                      }`}>
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-2 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 h-8 text-xs"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    size="icon"
                    className="h-8 w-8"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
              Selecione uma conversa
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateChatWindow;
