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
import { useAuth } from '@/components/auth/AuthProvider';
import { useTeams } from '@/hooks/useTeams';
import { useSports } from '@/hooks/useSports'; // Hook para buscar esportes
import { Users, Trophy, MapPin } from 'lucide-react';

const CreateTeam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createTeam } = useTeams();
  const { user } = useAuth();
  const { sports, loading: loadingSports } = useSports(); // Lista de esportes dinâmicos

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    sport: '', // Esse será o UUID do esporte selecionado
    description: '',
    maxMembers: '',
    city: '',
    state: '',
    logoUrl: '',
    recruitmentOpen: true,
    teamType: 'amador',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Você precisa estar logado para criar um time.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name || !formData.sport || !formData.description || !formData.city || !formData.state) {
      toast({
        title: 'Erro ao criar time',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await createTeam({
        id: crypto.randomUUID(), // Gera um ID único
        name: formData.name,
        description: formData.description,
        sport_id: formData.sport, // Envia o UUID do esporte
        owner_id: user.id, // ID do usuário autenticado que está criando o time
        logo_url: formData.logoUrl || null,
        city: formData.city,
        state: formData.state,
        max_members: formData.maxMembers ? parseInt(formData.maxMembers) : null,
        recruitment_open: formData.recruitmentOpen,
        team_type: formData.teamType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      toast({
        title: 'Time criado com sucesso!',
        description: 'Seu time foi registrado e está disponível.',
      });

      navigate('/teams');
    } catch (error: any) {
      toast({
        title: 'Erro ao criar time',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Novo Time</h1>
            <p className="text-gray-600">Monte seu time esportivo e conecte-se com novos atletas</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Informações Básicas</span>
                </CardTitle>
                <CardDescription>Defina os detalhes principais do seu time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Time *</Label>
                    <Input
                        id="name"
                        placeholder="Ex: Thunders FC"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sport">Esporte *</Label>
                    <Select
                        value={formData.sport}
                        onValueChange={(value) => handleInputChange('sport', value)}
                        disabled={loadingSports}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loadingSports ? 'Carregando esportes...' : 'Selecione o esporte'} />
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">URL do Logo</Label>
                  <Input
                      id="logoUrl"
                      type="url"
                      placeholder="Link para o logo do time (opcional)"
                      value={formData.logoUrl}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="teamType">Tipo de Time</Label>
                    <Select
                        value={formData.teamType}
                        onValueChange={(value) => handleInputChange('teamType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amador">Amador</SelectItem>
                        <SelectItem value="semi-profissional">Semi-profissional</SelectItem>
                        <SelectItem value="profissional">Profissional</SelectItem>
                        <SelectItem value="recreativo">Recreativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxMembers">Máximo de Membros</Label>
                    <Input
                        id="maxMembers"
                        type="number"
                        placeholder="Ex: 20"
                        value={formData.maxMembers}
                        onChange={(e) => handleInputChange('maxMembers', e.target.value)}
                        min="5"
                        max="50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Time *</Label>
                  <Textarea
                      id="description"
                      placeholder="Descreva seu time, estilo de jogo, objetivos..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Localização</span>
                </CardTitle>
                <CardDescription>Onde seu time está baseado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                        id="city"
                        placeholder="Ex: São Paulo"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado *</Label>
                    <Input
                        id="state"
                        placeholder="Ex: SP"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Configurações</span>
                </CardTitle>
                <CardDescription>Como o time será gerenciado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <input
                      type="checkbox"
                      id="recruitmentOpen"
                      checked={formData.recruitmentOpen}
                      onChange={(e) => handleInputChange('recruitmentOpen', e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div>
                    <Label htmlFor="recruitmentOpen" className="font-medium">
                      Recrutamento Aberto
                    </Label>
                    <p className="text-sm text-gray-600">
                      Permitir que novos jogadores solicitem entrada no time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/teams')}
                  disabled={loading}
                  className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600"
              >
                {loading ? 'Criando...' : 'Criar Time'}
              </Button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CreateTeam;