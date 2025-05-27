
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
import { Users, Trophy, MapPin } from 'lucide-react';

const CreateTeam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    description: '',
    maxMembers: '',
    city: '',
    recruitmentOpen: true,
    teamType: 'amador'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.sport || !formData.description || !formData.city) {
      toast({
        title: "Erro ao criar time",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Simulate team creation
    console.log('Creating team:', formData);
    
    toast({
      title: "Time criado com sucesso!",
      description: "Seu time foi criado e você já pode convidar jogadores",
    });
    
    navigate('/teams');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sportEmojis: { [key: string]: string } = {
    futebol: '⚽',
    volei: '🏐',
    basquete: '🏀',
    tenis: '🎾',
    corrida: '🏃',
    natacao: '🏊',
    ciclismo: '🚴',
    outros: '🏅'
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
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Informações Básicas</span>
              </CardTitle>
              <CardDescription>
                Defina os detalhes principais do seu time
              </CardDescription>
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
                  <Select value={formData.sport} onValueChange={(value) => handleInputChange('sport', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o esporte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="futebol">⚽ Futebol</SelectItem>
                      <SelectItem value="volei">🏐 Vôlei</SelectItem>
                      <SelectItem value="basquete">🏀 Basquete</SelectItem>
                      <SelectItem value="tenis">🎾 Tênis</SelectItem>
                      <SelectItem value="corrida">🏃 Corrida</SelectItem>
                      <SelectItem value="natacao">🏊 Natação</SelectItem>
                      <SelectItem value="ciclismo">🚴 Ciclismo</SelectItem>
                      <SelectItem value="outros">🏅 Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="teamType">Tipo de Time</Label>
                  <Select value={formData.teamType} onValueChange={(value) => handleInputChange('teamType', value)}>
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
                  placeholder="Descreva seu time, estilo de jogo, objetivos, nível esperado dos jogadores..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Localização</span>
              </CardTitle>
              <CardDescription>
                Onde seu time está baseado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  placeholder="Ex: São Paulo, SP"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações do Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Configurações</span>
              </CardTitle>
              <CardDescription>
                Como o time será gerenciado
              </CardDescription>
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

          {/* Preview */}
          {formData.name && formData.sport && (
            <Card>
              <CardHeader>
                <CardTitle>Prévia do Time</CardTitle>
                <CardDescription>
                  Como seu time aparecerá para outros jogadores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">{sportEmojis[formData.sport] || '🏅'}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{formData.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {formData.sport.charAt(0).toUpperCase() + formData.sport.slice(1)}
                        </span>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                          {formData.teamType.charAt(0).toUpperCase() + formData.teamType.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{formData.description}</p>
                  <div className="mt-3 text-sm text-gray-500">
                    📍 {formData.city}
                    {formData.maxMembers && ` • Máx: ${formData.maxMembers} membros`}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/teams')}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              Criar Time
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
