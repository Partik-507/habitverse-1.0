
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
  pulse?: boolean;
  glow?: boolean;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, loading, pulse, glow, children, disabled, ...props }, ref) => {
    return (
      <Button
        className={cn(
          'transition-all duration-300 transform',
          'hover:scale-105 active:scale-95',
          pulse && 'animate-pulse',
          glow && 'shadow-lg hover:shadow-xl',
          loading && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </Button>
    );
  }
);

EnhancedButton.displayName = 'EnhancedButton';
