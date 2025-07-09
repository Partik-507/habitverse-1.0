
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, CheckCircle, Flame, Target, Calendar, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  target_frequency: number;
  streak: number;
  best_streak: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_date: string;
  notes?: string;
}

export const RealHabitTracker = () => {
  const { user } = useAuth();
  const { updateUserStats } = useUserData();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    category: 'personal',
    target_frequency: 1
  });

  useEffect(() => {
    if (user) {
      fetchHabits();
      fetchCompletions();
    }
  }, [user]);

  const fetchHabits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHabits(data || []);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_date', { ascending: false });

      if (error) throw error;
      setCompletions(data || []);
    } catch (error) {
      console.error('Error fetching completions:', error);
    }
  };

  const saveHabit = async () => {
    if (!user || !newHabit.name.trim()) return;

    try {
      if (editingHabit) {
        const { error } = await supabase
          .from('habits')
          .update({
            name: newHabit.name,
            description: newHabit.description,
            category: newHabit.category,
            target_frequency: newHabit.target_frequency,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingHabit.id);

        if (error) throw error;
        toast.success('Habit updated successfully!');
      } else {
        const { error } = await supabase
          .from('habits')
          .insert({
            user_id: user.id,
            name: newHabit.name,
            description: newHabit.description,
            category: newHabit.category,
            target_frequency: newHabit.target_frequency,
            is_active: true
          });

        if (error) throw error;
        toast.success('Habit created successfully!');
      }

      setNewHabit({ name: '', description: '', category: 'personal', target_frequency: 1 });
      setShowForm(false);
      setEditingHabit(null);
      fetchHabits();
    } catch (error) {
      console.error('Error saving habit:', error);
      toast.error('Failed to save habit');
    }
  };

  const completeHabit = async (habitId: string) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    // Check if already completed today
    const alreadyCompleted = completions.some(
      c => c.habit_id === habitId && c.completed_date === today
    );

    if (alreadyCompleted) {
      toast.error('Habit already completed today!');
      return;
    }

    try {
      const { error } = await supabase
        .from('habit_completions')
        .insert({
          user_id: user.id,
          habit_id: habitId,
          completed_date: today
        });

      if (error) throw error;

      // Update habit streak
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        const newStreak = habit.streak + 1;
        const newBestStreak = Math.max(newStreak, habit.best_streak);
        
        await supabase
          .from('habits')
          .update({
            streak: newStreak,
            best_streak: newBestStreak,
            updated_at: new Date().toISOString()
          })
          .eq('id', habitId);
      }

      // Update user stats
      await updateUserStats(25, 5, false, true);
      
      fetchHabits();
      fetchCompletions();
      toast.success('Habit completed! +25 XP, +5 coins');
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to complete habit');
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!user || !confirm('Are you sure you want to delete this habit?')) return;

    try {
      const { error } = await supabase
        .from('habits')
        .update({ is_active: false })
        .eq('id', habitId);

      if (error) throw error;

      fetchHabits();
      toast.success('Habit deleted');
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
    }
  };

  const startEditing = (habit: Habit) => {
    setEditingHabit(habit);
    setNewHabit({
      name: habit.name,
      description: habit.description || '',
      category: habit.category,
      target_frequency: habit.target_frequency
    });
    setShowForm(true);
  };

  const isCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return completions.some(c => c.habit_id === habitId && c.completed_date === today);
  };

  const getWeeklyProgress = (habitId: string) => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const weekCompletions = completions.filter(c => 
      c.habit_id === habitId && 
      new Date(c.completed_date) >= lastWeek
    ).length;
    
    const habit = habits.find(h => h.id === habitId);
    return habit ? (weekCompletions / habit.target_frequency) * 100 : 0;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-green-100 text-green-800 border-green-200';
      case 'work': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'learning': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'personal': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Habit Tracker
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          {editingHabit ? 'Cancel Edit' : 'Add Habit'}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-green-500/30">
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-300">
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Habit name"
              value={newHabit.name}
              onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
              className="bg-white/50 dark:bg-gray-700/50 border-green-500/30"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newHabit.description}
              onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
              className="bg-white/50 dark:bg-gray-700/50 border-green-500/30"
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={newHabit.category}
                onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                className="p-2 bg-white/50 dark:bg-gray-700/50 border border-green-500/30 rounded-md"
              >
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="work">Work</option>
                <option value="learning">Learning</option>
              </select>
              <Input
                type="number"
                min="1"
                max="7"
                placeholder="Weekly target"
                value={newHabit.target_frequency}
                onChange={(e) => setNewHabit({ ...newHabit, target_frequency: parseInt(e.target.value) || 1 })}
                className="bg-white/50 dark:bg-gray-700/50 border-green-500/30"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={saveHabit} className="bg-green-600 hover:bg-green-700">
                {editingHabit ? 'Update Habit' : 'Create Habit'}
              </Button>
              <Button 
                onClick={() => {
                  setShowForm(false);
                  setEditingHabit(null);
                  setNewHabit({ name: '', description: '', category: 'personal', target_frequency: 1 });
                }} 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.length === 0 ? (
          <div className="col-span-full">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-green-500/30">
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No habits yet. Create your first habit to get started!</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          habits.map((habit) => {
            const weeklyProgress = getWeeklyProgress(habit.id);
            const completedToday = isCompletedToday(habit.id);
            
            return (
              <Card key={habit.id} className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-2 transition-all duration-200 ${
                completedToday 
                  ? 'border-green-500/50 shadow-lg shadow-green-500/20' 
                  : 'border-gray-200/50 dark:border-gray-700/50 hover:border-green-500/30'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {habit.name}
                        </h3>
                        <Badge className={getCategoryColor(habit.category)}>
                          {habit.category}
                        </Badge>
                      </div>
                      {habit.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {habit.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Flame className="h-4 w-4 mr-1 text-orange-500" />
                          <span>{habit.streak} day streak</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                          <span>{habit.target_frequency}x/week</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditing(habit)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteHabit(habit.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Weekly Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Weekly Progress</span>
                      <span>{Math.round(weeklyProgress)}%</span>
                    </div>
                    <Progress value={weeklyProgress} className="h-2" />
                  </div>

                  {/* Complete Button */}
                  <Button
                    onClick={() => completeHabit(habit.id)}
                    disabled={completedToday}
                    className={`w-full ${
                      completedToday
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
                    }`}
                  >
                    {completedToday ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed Today
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
