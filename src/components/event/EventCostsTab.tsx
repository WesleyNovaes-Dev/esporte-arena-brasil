
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, DollarSign, Trash2 } from 'lucide-react';
import type { EventCost } from '@/hooks/useEventManagement';

interface EventCostsTabProps {
  eventId: string;
  isAdmin: boolean;
  costs: EventCost[];
  onUpdate: () => void;
}

export const EventCostsTab: React.FC<EventCostsTabProps> = ({
  eventId,
  isAdmin,
  costs,
  onUpdate
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    item_description: '',
    cost: '',
    category: 'equipamento'
  });

  const categories = [
    { value: 'equipamento', label: 'Equipamento' },
    { value: 'local', label: 'Local/Quadra' },
    { value: 'premiacao', label: 'Premiação' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'arbitragem', label: 'Arbitragem' },
    { value: 'outros', label: 'Outros' }
  ];

  const addCost = async () => {
    if (!formData.item_name || !formData.cost) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      const { error } = await supabase
        .from('event_costs')
        .insert([{
          event_id: eventId,
          item_name: formData.item_name,
          item_description: formData.item_description || null,
          cost: parseFloat(formData.cost),
          category: formData.category
        }]);

      if (error) throw error;

      toast.success('Custo adicionado!');
      setFormData({
        item_name: '',
        item_description: '',
        cost: '',
        category: 'equipamento'
      });
      setIsDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding cost:', error);
      toast.error('Erro ao adicionar custo');
    }
  };

  const deleteCost = async (costId: string) => {
    try {
      const { error } = await supabase
        .from('event_costs')
        .delete()
        .eq('id', costId);

      if (error) throw error;

      toast.success('Custo removido');
      onUpdate();
    } catch (error) {
      console.error('Error deleting cost:', error);
      toast.error('Erro ao remover custo');
    }
  };

  const getTotalByCategory = (category: string) => {
    return costs
      .filter(cost => cost.category === category)
      .reduce((total, cost) => total + Number(cost.cost), 0);
  };

  const getTotalCosts = () => {
    return costs.reduce((total, cost) => total + Number(cost.cost), 0);
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(cat => cat.value === category)?.label || category;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Custos do Evento
            </CardTitle>
            {isAdmin && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                      <Label htmlFor="item_name">Nome do Item *</Label>
                      <Input
                        id="item_name"
                        value={formData.item_name}
                        onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                        placeholder="Ex: Troféu, Quadra, Medalhas..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
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
                      <Label htmlFor="cost">Valor (R$) *</Label>
                      <Input
                        id="cost"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.cost}
                        onChange={(e) => setFormData({...formData, cost: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="item_description">Descrição</Label>
                      <Textarea
                        id="item_description"
                        value={formData.item_description}
                        onChange={(e) => setFormData({...formData, item_description: e.target.value})}
                        placeholder="Descrição opcional do item..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={addCost} className="flex-1">
                        Adicionar
                      </Button>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                        Cancelar
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
            <p className="text-center text-gray-500 py-8">
              Nenhum custo cadastrado ainda
            </p>
          ) : (
            <div className="space-y-4">
              {/* Resumo por categoria */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const total = getTotalByCategory(category.value);
                  if (total === 0) return null;
                  
                  return (
                    <div key={category.value} className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{category.label}</p>
                      <p className="font-semibold text-lg">R$ {total.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>

              {/* Total geral */}
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800 font-semibold text-xl">
                  Total Geral: R$ {getTotalCosts().toFixed(2)}
                </p>
              </div>

              {/* Lista detalhada */}
              <div className="space-y-3">
                {costs.map((cost) => (
                  <div key={cost.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{cost.item_name}</h4>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {getCategoryLabel(cost.category)}
                        </span>
                      </div>
                      {cost.item_description && (
                        <p className="text-sm text-gray-600 mt-1">{cost.item_description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(cost.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-green-600">
                        R$ {Number(cost.cost).toFixed(2)}
                      </span>
                      {isAdmin && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteCost(cost.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
