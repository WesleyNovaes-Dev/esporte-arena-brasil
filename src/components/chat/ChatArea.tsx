
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { PrivateMessage } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatAreaProps {
  selectedUserId: string | null;
  selectedUser: {
    userId: string;
    userName: string;
    avatar?: string;
  } | null;
  currentConversation: PrivateMessage[];
  newMessage: string;
  userId?: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedUserId,
  selectedUser,
  currentConversation,
  newMessage,
  userId,
  onMessageChange,
  onSendMessage,
  onKeyPress
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  if (!selectedUserId || !selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Selecione uma conversa</p>
          <p className="text-sm">Escolha uma conversa para começar a conversar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={selectedUser.avatar || ''} />
            <AvatarFallback>
              {selectedUser.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-gray-900">{selectedUser.userName}</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentConversation.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === userId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender_id === userId
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender_id === userId ? 'text-green-200' : 'text-gray-500'
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
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-3">
          <Input
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <Button 
            onClick={onSendMessage}
            disabled={!newMessage.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
