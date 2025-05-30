
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrivateChat } from '@/hooks/useTeamChat';
import PrivateChatWindow from './PrivateChatWindow';

const PrivateChatIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { conversations, loading } = usePrivateChat();

  // Count unread messages
  const unreadCount = conversations.filter(msg => !msg.is_read).length;

  return (
    <>
      {/* Floating Chat Icon */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-12 w-12 rounded-full bg-green-600 hover:bg-green-700 shadow-lg"
          size="icon"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
          
          {/* Unread message badge */}
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <PrivateChatWindow 
          onClose={() => setIsOpen(false)}
          conversations={conversations}
          loading={loading}
        />
      )}
    </>
  );
};

export default PrivateChatIcon;
