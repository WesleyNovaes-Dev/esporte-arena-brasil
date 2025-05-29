
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';
import { CreateTeamFormData } from '@/types/createTeam';
import { Sport } from '@/hooks/useSports';

interface CreateTeamBasicInfoProps {
  formData: CreateTeamFormData;
  sports: Sport[];
  loadingSports: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
}

const CreateTeamBasicInfo = ({ formData, sports, loadingSports, onInputChange }: CreateTeamBasicInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Informações Básicas</span>
        </CardTitle>
        <CardDescription>Defina os detalhes principais do seu time</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Time *</Label>
            <Input
              id="name"
              placeholder="Ex: Thunders FC"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sport">Esporte *</Label>
            <Select
              value={formData.sport}
              onValueChange={(value) => onInputChange('sport', value)}
              disabled={loadingSports}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingSports ? 'Carregando esportes...' : 'Selecione o esporte'} />
              </SelectTrigger>
              <SelectContent>
                {sports.map((sport) => (
                  <SelectItem key={sport.id} value={sport.id}>
                    {sport.emoji} {sport.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl">URL do Logo</Label>
          <Input
            id="logoUrl"
            type="url"
            placeholder="Link para o logo do time (opcional)"
            value={formData.logoUrl}
            onChange={(e) => onInputChange('logoUrl', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="teamType">Tipo de Time</Label>
            <Select
              value={formData.teamType}
              onValueChange={(value) => onInputChange('teamType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amador">Amador</SelectItem>
                <SelectItem value="semi-profissional">Semi-profissional</SelectItem>
                <SelectItem value="profissional">Profissional</SelectItem>
                <SelectItem value="recreativo">Recreativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxMembers">Máximo de Membros</Label>
            <Input
              id="maxMembers"
              type="number"
              placeholder="Ex: 20"
              value={formData.maxMembers}
              onChange={(e) => onInputChange('maxMembers', e.target.value)}
              min="5"
              max="50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição do Time *</Label>
          <Textarea
            id="description"
            placeholder="Descreva seu time, estilo de jogo, objetivos..."
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            rows={4}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateTeamBasicInfo;
