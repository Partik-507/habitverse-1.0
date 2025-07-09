

import { useState } from "react";

import { Zap, Plus, Flame, Trophy, Target } from "lucide-react";

import { Card } from "@/components/ui/card";

interface HabitTrackerProps {
  user: any;
  setUser: (user: any) => void;
}

export const HabitTracker = ({ user, setUser }: HabitTrackerProps) => {
  const [habits, setHabits] = useState([
    { 
      id: 1, 
      name: "Morning Meditation", 
      streak: 12, 
      completedToday: true, 
      category: "Wellness",
      xpReward: 25,
      weeklyProgress: [true, true, false, true, true, true, true]
    },
    { 
      id: 2, 
      name: "Exercise", 
      streak: 8, 
      completedToday: false, 
      category: "Health",
      xpReward: 30,
      weeklyProgress: [true, false, true, true, false, true, false]
    },
    { 
      id: 3, 
      name: "Reading", 
      streak: 15, 
      completedToday: true, 
      category: "Learning",
      xpReward: 20,
      weeklyProgress: [true, true, true, true, true, true, true]
    },
    { 
      id: 4, 
      name: "Gratitude Journal", 
      streak: 10, 
      completedToday: false, 
      category: "Mindfulness",
      xpReward: 15,
      weeklyProgress: [true, true, true, false, true, true, false]
    }
  ]);

  const [newHabit, setNewHabit] = useState({ name: "", category: "Personal" });

  const toggleHabit = (habitId: number) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const wasCompleted = habit.completedToday;
        const newCompleted = !wasCompleted;
        
        // Update user XP and coins when completing habit
        if (newCompleted && !wasCompleted) {
          setUser(prevUser => ({
            ...prevUser,
            xp: prevUser.xp + habit.xpReward,
            coins: prevUser.coins + Math.floor(habit.xpReward / 5)
          }));
        }
        
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1)
        };
      }
      return habit;
    }));
  };

  const addHabit = () => {
    if (!newHabit.name) return;
    
    const habit = {
      id: Date.now(),
      name: newHabit.name,
      streak: 0,
      completedToday: false,
      category: newHabit.category,
      xpReward: 20,
      weeklyProgress: [false, false, false, false, false, false, false]
    };
    
    setHabits(prev => [...prev, habit]);
    setNewHabit({ name: "", category: "Personal" });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Wellness": "purple",
      "Health": "green",
      "Learning": "blue",
      "Mindfulness": "orange",
      "Personal": "cyan"
    };
    return colors[category] || "gray";
  };

  const totalCompleted = habits.filter(h => h.completedToday).length;
  const completionRate = Math.round((totalCompleted / habits.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Habit Tracker</h2>
          <p className="text-gray-300">Build the life you want, one habit at a time</p>
        </div>
        
        <div className="flex space-x-4">
          <Card className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 border-green-500/30 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{completionRate}%</div>
              <div className="text-sm text-green-400">Today's Progress</div>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-400 mr-1" />
                {user.streak}
              </div>
              <div className="text-sm text-orange-400">Day Streak</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add New Habit */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-cyan-500/30 p-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newHabit.name}
            onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Add a new habit..."
            className="flex-1 bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
            onKeyPress={(e) => e.key === 'Enter' && addHabit()}
          />
          
          <select
            value={newHabit.category}
            onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value }))}
            className="bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
            <option value="Wellness">Wellness</option>
            <option value="Learning">Learning</option>
            <option value="Mindfulness">Mindfulness</option>
          </select>
          
          <button
            onClick={addHabit}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl p-3 transition-all duration-200"
          >
            <Plus className="h-5 w-5 text-white" />
          </button>
        </div>
      </Card>

      {/* Habits Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {habits.map((habit) => {
          const categoryColor = getCategoryColor(habit.category);
          
          return (
            <Card key={habit.id} className={`bg-gradient-to-br from-${categoryColor}-500/10 to-black/20 border-${categoryColor}-500/30 p-6 hover:scale-[1.02] transition-all duration-200`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{habit.name}</h3>
                  <div className={`text-sm px-2 py-1 rounded-full bg-${categoryColor}-500/20 text-${categoryColor}-300 inline-block`}>
                    {habit.category}
                  </div>
                </div>
                
                <button
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    habit.completedToday
                      ? `bg-${categoryColor}-500 border-${categoryColor}-500 scale-110`
                      : `border-${categoryColor}-500 hover:bg-${categoryColor}-500/20`
                  }`}
                >
                  {habit.completedToday ? (
                    <Zap className="h-6 w-6 text-white" />
                  ) : (
                    <div className={`w-4 h-4 border-2 border-${categoryColor}-400 rounded-full`}></div>
                  )}
                </button>
              </div>

              {/* Streak Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Flame className={`h-5 w-5 text-${categoryColor}-400`} />
                  <span className="text-white font-medium">{habit.streak} day streak</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 text-sm">+{habit.xpReward} XP</span>
                </div>
              </div>

              {/* Weekly Progress */}
              <div className="space-y-2">
                <div className="text-sm text-gray-400">This Week</div>
                <div className="flex space-x-1">
                  {habit.weeklyProgress.map((completed, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs ${
                        completed
                          ? `bg-${categoryColor}-500 text-white`
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {["M", "T", "W", "T", "F", "S", "S"][index]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Weekly Progress</span>
                  <span>{habit.weeklyProgress.filter(Boolean).length}/7</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r from-${categoryColor}-400 to-${categoryColor}-300 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(habit.weeklyProgress.filter(Boolean).length / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No habits yet. Start building your ideal life!</p>
        </div>
      )}
    </div>
  );
};
