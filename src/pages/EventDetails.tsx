
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/auth/AuthProvider';
import { useEventManagement } from '@/hooks/useEventManagement';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CalendarDays, MapPin, Users, Trophy, Lock, Plus, DollarSign } from 'lucide-react';
import { EventParticipantsTab } from '@/components/event/EventParticipantsTab';
import { EventCostsTab } from '@/components/event/EventCostsTab';
import { EventMatchesTab } from '@/components/event/EventMatchesTab';
import { EventAdminsTab } from '@/components/event/EventAdminsTab';
import type { Event } from '@/hooks/useEvents';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [isParticipant, setIsParticipant] = useState(false);

  const {
    participants,
    costs,
    matches,
    loadParticipants,
    loadCosts,
    loadMatches
  } = useEventManagement(id || '');

  useEffect(() => {
    if (id) {
      fetchEvent();
      checkUserStatus();
      loadParticipants();
      loadCosts();
      loadMatches();
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          sports(name, emoji),
          profiles(full_name)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        navigate('/events');
        return;
      }

      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const checkUserStatus = async () => {
    if (!user || !id) return;

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('event_admins')
      .select('id')
      .eq('event_id', id)
      .eq('user_id', user.id)
      .single();

    setIsAdmin(!!adminData);

    // Check if user is participant
    const { data: participantData } = await supabase
      .from('event_participants')
      .select('id')
      .eq('event_id', id)
      .eq('user_id', user.id)
      .single();

    setIsParticipant(!!participantData);

    // Check if user has requested to join
    const { data: requestData } = await supabase
      .from('event_join_requests')
      .select('id')
      .eq('event_id', id)
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();

    setHasRequested(!!requestData);
  };

  const handleRequestToJoin = async () => {
    if (!user || !id) return;

    try {
      const { error } = await supabase
        .from('event_join_requests')
        .insert([
          {
            event_id: id,
            user_id: user.id,
            message: 'Gostaria de participar deste evento'
          }
        ]);

      if (error) throw error;

      setHasRequested(true);
      toast.success('Solicitação enviada com sucesso!');
    } catch (error) {
      console.error('Error requesting to join:', error);
      toast.error('Erro ao enviar solicitação');
    }
  };

  const getTotalCosts = () => {
    return costs.reduce((total, cost) => total + Number(cost.cost), 0);
  };

  const getCostPerParticipant = () => {
    const totalCosts = getTotalCosts();
    const participantCount = participants.length;
    
    if (participantCount === 0) return 0;
    return totalCosts / participantCount;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando evento...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Evento não encontrado</div>
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
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {event.is_private && <Lock className="w-8 h-8" />}
              {event.sports?.emoji} {event.title}
            </h1>
            <p className="text-gray-600 mt-2">
              Organizado por {event.profiles?.full_name}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant={getEventTypeColor(event.event_type || '')}>
                {event.event_type}
              </Badge>
              <Badge variant={getEventStatusColor(event.status || 'open')}>
                {getStatusLabel(event.status || 'open')}
              </Badge>
            </div>
          </div>
          
          {user && !isAdmin && !isParticipant && event.is_private && !hasRequested && (
            <Button onClick={handleRequestToJoin}>
              Solicitar Participação
            </Button>
          )}
          
          {hasRequested && (
            <Badge variant="outline">Solicitação Enviada</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarDays className="w-4 h-4" />
              {new Date(event.event_date).toLocaleDateString()} às {event.event_time}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              {event.location}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              {participants.length} participantes
              {event.max_participants && ` / ${event.max_participants}`}
            </div>
          </CardContent>
        </Card>
      </div>

      {event.description && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{event.description}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium">Sistema de Pontuação:</span>{' '}
              {event.scoring_system === 'points' ? 'Pontos Corridos' : 
               event.scoring_system === 'knockout' ? 'Mata-Mata' :
               event.scoring_system === 'sets' ? 'Por Sets' : 'Personalizado'}
            </div>
            <div>
              <span className="font-medium">Geração de Jogos:</span>{' '}
              {event.match_generation === 'manual' ? 'Manual' :
               event.match_generation === 'random' ? 'Aleatório' : 'Por Ranking'}
            </div>
            {event.scoring_system === 'points' && (
              <div>
                <span className="font-medium">Pontuação:</span>{' '}
                {event.points_per_win} vitória, {event.points_per_draw} empate, {event.points_per_loss} derrota
              </div>
            )}
            <div>
              <span className="font-medium">Permite Times:</span>{' '}
              {event.allows_teams ? 'Sim' : 'Não'}
            </div>
            <div>
              <span className="font-medium">Permite Individuais:</span>{' '}
              {event.allows_individual ? 'Sim' : 'Não'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium">Custo Total:</span>{' '}
              R$ {getTotalCosts().toFixed(2)}
            </div>
            <div>
              <span className="font-medium">Custo por Participante:</span>{' '}
              R$ {getCostPerParticipant().toFixed(2)}
            </div>
            {event.price && event.price > 0 && (
              <div>
                <span className="font-medium">Taxa de Inscrição:</span>{' '}
                R$ {event.price.toFixed(2)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="participants" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="participants">Participantes</TabsTrigger>
          <TabsTrigger value="costs">Custos</TabsTrigger>
          <TabsTrigger value="matches">Jogos</TabsTrigger>
          {isAdmin && <TabsTrigger value="admins">Administradores</TabsTrigger>}
        </TabsList>

        <TabsContent value="participants">
          <EventParticipantsTab 
            eventId={id || ''} 
            isAdmin={isAdmin}
            participants={participants}
            onUpdate={loadParticipants}
          />
        </TabsContent>

        <TabsContent value="costs">
          <EventCostsTab 
            eventId={id || ''} 
            isAdmin={isAdmin}
            costs={costs}
            onUpdate={loadCosts}
          />
        </TabsContent>

        <TabsContent value="matches">
          <EventMatchesTab 
            eventId={id || ''} 
            isAdmin={isAdmin}
            matches={matches}
            participants={participants}
            onUpdate={loadMatches}
          />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="admins">
            <EventAdminsTab 
              eventId={id || ''} 
              isAdmin={isAdmin}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EventDetails;
