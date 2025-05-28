
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Info, Edit, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Modal } from '@/components/ui/modal';
import { useSports } from '@/hooks/useSports';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/components/auth/AuthProvider';
import NotificationCenter from '@/components/notifications/NotificationCenter';

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const [myTeams, setMyTeams] = useState<any[]>([]);
  const [availableTeams, setAvailableTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { sports, getSport, loading: sportsLoading } = useSports();
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Função para buscar "Meus Times" do banco
  const fetchMyTeams = async () => {
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const user = sessionData?.session?.user;
      if (!user) throw new Error('Usuário não autenticado.');

      // Buscar times que o usuário possui ou é membro
      const { data: memberTeams, error: memberError } = await supabase
        .from('team_members')
        .select(`
          *,
          teams (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (memberError) throw memberError;

      const teams = memberTeams?.map(member => ({
        ...member.teams,
        memberRole: member.role,
        isOwner: member.teams.owner_id === user.id
      })) || [];

      setMyTeams(teams);
    } catch (err: any) {
      console.error('Erro ao buscar "Meus Times":', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar "Times Disponíveis" do banco
  const fetchAvailableTeams = async () => {
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const user = sessionData?.session?.user;
      if (!user) throw new Error('Usuário não autenticado.');

      // Buscar times que o usuário não faz parte
      const { data: userTeams } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      const userTeamIds = userTeams?.map(t => t.team_id) || [];

      const query = supabase
        .from('teams')
        .select('*')
        .eq('recruitment_open', true);

      if (userTeamIds.length > 0) {
        query.not('id', 'in', `(${userTeamIds.join(',')})`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setAvailableTeams(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar "Times Disponíveis":', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Carregar os dados do banco ao montar o componente
  useEffect(() => {
    fetchMyTeams();
    fetchAvailableTeams();
  }, []);

  // Filtrar "Times Disponíveis"
  const filteredAvailableTeams = availableTeams.filter((team) => {
    const matchesSearch =
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (team.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesSport = sportFilter === 'all' || team.sport_id === sportFilter;

    return matchesSearch && matchesSport;
  });

  // Função para abrir modal com detalhes
  const handleShowDetails = (team: any) => {
    navigate(`/teams/${team.id}`);
  };

  // Função para ingressar em um time
  const handleJoinTeam = async (teamId: string) => {
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      const user = sessionData?.session?.user;
      if (!user) throw new Error('Usuário não autenticado.');

      const { error } = await supabase
          .from('team_members')
          .insert([{ 
            team_id: teamId, 
            user_id: user.id,
            role: 'player',
            status: 'active'
          }]);
      
      if (error) throw error;

      // Buscar dados do time para notificação
      const { data: teamData } = await supabase
        .from('teams')
        .select('name, owner_id')
        .eq('id', teamId)
        .single();

      if (teamData) {
        // Criar notificação para o dono do time
        await supabase
          .from('notifications')
          .insert([{
            user_id: teamData.owner_id,
            title: 'Novo membro no time!',
            content: `${user.user_metadata?.full_name || user.email} entrou no time ${teamData.name}`,
            type: 'new_member'
          }]);
      }

      alert('Solicitação de participação enviada!');
      fetchMyTeams();
      fetchAvailableTeams();
    } catch (err: any) {
      console.error('Erro ao ingressar no time:', err.message);
      alert('Não foi possível ingressar no time.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || sportsLoading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p>Carregando os times...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-600">
          <p>Erro ao carregar os times: {error}</p>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Times</h1>
              <p className="text-gray-600">Gerencie seus times ou encontre novos para participar!</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 rounded-full w-5 h-5 text-xs p-0 flex items-center justify-center">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link to="/create-team" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Criar Time</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Centro de Notificações */}
          {showNotifications && (
            <div className="mb-8">
              <NotificationCenter />
            </div>
          )}

          {/* Meus Times */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Meus Times</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTeams.map((team) => (
                  <Card key={team.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <div className="flex space-x-2">
                        <Badge variant="secondary">
                          {getSport(team.sport_id)?.emoji || ''} {getSport(team.sport_id)?.name || 'Esporte não definido'}
                        </Badge>
                        {team.isOwner && (
                          <Badge variant="destructive">Dono</Badge>
                        )}
                        {!team.isOwner && (
                          <Badge variant="outline">{team.memberRole}</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 w-full"
                          onClick={() => navigate(`/teams/${team.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {team.isOwner ? 'Gerenciar' : 'Ver Time'}
                      </Button>
                    </CardContent>
                  </Card>
              ))}
            </div>
            {myTeams.length === 0 && <p className="text-gray-500">Você ainda não faz parte de nenhum time.</p>}
          </div>

          {/* Times Disponíveis */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Times Disponíveis</h2>
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Buscar por times"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                />
              </div>
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Esporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {sports.map((sport) => (
                      <SelectItem key={sport.id} value={sport.id}>
                        {sport.emoji || ''} {sport.name}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cards de Times Disponíveis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailableTeams.map((team) => (
                  <Card key={team.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <Badge variant="secondary">
                        {getSport(team.sport_id)?.emoji || ''} {getSport(team.sport_id)?.name || 'Esporte não definido'}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <Button
                          size="sm"
                          variant="outline"
                          className="w-full mb-2"
                          onClick={() => handleShowDetails(team)}
                      >
                        <Info className="w-4 h-4 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 w-full" 
                        onClick={() => handleJoinTeam(team.id)}
                      >
                        Ingressar
                      </Button>
                    </CardContent>
                  </Card>
              ))}
            </div>

            {filteredAvailableTeams.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhum time disponível encontrado.</p>
                </div>
            )}
          </div>
        </div>

        {/* Modal de Detalhes */}
        {isModalOpen && selectedTeam && (
            <Modal 
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title={selectedTeam.name} 
              description="Detalhes do Time"
            >
              <h3 className="text-lg font-semibold">{selectedTeam.name}</h3>
              <p className="text-sm text-gray-600">{selectedTeam.description || 'Sem descrição disponível.'}</p>
              <div className="flex flex-col gap-2 mt-4">
                <span>
                  Esporte: {getSport(selectedTeam.sport_id)?.emoji || ''} {getSport(selectedTeam.sport_id)?.name || 'Esporte não definido'}
                </span>
                <span>Local: {selectedTeam.city}, {selectedTeam.state}</span>
              </div>
            </Modal>
        )}
      </div>
  );
};

export default Teams;
