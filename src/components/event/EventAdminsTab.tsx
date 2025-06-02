
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Shield, Trash2 } from 'lucide-react';

interface EventAdminsTabProps {
  eventId: string;
  isAdmin: boolean;
}

interface EventAdmin {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export const EventAdminsTab: React.FC<EventAdminsTabProps> = ({
  eventId,
  isAdmin
}) => {
  const [admins, setAdmins] = useState<EventAdmin[]>([]);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, [eventId]);

  const loadAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('event_admins')
        .select(`
          id,
          user_id,
          role,
          created_at,
          profiles!inner(full_name, avatar_url)
        `)
        .eq('event_id', eventId);

      if (error) throw error;
      setAdmins(data || []);
    } catch (error) {
      console.error('Error loading admins:', error);
    }
  };

  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .ilike('full_name', `%${term}%`)
        .limit(10);

      if (error) throw error;
      
      // Filter out users who are already admins
      const adminIds = admins.map(a => a.user_id);
      const filteredResults = (data || []).filter(user => !adminIds.includes(user.id));
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const addAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('event_admins')
        .insert([{
          event_id: eventId,
          user_id: userId,
          role: 'admin'
        }]);

      if (error) throw error;

      toast.success('Administrador adicionado!');
      setSearchTerm('');
      setSearchResults([]);
      setIsDialogOpen(false);
      loadAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      toast.error('Erro ao adicionar administrador');
    }
  };

  const removeAdmin = async (adminId: string) => {
    try {
      const { error } = await supabase
        .from('event_admins')
        .delete()
        .eq('id', adminId);

      if (error) throw error;

      toast.success('Administrador removido');
      loadAdmins();
    } catch (error) {
      console.error('Error removing admin:', error);
      toast.error('Erro ao remover administrador');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Administradores ({admins.length})
          </CardTitle>
          {isAdmin && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Administrador</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Buscar usuário por nome..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      searchUsers(e.target.value);
                    }}
                  />
                  {searchResults.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {searchResults.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar_url || ''} />
                              <AvatarFallback>
                                {user.full_name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.full_name}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addAdmin(user.id)}
                          >
                            Adicionar
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {admins.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhum administrador encontrado
          </p>
        ) : (
          <div className="space-y-3">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={admin.profiles?.avatar_url || ''} />
                    <AvatarFallback>
                      {admin.profiles?.full_name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{admin.profiles?.full_name}</p>
                    <p className="text-sm text-gray-600">{admin.role}</p>
                  </div>
                </div>
                {isAdmin && admins.length > 1 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeAdmin(admin.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
