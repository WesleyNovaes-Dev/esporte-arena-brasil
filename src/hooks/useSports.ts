
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

  const fetchSports = async () => {
    try {
      const { data, error } = await supabase
        .from('sports')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching sports:', error);
        return;
      }

      setSports(data || []);
    } catch (error) {
      console.error('Error fetching sports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  return {
    sports,
    loading,
    refetch: fetchSports
  };
};
