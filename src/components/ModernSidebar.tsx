
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  StickyNote, 
  Target, 
  TrendingUp, 
  BarChart3, 
  Bot, 
  Users, 
  Trophy, 
  Settings,
  Zap,
  Brain,
  Wand2,
  Network
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModernSidebarProps {
  user: any;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Notes', href: '/notes', icon: StickyNote },
  { name: 'Habits', href: '/habits', icon: Zap },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Second Brain', href: '/brain', icon: Brain },
  { name: 'Note Mastery', href: '/note-mastery', icon: Network },
  // { name: 'AI Images', href: '/images', icon: Wand2 },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'AI Coach', href: '/ai-coach', icon: Bot },
  // { name: 'Squad', href: '/squad', icon: Users },
  { name: 'Achievements', href: '/achievements', icon: Trophy },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const ModernSidebar = ({ user }: ModernSidebarProps) => {
  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              HabitVerse
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">2.0</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden',
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:text-gray-300 dark:hover:bg-gray-800'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn(
                      "mr-3 h-5 w-5 transition-transform duration-200",
                      isActive ? "text-white scale-110" : "group-hover:scale-110"
                    )} />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.name || 'User'}
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Level {user?.level || 1}</span>
              <span>•</span>
              <span>{user?.xp || 0} XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
