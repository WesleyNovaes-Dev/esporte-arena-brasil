
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTeams } from '@/hooks/useTeams';
import { useChampionshipManagement, ChampionshipTeam } from '@/hooks/useChampionshipManagement';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

interface ChampionshipTeamsTabProps {
  teams: ChampionshipTeam[];
  isAdmin: boolean;
  championshipId: string;
  onTeamsUpdate: () => void;
}

const ChampionshipTeamsTab = ({ teams, isAdmin, championshipId, onTeamsUpdate }: ChampionshipTeamsTabProps) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const { getTeams } = useTeams();
  const { inviteTeam } = useChampionshipManagement(championshipId);
  const [availableTeams, setAvailableTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAvailableTeams = async () => {
    try {
      setLoading(true);
      const allTeams = await getTeams();
      const invitedTeamIds = teams.map(t => t.team_id);
      const available = allTeams.filter(team => !invitedTeamIds.includes(team.id));
      setAvailableTeams(available);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteTeam = async () => {
    if (!selectedTeamId) return;

    try {
      await inviteTeam(selectedTeamId);
      toast.success('Convite enviado com sucesso!');
      setShowInviteDialog(false);
      setSelectedTeamId('');
      onTeamsUpdate();
    } catch (error) {
      console.error('Erro ao convidar time:', error);
      toast.error('Erro ao enviar convite');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      invited: 'default',
      accepted: 'outline',
      declined: 'destructive'
    } as const;

    const labels = {
      invited: 'Convidado',
      accepted: 'Aceito',
      declined: 'Recusado'
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
          <CardTitle>Times Participantes</CardTitle>
          {isAdmin && (
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button onClick={loadAvailableTeams}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Convidar Time
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Convidar Time</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um time" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTeams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name} - {team.city}, {team.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowInviteDialog(false)}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleInviteTeam}
                      disabled={!selectedTeamId || loading}
                      className="flex-1"
                    >
                      Enviar Convite
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {teams.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum time convidado ainda
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Pontos</TableHead>
                <TableHead className="text-center">Vitórias</TableHead>
                <TableHead className="text-center">Empates</TableHead>
                <TableHead className="text-center">Derrotas</TableHead>
                <TableHead className="text-center">Saldo de Gols</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {team.teams?.logo_url && (
                        <img
                          src={team.teams.logo_url}
                          alt={team.teams?.name}
                          className="w-8 h-8 rounded"
                        />
                      )}
                      {team.teams?.name}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(team.status)}</TableCell>
                  <TableCell className="text-center font-semibold">{team.points}</TableCell>
                  <TableCell className="text-center">{team.wins}</TableCell>
                  <TableCell className="text-center">{team.draws}</TableCell>
                  <TableCell className="text-center">{team.losses}</TableCell>
                  <TableCell className="text-center">
                    {team.goals_for - team.goals_against}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ChampionshipTeamsTab;
