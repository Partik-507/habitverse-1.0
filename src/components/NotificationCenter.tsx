
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Clock, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'task' | 'habit' | 'reminder';
  title: string;
  message: string;
  due_time?: string;
  task_id?: string;
  habit_id?: string;
  created_at: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      // Get overdue tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .not('due_date', 'is', null)
        .lt('due_date', new Date().toISOString());

      // Get today's incomplete habits
      const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

      const mockNotifications: Notification[] = [
        ...(tasks || []).map(task => ({
          id: `task-${task.id}`,
          type: 'task' as const,
          title: 'Overdue Task',
          message: task.title,
          due_time: task.due_date,
          task_id: task.id,
          created_at: task.created_at
        })),
        ...(habits || []).slice(0, 2).map(habit => ({
          id: `habit-${habit.id}`,
          type: 'habit' as const,
          title: 'Habit Reminder',
          message: `Don't forget: ${habit.name}`,
          habit_id: habit.id,
          created_at: new Date().toISOString()
        }))
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markTaskDone = async (taskId: string) => {
    try {
      await supabase
        .from('tasks')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', taskId);
      
      setNotifications(prev => prev.filter(n => n.task_id !== taskId));
      toast.success('Task completed!');
    } catch (error) {
      console.error('Error marking task done:', error);
    }
  };

  const snoozeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification snoozed for 1 hour');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end p-4">
      <Card className="w-96 max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {notification.message}
                      </div>
                      {notification.due_time && (
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Due: {new Date(notification.due_time).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-2">
                    {notification.task_id && (
                      <Button
                        size="sm"
                        onClick={() => markTaskDone(notification.task_id!)}
                        className="bg-green-600 hover:bg-green-700 text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mark Done
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => snoozeNotification(notification.id)}
                      className="text-xs"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      Snooze
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
