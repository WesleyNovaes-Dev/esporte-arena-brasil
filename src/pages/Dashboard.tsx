
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Plus, Trophy, Clock } from 'lucide-react';

const Dashboard = () => {
  const [upcomingEvents] = useState([
    {
      id: 1,
      title: 'Futebol Society - Domingo',
      sport: 'Futebol',
      date: '2024-12-01',
      time: '09:00',
      location: 'Campo do Bairro Central',
      participants: 18,
      maxParticipants: 20,
      price: 'R$ 25,00',
      organizer: 'João Silva',
      status: 'Confirmado'
    },
    {
      id: 2,
      title: 'Vôlei de Praia',
      sport: 'Vôlei',
      date: '2024-12-03',
      time: '18:00',
      location: 'Praia de Copacabana',
      participants: 6,
      maxParticipants: 8,
      price: 'Gratuito',
      organizer: 'Maria Santos',
      status: 'Vagas Abertas'
    },
    {
      id: 3,
      title: 'Torneio de Tênis',
      sport: 'Tênis',
      date: '2024-12-05',
      time: '14:00',
      location: 'Clube Recreativo',
      participants: 12,
      maxParticipants: 16,
      price: 'R$ 40,00',
      organizer: 'Carlos Oliveira',
      status: 'Inscrições Abertas'
    }
  ]);

  const [myTeams] = useState([
    {
      id: 1,
      name: 'Thunders FC',
      sport: 'Futebol',
      members: 15,
      wins: 8,
      losses: 2,
      draws: 1,
      logo: '⚽'
    },
    {
      id: 2,
      name: 'Spike Masters',
      sport: 'Vôlei',
      members: 8,
      wins: 12,
      losses: 3,
      draws: 0,
      logo: '🏐'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-green-100 text-green-800';
      case 'Vagas Abertas':
        return 'bg-blue-100 text-blue-800';
      case 'Inscrições Abertas':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Acompanhe seus eventos, times e estatísticas</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button asChild className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Link to="/create-event" className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Criar Evento</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-16 border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
            <Link to="/create-team" className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Criar Time</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-16 border-2 border-purple-500 text-purple-600 hover:bg-purple-50">
            <Link to="/championships" className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Ver Campeonatos</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Próximos Eventos */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Próximos Eventos</span>
                </CardTitle>
                <CardDescription>
                  Eventos que você organizou ou está participando
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{event.participants}/{event.maxParticipants} participantes</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{event.price}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.organizer}`} />
                          <AvatarFallback>{event.organizer.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">Org. {event.organizer}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-4">
                  <Button variant="outline" asChild>
                    <Link to="/events">Ver Todos os Eventos</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meus Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Meus Times</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {myTeams.map((team) => (
                  <div key={team.id} className="border rounded-lg p-3">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{team.logo}</span>
                      <div>
                        <h4 className="font-semibold">{team.name}</h4>
                        <p className="text-sm text-gray-600">{team.sport}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <div className="font-semibold text-green-600">{team.wins}</div>
                        <div className="text-gray-500">V</div>
                      </div>
                      <div>
                        <div className="font-semibold text-red-600">{team.losses}</div>
                        <div className="text-gray-500">D</div>
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-600">{team.draws}</div>
                        <div className="text-gray-500">E</div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/teams">Ver Todos os Times</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Estatísticas Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Suas Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Eventos Participados</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Times Criados</span>
                  <span className="font-semibold">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avaliação Média</span>
                  <span className="font-semibold">4.8 ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posição no Ranking</span>
                  <span className="font-semibold">#47</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/profile">Ver Perfil Completo</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
