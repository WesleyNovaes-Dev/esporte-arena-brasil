
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Send, Pin, MessageSquare, Megaphone } from 'lucide-react';
import { toast } from 'sonner';

interface ChampionshipMessage {
  id: string;
  content: string;
  message_type: string;
  is_pinned: boolean;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

interface ChampionshipChatTabProps {
  championshipId: string;
}

const ChampionshipChatTab = ({ championshipId }: ChampionshipChatTabProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChampionshipMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'chat' | 'announcement'>('chat');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('championship_admins')
        .select('id')
        .eq('championship_id', championshipId)
        .eq('user_id', user.id)
        .single();

      setIsAdmin(!!data);
    };

    checkAdminStatus();
  }, [championshipId, user]);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('championship_messages')
        .select(`
          *,
          profiles(full_name)
        `)
        .eq('championship_id', championshipId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar mensagens:', error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`championship_messages_${championshipId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'championship_messages',
          filter: `championship_id=eq.${championshipId}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [championshipId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('championship_messages')
        .insert([
          {
            championship_id: championshipId,
            sender_id: user.id,
            content: newMessage,
            message_type: messageType
          }
        ]);

      if (error) throw error;

      setNewMessage('');
      toast.success('Mensagem enviada!');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const pinnedMessages = messages.filter(msg => msg.is_pinned);
  const chatMessages = messages.filter(msg => !msg.is_pinned);

  return (
    <div className="space-y-6">
      {/* Mensagens Fixadas */}
      {pinnedMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pin className="w-5 h-5" />
              Avisos Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pinnedMessages.map((message) => (
              <div key={message.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-yellow-100">
                    {message.message_type === 'announcement' ? 'Aviso' : 'Mensagem'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-900">{message.content}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Por: {message.profiles?.full_name || 'Usuário'}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Chat */}
      <Card className="h-96 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat do Campeonato
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Nenhuma mensagem ainda. Seja o primeiro a enviar!
              </div>
            ) : (
              chatMessages.map((message) => (
                <div key={message.id} className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      {message.profiles?.full_name || 'Usuário'}
                    </span>
                    <div className="flex items-center gap-2">
                      {message.message_type === 'announcement' && (
                        <Badge variant="secondary">
                          <Megaphone className="w-3 h-3 mr-1" />
                          Aviso
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 bg-gray-50 p-2 rounded">{message.content}</p>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  variant={messageType === 'chat' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMessageType('chat')}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Chat
                </Button>
                <Button
                  variant={messageType === 'announcement' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMessageType('announcement')}
                >
                  <Megaphone className="w-4 h-4 mr-1" />
                  Aviso
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder={messageType === 'announcement' ? 'Escreva um aviso...' : 'Digite sua mensagem...'}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim() || loading}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChampionshipChatTab;
