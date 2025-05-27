
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../components/auth/AuthProvider';
import { Star, Trophy, Calendar, Users, Edit } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const userStats = {
    eventsParticipated: 23,
    teamsCreated: 2,
    averageRating: 4.8,
    rankingPosition: 47,
    wins: 15,
    losses: 8,
    goals: 12,
    assists: 7
  };

  const sports = [
    { name: 'Futebol', level: 'Avançado', games: 18 },
    { name: 'Vôlei', level: 'Intermediário', games: 5 },
    { name: 'Tênis', level: 'Iniciante', games: 2 }
  ];

  const achievements = [
    { title: 'Artilheiro', description: 'Maior artilheiro do mês', icon: '⚽', date: 'Nov 2024' },
    { title: 'MVP', description: 'Melhor jogador da partida', icon: '🏆', date: 'Out 2024' },
    { title: 'Fair Play', description: 'Comportamento exemplar', icon: '🤝', date: 'Set 2024' },
    { title: 'Participativo', description: '20+ eventos participados', icon: '📅', date: 'Ago 2024' }
  ];

  const recentActivity = [
    { type: 'event', title: 'Participou do Futebol Society', date: '2024-11-25', icon: Calendar },
    { type: 'achievement', title: 'Conquistou medalha de Artilheiro', date: '2024-11-20', icon: Trophy },
    { type: 'team', title: 'Entrou no time Thunders FC', date: '2024-11-15', icon: Users },
    { type: 'event', title: 'Organizou Vôlei de Praia', date: '2024-11-10', icon: Calendar }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Avançado':
        return 'bg-green-100 text-green-800';
      case 'Intermediário':
        return 'bg-yellow-100 text-yellow-800';
      case 'Iniciante':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="text-2xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
                    <p className="text-gray-600 mb-2">{user?.email}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Membro desde Nov 2024</span>
                      <span>•</span>
                      <span>São Paulo, SP</span>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4 sm:mt-0">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{userStats.averageRating}</span>
                    <span className="text-gray-500">(23 avaliações)</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Ranking: <span className="font-semibold text-green-600">#{userStats.rankingPosition}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{userStats.eventsParticipated}</div>
                    <div className="text-sm text-gray-600">Eventos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{userStats.wins}</div>
                    <div className="text-sm text-gray-600">Vitórias</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{userStats.goals}</div>
                    <div className="text-sm text-gray-600">Gols</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{userStats.assists}</div>
                    <div className="text-sm text-gray-600">Assistências</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sports */}
            <Card>
              <CardHeader>
                <CardTitle>Esportes Praticados</CardTitle>
                <CardDescription>
                  Seus esportes e níveis de habilidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sports.map((sport, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{sport.name}</h3>
                      <p className="text-sm text-gray-600">{sport.games} jogos disputados</p>
                    </div>
                    <Badge className={getLevelColor(sport.level)} variant="secondary">
                      {sport.level}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Conquistas</CardTitle>
                <CardDescription>
                  Suas medalhas e conquistas no esporte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                        <p className="text-xs text-gray-500">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Vitórias</span>
                      <span>{Math.round((userStats.wins / (userStats.wins + userStats.losses)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(userStats.wins / (userStats.wins + userStats.losses)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Avaliação</span>
                      <span>{userStats.averageRating}/5.0</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(userStats.averageRating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <activity.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
