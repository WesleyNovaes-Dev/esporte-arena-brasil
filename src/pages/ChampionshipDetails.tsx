
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { useChampionshipManagement } from '@/hooks/useChampionshipManagement';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import ChampionshipTeamsTab from '@/components/championship/ChampionshipTeamsTab';
import ChampionshipMatchesTab from '@/components/championship/ChampionshipMatchesTab';
import ChampionshipCostsTab from '@/components/championship/ChampionshipCostsTab';
import ChampionshipChatTab from '@/components/championship/ChampionshipChatTab';

const ChampionshipDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [championship, setChampionship] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    teams,
    matches,
    costs,
    loadTeams,
    loadMatches,
    loadCosts
  } = useChampionshipManagement(id || '');

  useEffect(() => {
    const fetchChampionship = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('championships')
          .select(`
            *,
            sports(name, emoji),
            profiles(full_name)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setChampionship(data);

        // Check if user is admin
        const { data: adminData } = await supabase
          .from('championship_admins')
          .select('id')
          .eq('championship_id', id)
          .eq('user_id', user?.id)
          .single();

        setIsAdmin(!!adminData);
      } catch (error) {
        console.error('Erro ao carregar campeonato:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChampionship();
    loadTeams();
    loadMatches();
    loadCosts();
  }, [id, user?.id, loadTeams, loadMatches, loadCosts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!championship) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Campeonato não encontrado</div>
        </div>
      </div>
    );
  }

  const totalCosts = costs.reduce((sum, cost) => sum + cost.cost, 0);
  const acceptedTeams = teams.filter(team => team.status === 'accepted');
  const costPerTeam = acceptedTeams.length > 0 ? totalCosts / acceptedTeams.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{championship.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={championship.is_private ? "destructive" : "default"}>
                {championship.is_private ? 'Privado' : 'Público'}
              </Badge>
              <Badge variant="outline">{championship.status}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600">Esporte</p>
                    <p className="font-semibold">
                      {championship.sports?.emoji} {championship.sports?.name}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Times</p>
                    <p className="font-semibold">{acceptedTeams.length}/{championship.max_teams}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Premiação</p>
                    <p className="font-semibold">R$ {championship.prize_pool?.toFixed(2) || '0,00'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Período</p>
                    <p className="font-semibold text-sm">
                      {championship.start_date ? new Date(championship.start_date).toLocaleDateString() : 'A definir'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {championship.description && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <p className="text-gray-700">{championship.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="teams" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="teams">Times</TabsTrigger>
            <TabsTrigger value="matches">Jogos</TabsTrigger>
            <TabsTrigger value="costs">Custos</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <ChampionshipTeamsTab
              teams={teams}
              isAdmin={isAdmin}
              championshipId={id || ''}
              onTeamsUpdate={loadTeams}
            />
          </TabsContent>

          <TabsContent value="matches">
            <ChampionshipMatchesTab
              matches={matches}
              teams={acceptedTeams}
              isAdmin={isAdmin}
              championshipId={id || ''}
              onMatchesUpdate={loadMatches}
            />
          </TabsContent>

          <TabsContent value="costs">
            <ChampionshipCostsTab
              costs={costs}
              isAdmin={isAdmin}
              championshipId={id || ''}
              totalCosts={totalCosts}
              costPerTeam={costPerTeam}
              teamsCount={acceptedTeams.length}
              onCostsUpdate={loadCosts}
            />
          </TabsContent>

          <TabsContent value="chat">
            <ChampionshipChatTab championshipId={id || ''} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ChampionshipDetails;
