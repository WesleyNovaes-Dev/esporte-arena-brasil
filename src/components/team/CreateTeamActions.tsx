
import { Button } from '@/components/ui/button';

interface CreateTeamActionsProps {
  loading: boolean;
  onCancel: () => void;
}

const CreateTeamActions = ({ loading, onCancel }: CreateTeamActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={loading}
        className="w-full sm:w-auto"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600"
      >
        {loading ? 'Criando...' : 'Criar Time'}
      </Button>
    </div>
  );
};

export default CreateTeamActions;
