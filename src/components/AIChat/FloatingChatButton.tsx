
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface FloatingChatButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

export const FloatingChatButton = ({ onClick, isActive = false }: FloatingChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`fixed bottom-20 right-4 z-40 w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ${
        isActive 
          ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
          : 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600'
      }`}
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </Button>
  );
};
