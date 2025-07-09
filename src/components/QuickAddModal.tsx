
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Target, Zap, BookOpen, Flag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { toast } from 'sonner';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal = ({ isOpen, onClose }: QuickAddModalProps) => {
  const { user } = useAuth();
  const { updateUserStats } = useUserData();
  const [activeTab, setActiveTab] = useState<'task' | 'habit' | 'journal' | 'goal'>('task');
  const [loading, setLoading] = useState(false);
  
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  });
  
  const [habitData, setHabitData] = useState({
    name: '',
    description: '',
    category: 'personal',
    target_frequency: 1
  });
  
  const [journalData, setJournalData] = useState({
    title: '',
    content: '',
    mood: '',
    tags: ''
  });
  
  const [goalData, setGoalData] = useState({
    title: '',
    description: '',
    category: 'personal',
    target_date: ''
  });

  const resetForms = () => {
    setTaskData({ title: '', description: '', priority: 'medium', due_date: '' });
    setHabitData({ name: '', description: '', category: 'personal', target_frequency: 1 });
    setJournalData({ title: '', content: '', mood: '', tags: '' });
    setGoalData({ title: '', description: '', category: 'personal', target_date: '' });
  };

  const handleCreateTask = async () => {
    if (!user || !taskData.title.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          due_date: taskData.due_date || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Task created successfully!');
      resetForms();
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = async () => {
    if (!user || !habitData.name.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: habitData.name,
          description: habitData.description,
          category: habitData.category,
          target_frequency: habitData.target_frequency,
          is_active: true
        });

      if (error) throw error;

      toast.success('Habit created successfully!');
      resetForms();
      onClose();
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJournal = async () => {
    if (!user || !journalData.title.trim() || !journalData.content.trim()) return;

    setLoading(true);
    try {
      const tags = journalData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: journalData.title,
          content: journalData.content,
          mood: journalData.mood || null,
          tags: tags.length > 0 ? tags : null
        });

      if (error) throw error;

      await updateUserStats(20, 3, false, false, true);
      toast.success('Journal entry created! +20 XP, +3 coins');
      resetForms();
      onClose();
    } catch (error) {
      console.error('Error creating journal entry:', error);
      toast.error('Failed to create journal entry');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!user || !goalData.title.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title: goalData.title,
          description: goalData.description,
          category: goalData.category,
          target_date: goalData.target_date || null,
          status: 'active'
        });

      if (error) throw error;

      toast.success('Goal created successfully!');
      resetForms();
      onClose();
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'task', label: 'Task', icon: Target },
    { id: 'habit', label: 'Habit', icon: Zap },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'goal', label: 'Goal', icon: Flag }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <Plus className="h-5 w-5" />
              <span>Quick Add</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => { onClose(); resetForms(); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex space-x-1 mt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-1 ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {activeTab === 'task' && (
            <div className="space-y-4">
              <Input
                placeholder="Task title"
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              />
              <div className="flex space-x-4">
                <select
                  value={taskData.priority}
                  onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                  className="p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <Input
                  type="date"
                  value={taskData.due_date}
                  onChange={(e) => setTaskData({ ...taskData, due_date: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateTask} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          )}

          {activeTab === 'habit' && (
            <div className="space-y-4">
              <Input
                placeholder="Habit name"
                value={habitData.name}
                onChange={(e) => setHabitData({ ...habitData, name: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={habitData.description}
                onChange={(e) => setHabitData({ ...habitData, description: e.target.value })}
              />
              <div className="flex space-x-4">
                <select
                  value={habitData.category}
                  onChange={(e) => setHabitData({ ...habitData, category: e.target.value })}
                  className="p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  value={habitData.target_frequency}
                  onChange={(e) => setHabitData({ ...habitData, target_frequency: parseInt(e.target.value) || 1 })}
                />
              </div>
              <Button onClick={handleCreateHabit} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? 'Creating...' : 'Create Habit'}
              </Button>
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="space-y-4">
              <Input
                placeholder="Entry title"
                value={journalData.title}
                onChange={(e) => setJournalData({ ...journalData, title: e.target.value })}
              />
              <Textarea
                placeholder="What's on your mind?"
                value={journalData.content}
                onChange={(e) => setJournalData({ ...journalData, content: e.target.value })}
                className="min-h-20"
              />
              <div className="flex space-x-4">
                <select
                  value={journalData.mood}
                  onChange={(e) => setJournalData({ ...journalData, mood: e.target.value })}
                  className="p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select mood</option>
                  <option value="happy">😊 Happy</option>
                  <option value="sad">😢 Sad</option>
                  <option value="excited">🎉 Excited</option>
                  <option value="calm">😌 Calm</option>
                  <option value="anxious">😰 Anxious</option>
                  <option value="grateful">🙏 Grateful</option>
                </select>
                <Input
                  placeholder="Tags (comma-separated)"
                  value={journalData.tags}
                  onChange={(e) => setJournalData({ ...journalData, tags: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateJournal} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
                {loading ? 'Creating...' : 'Create Entry'}
              </Button>
            </div>
          )}

          {activeTab === 'goal' && (
            <div className="space-y-4">
              <Input
                placeholder="Goal title"
                value={goalData.title}
                onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={goalData.description}
                onChange={(e) => setGoalData({ ...goalData, description: e.target.value })}
              />
              <div className="flex space-x-4">
                <select
                  value={goalData.category}
                  onChange={(e) => setGoalData({ ...goalData, category: e.target.value })}
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
                  value={goalData.target_date}
                  onChange={(e) => setGoalData({ ...goalData, target_date: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateGoal} disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700">
                {loading ? 'Creating...' : 'Create Goal'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
