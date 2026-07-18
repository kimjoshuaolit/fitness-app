// src/hooks/useWeights.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

// Row shape coming out of the v_daily_weights view (raw weight + 7-day avg + delta).
export type WeightRow = Database['public']['Views']['v_daily_weights']['Row'];

const WEIGHTS_KEY = ['weights'] as const;

// Read: every logged day, oldest first (charts read left-to-right).
export function useWeights() {
  return useQuery({
    queryKey: WEIGHTS_KEY,
    queryFn: async (): Promise<WeightRow[]> => {
      const { data, error } = await supabase
        .from('v_daily_weights')
        .select('*')
        .order('entry_date', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

// Write: one weigh-in per day. The unique(user_id, entry_date) constraint
// means re-logging the same date overwrites instead of duplicating.
export function useUpsertWeight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { entry_date: string; weight_lbs: number }) => {
      const { data: userData, error: authErr } = await supabase.auth.getUser();
      if (authErr || !userData.user) throw authErr ?? new Error('Not signed in');

      const { error } = await supabase
        .from('daily_weights')
        .upsert(
          {
            user_id: userData.user.id,
            entry_date: input.entry_date,
            weight_lbs: input.weight_lbs,
          },
          { onConflict: 'user_id,entry_date' }
        );
      if (error) throw error;
    },
    // Refetch the view so the 7-day average recomputes server-side.
    onSuccess: () => qc.invalidateQueries({ queryKey: WEIGHTS_KEY }),
  });
}