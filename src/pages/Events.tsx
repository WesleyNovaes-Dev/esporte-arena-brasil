
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Plus, Search } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { events, loading, joinEvent } = useEvents();
  const { user } = useAuth();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'full':
        return 'bg-red-100 text-red-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Vagas Abertas';
      case 'full':
        return 'Lotado';
      case 'closed':
        return 'Encerrado';
      default:
        return 'Disponível';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = sportFilter === 'all' || event.sports?.name === sportFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesSport && matchesStatus;
  });

  const handleJoinEvent = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para participar de eventos",
        variant: "destructive",
      });
      return;
    }

    try {
      await joinEvent(eventId);
      toast({
        title: "Sucesso!",
        description: "Você foi inscrito no evento",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao participar",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    }
  };

  const isUserParticipant = (event: any) => {
    return event.event_participants?.some((p: any) => p.user_id === user?.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
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
                  <SelectItem value="open">Vagas Abertas</SelectItem>
                  <SelectItem value="full">Lotado</SelectItem>
                  <SelectItem value="closed">Encerrado</SelectItem>
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
                    {getStatusText(event.status)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center space-x-1">
                    <span>{event.sports?.emoji}</span>
                    <span>{event.sports?.name}</span>
                  </span>
                  <span className="font-medium text-green-600">
                    {event.price > 0 ? `R$ ${event.price.toFixed(2)}` : 'Gratuito'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.description && (
                  <p className="text-gray-600 text-sm">{event.description}</p>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(event.event_date).toLocaleDateString('pt-BR')} às {event.event_time}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  {event.max_participants && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.event_participants?.length || 0}/{event.max_participants} participantes
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-gray-500">
                    Por {event.profiles?.full_name || 'Organizador'}
                  </span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    {event.status === 'open' && !isUserParticipant(event) && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleJoinEvent(event.id)}
                      >
                        Participar
                      </Button>
                    )}
                    {isUserParticipant(event) && (
                      <Badge variant="secondary">Inscrito</Badge>
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
