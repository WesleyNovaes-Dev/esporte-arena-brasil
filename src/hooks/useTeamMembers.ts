
import { useState, useCallback } from 'react';
import { TeamMember } from '@/types/teamManagement';
import { 
  fetchTeamMembers, 
  addTeamMember, 
  removeTeamMember, 
  updateTeamMemberRole 
} from '@/services/teamMembersService';

export const useTeamMembers = (teamId: string) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMembers = useCallback(async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      const data = await fetchTeamMembers(teamId);
      setMembers(data);
    } catch (error) {
      console.error('Erro ao buscar membros do time:', error);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  const addMember = useCallback(async (userId: string, role: string = 'player') => {
    try {
      const data = await addTeamMember(teamId, userId, role);
      await loadMembers(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      throw error;
    }
  }, [teamId, loadMembers]);

  const removeMember = useCallback(async (memberId: string) => {
    try {
      await removeTeamMember(memberId);
      await loadMembers(); // Refresh the list
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      throw error;
    }
  }, [loadMembers]);

  const updateMemberRole = useCallback(async (memberId: string, newRole: string, customRoleId?: string) => {
    try {
      await updateTeamMemberRole(memberId, newRole, customRoleId);
      await loadMembers(); // Refresh the list
    } catch (error) {
      console.error('Erro ao atualizar função do membro:', error);
      throw error;
    }
  }, [loadMembers]);

  return {
    members,
    loading,
    addMember,
    removeMember,
    updateMemberRole,
    refetchMembers: loadMembers
  };
};
