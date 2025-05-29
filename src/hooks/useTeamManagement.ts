
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  role: string;
  status: string;
  joined_at: string;
  custom_role_id: string | null;
  profiles: {
    full_name: string;
    avatar_url: string | null;
    email?: string;
  };
  team_roles?: {
    name: string;
    description: string;
    permissions: string[];
  };
}

export interface TeamRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  team_id: string;
}

export const useTeamManagement = (teamId: string) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTeamMembers = async () => {
    if (!teamId) return;

    try {
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
      
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Erro ao buscar membros do time:', error);
    }
  };

  const fetchTeamRoles = async () => {
    if (!teamId) return;

    try {
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
      
      setRoles(formattedRoles);
    } catch (error) {
      console.error('Erro ao buscar funções do time:', error);
    }
  };

  const addMember = async (userId: string, role: string = 'player') => {
    try {
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

      fetchTeamMembers();
      return data;
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      throw error;
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ status: 'removed' })
        .eq('id', memberId);

      if (error) throw error;
      fetchTeamMembers();
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      throw error;
    }
  };

  const updateMemberRole = async (memberId: string, newRole: string, customRoleId?: string) => {
    try {
      const updateData: any = { role: newRole };
      if (customRoleId) {
        updateData.custom_role_id = customRoleId;
      }

      const { error } = await supabase
        .from('team_members')
        .update(updateData)
        .eq('id', memberId);

      if (error) throw error;
      fetchTeamMembers();
    } catch (error) {
      console.error('Erro ao atualizar função do membro:', error);
      throw error;
    }
  };

  const createCustomRole = async (name: string, description: string, permissions: string[]) => {
    try {
      const { data, error } = await supabase
        .from('team_roles')
        .insert([{
          team_id: teamId,
          name,
          description,
          permissions
        }]);

      if (error) throw error;
      fetchTeamRoles();
      return data;
    } catch (error) {
      console.error('Erro ao criar função personalizada:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (teamId) {
      setLoading(true);
      Promise.all([fetchTeamMembers(), fetchTeamRoles()]).finally(() => {
        setLoading(false);
      });
    }
  }, [teamId]);

  return {
    members,
    roles,
    loading,
    addMember,
    removeMember,
    updateMemberRole,
    createCustomRole,
    refetch: () => Promise.all([fetchTeamMembers(), fetchTeamRoles()])
  };
};
