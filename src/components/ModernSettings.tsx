

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Palette, Shield, Download, Trash2, Moon, Sun, Globe, Smartphone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const ModernSettings = () => {
  const { user, signOut } = useAuth();
  const { userProfile, fetchUserData } = useUserData();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    tasks: true,
    habits: true,
    ai: true,
    achievements: true,
    focus: false
  });
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    timezone: 'UTC-8',
    language: 'English'
  });

  useEffect(() => {
    if (userProfile) {
      setProfile({
        fullName: userProfile.full_name || '',
        email: userProfile.email || '',
        timezone: 'UTC-8',
        language: 'English'
      });
    }
    
    // Check current theme
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, [userProfile]);

  const handleProfileUpdate = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          email: profile.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      await fetchUserData();
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    toast.success(`Switched to ${newTheme ? 'dark' : 'light'} mode`);
  };

  const exportData = async () => {
    if (!user) return;

    try {
      // Fetch all user data
      const [tasks, habits, notes, goals, journal] = await Promise.all([
        supabase.from('tasks').select('*').eq('user_id', user.id),
        supabase.from('habits').select('*').eq('user_id', user.id),
        supabase.from('notes').select('*').eq('user_id', user.id),
        supabase.from('goals').select('*').eq('user_id', user.id),
        supabase.from('journal_entries').select('*').eq('user_id', user.id)
      ]);

      const exportData = {
        profile: userProfile,
        tasks: tasks.data || [],
        habits: habits.data || [],
        notes: notes.data || [],
        goals: goals.data || [],
        journal: journal.data || [],
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habits-verse-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Customize your HabitVerse experience</p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-500" />
            <CardTitle className="text-gray-900 dark:text-white">Profile Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Full Name
              </label>
              <Input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Email
              </label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
                type="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Timezone
              </label>
              <select 
                value={profile.timezone}
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="UTC-8">UTC-8 (Pacific)</option>
                <option value="UTC-5">UTC-5 (Eastern)</option>
                <option value="UTC+0">UTC+0 (GMT)</option>
                <option value="UTC+1">UTC+1 (CET)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Language
              </label>
              <select 
                value={profile.language}
                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                className="w-full p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </div>
          <Button onClick={handleProfileUpdate} className="bg-blue-500 hover:bg-blue-600">
            Update Profile
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Palette className="h-6 w-6 text-purple-500" />
            <CardTitle className="text-gray-900 dark:text-white">Appearance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              {isDarkMode ? <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" /> : <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">Dark Mode</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</div>
              </div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-green-500" />
            <CardTitle className="text-gray-900 dark:text-white">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'tasks', label: 'Task Reminders', description: 'Get notified about upcoming deadlines' },
            { key: 'habits', label: 'Habit Notifications', description: 'Daily reminders for your habits' },
            { key: 'ai', label: 'AI Insights', description: 'Weekly analysis and suggestions' },
            { key: 'achievements', label: 'Achievement Alerts', description: 'Celebrate your wins and milestones' },
            { key: 'focus', label: 'Focus Session Reminders', description: 'Pomodoro and deep work notifications' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{item.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{item.description}</div>
              </div>
              <Switch 
                checked={notifications[item.key as keyof typeof notifications]}
                onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Download className="h-6 w-6 text-orange-500" />
            <CardTitle className="text-gray-900 dark:text-white">Data Management</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={exportData}
              variant="outline" 
              className="flex items-center space-x-2 h-auto p-4"
            >
              <Download className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Export Data</div>
                <div className="text-sm text-gray-500">Download all your data</div>
              </div>
            </Button>
            
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="flex items-center space-x-2 h-auto p-4 text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Sign Out</div>
                <div className="text-sm text-gray-500">Sign out of your account</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-blue-500" />
            <CardTitle className="text-gray-900 dark:text-white">Account Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Free Plan</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">All features included</div>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
