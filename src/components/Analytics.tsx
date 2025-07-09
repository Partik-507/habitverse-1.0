
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  TrendingUp, Target, Activity, Calendar, Award, Brain,
  CheckSquare, Zap, BookOpen, BarChart3 
} from 'lucide-react';

interface AnalyticsData {
  weeklyProgress: Array<{
    date: string;
    tasks: number;
    habits: number;
    journal: number;
    xp: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    completed: number;
    target: number;
  }>;
  categoryBreakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  streakData: {
    current: number;
    longest: number;
    average: number;
  };
  productivityScore: number;
  totalStats: {
    tasksCompleted: number;
    habitsCompleted: number;
    journalEntries: number;
    totalXP: number;
  };
}

export const Analytics = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    weeklyProgress: [],
    monthlyTrends: [],
    categoryBreakdown: [],
    streakData: { current: 0, longest: 0, average: 0 },
    productivityScore: 0,
    totalStats: { tasksCompleted: 0, habitsCompleted: 0, journalEntries: 0, totalXP: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
  }, [user, timeRange]);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user stats
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch weekly progress data
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Get tasks completed on this date
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('completed_at', dateStr)
          .lt('completed_at', new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000).toISOString());

        // Get habits completed on this date
        const { data: habits } = await supabase
          .from('habit_completions')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed_date', dateStr);

        // Get journal entries on this date
        const { data: journal } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', dateStr)
          .lt('created_at', new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000).toISOString());

        weeklyData.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          tasks: tasks?.length || 0,
          habits: habits?.length || 0,
          journal: journal?.length || 0,
          xp: (tasks?.length || 0) * 10 + (habits?.length || 0) * 5 + (journal?.length || 0) * 15
        });
      }

      // Fetch monthly trends
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();

        const { data: monthTasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .gte('completed_at', startOfMonth)
          .lte('completed_at', endOfMonth);

        const { data: monthHabits } = await supabase
          .from('habit_completions')
          .select('*')
          .eq('user_id', user.id)
          .gte('completed_date', startOfMonth.split('T')[0])
          .lte('completed_date', endOfMonth.split('T')[0]);

        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          completed: (monthTasks?.length || 0) + (monthHabits?.length || 0),
          target: 50 // Arbitrary target for demonstration
        });
      }

      // Category breakdown
      const { data: allTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      const { data: allHabits } = await supabase
        .from('habits')
        .select('category')
        .eq('user_id', user.id);

      const categoryData = [
        { 
          name: 'Tasks', 
          value: allTasks?.length || 0, 
          color: '#3B82F6' 
        },
        { 
          name: 'Health', 
          value: allHabits?.filter(h => h.category === 'health').length || 0, 
          color: '#10B981' 
        },
        { 
          name: 'Personal', 
          value: allHabits?.filter(h => h.category === 'personal').length || 0, 
          color: '#F59E0B' 
        },
        { 
          name: 'Work', 
          value: allHabits?.filter(h => h.category === 'work').length || 0, 
          color: '#EF4444' 
        }
      ];

      setAnalyticsData({
        weeklyProgress: weeklyData,
        monthlyTrends: monthlyData,
        categoryBreakdown: categoryData,
        streakData: {
          current: userStats?.streak || 0,
          longest: userStats?.streak || 0, // Would need separate tracking
          average: Math.floor((userStats?.streak || 0) / 2)
        },
        productivityScore: Math.min(100, ((userStats?.xp || 0) / 1000) * 100),
        totalStats: {
          tasksCompleted: userStats?.total_tasks_completed || 0,
          habitsCompleted: userStats?.total_habits_completed || 0,
          journalEntries: userStats?.total_journal_entries || 0,
          totalXP: userStats?.xp || 0
        }
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your progress and insights</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={timeRange === 'week' ? 'default' : 'outline'}
            onClick={() => setTimeRange('week')}
            size="sm"
          >
            Week
          </Button>
          <Button
            variant={timeRange === 'month' ? 'default' : 'outline'}
            onClick={() => setTimeRange('month')}
            size="sm"
          >
            Month
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <CheckSquare className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tasks Completed</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {analyticsData.totalStats.tasksCompleted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Zap className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Habits Completed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {analyticsData.totalStats.habitsCompleted}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <BookOpen className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Journal Entries</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {analyticsData.totalStats.journalEntries}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {analyticsData.streakData.current} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Weekly Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: any) => [value, name === 'tasks' ? 'Tasks' : name === 'habits' ? 'Habits' : name === 'journal' ? 'Journal' : 'XP']}
                  />
                  <Bar dataKey="tasks" fill="#3B82F6" name="tasks" />
                  <Bar dataKey="habits" fill="#10B981" name="habits" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="completed" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="target" stroke="#E5E7EB" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Productivity Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                      {Math.round(analyticsData.productivityScore)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Overall Score</div>
                  </div>
                  <Progress value={analyticsData.productivityScore} className="h-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    {analyticsData.productivityScore > 80 ? 'Excellent performance!' : 
                     analyticsData.productivityScore > 60 ? 'Good progress!' : 
                     'Keep pushing forward!'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Streak Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Current Streak</span>
                    <span className="font-semibold">{analyticsData.streakData.current} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Longest Streak</span>
                    <span className="font-semibold">{analyticsData.streakData.longest} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Average Streak</span>
                    <span className="font-semibold">{analyticsData.streakData.average} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
