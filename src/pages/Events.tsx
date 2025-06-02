
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEvents } from '@/hooks/useEvents';
import { useAuth } from '@/components/auth/AuthProvider';
import { CalendarDays, MapPin, Users, Trophy, Plus, Lock } from 'lucide-react';

const Events = () => {
  const { events, loading } = useEvents();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando eventos...</div>
      </div>
    );
  }

  const getEventTypeColor = (type: string) => {
    const colors = {
      torneio: 'default',
      amistoso: 'secondary',
      campeonato: 'outline',
      copa: 'destructive'
    } as const;
    return colors[type as keyof typeof colors] || 'default';
  };

  const getEventStatusColor = (status: string) => {
    const colors = {
      open: 'default',
      in_progress: 'secondary',
      completed: 'outline',
      cancelled: 'destructive'
    } as const;
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      open: 'Aberto',
      in_progress: 'Em Andamento',
      completed: 'Finalizado',
      cancelled: 'Cancelado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8" />
            Eventos
          </h1>
          <p className="text-gray-600 mt-2">
            Descubra e participe de eventos esportivos
          </p>
        </div>
        
        {user && (
          <Button asChild>
            <Link to="/events/create">
              <Plus className="w-4 h-4 mr-2" />
              Criar Evento
            </Link>
          </Button>
        )}
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-600 mb-4">
              Seja o primeiro a criar um evento esportivo!
            </p>
            {user && (
              <Button asChild>
                <Link to="/events/create">Criar Primeiro Evento</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {event.is_private && <Lock className="w-4 h-4" />}
                      {event.sports?.emoji} {event.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Organizado por {event.profiles?.full_name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={getEventTypeColor(event.event_type || '')}>
                      {event.event_type}
                    </Badge>
                    <Badge variant={getEventStatusColor(event.status || 'open')}>
                      {getStatusLabel(event.status || 'open')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(event.event_date).toLocaleDateString()} às {event.event_time}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>

                {event.max_participants && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    Máximo de {event.max_participants} participantes
                  </div>
                )}

                {event.price && event.price > 0 && (
                  <div className="text-sm font-semibold text-green-600">
                    Taxa: R$ {event.price.toFixed(2)}
                  </div>
                )}

                {event.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/events/${event.id}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
