
import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { usePrivateChat } from '@/hooks/useTeamChat';
import { PrivateMessage } from '@/types/chat';
import Navbar from '@/components/layout/Navbar';
import ConversationSidebar from '@/components/chat/ConversationSidebar';
import ChatArea from '@/components/chat/ChatArea';

const PrivateChat = () => {
  const { user } = useAuth();
  const { conversations, loading, sendPrivateMessage } = usePrivateChat();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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
  }).filter(userItem => 
    userItem.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const selectedUser = selectedUserId ? userList.find(u => u.userId === selectedUserId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)] flex">
          <ConversationSidebar
            conversations={conversations}
            loading={loading}
            selectedUserId={selectedUserId}
            searchTerm={searchTerm}
            userId={user?.id}
            onSelectUser={setSelectedUserId}
            onSearchChange={setSearchTerm}
          />
          
          <ChatArea
            selectedUserId={selectedUserId}
            selectedUser={selectedUser}
            currentConversation={currentConversation}
            newMessage={newMessage}
            userId={user?.id}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
