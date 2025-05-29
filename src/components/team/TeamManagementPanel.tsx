
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  MessageSquare, 
  Trophy, 
  BarChart3, 
  Settings, 
  Plus,
  UserPlus,
  Crown,
  Shield,
  Edit,
  Trash2
} from 'lucide-react';
import { useTeamManagement } from '@/hooks/useTeamManagement';
import { useTeamChat } from '@/hooks/useTeamChat';
import { useSports } from '@/hooks/useSports';
import TeamRequestsManager from './TeamRequestsManager';

interface TeamManagementPanelProps {
  team: any;
  isOwner: boolean;
}

const TeamManagementPanel: React.FC<TeamManagementPanelProps> = ({ team, isOwner }) => {
  const { members, roles, loading, addMember, removeMember, updateMemberRole, refetch } = useTeamManagement(team.id);
  const { teamMessages, sendTeamMessage } = useTeamChat(team.id);
  const { getSport } = useSports();
  const [newMessage, setNewMessage] = useState('');

  const sport = getSport(team.sport_id);
  const occupancyPercentage = (members.length / (team.max_members || 20)) * 100;

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      await sendTeamMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handlePromoteMember = async (memberId: string, currentRole: string) => {
    const newRole = currentRole === 'player' ? 'captain' : 'admin';
    await updateMemberRole(memberId, newRole);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando painel de administração...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header do Time */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={team.logo_url} />
              <AvatarFallback className="text-2xl">
                {team.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-3xl">{team.name}</CardTitle>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary">
                  {sport?.emoji} {sport?.name}
                </Badge>
                <Badge variant="outline">
                  {team.city}, {team.state}
                </Badge>
                <Badge variant={team.recruitment_open ? "default" : "secondary"}>
                  {team.recruitment_open ? "Recrutamento Aberto" : "Recrutamento Fechado"}
                </Badge>
              </div>
              <p className="text-gray-600 mt-2">{team.description}</p>
              
              {/* Barra de Ocupação */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Membros do Time</span>
                  <span>{members.length}/{team.max_members || 20}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs de Administração */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="requests">Solicitações</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="matches">Partidas</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members.length}</div>
                <p className="text-xs text-muted-foreground">
                  {team.max_members - members.length} vagas disponíveis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mensagens Hoje</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamMessages.length}</div>
                <p className="text-xs text-muted-foreground">
                  Chat ativo
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximas Partidas</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Nenhuma agendada
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Solicitações */}
        <TabsContent value="requests">
          <TeamRequestsManager teamId={team.id} onRequestUpdate={refetch} />
        </TabsContent>

        {/* Membros */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gerenciar Membros</CardTitle>
                {isOwner && (
                  <Button className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Convidar Membro
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.profiles.avatar_url || undefined} />
                        <AvatarFallback>
                          {member.profiles.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.profiles.full_name}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={
                            member.role === 'admin' ? 'destructive' :
                            member.role === 'captain' ? 'default' : 'secondary'
                          }>
                            {member.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                            {member.role === 'captain' && <Shield className="w-3 h-3 mr-1" />}
                            {member.role === 'admin' ? 'Administrador' :
                             member.role === 'captain' ? 'Capitão' : 'Jogador'}
                          </Badge>
                          {member.team_roles && (
                            <Badge variant="outline">
                              {member.team_roles.name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Entrou em {new Date(member.joined_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {isOwner && member.user_id !== team.owner_id && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePromoteMember(member.id, member.role)}
                        >
                          <Crown className="w-4 h-4 mr-1" />
                          Promover
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeMember(member.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chat */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Chat do Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mensagens */}
                <div className="h-64 overflow-y-auto border rounded-lg p-4 space-y-3">
                  {teamMessages.length === 0 ? (
                    <div className="text-center text-gray-500">
                      Nenhuma mensagem ainda. Seja o primeiro a enviar!
                    </div>
                  ) : (
                    teamMessages.map((message) => (
                      <div key={message.id} className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.profiles?.avatar_url || undefined} />
                          <AvatarFallback>
                            {message.profiles?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">{message.profiles?.full_name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input de Nova Mensagem */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    Enviar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partidas */}
        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle>Partidas e Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Nenhuma partida agendada</p>
                {isOwner && (
                  <Button className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Agendar Partida
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Estatísticas */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas e Desempenho</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Estatísticas em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações */}
        <TabsContent value="settings">
          {isOwner ? (
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome do Time</label>
                    <Input defaultValue={team.name} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <Textarea defaultValue={team.description} />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Capacidade Máxima</label>
                      <Input type="number" defaultValue={team.max_members} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Recrutamento</label>
                      <select className="w-full p-2 border rounded" defaultValue={team.recruitment_open ? "open" : "closed"}>
                        <option value="open">Aberto</option>
                        <option value="closed">Fechado</option>
                      </select>
                    </div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Apenas administradores podem acessar as configurações</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagementPanel;
