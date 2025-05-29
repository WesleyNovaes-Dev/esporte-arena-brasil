
export interface CreateTeamFormData {
  name: string;
  sport: string;
  description: string;
  maxMembers: string;
  city: string;
  state: string;
  logoUrl: string;
  recruitmentOpen: boolean;
  teamType: string;
}

export const defaultFormData: CreateTeamFormData = {
  name: '',
  sport: '',
  description: '',
  maxMembers: '',
  city: '',
  state: '',
  logoUrl: '',
  recruitmentOpen: true,
  teamType: 'amador',
};
