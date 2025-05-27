import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Save } from 'lucide-react';

interface TeamManagementModalProps {
    team: any;
    onClose: () => void;
}

const TeamManagementModal: React.FC<TeamManagementModalProps> = ({ team, onClose }) => {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    const fetchTeamMembers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select('id, user_id, created_at, users (id, email, full_name)')
                .eq('team_id', team.id);

            if (error) throw error;

            setMembers(data || []);
        } catch (err) {
            console.error('Erro ao buscar membros do time:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMember = async (memberId: string, updatedData: any) => {
        try {
            const { error } = await supabase
                .from('team_members')
                .update(updatedData)
                .eq('id', memberId);

            if (error) throw error;
            alert('Informações atualizadas com sucesso!');
            fetchTeamMembers(); // Recarrega os dados atualizados
        } catch (err) {
            console.error('Erro ao atualizar membro:', err);
            alert('Erro ao atualizar membro.');
        }
    };

    return (
        <Modal title={`Gerenciar Time: ${team.name}`} description="Gerencie os usuários e informações do time." onClose={onClose}>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações do Time</h3>
                <div>
                    <p><strong>Nome:</strong> {team.name}</p>
                    <p><strong>Esporte:</strong> {team.sportDetails?.name || 'N/A'}</p>
                    <p><strong>Criação:</strong> {new Date(team.created_at).toLocaleDateString()}</p>
                    <p><strong>Total de Membros:</strong> {members.length}</p>
                </div>

                <h3 className="text-lg font-semibold">Membros do Time</h3>
                {loading ? (
                    <p>Carregando membros...</p>
                ) : (
                    <div className="space-y-4">
                        {members.map((member) => (
                            <MemberRow
                                key={member.id}
                                member={member}
                                onUpdate={(data) => handleUpdateMember(member.id, data)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default TeamManagementModal;

const MemberRow = ({ member, onUpdate }: { member: any; onUpdate: (data: any) => void }) => {
    const [editing, setEditing] = useState(false);
    const [updatedName, setUpdatedName] = useState(member.users.full_name);

    const handleSave = () => {
        onUpdate({ full_name: updatedName });
        setEditing(false);
    };

    return (
        <div className="flex items-center justify-between border p-2 rounded">
            <div>
                {editing ? (
                    <Input
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        placeholder="Atualizar nome"
                    />
                ) : (
                    <p>
                        <strong>Nome:</strong> {member.users.full_name} <br />
                        <strong>Email:</strong> {member.users.email}
                    </p>
                )}
            </div>
            <div>
                {editing ? (
                    <Button size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-1" /> Salvar
                    </Button>
                ) : (
                    <Button size="sm" onClick={() => setEditing(true)}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                )}
            </div>
        </div>
    );
};