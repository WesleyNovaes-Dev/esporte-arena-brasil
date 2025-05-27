
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Calendar, Users, Target, Crown, Medal } from 'lucide-react';

const Championships = () => {
  const [activeChampionships] = useState([
    {
      id: 1,
      name: 'Copa Verão 2024',
      sport: 'Futebol',
      type: 'Copa',
      status: 'Em andamento',
      teams: 16,
      phase: 'Quartas de final',
      prize: 'R$ 2.000',
      startDate: '2024-11-15',
      endDate: '2024-12-20',
      organizer: 'João Silva',
      participants: 32
    },
    {
      id: 2,
      name: 'Torneio de Vôlei de Praia',
      sport: 'Vôlei',
      type: 'Torneio',
      status: 'Inscrições abertas',
      teams: 8,
      phase: 'Inscrições',
      prize: 'Medalhas',
      startDate: '2024-12-10',
      endDate: '2024-12-15',
      organizer: 'Maria Santos',
      participants: 16
    }
  ]);

  const [myChampionships] = useState([
    {
      id: 3,
      name: 'Liga Municipal de Basquete',
      sport: 'Basquete',
      type: 'Liga',
      status: 'Finalizado',
      position: 3,
      teams: 12,
      prize: 'Medalha de Bronze',
      endDate: '2024-10-30',
      team: 'Basket Warriors'
    }
  ]);

  const [rankings] = useState([
    {
      position: 1,
      team: 'Thunders FC',
      points: 18,
      games: 6,
      wins: 6,
      draws: 0,
      losses: 0,
      goals: 15,
      goalsAgainst: 3
    },
    {
      position: 2,
      team: 'Lightning Bolts',
      points: 12,
      games: 6,
      wins: 4,
      draws: 0,
      losses: 2,
      goals: 12,
      goalsAgainst: 8
    },
    {
      position: 3,
      team: 'Fire Dragons',
      points: 9,
      games: 6,
      wins: 3,
      draws: 0,
      losses: 3,
      goals: 10,
      goalsAgainst: 10
    },
    {
      position: 4,
      team: 'Ice Wolves',
      points: 6,
      games: 6,
      wins: 2,
      draws: 0,
      losses: 4,
      goals: 8,
      goalsAgainst: 12
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return 'bg-green-100 text-green-800';
      case 'Inscrições abertas':
        return 'bg-blue-100 text-blue-800';
      case 'Finalizado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-gray-600 font-bold">{position}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campeonatos</h1>
          <p className="text-gray-600">Acompanhe campeonatos, torneios e suas participações</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Campeonatos Ativos</TabsTrigger>
            <TabsTrigger value="my">Minhas Participações</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
          </TabsList>

          {/* Active Championships */}
          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeChampionships.map((championship) => (
                <Card key={championship.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{championship.name}</CardTitle>
                      <Badge className={getStatusColor(championship.status)} variant="secondary">
                        {championship.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{championship.sport}</Badge>
                      <Badge variant="outline">{championship.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{championship.teams} times</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span>{championship.phase}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-gray-400" />
                        <span>{championship.prize}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(championship.startDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${championship.organizer}`} />
                        <AvatarFallback className="text-xs">{championship.organizer.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>Organizador: {championship.organizer}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Ver Detalhes
                      </Button>
                      {championship.status === 'Inscrições abertas' && (
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          Inscrever Time
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Championships */}
          <TabsContent value="my" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myChampionships.map((championship) => (
                <Card key={championship.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{championship.name}</CardTitle>
                      <Badge className={getStatusColor(championship.status)} variant="secondary">
                        {championship.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{championship.sport}</Badge>
                      <Badge variant="outline">{championship.type}</Badge>
                      {championship.position && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {championship.position}º lugar
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{championship.teams} times</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-gray-400" />
                        <span>{championship.prize}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Finalizado em {new Date(championship.endDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Time: {championship.team}</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      Ver Histórico
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rankings */}
          <TabsContent value="rankings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Copa Verão 2024 - Classificação</CardTitle>
                <CardDescription>
                  Classificação atual da fase de grupos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Pos</th>
                        <th className="text-left py-2">Time</th>
                        <th className="text-center py-2">PTS</th>
                        <th className="text-center py-2">J</th>
                        <th className="text-center py-2">V</th>
                        <th className="text-center py-2">E</th>
                        <th className="text-center py-2">D</th>
                        <th className="text-center py-2">GP</th>
                        <th className="text-center py-2">GC</th>
                        <th className="text-center py-2">SG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankings.map((team) => (
                        <tr key={team.position} className="border-b hover:bg-gray-50">
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              {getPositionIcon(team.position)}
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${team.team}`} />
                                <AvatarFallback className="text-xs">{team.team.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{team.team}</span>
                            </div>
                          </td>
                          <td className="text-center py-3 font-bold">{team.points}</td>
                          <td className="text-center py-3">{team.games}</td>
                          <td className="text-center py-3 text-green-600">{team.wins}</td>
                          <td className="text-center py-3 text-yellow-600">{team.draws}</td>
                          <td className="text-center py-3 text-red-600">{team.losses}</td>
                          <td className="text-center py-3">{team.goals}</td>
                          <td className="text-center py-3">{team.goalsAgainst}</td>
                          <td className="text-center py-3 font-medium">
                            {team.goals - team.goalsAgainst > 0 ? '+' : ''}{team.goals - team.goalsAgainst}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Championships;
