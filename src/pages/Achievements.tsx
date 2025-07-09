
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target, Zap, BookOpen, Calendar, Award, Crown, Medal, Flame } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function Achievements() {
  const { user } = useAuth();
  const { userStats } = useUserData();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalHabits: 0,
    totalJournalEntries: 0,
    currentStreak: 0
  });

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user, userStats]);

  const loadUserStats = async () => {
    if (!user) return;

    try {
      // Get actual user data
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed');

      const { data: habits } = await supabase
        .from('habit_completions')
        .select('*')
        .eq('user_id', user.id);

      const { data: journal } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id);

      const userStatsData = {
        totalTasks: tasks?.length || 0,
        totalHabits: habits?.length || 0,
        totalJournalEntries: journal?.length || 0,
        currentStreak: userStats?.streak || 0
      };

      setStats(userStatsData);
      generateAchievements(userStatsData);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const generateAchievements = (userStats: any) => {
    const achievementTemplates: Omit<Achievement, 'progress' | 'isUnlocked'>[] = [
      // Task Achievements
      {
        id: 'first-task',
        title: 'Getting Started',
        description: 'Complete your first task',
        icon: Target,
        category: 'tasks',
        maxProgress: 1,
        xpReward: 50,
        rarity: 'common'
      },
      {
        id: 'task-warrior',
        title: 'Task Warrior',
        description: 'Complete 50 tasks',
        icon: Trophy,
        category: 'tasks',
        maxProgress: 50,
        xpReward: 500,
        rarity: 'rare'
      },
      {
        id: 'task-master',
        title: 'Task Master',
        description: 'Complete 100 tasks',
        icon: Crown,
        category: 'tasks',
        maxProgress: 100,
        xpReward: 1000,
        rarity: 'epic'
      },
      {
        id: 'task-legend',
        title: 'Task Legend',
        description: 'Complete 500 tasks',
        icon: Medal,
        category: 'tasks',
        maxProgress: 500,
        xpReward: 2500,
        rarity: 'legendary'
      },

      // Habit Achievements
      {
        id: 'first-habit',
        title: 'Habit Starter',
        description: 'Complete your first habit',
        icon: Zap,
        category: 'habits',
        maxProgress: 1,
        xpReward: 25,
        rarity: 'common'
      },
      {
        id: 'habit-builder',
        title: 'Habit Builder',
        description: 'Complete 30 habits',
        icon: Star,
        category: 'habits',
        maxProgress: 30,
        xpReward: 300,
        rarity: 'rare'
      },
      {
        id: 'habit-champion',
        title: 'Habit Champion',
        description: 'Complete 100 habits',
        icon: Award,
        category: 'habits',
        maxProgress: 100,
        xpReward: 750,
        rarity: 'epic'
      },

      // Streak Achievements
      {
        id: 'streak-3',
        title: 'Getting Consistent',
        description: 'Maintain a 3-day streak',
        icon: Flame,
        category: 'streaks',
        maxProgress: 3,
        xpReward: 100,
        rarity: 'common'
      },
      {
        id: 'streak-7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: Flame,
        category: 'streaks',
        maxProgress: 7,
        xpReward: 250,
        rarity: 'rare'
      },
      {
        id: 'streak-30',
        title: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: Flame,
        category: 'streaks',
        maxProgress: 30,
        xpReward: 1000,
        rarity: 'epic'
      },
      {
        id: 'streak-100',
        title: 'Centurion',
        description: 'Maintain a 100-day streak',
        icon: Flame,
        category: 'streaks',
        maxProgress: 100,
        xpReward: 5000,
        rarity: 'legendary'
      },

      // Journal Achievements
      {
        id: 'first-journal',
        title: 'First Thoughts',
        description: 'Write your first journal entry',
        icon: BookOpen,
        category: 'journal',
        maxProgress: 1,
        xpReward: 30,
        rarity: 'common'
      },
      {
        id: 'journal-writer',
        title: 'Thoughtful Writer',
        description: 'Write 20 journal entries',
        icon: BookOpen,
        category: 'journal',
        maxProgress: 20,
        xpReward: 400,
        rarity: 'rare'
      },

      // Level Achievements
      {
        id: 'level-5',
        title: 'Rising Star',
        description: 'Reach level 5',
        icon: Star,
        category: 'levels',
        maxProgress: 5,
        xpReward: 200,
        rarity: 'common'
      },
      {
        id: 'level-10',
        title: 'Experienced User',
        description: 'Reach level 10',
        icon: Trophy,
        category: 'levels',
        maxProgress: 10,
        xpReward: 500,
        rarity: 'rare'
      },
      {
        id: 'level-25',
        title: 'Power User',
        description: 'Reach level 25',
        icon: Crown,
        category: 'levels',
        maxProgress: 25,
        xpReward: 2000,
        rarity: 'epic'
      }
    ];

    const processedAchievements = achievementTemplates.map(template => {
      let progress = 0;
      
      switch (template.category) {
        case 'tasks':
          progress = userStats.totalTasks;
          break;
        case 'habits':
          progress = userStats.totalHabits;
          break;
        case 'streaks':
          progress = userStats.currentStreak;
          break;
        case 'journal':
          progress = userStats.totalJournalEntries;
          break;
        case 'levels':
          progress = userStats?.level || 1;
          break;
        default:
          progress = 0;
      }

      return {
        ...template,
        progress: Math.min(progress, template.maxProgress),
        isUnlocked: progress >= template.maxProgress,
        unlockedAt: progress >= template.maxProgress ? new Date().toISOString() : undefined
      };
    });

    setAchievements(processedAchievements);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tasks': return 'bg-green-500/20 text-green-600';
      case 'habits': return 'bg-blue-500/20 text-blue-600';
      case 'streaks': return 'bg-orange-500/20 text-orange-600';
      case 'journal': return 'bg-purple-500/20 text-purple-600';
      case 'levels': return 'bg-pink-500/20 text-pink-600';
      default: return 'bg-gray-500/20 text-gray-600';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  const lockedAchievements = achievements.filter(a => !a.isUnlocked);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Achievements</h1>

      {/* Stats Overview */}
      <Card className="mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{unlockedAchievements.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{achievements.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">XP Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
            Unlocked Achievements
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unlockedAchievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <Card key={achievement.id} className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${getCategoryColor(achievement.category)}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {achievement.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Unlocked
                          </Badge>
                          <span className="text-sm font-medium text-yellow-600">
                            +{achievement.xpReward} XP
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="h-6 w-6 mr-2 text-gray-500" />
            In Progress
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lockedAchievements.map((achievement) => {
              const Icon = achievement.icon;
              const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
              
              return (
                <Card key={achievement.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-80">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700`}>
                        <Icon className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h3>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {achievement.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">
                              {achievement.progress} / {achievement.maxProgress}
                            </span>
                            <span className="text-yellow-600">
                              +{achievement.xpReward} XP
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
