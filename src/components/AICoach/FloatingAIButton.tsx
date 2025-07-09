
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle } from 'lucide-react';

interface FloatingAIButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export const FloatingAIButton = ({ onClick, hasUnread = false }: FloatingAIButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
    >
      <div className="relative">
        <Bot className="h-6 w-6 text-white" />
        {hasUnread && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </div>
    </Button>
  );
};
