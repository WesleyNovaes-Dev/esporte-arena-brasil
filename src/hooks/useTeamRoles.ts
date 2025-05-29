
import { useState, useCallback } from 'react';
import { TeamRole } from '@/types/teamManagement';
import { fetchTeamRoles, createTeamCustomRole } from '@/services/teamRolesService';

export const useTeamRoles = (teamId: string) => {
  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRoles = useCallback(async () => {
    if (!teamId) return;
    
    try {
      setLoading(true);
      const data = await fetchTeamRoles(teamId);
      setRoles(data);
    } catch (error) {
      console.error('Erro ao buscar funções do time:', error);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  const createCustomRole = useCallback(async (name: string, description: string, permissions: string[]) => {
    try {
      const data = await createTeamCustomRole(teamId, name, description, permissions);
      await loadRoles(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Erro ao criar função personalizada:', error);
      throw error;
    }
  }, [teamId, loadRoles]);

  return {
    roles,
    loading,
    createCustomRole,
    refetchRoles: loadRoles
  };
};
