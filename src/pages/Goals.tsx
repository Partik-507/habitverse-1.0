
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, Calendar, Edit, Trash2, Flag, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: string;
  progress: number;
  target_date?: string;
  created_at: string;
  updated_at: string;
}

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal',
    target_date: ''
  });

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const saveGoal = async () => {
    if (!user || !newGoal.title.trim()) return;

    try {
      if (editingGoal) {
        const { error } = await supabase
          .from('goals')
          .update({
            title: newGoal.title,
            description: newGoal.description,
            category: newGoal.category,
            target_date: newGoal.target_date || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingGoal.id);

        if (error) throw error;
        toast.success('Goal updated successfully!');
      } else {
        const { error } = await supabase
          .from('goals')
          .insert({
            user_id: user.id,
            title: newGoal.title,
            description: newGoal.description,
            category: newGoal.category,
            target_date: newGoal.target_date || null,
            status: 'active'
          });

        if (error) throw error;
        toast.success('Goal created successfully!');
      }

      setNewGoal({ title: '', description: '', category: 'personal', target_date: '' });
      setShowForm(false);
      setEditingGoal(null);
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };

  const updateProgress = async (goalId: string, newProgress: number) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({
          progress: newProgress,
          status: newProgress >= 100 ? 'completed' : 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId);

      if (error) throw error;

      fetchGoals();
      if (newProgress >= 100) {
        toast.success('🎉 Goal completed! Congratulations!');
      } else {
        toast.success('Progress updated!');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;

      fetchGoals();
      toast.success('Goal deleted');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const startEditing = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description || '',
      category: goal.category,
      target_date: goal.target_date || ''
    });
    setShowForm(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-green-100 text-green-800 border-green-200';
      case 'work': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'learning': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'financial': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'personal': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'active': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'paused': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Goals</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {editingGoal ? 'Cancel Edit' : 'Add Goal'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Goal title"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            <Textarea
              placeholder="Description (optional)"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            <div className="flex space-x-4">
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="work">Work</option>
                <option value="learning">Learning</option>
                <option value="financial">Financial</option>
              </select>
              <Input
                type="date"
                value={newGoal.target_date}
                onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={saveGoal} className="bg-green-600 hover:bg-green-700">
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </Button>
              <Button 
                onClick={() => {
                  setShowForm(false);
                  setEditingGoal(null);
                  setNewGoal({ title: '', description: '', category: 'personal', target_date: '' });
                }} 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.length === 0 ? (
          <div className="col-span-full">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No goals yet. Create your first goal to get started!</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          goals.map((goal) => (
            <Card key={goal.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                      <Badge className={getCategoryColor(goal.category)}>
                        {goal.category}
                      </Badge>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {goal.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status}
                      </Badge>
                      {goal.target_date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(goal.target_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(goal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{goal.progress || 0}%</span>
                  </div>
                  <Progress value={goal.progress || 0} className="h-2" />
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => updateProgress(goal.id, Math.min(100, (goal.progress || 0) + 10))}
                      className="bg-green-600 hover:bg-green-700 text-xs"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +10%
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateProgress(goal.id, Math.min(100, (goal.progress || 0) + 25))}
                      className="bg-blue-600 hover:bg-blue-700 text-xs"
                    >
                      <Flag className="h-3 w-3 mr-1" />
                      +25%
                    </Button>
                    {goal.progress !== 100 && (
                      <Button
                        size="sm"
                        onClick={() => updateProgress(goal.id, 100)}
                        className="bg-purple-600 hover:bg-purple-700 text-xs"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
