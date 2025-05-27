
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Plus, Search, Filter } from 'lucide-react';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [events] = useState([
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
      status: 'Vagas Abertas',
      description: 'Partida amistosa de futebol society. Venha se divertir!'
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
      status: 'Vagas Abertas',
      description: 'Vôlei de praia ao pôr do sol. Nível iniciante/intermediário.'
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
      status: 'Inscrições Abertas',
      description: 'Torneio de tênis para todos os níveis. Premiação para os top 3.'
    },
    {
      id: 4,
      title: 'Basquete 3x3',
      sport: 'Basquete',
      date: '2024-12-07',
      time: '16:00',
      location: 'Quadra da Escola Municipal',
      participants: 12,
      maxParticipants: 12,
      price: 'R$ 15,00',
      organizer: 'Ana Costa',
      status: 'Lotado',
      description: 'Torneio de basquete 3x3. Formato rápido e dinâmico.'
    },
    {
      id: 5,
      title: 'Corrida 5K',
      sport: 'Corrida',
      date: '2024-12-08',
      time: '07:00',
      location: 'Parque da Cidade',
      participants: 45,
      maxParticipants: 50,
      price: 'R$ 20,00',
      organizer: 'Pedro Lima',
      status: 'Vagas Abertas',
      description: 'Corrida matinal de 5K no parque. Kit participant incluso.'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vagas Abertas':
        return 'bg-green-100 text-green-800';
      case 'Inscrições Abertas':
        return 'bg-blue-100 text-blue-800';
      case 'Lotado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = sportFilter === 'all' || event.sport === sportFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesSport && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos Esportivos</h1>
            <p className="text-gray-600">Encontre e participe de eventos esportivos na sua região</p>
          </div>
          <Button asChild className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Link to="/create-event" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Criar Evento</span>
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar eventos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Esporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os esportes</SelectItem>
                  <SelectItem value="Futebol">Futebol</SelectItem>
                  <SelectItem value="Vôlei">Vôlei</SelectItem>
                  <SelectItem value="Tênis">Tênis</SelectItem>
                  <SelectItem value="Basquete">Basquete</SelectItem>
                  <SelectItem value="Corrida">Corrida</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Vagas Abertas">Vagas Abertas</SelectItem>
                  <SelectItem value="Inscrições Abertas">Inscrições Abertas</SelectItem>
                  <SelectItem value="Lotado">Lotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Badge className={getStatusColor(event.status)} variant="secondary">
                    {event.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {event.sport}
                  </span>
                  <span className="font-medium text-green-600">{event.price}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 text-sm">{event.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{event.participants}/{event.maxParticipants} participantes</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-gray-500">Por {event.organizer}</span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    {event.status !== 'Lotado' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Participar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar os filtros ou criar um novo evento.</p>
            <Button asChild>
              <Link to="/create-event">Criar Primeiro Evento</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
