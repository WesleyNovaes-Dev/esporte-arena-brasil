
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useChampionshipManagement, ChampionshipMatch, ChampionshipTeam } from '@/hooks/useChampionshipManagement';
import { toast } from 'sonner';
import { Plus, Edit } from 'lucide-react';

interface ChampionshipMatchesTabProps {
  matches: ChampionshipMatch[];
  teams: ChampionshipTeam[];
  isAdmin: boolean;
  championshipId: string;
  onMatchesUpdate: () => void;
}

const ChampionshipMatchesTab = ({ matches, teams, isAdmin, championshipId, onMatchesUpdate }: ChampionshipMatchesTabProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<ChampionshipMatch | null>(null);
  const { createMatch, updateMatch } = useChampionshipManagement(championshipId);

  const [matchData, setMatchData] = useState({
    home_team_id: '',
    away_team_id: '',
    round_number: 1,
    match_date: '',
    location: ''
  });

  const [resultData, setResultData] = useState({
    home_score: '',
    away_score: '',
    home_sets: '',
    away_sets: '',
    status: '',
    observations: ''
  });

  const acceptedTeams = teams.filter(team => team.status === 'accepted');

  const handleCreateMatch = async () => {
    if (!matchData.home_team_id || !matchData.away_team_id) {
      toast.error('Selecione os dois times');
      return;
    }

    try {
      await createMatch(matchData);
      toast.success('Jogo criado com sucesso!');
      setShowCreateDialog(false);
      setMatchData({
        home_team_id: '',
        away_team_id: '',
        round_number: 1,
        match_date: '',
        location: ''
      });
      onMatchesUpdate();
    } catch (error) {
      console.error('Erro ao criar jogo:', error);
      toast.error('Erro ao criar jogo');
    }
  };

  const handleUpdateMatch = async () => {
    if (!selectedMatch) return;

    try {
      const updates: any = {
        status: resultData.status || 'completed'
      };

      if (resultData.home_score !== '') updates.home_score = parseInt(resultData.home_score);
      if (resultData.away_score !== '') updates.away_score = parseInt(resultData.away_score);
      if (resultData.home_sets !== '') updates.home_sets = parseInt(resultData.home_sets);
      if (resultData.away_sets !== '') updates.away_sets = parseInt(resultData.away_sets);
      if (resultData.observations) updates.observations = resultData.observations;

      await updateMatch(selectedMatch.id, updates);
      toast.success('Resultado atualizado com sucesso!');
      setShowEditDialog(false);
      setSelectedMatch(null);
      onMatchesUpdate();
    } catch (error) {
      console.error('Erro ao atualizar resultado:', error);
      toast.error('Erro ao atualizar resultado');
    }
  };

  const openEditDialog = (match: ChampionshipMatch) => {
    setSelectedMatch(match);
    setResultData({
      home_score: match.home_score?.toString() || '',
      away_score: match.away_score?.toString() || '',
      home_sets: match.home_sets?.toString() || '',
      away_sets: match.away_sets?.toString() || '',
      status: match.status,
      observations: match.observations || ''
    });
    setShowEditDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: 'default',
      in_progress: 'secondary',
      completed: 'outline',
      cancelled: 'destructive'
    } as const;

    const labels = {
      scheduled: 'Agendado',
      in_progress: 'Em Andamento',
      completed: 'Finalizado',
      cancelled: 'Cancelado'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Jogos do Campeonato</CardTitle>
          {isAdmin && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Jogo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Jogo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Time da Casa</Label>
                      <Select value={matchData.home_team_id} onValueChange={(value) => setMatchData({ ...matchData, home_team_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o time" />
                        </SelectTrigger>
                        <SelectContent>
                          {acceptedTeams.map((team) => (
                            <SelectItem key={team.team_id} value={team.team_id}>
                              {team.teams?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Time Visitante</Label>
                      <Select value={matchData.away_team_id} onValueChange={(value) => setMatchData({ ...matchData, away_team_id: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o time" />
                        </SelectTrigger>
                        <SelectContent>
                          {acceptedTeams.filter(team => team.team_id !== matchData.home_team_id).map((team) => (
                            <SelectItem key={team.team_id} value={team.team_id}>
                              {team.teams?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rodada</Label>
                      <Input
                        type="number"
                        min="1"
                        value={matchData.round_number}
                        onChange={(e) => setMatchData({ ...matchData, round_number: parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Data e Hora</Label>
                      <Input
                        type="datetime-local"
                        value={matchData.match_date}
                        onChange={(e) => setMatchData({ ...matchData, match_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Local</Label>
                    <Input
                      value={matchData.location}
                      onChange={(e) => setMatchData({ ...matchData, location: e.target.value })}
                      placeholder="Local do jogo"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateMatch} className="flex-1">
                      Criar Jogo
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum jogo criado ainda
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rodada</TableHead>
                <TableHead>Jogo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead>Ações</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>{match.round_number}</TableCell>
                  <TableCell>
                    {match.home_team?.name} vs {match.away_team?.name}
                  </TableCell>
                  <TableCell>
                    {match.match_date ? new Date(match.match_date).toLocaleString() : 'A definir'}
                  </TableCell>
                  <TableCell>{match.location || 'A definir'}</TableCell>
                  <TableCell>
                    {match.home_score !== null && match.away_score !== null
                      ? `${match.home_score} x ${match.away_score}`
                      : '-'
                    }
                  </TableCell>
                  <TableCell>{getStatusBadge(match.status)}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(match)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Dialog para editar resultado */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Resultado</DialogTitle>
            </DialogHeader>
            {selectedMatch && (
              <div className="space-y-4">
                <div className="text-center font-semibold">
                  {selectedMatch.home_team?.name} vs {selectedMatch.away_team?.name}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Placar Casa</Label>
                    <Input
                      type="number"
                      min="0"
                      value={resultData.home_score}
                      onChange={(e) => setResultData({ ...resultData, home_score: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Placar Visitante</Label>
                    <Input
                      type="number"
                      min="0"
                      value={resultData.away_score}
                      onChange={(e) => setResultData({ ...resultData, away_score: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={resultData.status} onValueChange={(value) => setResultData({ ...resultData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="completed">Finalizado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={resultData.observations}
                    onChange={(e) => setResultData({ ...resultData, observations: e.target.value })}
                    placeholder="Observações sobre o jogo..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleUpdateMatch} className="flex-1">
                    Salvar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ChampionshipMatchesTab;
