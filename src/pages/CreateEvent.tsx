
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useSports } from '@/hooks/useSports';
import { useAuth } from '@/components/auth/AuthProvider';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createEvent } = useEvents();
  const { sports } = useSports();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    sport_id: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    max_participants: '',
    price: '',
    event_type: 'amistoso'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para criar eventos",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.sport_id || !formData.event_date || !formData.event_time || !formData.location) {
      toast({
        title: "Erro ao criar evento",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await createEvent({
        title: formData.title,
        sport_id: formData.sport_id,
        description: formData.description || null,
        event_date: formData.event_date,
        event_time: formData.event_time,
        location: formData.location,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        price: formData.price ? parseFloat(formData.price) : 0,
        event_type: formData.event_type,
        status: 'open'
      });

      toast({
        title: "Evento criado com sucesso!",
        description: "Seu evento foi publicado e está disponível para participação",
      });
      
      navigate('/events');
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: "Erro ao criar evento",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Novo Evento</h1>
          <p className="text-gray-600">Organize um evento esportivo e conecte-se com outros atletas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Defina os detalhes principais do seu evento esportivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Evento *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Futebol Society - Domingo"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sport">Esporte *</Label>
                  <Select value={formData.sport_id} onValueChange={(value) => handleInputChange('sport_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o esporte" />
                    </SelectTrigger>
                    <SelectContent>
                      {sports.map((sport) => (
                        <SelectItem key={sport.id} value={sport.id}>
                          <span className="flex items-center space-x-2">
                            <span>{sport.emoji}</span>
                            <span>{sport.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Tipo de Evento</Label>
                <Select value={formData.event_type} onValueChange={(value) => handleInputChange('event_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="amistoso">Partida Amistosa</SelectItem>
                    <SelectItem value="campeonato">Campeonato</SelectItem>
                    <SelectItem value="copa">Copa/Mata-mata</SelectItem>
                    <SelectItem value="treino">Treino/Coletivo</SelectItem>
                    <SelectItem value="beneficente">Evento Beneficente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva seu evento, nível de habilidade esperado, regras especiais..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data e Local */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Data e Local</span>
              </CardTitle>
              <CardDescription>
                Defina quando e onde o evento acontecerá
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => handleInputChange('event_date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Horário *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => handleInputChange('event_time', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Local *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="Ex: Campo do Bairro Central, Rua das Flores, 123"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participantes e Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Participantes e Financeiro</span>
              </CardTitle>
              <CardDescription>
                Configure vagas e valores do evento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Máximo de Participantes</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="Ex: 20"
                    value={formData.max_participants}
                    onChange={(e) => handleInputChange('max_participants', e.target.value)}
                    min="2"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Valor por Pessoa (R$)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="Ex: 25.00 (deixe vazio se gratuito)"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/events')}
              className="w-full sm:w-auto"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar Evento"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
