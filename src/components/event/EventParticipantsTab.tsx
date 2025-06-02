
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Check, X, UserPlus, Users } from 'lucide-react';
import type { EventParticipant } from '@/hooks/useEventManagement';

interface EventParticipantsTabProps {
  eventId: string;
  isAdmin: boolean;
  participants: EventParticipant[];
  onUpdate: () => void;
}

interface JoinRequest {
  id: string;
  user_id: string;
  message: string | null;
  requested_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export const EventParticipantsTab: React.FC<EventParticipantsTabProps> = ({
  eventId,
  isAdmin,
  participants,
  onUpdate
}) => {
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadJoinRequests();
    }
  }, [eventId, isAdmin]);

  const loadJoinRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('event_join_requests')
        .select(`
          *,
          profiles(full_name, avatar_url)
        `)
        .eq('event_id', eventId)
        .eq('status', 'pending');

      if (error) throw error;
      setJoinRequests(data || []);
    } catch (error) {
      console.error('Error loading join requests:', error);
    }
  };

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .ilike('full_name', `%${term}%`)
        .limit(10);

      if (error) throw error;
      
      // Filter out users who are already participants
      const participantIds = participants.map(p => p.user_id);
      const filteredResults = (data || []).filter(user => !participantIds.includes(user.id));
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const approveJoinRequest = async (requestId: string, userId: string) => {
    try {
      // Update request status
      const { error: updateError } = await supabase
        .from('event_join_requests')
        .update({ 
          status: 'approved',
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Add user as participant
      const { error: insertError } = await supabase
        .from('event_participants')
        .insert([{
          event_id: eventId,
          user_id: userId,
          status: 'confirmed'
        }]);

      if (insertError) throw insertError;

      toast.success('Solicitação aprovada!');
      loadJoinRequests();
      onUpdate();
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Erro ao aprovar solicitação');
    }
  };

  const rejectJoinRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('event_join_requests')
        .update({ 
          status: 'rejected',
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Solicitação rejeitada');
      loadJoinRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Erro ao rejeitar solicitação');
    }
  };

  const inviteUser = async (userId: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('event_user_invitations')
        .insert([{
          event_id: eventId,
          user_id: userId,
          status: 'invited'
        }]);

      if (error) throw error;

      toast.success('Convite enviado!');
      setSearchTerm('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error inviting user:', error);
      toast.error('Erro ao enviar convite');
    } finally {
      setLoading(false);
    }
  };

  const removeParticipant = async (participantId: string) => {
    try {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('id', participantId);

      if (error) throw error;

      toast.success('Participante removido');
      onUpdate();
    } catch (error) {
      console.error('Error removing participant:', error);
      toast.error('Erro ao remover participante');
    }
  };

  return (
    <div className="space-y-6">
      {/* Join Requests */}
      {isAdmin && joinRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Solicitações de Entrada ({joinRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {joinRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={request.profiles?.avatar_url || ''} />
                    <AvatarFallback>
                      {request.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.profiles?.full_name}</p>
                    {request.message && (
                      <p className="text-sm text-gray-600">{request.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(request.requested_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => approveJoinRequest(request.id, request.user_id)}
                  >
                    <Check className="w-4 h-4" />
                    Aprovar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rejectJoinRequest(request.id)}
                  >
                    <X className="w-4 h-4" />
                    Rejeitar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Participants List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Participantes ({participants.length})
            </CardTitle>
            {isAdmin && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Convidar Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Convidar Usuário</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Buscar usuário por nome..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        searchUsers(e.target.value);
                      }}
                    />
                    {searchResults.length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {searchResults.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar_url || ''} />
                                <AvatarFallback>
                                  {user.full_name?.charAt(0) || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span>{user.full_name}</span>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => inviteUser(user.id)}
                              disabled={loading}
                            >
                              Convidar
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {participants.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum participante ainda
            </p>
          ) : (
            <div className="space-y-3">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={participant.profiles?.avatar_url || ''} />
                      <AvatarFallback>
                        {participant.profiles?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{participant.profiles?.full_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(participant.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{participant.status}</Badge>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeParticipant(participant.id)}
                      >
                        Remover
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
