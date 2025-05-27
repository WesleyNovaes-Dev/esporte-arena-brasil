import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Sport {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const useSports = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os esportes da tabela "sports"
  const fetchSports = async () => {
    try {
      const { data, error } = await supabase
          .from('sports')
          .select('*') // Busca todos os campos
          .order('name', { ascending: true }); // Ordena pelo nome do esporte

      if (error) {
        console.error('Erro ao buscar esportes:', error);
        return;
      }

      setSports(data || []);
    } catch (error) {
      console.error('Erro ao buscar esportes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para obter um esporte pelo ID
  const getSport = (sportId: string): Sport | undefined => {
    console.log(sportId);
    return sports.find((sport) => sport.id === sportId);
  };

  // Carregar os esportes ao montar o hook
  useEffect(() => {
    fetchSports();
  }, []);

  return {
    sports, // Lista completa dos esportes carregados
    loading, // Status de carregamento
    refetch: fetchSports, // Função para recarregar os esportes
    getSport, // Função para buscar um esporte por ID
  };
};