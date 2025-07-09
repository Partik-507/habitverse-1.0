
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export interface UserStats {
  id: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  total_tasks_completed: number;
  total_habits_completed: number;
  total_journal_entries: number;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setUserStats(null);
      setUserProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      setUserStats(stats);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserStats = async (
    xpGain: number = 0,
    coinsGain: number = 0,
    taskCompleted: boolean = false,
    habitCompleted: boolean = false,
    journalEntry: boolean = false
  ) => {
    if (!user) return;

    try {
      await supabase.rpc('update_user_stats', {
        user_id: user.id,
        xp_gain: xpGain,
        coins_gain: coinsGain,
        task_completed: taskCompleted,
        habit_completed: habitCompleted,
        journal_entry: journalEntry
      });

      // Refetch user stats
      fetchUserData();
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  return {
    userStats,
    userProfile,
    loading,
    fetchUserData,
    updateUserStats
  };
};
