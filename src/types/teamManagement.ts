
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
