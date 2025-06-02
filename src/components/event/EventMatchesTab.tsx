
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar } from 'lucide-react';
import type { EventMatch, EventParticipant } from '@/hooks/useEventManagement';

interface EventMatchesTabProps {
  eventId: string;
  isAdmin: boolean;
  matches: EventMatch[];
  participants: EventParticipant[];
  onUpdate: () => void;
}

export const EventMatchesTab: React.FC<EventMatchesTabProps> = ({
  eventId,
  isAdmin,
  matches,
  participants,
  onUpdate
}) => {
  const getParticipantName = (participantId: string, participantType: string) => {
    if (participantType === 'user') {
      const participant = participants.find(p => p.user_id === participantId);
      return participant?.profiles?.full_name || 'Usuário';
    }
    return 'Time'; // TODO: Implement team name lookup
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'default',
      in_progress: 'secondary',
      completed: 'outline',
      cancelled: 'destructive'
    } as const;
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: 'Agendado',
      in_progress: 'Em Andamento',
      completed: 'Finalizado',
      cancelled: 'Cancelado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Jogos ({matches.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhum jogo criado ainda
          </p>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Rodada {match.round_number}</span>
                    <Badge variant={getStatusColor(match.status)}>
                      {getStatusLabel(match.status)}
                    </Badge>
                  </div>
                  {match.match_date && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(match.match_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4">
                  <div className="text-center flex-1">
                    <p className="font-medium">
                      {getParticipantName(match.participant1_id, match.participant1_type)}
                    </p>
                    {match.status === 'completed' && (
                      <p className="text-2xl font-bold">
                        {match.participant1_score || 0}
                      </p>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="text-gray-400 font-bold">VS</span>
                  </div>

                  <div className="text-center flex-1">
                    <p className="font-medium">
                      {getParticipantName(match.participant2_id, match.participant2_type)}
                    </p>
                    {match.status === 'completed' && (
                      <p className="text-2xl font-bold">
                        {match.participant2_score || 0}
                      </p>
                    )}
                  </div>
                </div>

                {match.observations && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                    <strong>Observações:</strong> {match.observations}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
