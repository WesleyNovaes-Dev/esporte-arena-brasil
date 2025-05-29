
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/types/teamManagement';

export const fetchTeamMembers = async (teamId: string): Promise<TeamMember[]> => {
  if (!teamId) return [];

  const { data, error } = await supabase
    .from('team_members')
    .select(`
      *,
      profiles:user_id (
        full_name,
        avatar_url
      ),
      team_roles:custom_role_id (
        name,
        description,
        permissions
      )
    `)
    .eq('team_id', teamId)
    .eq('status', 'active');

  if (error) throw error;
  
  const formattedMembers: TeamMember[] = (data || []).map(member => ({
    ...member,
    team_roles: member.team_roles ? {
      ...member.team_roles,
      permissions: Array.isArray(member.team_roles.permissions) 
        ? (member.team_roles.permissions as any[]).map(p => String(p))
        : []
    } : undefined
  })) as TeamMember[];
  
  return formattedMembers;
};

export const addTeamMember = async (teamId: string, userId: string, role: string = 'player') => {
  const { data, error } = await supabase
    .from('team_members')
    .insert([{
      team_id: teamId,
      user_id: userId,
      role,
      status: 'active'
    }]);

  if (error) throw error;
  
  // Criar notificação para o novo membro
  await supabase
    .from('notifications')
    .insert([{
      user_id: userId,
      title: 'Bem-vindo ao time!',
      content: 'Você foi adicionado a um novo time.',
      type: 'team_joined'
    }]);

  return data;
};

export const removeTeamMember = async (memberId: string) => {
  const { error } = await supabase
    .from('team_members')
    .update({ status: 'removed' })
    .eq('id', memberId);

  if (error) throw error;
};

export const updateTeamMemberRole = async (memberId: string, newRole: string, customRoleId?: string) => {
  const updateData: any = { role: newRole };
  if (customRoleId) {
    updateData.custom_role_id = customRoleId;
  }

  const { error } = await supabase
    .from('team_members')
    .update(updateData)
    .eq('id', memberId);

  if (error) throw error;
};
