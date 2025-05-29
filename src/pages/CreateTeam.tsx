
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';
import { useTeams } from '@/hooks/useTeams';
import { useSports } from '@/hooks/useSports';
import CreateTeamBasicInfo from '@/components/team/CreateTeamBasicInfo';
import CreateTeamLocation from '@/components/team/CreateTeamLocation';
import CreateTeamSettings from '@/components/team/CreateTeamSettings';
import CreateTeamActions from '@/components/team/CreateTeamActions';
import { CreateTeamFormData, defaultFormData } from '@/types/createTeam';
import { validateCreateTeamForm } from '@/utils/createTeamValidation';

const CreateTeam = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createTeam } = useTeams();
  const { user } = useAuth();
  const { sports, loading: loadingSports } = useSports();

  const [formData, setFormData] = useState<CreateTeamFormData>(defaultFormData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Você precisa estar logado para criar um time.',
        variant: 'destructive',
      });
      return;
    }

    const validationError = validateCreateTeamForm(formData);
    if (validationError) {
      toast({
        title: 'Erro ao criar time',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await createTeam({
        name: formData.name,
        description: formData.description,
        sport_id: formData.sport,
        owner_id: user.id,
        logo_url: formData.logoUrl || null,
        city: formData.city,
        state: formData.state,
        max_members: formData.maxMembers ? parseInt(formData.maxMembers) : 20,
        recruitment_open: formData.recruitmentOpen,
        team_type: formData.teamType,
      });

      toast({
        title: 'Time criado com sucesso!',
        description: 'Seu time foi registrado e está disponível.',
      });

      navigate('/teams');
    } catch (error: any) {
      toast({
        title: 'Erro ao criar time',
        description: error.message || 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    navigate('/teams');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Novo Time</h1>
          <p className="text-gray-600">Monte seu time esportivo e conecte-se com novos atletas</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <CreateTeamBasicInfo
            formData={formData}
            sports={sports}
            loadingSports={loadingSports}
            onInputChange={handleInputChange}
          />
          
          <CreateTeamLocation
            formData={formData}
            onInputChange={handleInputChange}
          />
          
          <CreateTeamSettings
            formData={formData}
            onInputChange={handleInputChange}
          />

          <CreateTeamActions
            loading={loading}
            onCancel={handleCancel}
          />
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
