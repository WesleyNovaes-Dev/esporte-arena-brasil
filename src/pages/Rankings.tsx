
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Star, Target, TrendingUp, Medal, Crown } from 'lucide-react';

const Rankings = () => {
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const [playerRankings] = useState([
    {
      position: 1,
      name: 'Carlos Silva',
      rating: 4.9,
      sport: 'Futebol',
      city: 'São Paulo',
      games: 45,
      wins: 38,
      goals: 23,
      assists: 15,
      points: 2450
    },
    {
      position: 2,
      name: 'Ana Costa',
      rating: 4.8,
      sport: 'Basquete',
      city: 'Rio de Janeiro',
      games: 32,
      wins: 28,
      goals: 156,
      assists: 89,
      points: 2380
    },
    {
      position: 3,
      name: 'João Silva',
      rating: 4.7,
      sport: 'Vôlei',
      city: 'Belo Horizonte',
      games: 28,
      wins: 24,
      goals: 0,
      assists: 112,
      points: 2290
    },
    {
      position: 4,
      name: 'Maria Santos',
      rating: 4.6,
      sport: 'Tênis',
      city: 'Brasília',
      games: 18,
      wins: 15,
      goals: 0,
      assists: 0,
      points: 2180
    },
    {
      position: 5,
      name: 'Pedro Lima',
      rating: 4.5,
      sport: 'Corrida',
      city: 'Porto Alegre',
      games: 25,
      wins: 20,
      goals: 0,
      assists: 0,
      points: 2150
    }
  ]);

  const [teamRankings] = useState([
    {
      position: 1,
      name: 'Thunders FC',
      sport: 'Futebol',
      city: 'São Paulo',
      members: 15,
      wins: 28,
      losses: 3,
      draws: 2,
      championships: 3,
      points: 3200
    },
    {
      position: 2,
      name: 'Spike Masters',
      sport: 'Vôlei',
      city: 'Rio de Janeiro',
      members: 8,
      wins: 24,
      losses: 4,
      draws: 0,
      championships: 2,
      points: 3100
    },
    {
      position: 3,
      name: 'Basket Warriors',
      sport: 'Basquete',
      city: 'Belo Horizonte',
      members: 12,
      wins: 22,
      losses: 6,
      draws: 1,
      championships: 1,
      points: 2950
    }
  ]);

  const [myStats] = useState({
    position: 47,
    rating: 4.2,
    points: 1850,
    gamesThisMonth: 8,
    winsThisMonth: 6,
    sport: 'Futebol',
    city: 'São Paulo'
  });

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <div className="w-5 h-5 flex items-center justify-center text-gray-600 font-bold text-sm">
            {position}
          </div>
        );
    }
  };

  const getSportEmoji = (sport: string) => {
    switch (sport) {
      case 'Futebol':
        return '⚽';
      case 'Basquete':
        return '🏀';
      case 'Vôlei':
        return '🏐';
      case 'Tênis':
        return '🎾';
      case 'Corrida':
        return '🏃';
      default:
        return '🏅';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rankings</h1>
          <p className="text-gray-600">Acompanhe os melhores jogadores e times da plataforma</p>
        </div>

        {/* My Position Card */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Sua Posição no Ranking</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">#{myStats.position}</div>
                <div className="text-sm text-gray-600">Posição Geral</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">{myStats.rating}</div>
                <div className="text-sm text-gray-600">Avaliação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{myStats.points}</div>
                <div className="text-sm text-gray-600">Pontos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{myStats.gamesThisMonth}</div>
                <div className="text-sm text-gray-600">Jogos este mês</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedSport} onValueChange={setSelectedSport}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por esporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os esportes</SelectItem>
                  <SelectItem value="Futebol">⚽ Futebol</SelectItem>
                  <SelectItem value="Basquete">🏀 Basquete</SelectItem>
                  <SelectItem value="Vôlei">🏐 Vôlei</SelectItem>
                  <SelectItem value="Tênis">🎾 Tênis</SelectItem>
                  <SelectItem value="Corrida">🏃 Corrida</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as regiões</SelectItem>
                  <SelectItem value="São Paulo">São Paulo</SelectItem>
                  <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                  <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                  <SelectItem value="Brasília">Brasília</SelectItem>
                  <SelectItem value="Porto Alegre">Porto Alegre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="players" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="players">Ranking de Jogadores</TabsTrigger>
            <TabsTrigger value="teams">Ranking de Times</TabsTrigger>
          </TabsList>

          {/* Players Ranking */}
          <TabsContent value="players" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>Top Jogadores</span>
                </CardTitle>
                <CardDescription>
                  Os melhores jogadores baseado em performance e avaliações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {playerRankings.map((player) => (
                    <div key={player.position} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        {getPositionIcon(player.position)}
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} />
                          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">{player.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {getSportEmoji(player.sport)} {player.sport}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>📍 {player.city}</span>
                          <span>🎮 {player.games} jogos</span>
                          <span>🏆 {player.wins} vitórias</span>
                          {player.goals > 0 && <span>⚽ {player.goals} gols</span>}
                          {player.assists > 0 && <span>🎯 {player.assists} assistências</span>}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">{player.rating}</span>
                        </div>
                        <div className="text-sm text-gray-600">{player.points} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teams Ranking */}
          <TabsContent value="teams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-green-600" />
                  <span>Top Times</span>
                </CardTitle>
                <CardDescription>
                  Os melhores times baseado em desempenho e conquistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamRankings.map((team) => (
                    <div key={team.position} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        {getPositionIcon(team.position)}
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">{getSportEmoji(team.sport)}</span>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">{team.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {getSportEmoji(team.sport)} {team.sport}
                          </Badge>
                          {team.championships > 0 && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              {team.championships} 🏆
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>📍 {team.city}</span>
                          <span>👥 {team.members} membros</span>
                          <span>🏆 {team.wins}V</span>
                          <span>❌ {team.losses}D</span>
                          {team.draws > 0 && <span>🤝 {team.draws}E</span>}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-lg text-green-600 mb-1">
                          {team.points} pts
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.round((team.wins / (team.wins + team.losses + team.draws)) * 100)}% vitórias
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Rankings;
