
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { useChampionships } from '@/hooks/useChampionships';
import { useSports } from '@/hooks/useSports';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const CreateChampionship = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createChampionship } = useChampionships();
  const { sports } = useSports();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sport_id: '',
    start_date: '',
    end_date: '',
    championship_type: 'pontos_corridos',
    prize_pool: 0,
    scoring_system: 'points',
    match_generation: 'manual',
    points_per_win: 3,
    points_per_draw: 1,
    points_per_loss: 0,
    is_private: false,
    max_teams: 16
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Você precisa estar logado para criar um campeonato');
      return;
    }

    try {
      setLoading(true);
      await createChampionship(formData);
      toast.success('Campeonato criado com sucesso!');
      navigate('/championships');
    } catch (error) {
      console.error('Erro ao criar campeonato:', error);
      toast.error('Erro ao criar campeonato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Criar Novo Campeonato</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Campeonato</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sport">Esporte</Label>
                  <Select value={formData.sport_id} onValueChange={(value) => setFormData({ ...formData, sport_id: value })}>
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
                  <Label htmlFor="start_date">Data de Início</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Data de Término</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="championship_type">Tipo de Campeonato</Label>
                  <Select value={formData.championship_type} onValueChange={(value) => setFormData({ ...formData, championship_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pontos_corridos">Pontos Corridos</SelectItem>
                      <SelectItem value="mata_mata">Mata-Mata</SelectItem>
                      <SelectItem value="grupos">Grupos + Mata-Mata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scoring_system">Sistema de Pontuação</Label>
                  <Select value={formData.scoring_system} onValueChange={(value) => setFormData({ ...formData, scoring_system: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="points">Pontos</SelectItem>
                      <SelectItem value="sets">Sets</SelectItem>
                      <SelectItem value="knockout">Eliminação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_teams">Máximo de Times</Label>
                  <Input
                    id="max_teams"
                    type="number"
                    min="4"
                    max="64"
                    value={formData.max_teams}
                    onChange={(e) => setFormData({ ...formData, max_teams: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prize_pool">Premiação (R$)</Label>
                  <Input
                    id="prize_pool"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.prize_pool}
                    onChange={(e) => setFormData({ ...formData, prize_pool: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_private"
                    checked={formData.is_private}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_private: checked })}
                  />
                  <Label htmlFor="is_private">Campeonato Privado</Label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="points_per_win">Pontos por Vitória</Label>
                  <Input
                    id="points_per_win"
                    type="number"
                    min="0"
                    value={formData.points_per_win}
                    onChange={(e) => setFormData({ ...formData, points_per_win: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points_per_draw">Pontos por Empate</Label>
                  <Input
                    id="points_per_draw"
                    type="number"
                    min="0"
                    value={formData.points_per_draw}
                    onChange={(e) => setFormData({ ...formData, points_per_draw: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points_per_loss">Pontos por Derrota</Label>
                  <Input
                    id="points_per_loss"
                    type="number"
                    min="0"
                    value={formData.points_per_loss}
                    onChange={(e) => setFormData({ ...formData, points_per_loss: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/championships')}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Campeonato'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateChampionship;
