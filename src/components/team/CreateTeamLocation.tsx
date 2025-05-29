
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { CreateTeamFormData } from '@/types/createTeam';

interface CreateTeamLocationProps {
  formData: CreateTeamFormData;
  onInputChange: (field: string, value: string | boolean) => void;
}

const CreateTeamLocation = ({ formData, onInputChange }: CreateTeamLocationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Localização</span>
        </CardTitle>
        <CardDescription>Onde seu time está baseado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade *</Label>
            <Input
              id="city"
              placeholder="Ex: São Paulo"
              value={formData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Estado *</Label>
            <Input
              id="state"
              placeholder="Ex: SP"
              value={formData.state}
              onChange={(e) => onInputChange('state', e.target.value)}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateTeamLocation;
