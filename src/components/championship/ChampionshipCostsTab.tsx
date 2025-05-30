
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useChampionshipManagement, ChampionshipCost } from '@/hooks/useChampionshipManagement';
import { toast } from 'sonner';
import { Plus, DollarSign } from 'lucide-react';

interface ChampionshipCostsTabProps {
  costs: ChampionshipCost[];
  isAdmin: boolean;
  championshipId: string;
  totalCosts: number;
  costPerTeam: number;
  teamsCount: number;
  onCostsUpdate: () => void;
}

const ChampionshipCostsTab = ({ 
  costs, 
  isAdmin, 
  championshipId, 
  totalCosts, 
  costPerTeam, 
  teamsCount,
  onCostsUpdate 
}: ChampionshipCostsTabProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { addCost } = useChampionshipManagement(championshipId);

  const [costData, setCostData] = useState({
    item_name: '',
    item_description: '',
    cost: 0,
    category: ''
  });

  const categories = [
    { value: 'trophy', label: 'Troféu' },
    { value: 'venue', label: 'Quadra/Local' },
    { value: 'medal', label: 'Medalha' },
    { value: 'transport', label: 'Transporte' },
    { value: 'referee', label: 'Arbitragem' },
    { value: 'equipment', label: 'Equipamentos' },
    { value: 'other', label: 'Outros' }
  ];

  const handleAddCost = async () => {
    if (!costData.item_name || !costData.category || costData.cost <= 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await addCost(costData);
      toast.success('Custo adicionado com sucesso!');
      setShowAddDialog(false);
      setCostData({
        item_name: '',
        item_description: '',
        cost: 0,
        category: ''
      });
      onCostsUpdate();
    } catch (error) {
      console.error('Erro ao adicionar custo:', error);
      toast.error('Erro ao adicionar custo');
    }
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.label || category;
  };

  const costsByCategory = costs.reduce((acc, cost) => {
    if (!acc[cost.category]) {
      acc[cost.category] = [];
    }
    acc[cost.category].push(cost);
    return acc;
  }, {} as Record<string, ChampionshipCost[]>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Custo Total</p>
                <p className="text-2xl font-bold">R$ {totalCosts.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Custo por Time</p>
                <p className="text-2xl font-bold">R$ {costPerTeam.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-600">Times Participantes</p>
              <p className="text-2xl font-bold">{teamsCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Custos do Campeonato</CardTitle>
            {isAdmin && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Custo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Custo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nome do Item</Label>
                      <Input
                        value={costData.item_name}
                        onChange={(e) => setCostData({ ...costData, item_name: e.target.value })}
                        placeholder="Ex: Troféu 1º lugar"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select value={costData.category} onValueChange={(value) => setCostData({ ...costData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Valor (R$)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={costData.cost}
                        onChange={(e) => setCostData({ ...costData, cost: parseFloat(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Descrição (opcional)</Label>
                      <Textarea
                        value={costData.item_description}
                        onChange={(e) => setCostData({ ...costData, item_description: e.target.value })}
                        placeholder="Descrição detalhada do item..."
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddDialog(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddCost} className="flex-1">
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {costs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum custo adicionado ainda
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(costsByCategory).map(([category, categoryCosts]) => (
                <div key={category}>
                  <h3 className="font-semibold mb-3">{getCategoryLabel(category)}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryCosts.map((cost) => (
                        <TableRow key={cost.id}>
                          <TableCell className="font-medium">{cost.item_name}</TableCell>
                          <TableCell>{cost.item_description || '-'}</TableCell>
                          <TableCell className="text-right">R$ {cost.cost.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="font-semibold">
                          Subtotal {getCategoryLabel(category)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ {categoryCosts.reduce((sum, cost) => sum + cost.cost, 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChampionshipCostsTab;
