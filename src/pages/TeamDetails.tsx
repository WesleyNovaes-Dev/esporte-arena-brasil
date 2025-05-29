
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import TeamManagementPanel from '@/components/team/TeamManagementPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSports } from '@/hooks/useSports';
import { Users, MapPin, Calendar, Settings } from 'lucide-react';


import TextareaAutosize from 'react-textarea-autosize';




import { useTeamChat } from '@/hooks/useTeamChat';
import { Input } from '@headlessui/react';

const TeamDetails: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const { getSport } = useSports();
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isManaging, setIsManaging] = useState(false);
  const [userMembership, setUserMembership] = useState<any>(null);




  const { teamMessages, sendTeamMessage } = useTeamChat(teamId);

  const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await sendTeamMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
      fetchTeamMembers();
      checkUserMembership();
    }
  }, [teamId, user]);

  const fetchTeamDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (error) throw error;
      setTeam(data);
    } catch (error) {
      console.error('Erro ao buscar detalhes do time:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('team_id', teamId)
        .eq('status', 'active');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Erro ao buscar membros do time:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserMembership = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (!error && data) {
        setUserMembership(data);
      }
    } catch (error) {
      // Usuário não é membro do time
    }
  };

  const handleJoinTeam = async () => {
    if (!user || !team) return;

    try {
      // Verificar se o time tem vagas
      if (members.length >= (team.max_members || 20)) {
        alert('Este time já atingiu sua capacidade máxima!');
        return;
      }

      const { error } = await supabase
        .from('team_members')
        .insert([{
          team_id: teamId,
          user_id: user.id,
          role: 'player',
          status: 'active'
        }]);

      if (error) throw error;

      // Criar notificação para o dono do time
      await supabase
        .from('notifications')
        .insert([{
          user_id: team.owner_id,
          title: 'Novo membro no time!',
          content: `${user.user_metadata?.full_name || user.email} entrou no time ${team.name}`,
          type: 'new_member'
        }]);

      // Notificar todos os membros
      const memberNotifications = members.map(member => ({
        user_id: member.user_id,
        title: 'Novo membro no time!',
        content: `${user.user_metadata?.full_name || user.email} entrou no time ${team.name}`,
        type: 'new_member'
      }));

      if (memberNotifications.length > 0) {
        await supabase
          .from('notifications')
          .insert(memberNotifications);
      }

      alert('Você entrou no time com sucesso!');
      fetchTeamMembers();
      checkUserMembership();
    } catch (error) {
      console.error('Erro ao entrar no time:', error);
      alert('Não foi possível entrar no time. Tente novamente.');
    }
  };

  if (!teamId) {
    return <Navigate to="/teams" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p>Carregando detalhes do time...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p>Time não encontrado.</p>
        </div>
      </div>
    );
  }

  const sport = getSport(team.sport_id);
  const isOwner = user?.id === team.owner_id;
  const isMember = userMembership !== null;
  const canManage = isOwner || (userMembership?.role === 'admin' || userMembership?.role === 'captain');

  // Se está gerenciando, mostrar o painel completo
  if (isManaging && (isOwner || isMember)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <TeamManagementPanel team={team} isOwner={isOwner} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header do Time */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={team.logo_url} />
                  <AvatarFallback className="text-2xl">
                    {team.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-3xl">{team.name}</CardTitle>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary">
                      {sport?.emoji} {sport?.name}
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{team.city}, {team.state}</span>
                    </Badge>
                    <Badge variant={team.recruitment_open ? "default" : "secondary"}>
                      {team.recruitment_open ? "Recrutamento Aberto" : "Recrutamento Fechado"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {!isMember && team.recruitment_open && (
                  <Button onClick={handleJoinTeam} className="bg-green-600 hover:bg-green-700">
                    Ingressar no Time
                  </Button>
                )}
                {canManage && (
                  <Button 
                    onClick={() => setIsManaging(true)}
                    variant="outline"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Gerenciar Time
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{team.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{members.length}</div>
                <p className="text-sm text-gray-500">Membros</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{team.max_members || 20}</div>
                <p className="text-sm text-gray-500">Capacidade</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">0</div>
                <p className="text-sm text-gray-500">Vitórias</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {new Date(team.created_at).getFullYear()}
                </div>
                <p className="text-sm text-gray-500">Fundado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Membros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Membros do Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Avatar>
                    <AvatarImage src={member.profiles.avatar_url || undefined} />
                    <AvatarFallback>
                      {member.profiles.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{member.profiles.full_name}</p>
                    <Badge variant={
                      member.role === 'admin' ? 'destructive' :
                      member.role === 'captain' ? 'default' : 'secondary'
                    } className="text-xs">
                      {member.role === 'admin' ? 'Administrador' :
                       member.role === 'captain' ? 'Capitão' : 'Jogador'}
                    </Badge>
                  </div>
                  {member.user_id === team.owner_id && (
                    <Badge variant="outline" className="text-xs">
                      Dono
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {members.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Nenhum membro no time ainda</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card ></Card>

           <Card className="mb-10 w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Chat do Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          {/* Lista de mensagens */}
          <div className="h-64 md:h-80 overflow-y-auto border rounded-lg p-4 space-y-3 bg-gray-50">
            {teamMessages.length === 0 ? (
              <div className="text-center text-gray-500">
                Nenhuma mensagem ainda. Seja o primeiro a enviar!
              </div>
            ) : (
              teamMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {message.profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {message.profiles?.full_name || 'Usuário'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            <div />
          </div>

          {/* Campo de nova mensagem */}
          <div className="flex items-end space-x-2">
            <TextareaAutosize
              className="flex-1 resize-none rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              minRows={1}
              maxRows={6}
            />
            <Button onClick={handleSendMessage}>Enviar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
      </div>

      
    </div>
  );
};

export default TeamDetails;
