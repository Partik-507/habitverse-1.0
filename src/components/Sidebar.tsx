
import { Brain, Target, Zap, BookOpen, BarChart3, Settings, Home, Calendar } from "lucide-react";

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  user: any;
}

export const Sidebar = ({ activeModule, setActiveModule, user }: SidebarProps) => {
  const modules = [
    { id: "dashboard", icon: Home, label: "Dashboard", color: "cyan" },
    { id: "tasks", icon: Target, label: "Tasks & Goals", color: "purple" },
    { id: "habits", icon: Zap, label: "Habits", color: "green" },
    { id: "journal", icon: BookOpen, label: "Journal", color: "orange" },
    { id: "analytics", icon: BarChart3, label: "Analytics", color: "blue" },
    { id: "settings", icon: Settings, label: "Settings", color: "gray" }
  ];

  return (
    <div className="w-64 bg-black/40 backdrop-blur-xl border-r border-cyan-500/30 flex flex-col">
      {/* User Profile Section */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-cyan-400">🔥 {user.streak} day streak</div>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Level {user.level}</span>
            <span>{user.xp}/3000 XP</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(user.xp / 3000) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = activeModule === module.id;
          
          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? `bg-gradient-to-r from-${module.color}-500/20 to-${module.color}-400/10 border border-${module.color}-500/50 text-${module.color}-300`
                  : "hover:bg-white/5 text-gray-300 hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? `text-${module.color}-400` : "group-hover:text-cyan-400"} transition-colors`} />
              <span className="font-medium">{module.label}</span>
              {isActive && (
                <div className={`ml-auto w-2 h-2 bg-${module.color}-400 rounded-full animate-pulse`}></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-cyan-500/20">
        <div className="text-xs text-gray-400 mb-2">Today's Progress</div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tasks</span>
            <span className="text-green-400">7/10</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Habits</span>
            <span className="text-purple-400">5/8</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Focus Time</span>
            <span className="text-cyan-400">2.5h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
