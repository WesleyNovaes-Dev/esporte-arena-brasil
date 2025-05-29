
import { CreateTeamFormData } from '@/types/createTeam';

export const validateCreateTeamForm = (formData: CreateTeamFormData): string | null => {
  if (!formData.name || !formData.sport || !formData.description || !formData.city || !formData.state) {
    return 'Por favor, preencha todos os campos obrigatórios.';
  }
  return null;
};
