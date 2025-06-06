
import { supabase } from '@/integrations/supabase/client';

interface CreateTeamData {
    name: string;
    description: string;
    sport_id: string;
    owner_id: string;
    logo_url?: string | null;
    city: string;
    state: string;
    max_members: number;
    recruitment_open: boolean;
    team_type: string;
}

export const useTeams = () => {
    const getTeams = async () => {
        const { data, error } = await supabase
            .from('teams')
            .select('id, name, description, city, state, recruitment_open, owner_id, sport_id, max_members, team_type, logo_url');

        if (error) {
            console.error('Erro ao buscar times no banco:', error.message);
            throw error;
        }

        return data;
    };

    const createTeam = async (teamData: CreateTeamData) => {
        const { data, error } = await supabase.from('teams').insert([
            {
                name: teamData.name,
                description: teamData.description,
                sport_id: teamData.sport_id,
                owner_id: teamData.owner_id,
                logo_url: teamData.logo_url || null,
                city: teamData.city,
                state: teamData.state,
                max_members: teamData.max_members,
                recruitment_open: teamData.recruitment_open,
                team_type: teamData.team_type,
            },
        ]);

        if (error) {
            console.error('Erro ao salvar o time no banco:', error.message);
            throw error;
        }
        return data;
    };

    return {
        getTeams,
        createTeam,
    };
};
