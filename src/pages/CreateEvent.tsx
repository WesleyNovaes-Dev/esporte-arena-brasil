
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSports } from '@/hooks/useSports';
import { useEvents } from '@/hooks/useEvents';
import { toast } from 'sonner';
import { CalendarDays, MapPin, Trophy } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { sports } = useSports();
  const { createEvent } = useEvents();
  const [loading, setLoading] = useState(false);

  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    sport_id: '',
    event_date: '',
    event_time: '',
    location: '',
    price: '',
    event_type: 'torneio',
    max_participants: '',
    scoring_system: 'points',
    match_generation: 'manual',
    points_per_win: 3,
    points_per_draw: 1,
    points_per_loss: 0,
    is_private: false,
    allows_teams: true,
    allows_individual: true,
    registration_deadline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData.title || !eventData.sport_id || !eventData.event_date || !eventData.event_time || !eventData.location) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = {
        ...eventData,
        price: eventData.price ? parseFloat(eventData.price) : 0,
        max_participants: eventData.max_participants ? parseInt(eventData.max_participants) : null,
        registration_deadline: eventData.registration_deadline || null
      };

      await createEvent(submitData);
      toast.success('Evento criado com sucesso!');
      navigate('/events');
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      toast.error('Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8" />
            Criar Evento
          </h1>
          <p className="text-gray-600 mt-2">
            Organize um evento esportivo e convide participantes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome do Evento *</Label>
                <Input
                  id="title"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  placeholder="Ex: Torneio de Futebol da Cidade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  placeholder="Descreva o evento..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sport">Esporte *</Label>
                  <Select value={eventData.sport_id} onValueChange={(value) => setEventData({ ...eventData, sport_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o esporte" />
                    </SelectTrigger>
                    <SelectContent>
                      {sports.map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          {sport.emoji} {sport.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_type">Tipo de Evento</Label>
                  <Select value={eventData.event_type} onValueChange={(value) => setEventData({ ...eventData, event_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="torneio">Torneio</SelectItem>
                      <SelectItem value="amistoso">Amistoso</SelectItem>
                      <SelectItem value="campeonato">Campeonato</SelectItem>
                      <SelectItem value="copa">Copa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data e Local */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Data e Local
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Data do Evento *</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={eventData.event_date}
                    onChange={(e) => setEventData({ ...eventData, event_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_time">Horário *</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={eventData.event_time}
                    onChange={(e) => setEventData({ ...eventData, event_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Local *</Label>
                <Input
                  id="location"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                  placeholder="Ex: Centro Esportivo Municipal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Taxa de Inscrição (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={eventData.price}
                    onChange={(e) => setEventData({ ...eventData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_participants">Máximo de Participantes</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    min="1"
                    value={eventData.max_participants}
                    onChange={(e) => setEventData({ ...eventData, max_participants: e.target.value })}
                    placeholder="Ilimitado"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_deadline">Prazo de Inscrição</Label>
                <Input
                  id="registration_deadline"
                  type="datetime-local"
                  value={eventData.registration_deadline}
                  onChange={(e) => setEventData({ ...eventData, registration_deadline: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações do Evento */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scoring_system">Sistema de Pontuação</Label>
                  <Select value={eventData.scoring_system} onValueChange={(value) => setEventData({ ...eventData, scoring_system: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="points">Pontos Corridos</SelectItem>
                      <SelectItem value="knockout">Mata-Mata</SelectItem>
                      <SelectItem value="sets">Por Sets</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="match_generation">Geração de Jogos</Label>
                  <Select value={eventData.match_generation} onValueChange={(value) => setEventData({ ...eventData, match_generation: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="random">Aleatório</SelectItem>
                      <SelectItem value="by_ranking">Por Ranking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {eventData.scoring_system === 'points' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="points_per_win">Pontos por Vitória</Label>
                    <Input
                      id="points_per_win"
                      type="number"
                      min="0"
                      value={eventData.points_per_win}
                      onChange={(e) => setEventData({ ...eventData, points_per_win: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points_per_draw">Pontos por Empate</Label>
                    <Input
                      id="points_per_draw"
                      type="number"
                      min="0"
                      value={eventData.points_per_draw}
                      onChange={(e) => setEventData({ ...eventData, points_per_draw: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points_per_loss">Pontos por Derrota</Label>
                    <Input
                      id="points_per_loss"
                      type="number"
                      min="0"
                      value={eventData.points_per_loss}
                      onChange={(e) => setEventData({ ...eventData, points_per_loss: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Evento Privado</Label>
                    <p className="text-sm text-gray-500">
                      Apenas participantes convidados podem ver os detalhes
                    </p>
                  </div>
                  <Switch
                    checked={eventData.is_private}
                    onCheckedChange={(checked) => setEventData({ ...eventData, is_private: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Times</Label>
                    <p className="text-sm text-gray-500">
                      Times podem participar do evento
                    </p>
                  </div>
                  <Switch
                    checked={eventData.allows_teams}
                    onCheckedChange={(checked) => setEventData({ ...eventData, allows_teams: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Jogadores Individuais</Label>
                    <p className="text-sm text-gray-500">
                      Jogadores individuais podem participar
                    </p>
                  </div>
                  <Switch
                    checked={eventData.allows_individual}
                    onCheckedChange={(checked) => setEventData({ ...eventData, allows_individual: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/events')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Criando...' : 'Criar Evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
