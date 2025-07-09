
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Globe, Briefcase, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  mode: 'workspace' | 'general';
}

interface AICoachPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  isMinimized: boolean;
}

export const AICoachPanel = ({ isOpen, onClose, onMinimize, isMinimized }: AICoachPanelProps) => {
  const { user } = useAuth();
  const { userStats, updateUserStats } = useUserData();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI Coach for HabitVerse. I'm currently in Workspace Mode ✅ - I can help you manage tasks, habits, goals, and more. Type 'switch to general mode' to ask me anything!",
      timestamp: new Date(),
      mode: 'workspace'
    }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'workspace' | 'general'>('workspace');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickSuggestions = mode === 'workspace' ? [
    "Plan my day",
    "What habits are due today?",
    "Show my productivity this week",
    "Create a reading habit",
    "Add task: Submit report by Friday"
  ] : [
    "Give me motivation",
    "Best productivity tips",
    "30-day challenge ideas",
    "How to build habits?",
    "Switch to workspace mode"
  ];

  const processWorkspaceCommand = async (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for mode switch
    if (lowerInput.includes('switch to general') || lowerInput.includes('general mode')) {
      setMode('general');
      return "Switched to General Chat Mode 🌍 - Ask me anything! Say 'switch to workspace mode' to go back to productivity features.";
    }

    // Task management
    if (lowerInput.includes('create task') || lowerInput.includes('add task')) {
      const taskMatch = userInput.match(/(?:create task|add task):?\s*(.*)/i);
      if (taskMatch) {
        const taskTitle = taskMatch[1].trim();
        try {
          const { error } = await supabase
            .from('tasks')
            .insert({
              user_id: user?.id,
              title: taskTitle,
              status: 'pending',
              priority: 'medium'
            });
          
          if (!error) {
            await updateUserStats(25, 5);
            return `✅ Created task: "${taskTitle}". +25 XP, +5 coins earned!`;
          }
        } catch (error) {
          console.error('Error creating task:', error);
        }
      }
      return "I can help you create tasks! Try: 'Create task: Submit report by Friday'";
    }

    // Habit management
    if (lowerInput.includes('create habit') || lowerInput.includes('add habit')) {
      const habitMatch = userInput.match(/(?:create habit|add habit):?\s*(.*)/i);
      if (habitMatch) {
        const habitName = habitMatch[1].trim();
        try {
          const { error } = await supabase
            .from('habits')
            .insert({
              user_id: user?.id,
              name: habitName,
              category: 'personal',
              target_frequency: 1
            });
          
          if (!error) {
            await updateUserStats(30, 10);
            return `🔁 Created habit: "${habitName}". +30 XP, +10 coins earned!`;
          }
        } catch (error) {
          console.error('Error creating habit:', error);
        }
      }
      return "I can help you create habits! Try: 'Create habit: Read 30 minutes daily'";
    }

    // Show tasks
    if (lowerInput.includes('show tasks') || lowerInput.includes('my tasks') || lowerInput.includes('upcoming tasks')) {
      try {
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user?.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(5);

        if (tasks && tasks.length > 0) {
          const taskList = tasks.map(task => `• ${task.title} (${task.priority} priority)`).join('\n');
          return `📝 Your upcoming tasks:\n\n${taskList}`;
        } else {
          return "🎉 No pending tasks! You're all caught up. Want to add a new task?";
        }
      } catch (error) {
        return "I couldn't fetch your tasks right now. Please try again.";
      }
    }

    // Show habits
    if (lowerInput.includes('habits due') || lowerInput.includes('my habits') || lowerInput.includes('habit progress')) {
      try {
        const { data: habits } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user?.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(5);

        if (habits && habits.length > 0) {
          const habitList = habits.map(habit => `🔁 ${habit.name} - ${habit.streak} day streak`).join('\n');
          return `Your active habits:\n\n${habitList}`;
        } else {
          return "No active habits yet. Let's create your first habit to build consistency!";
        }
      } catch (error) {
        return "I couldn't fetch your habits right now. Please try again.";
      }
    }

    // Plan day
    if (lowerInput.includes('plan my day') || lowerInput.includes('daily plan')) {
      const stats = userStats || { level: 1, xp: 0, streak: 0 };
      return `🌅 Here's your day plan:\n\n**Morning (9-11 AM)**\n• Check urgent tasks\n• Complete 1-2 high-priority items\n\n**Afternoon (1-4 PM)**\n• Focus on deep work\n• Review habit progress\n\n**Evening (6-8 PM)**\n• Wrap up remaining tasks\n• Journal or reflect\n\nYour current streak: ${stats.streak} days. Level: ${stats.level}. Keep it up! 💪`;
    }

    // Productivity stats
    if (lowerInput.includes('productivity') || lowerInput.includes('stats') || lowerInput.includes('progress')) {
      const stats = userStats || { level: 1, xp: 0, coins: 0, streak: 0, total_tasks_completed: 0 };
      return `📊 Your HabitVerse Stats:\n\n🎯 Level: ${stats.level}\n⚡ XP: ${stats.xp}\n🪙 Coins: ${stats.coins}\n🔥 Streak: ${stats.streak} days\n✅ Tasks Completed: ${stats.total_tasks_completed}\n\nYou're doing great! Keep building those productive habits! 🚀`;
    }

    return "I'm here to help with your productivity! Try commands like:\n• 'Create task: [description]'\n• 'Show my tasks'\n• 'Plan my day'\n• 'What habits are due today?'\n• 'Switch to general mode'";
  };

  const processGeneralCommand = async (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    // Check for mode switch
    if (lowerInput.includes('switch to workspace') || lowerInput.includes('workspace mode')) {
      setMode('workspace');
      return "Switched back to Workspace Mode ✅ - I can now help you manage your tasks, habits, and productivity inside HabitVerse!";
    }

    // Use the existing AI coach function for general queries
    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: { message: userInput }
      });

      if (error) throw error;
      return data.response || "I'm here to help! What would you like to know?";
    } catch (error) {
      console.error('Error calling AI coach:', error);
      return "I'm having trouble connecting right now. As your general AI assistant, I can help with productivity tips, motivation, learning resources, and general questions. What would you like to explore?";
    }
  };

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      mode
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = mode === 'workspace' 
        ? await processWorkspaceCommand(messageContent)
        : await processGeneralCommand(messageContent);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        mode
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I encountered an error. Please try again!",
        timestamp: new Date(),
        mode
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">AI Coach</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={mode === 'workspace' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}>
                    {mode === 'workspace' ? (
                      <>
                        <Briefcase className="h-3 w-3 mr-1" />
                        Workspace Mode
                      </>
                    ) : (
                      <>
                        <Globe className="h-3 w-3 mr-1" />
                        General Mode
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={onMinimize}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Quick Suggestions */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-1">
                {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => sendMessage(suggestion)}
                    className="text-xs h-6 px-2"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 h-96">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <Sparkles className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-blue-500">AI Coach</span>
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder={mode === 'workspace' ? "Ask about tasks, habits, goals..." : "Ask me anything..."}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
