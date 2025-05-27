
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Search, Trophy, Star, Calendar } from 'lucide-react';

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');

  const [myTeams] = useState([
    {
      id: 1,
      name: 'Thunders FC',
      sport: 'Futebol',
      role: 'Capitão',
      members: 15,
      wins: 8,
      losses: 2,
      draws: 1,
      logo: '⚽',
      description: 'Time competitivo de futebol society',
      nextGame: '2024-12-01',
      rating: 4.7
    },
    {
      id: 2,
      name: 'Spike Masters',
      sport: 'Vôlei',
      role: 'Jogador',
      members: 8,
      wins: 12,
      losses: 3,
      draws: 0,
      logo: '🏐',
      description: 'Equipe de vôlei de praia profissional',
      nextGame: '2024-12-03',
      rating: 4.9
    }
  ]);

  const [availableTeams] = useState([
    {
      id: 3,
      name: 'Basket Warriors',
      sport: 'Basquete',
      members: 10,
      maxMembers: 12,
      wins: 5,
      losses: 1,
      logo: '🏀',
      description: 'Time de basquete 3x3 procura novos talentos',
      captain: 'Ana Costa',
      rating: 4.6,
      recruiting: true
    },
    {
      id: 4,
      name: 'Tennis Club Elite',
      sport: 'Tênis',
      members: 6,
      maxMembers: 8,
      wins: 15,
      losses: 4,
      logo: '🎾',
      description: 'Clube de tênis para jogadores avançados',
      captain: 'Carlos Silva',
      rating: 4.8,
      recruiting: true
    },
    {
      id: 5,
      name: 'Runners United',
      sport: 'Corrida',
      members: 20,
      maxMembers: 25,
      wins: 0,
      losses: 0,
      logo: '🏃',
      description: 'Grupo de corrida para todos os níveis',
      captain: 'Pedro Lima',
      rating: 4.5,
      recruiting: true
    }
  ]);

  const filteredAvailableTeams = availableTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = sportFilter === 'all' || team.sport === sportFilter;
    
    return matchesSearch && matchesSport;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Times</h1>
            <p className="text-gray-600">Gerencie seus times e encontre novos para participar</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Link to="/create-team" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Criar Time</span>
            </Link>
          </Button>
        </div>

        {/* My Teams */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Meus Times</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTeams.map((team) => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">{team.logo}</span>
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="text-xs">{team.sport}</Badge>
                        <Badge className="text-xs bg-blue-100 text-blue-800">{team.role}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{team.rating}</span>
                    <span className="text-sm text-gray-500">• {team.members} membros</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{team.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="font-semibold text-green-600">{team.wins}</div>
                      <div className="text-gray-500">Vitórias</div>
                    </div>
                    <div>
                      <div className="font-semibold text-red-600">{team.losses}</div>
                      <div className="text-gray-500">Derrotas</div>
                    </div>
                    <div>
                      <div className="font-semibold text-yellow-600">{team.draws}</div>
                      <div className="text-gray-500">Empates</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Próximo jogo: {new Date(team.nextGame).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Detalhes
                    </Button>
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                      Gerenciar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Teams */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-900">Times Disponíveis</h2>
            
            {/* Filters */}
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar times..."
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
                  <SelectItem value="Futebol">Futebol</SelectItem>
                  <SelectItem value="Vôlei">Vôlei</SelectItem>
                  <SelectItem value="Basquete">Basquete</SelectItem>
                  <SelectItem value="Tênis">Tênis</SelectItem>
                  <SelectItem value="Corrida">Corrida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailableTeams.map((team) => (
              <Card key={team.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">{team.logo}</span>
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{team.sport}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{team.rating}</span>
                    </div>
                    {team.recruiting && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        Recrutando
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{team.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{team.members}/{team.maxMembers} membros</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-gray-400" />
                      <span>{team.wins}V - {team.losses}D</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${team.captain}`} />
                      <AvatarFallback className="text-xs">{team.captain.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>Capitão: {team.captain}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Detalhes
                    </Button>
                    <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Solicitar Entrada
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAvailableTeams.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum time encontrado</h3>
              <p className="text-gray-600 mb-4">Tente ajustar os filtros ou criar seu próprio time.</p>
              <Button asChild>
                <Link to="/create-team">Criar Meu Time</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teams;
