
import { supabase } from '@/integrations/supabase/client';
import { TeamRole } from '@/types/teamManagement';

export const fetchTeamRoles = async (teamId: string): Promise<TeamRole[]> => {
  if (!teamId) return [];

  const { data, error } = await supabase
    .from('team_roles')
    .select('*')
    .eq('team_id', teamId);

  if (error) throw error;
  
  const formattedRoles: TeamRole[] = (data || []).map(role => ({
    ...role,
    permissions: Array.isArray(role.permissions) 
      ? (role.permissions as any[]).map(p => String(p))
      : []
  })) as TeamRole[];
  
  return formattedRoles;
};

export const createTeamCustomRole = async (teamId: string, name: string, description: string, permissions: string[]) => {
  const { data, error } = await supabase
    .from('team_roles')
    .insert([{
      team_id: teamId,
      name,
      description,
      permissions
    }]);

  if (error) throw error;
  return data;
};
