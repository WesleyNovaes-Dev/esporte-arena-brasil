
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TeamRequest {
  id: string;
  user_id: string;
  team_id: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface TeamRequestsManagerProps {
  teamId: string;
  onRequestUpdate: () => void;
}

const TeamRequestsManager: React.FC<TeamRequestsManagerProps> = ({ teamId, onRequestUpdate }) => {
  const [requests, setRequests] = React.useState<TeamRequest[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          *,
          profiles:profile_id (
            full_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId)
        .eq('status', 'pending')
        .eq('type', 'request');

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: string, action: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: action })
        .eq('id', requestId);

      if (error) throw error;

      if (action === 'accepted') {
        // Adicionar o usuário ao time
        const request = requests.find(r => r.id === requestId);
        if (request) {
          await supabase
            .from('team_members')
            .insert({
              team_id: teamId,
              user_id: request.user_id,
              role: 'player',
              status: 'active'
            });
        }
      }

      fetchRequests();
      onRequestUpdate();
    } catch (error) {
      console.error('Erro ao processar solicitação:', error);
    }
  };

  React.useEffect(() => {
    fetchRequests();
  }, [teamId]);

  if (loading) {
    return <div>Carregando solicitações...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Solicitações Pendentes</span>
          {requests.length > 0 && (
            <Badge variant="destructive">{requests.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-gray-500">Nenhuma solicitação pendente</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={request.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {request.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{request.profiles?.full_name}</p>
                    <p className="text-sm text-gray-500">
                      Solicitou em {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleRequest(request.id, 'accepted')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRequest(request.id, 'rejected')}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamRequestsManager;
