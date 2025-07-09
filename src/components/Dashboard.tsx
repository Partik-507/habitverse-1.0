
import { TrendingUp, Target, Zap, BookOpen, Calendar, Brain } from "lucide-react";
import { Card } from "@/components/ui/card";

interface DashboardProps {
  user: any;
}

export const Dashboard = ({ user }: DashboardProps) => {
  const stats = [
    { label: "Active Goals", value: "12", change: "+2", icon: Target, color: "purple" },
    { label: "Habit Streak", value: `${user.streak}`, change: "+1", icon: Zap, color: "green" },
    { label: "Tasks Done", value: "847", change: "+23", icon: TrendingUp, color: "cyan" },
    { label: "Journal Entries", value: "156", change: "+5", icon: BookOpen, color: "orange" }
  ];

  const quickActions = [
    { label: "Plan My Day", icon: Calendar, color: "cyan" },
    { label: "Add Quick Task", icon: Target, color: "purple" },
    { label: "Log Habit", icon: Zap, color: "green" },
    { label: "Voice Journal", icon: BookOpen, color: "orange" }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl p-6 border border-cyan-500/20">
        <h2 className="text-3xl font-bold mb-2">Good morning, {user.name}! ✨</h2>
        <p className="text-gray-300">You're on a {user.streak}-day streak! Let's make today extraordinary.</p>
        
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-black/30 rounded-full px-4 py-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">All systems operational</span>
          </div>
          
          <div className="flex items-center space-x-2 bg-black/30 rounded-full px-4 py-2">
            <Brain className="h-4 w-4 text-purple-400" />
            <span className="text-sm">AI Coach ready</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`bg-gradient-to-br from-${stat.color}-500/10 to-black/20 border-${stat.color}-500/30 p-6 hover:scale-105 transition-transform duration-200`}>
              <div className="flex items-center justify-between mb-4">
                <Icon className={`h-8 w-8 text-${stat.color}-400`} />
                <span className={`text-sm text-${stat.color}-400 bg-${stat.color}-500/20 px-2 py-1 rounded-full`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
        <h3 className="text-xl font-semibold mb-4 text-cyan-300">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className={`bg-gradient-to-r from-${action.color}-500/20 to-black/20 hover:from-${action.color}-500/30 hover:to-black/30 border border-${action.color}-500/30 rounded-xl p-4 transition-all duration-200 hover:scale-105`}
              >
                <Icon className={`h-6 w-6 text-${action.color}-400 mb-2`} />
                <div className="text-sm font-medium text-white">{action.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Focus */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold mb-4 text-purple-300">Today's Priorities</h3>
          <div className="space-y-3">
            {[
              { task: "Complete project proposal", priority: "high", time: "2h" },
              { task: "Morning meditation", priority: "medium", time: "20m" },
              { task: "Team standup", priority: "high", time: "30m" },
              { task: "Workout session", priority: "medium", time: "1h" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.priority === 'high' ? 'bg-red-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="text-white">{item.task}</span>
                </div>
                <span className="text-gray-400 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
          <h3 className="text-xl font-semibold mb-4 text-green-300">Habit Progress</h3>
          <div className="space-y-4">
            {[
              { habit: "Morning Pages", progress: 85, streak: 12 },
              { habit: "Exercise", progress: 60, streak: 8 },
              { habit: "Reading", progress: 90, streak: 15 },
              { habit: "Meditation", progress: 75, streak: 10 }
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">{item.habit}</span>
                  <span className="text-green-400">🔥 {item.streak}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
