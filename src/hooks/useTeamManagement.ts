
import { useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTeamMembers } from './useTeamMembers';
import { useTeamRoles } from './useTeamRoles';

export const useTeamManagement = (teamId: string) => {
  const { user } = useAuth();
  
  const {
    members,
    loading: membersLoading,
    addMember,
    removeMember,
    updateMemberRole,
    refetchMembers
  } = useTeamMembers(teamId);

  const {
    roles,
    loading: rolesLoading,
    createCustomRole,
    refetchRoles
  } = useTeamRoles(teamId);

  const loading = membersLoading || rolesLoading;

  useEffect(() => {
    if (teamId) {
      refetchMembers();
      refetchRoles();
    }
  }, [teamId, refetchMembers, refetchRoles]);

  const refetch = async () => {
    await Promise.all([refetchMembers(), refetchRoles()]);
  };

  return {
    members,
    roles,
    loading,
    addMember,
    removeMember,
    updateMemberRole,
    createCustomRole,
    refetch
  };
};

// Re-export types for backward compatibility
export type { TeamMember, TeamRole } from '@/types/teamManagement';
