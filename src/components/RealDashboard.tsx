import { useState, useEffect } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Brain, Target, BookOpen, Zap, TrendingUp, Calendar, Award, Coins, 
  CheckSquare, Plus, Activity 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { QuickAddModal } from './QuickAddModal';
import { MovingDotAnimation } from './MovingDotAnimation';

interface DashboardStats {
  tasksCompletedToday: number;
  habitsCompletedToday: number;
  totalHabits: number;
  currentStreak: number;
  weeklyProgress: Array<{ day: string; completed: number; total: number; }>;
}

export const RealDashboard = () => {
  const { user } = useAuth();
  const { userStats, userProfile, loading, updateUserStats } = useUserData();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    tasksCompletedToday: 0,
    habitsCompletedToday: 0,
    totalHabits: 0,
    currentStreak: 0,
    weeklyProgress: []
  });
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get tasks completed today
      const { data: todayTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('completed_at', today);

      // Get all active habits
      const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Get habit completions for today
      const { data: todayHabitCompletions } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed_date', today);

      // Generate weekly progress data - last 7 days
      const weeklyProgress = [];
      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStr = date.toISOString().split('T')[0];
        
        // Get actual completions for this day
        const { data: dayCompletions } = await supabase
          .from('habit_completions')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed_date', dayStr);
        
        const { data: dayTasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('completed_at', dayStr)
          .lt('completed_at', new Date(new Date(dayStr).getTime() + 24 * 60 * 60 * 1000).toISOString());

        weeklyProgress.push({
          day: weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1],
          completed: (dayCompletions?.length || 0) + (dayTasks?.length || 0),
          total: (habits?.length || 0) + 5 // Assume 5 tasks target per day
        });
      }

      setDashboardStats({
        tasksCompletedToday: todayTasks?.length || 0,
        habitsCompletedToday: todayHabitCompletions?.length || 0,
        totalHabits: habits?.length || 0,
        currentStreak: userStats?.streak || 0,
        weeklyProgress
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const xpToNextLevel = (userStats?.level || 1) * 1000;
  const xpProgress = ((userStats?.xp || 0) / xpToNextLevel) * 100;
  const habitProgress = dashboardStats.totalHabits > 0 
    ? (dashboardStats.habitsCompletedToday / dashboardStats.totalHabits) * 100 
    : 0;

  const stats = [
    { 
      label: "Tasks Today", 
      value: dashboardStats.tasksCompletedToday.toString(), 
      change: "+2", 
      icon: CheckSquare, 
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      badgeColor: "bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300"
    },
    { 
      label: "Habits Today", 
      value: `${dashboardStats.habitsCompletedToday}/${dashboardStats.totalHabits}`, 
      change: "+1", 
      icon: Zap, 
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      badgeColor: "bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-300"
    },
    { 
      label: "Current Streak", 
      value: `${dashboardStats.currentStreak}`, 
      change: "+1", 
      icon: Activity, 
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      badgeColor: "bg-orange-50 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300"
    },
    { 
      label: "Total XP", 
      value: (userStats?.xp || 0).toString(), 
      change: "+50", 
      icon: TrendingUp, 
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      badgeColor: "bg-purple-50 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300"
    }
  ];

  const quickActions = [
    { label: "Plan My Day", icon: Calendar, gradient: "from-cyan-500 to-blue-500" },
    { label: "Add Quick Task", icon: Target, gradient: "from-purple-500 to-pink-500" },
    { label: "Log Habit", icon: Zap, gradient: "from-green-500 to-emerald-500" },
    { label: "Voice Journal", icon: BookOpen, gradient: "from-orange-500 to-red-500" }
  ];

  const todaysPriorities = [
    { task: "Complete project proposal", priority: "high", time: "2h" },
    { task: "Morning meditation", priority: "medium", time: "20m" },
    { task: "Team standup", priority: "high", time: "30m" },
    { task: "Workout session", priority: "medium", time: "1h" }
  ];

  const habitProgressData = [
    { habit: "Morning Pages", progress: 85, streak: 12 },
    { habit: "Exercise", progress: 60, streak: 8 },
    { habit: "Reading", progress: 90, streak: 15 },
    { habit: "Meditation", progress: 75, streak: 10 }
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Good morning, {userProfile?.full_name || 'Digital Pioneer'}! ✨
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {dashboardStats.currentStreak > 0 
            ? `You're on a ${dashboardStats.currentStreak}-day streak! Keep it up!`
            : "Ready to start building great habits?"
          }
        </p>
        
        {/* Moving Dot Animation */}
        <div className="mt-6 mb-4">
          <MovingDotAnimation />
        </div>
        
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 rounded-full px-4 py-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700 dark:text-green-300">All systems operational</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-4 py-2">
            <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-purple-700 dark:text-purple-300">AI Coach ready</span>
          </div>
        </div>

        <Button
          onClick={() => setShowQuickAdd(true)}
          className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Quick Add
        </Button>
      </div>

      {/* Live Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${stat.badgeColor}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* XP Progress */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-300">
            <Award className="h-5 w-5" />
            <span>Level Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Level {userStats?.level || 1}</span>
              <span className="text-gray-600 dark:text-gray-300">{userStats?.xp || 0} / {xpToNextLevel} XP</span>
            </div>
            <Progress value={xpProgress} className="h-3" />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {xpToNextLevel - (userStats?.xp || 0)} XP until next level
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center">
            <Zap className="h-5 w-5 mr-2 text-blue-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className={`p-4 rounded-xl transition-all duration-200 hover:scale-105 bg-gradient-to-r ${action.gradient} text-white shadow-md hover:shadow-lg`}
                >
                  <Icon className="h-6 w-6 mb-2 mx-auto" />
                  <div className="text-sm font-medium">{action.label}</div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress Chart & Today's Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-600 dark:text-blue-300">Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dashboardStats.weeklyProgress}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'completed' ? 'Completed' : 'Target']}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Bar 
                  dataKey="completed" 
                  fill="#3B82F6" 
                  radius={[4, 4, 0, 0]}
                  name="completed"
                />
                <Bar 
                  dataKey="total" 
                  fill="#E5E7EB" 
                  radius={[4, 4, 0, 0]}
                  name="target"
                  opacity={0.3}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-300">Today's Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(habitProgress)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Complete</div>
              </div>
              
              <Progress value={habitProgress} className="h-3" />
              
              <div className="text-center text-sm text-gray-600 dark:text-gray-300">
                {dashboardStats.habitsCompletedToday} of {dashboardStats.totalHabits} habits completed
              </div>

              {/* Streak Visualization */}
              <div className="flex justify-center space-x-1 mt-4">
                {Array.from({ length: Math.min(dashboardStats.currentStreak, 30) }, (_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
                {dashboardStats.currentStreak > 30 && (
                  <span className="text-sm text-green-600 ml-2">+{dashboardStats.currentStreak - 30}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Focus */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-500" />
              Today's Priorities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysPriorities.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-gray-900 dark:text-white">{item.task}</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Habit Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habitProgressData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-900 dark:text-white">{item.habit}</span>
                    <span className="text-green-600 dark:text-green-400">🔥 {item.streak}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
        <CardContent className="p-6 text-center">
          <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-2">
            "Success is the sum of small efforts repeated day in and day out."
          </blockquote>
          <cite className="text-sm text-cyan-600 dark:text-cyan-400">- Robert Collier</cite>
        </CardContent>
      </Card>

      <QuickAddModal 
        isOpen={showQuickAdd} 
        onClose={() => setShowQuickAdd(false)} 
      />
    </div>
  );
};
