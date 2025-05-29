
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trophy } from 'lucide-react';
import { CreateTeamFormData } from '@/types/createTeam';

interface CreateTeamSettingsProps {
  formData: CreateTeamFormData;
  onInputChange: (field: string, value: string | boolean) => void;
}

const CreateTeamSettings = ({ formData, onInputChange }: CreateTeamSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5" />
          <span>Configurações</span>
        </CardTitle>
        <CardDescription>Como o time será gerenciado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="recruitmentOpen"
            checked={formData.recruitmentOpen}
            onChange={(e) => onInputChange('recruitmentOpen', e.target.checked)}
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <div>
            <Label htmlFor="recruitmentOpen" className="font-medium">
              Recrutamento Aberto
            </Label>
            <p className="text-sm text-gray-600">
              Permitir que novos jogadores solicitem entrada no time
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateTeamSettings;
