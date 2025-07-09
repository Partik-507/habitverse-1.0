
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceNoteButtonProps {
  onVoiceText: (text: string) => void;
  disabled?: boolean;
}

export const VoiceNoteButton = ({ onVoiceText, disabled = false }: VoiceNoteButtonProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [showControls, setShowControls] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecordedText(transcript);
        setIsRecording(false);
        setShowControls(true);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setShowControls(false);
        toast.error('Voice recognition failed. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const startRecording = () => {
    if (recognitionRef.current && !disabled) {
      setIsRecording(true);
      setShowControls(false);
      setRecordedText('');
      recognitionRef.current.start();
    } else {
      toast.error('Voice input not supported in your browser');
    }
  };

  const acceptRecording = () => {
    onVoiceText(recordedText);
    setShowControls(false);
    setRecordedText('');
    toast.success('Voice note added!');
  };

  const cancelRecording = () => {
    setShowControls(false);
    setRecordedText('');
  };

  const isMicSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  if (!isMicSupported) {
    return null; // Hide if not supported
  }

  return (
    <div className="space-y-2">
      {showControls && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            Recorded: "{recordedText}"
          </div>
          <div className="flex space-x-2">
            <Button onClick={acceptRecording} size="sm" className="bg-green-500 hover:bg-green-600">
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button onClick={cancelRecording} size="sm" variant="outline">
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      <Button
        onClick={startRecording}
        disabled={disabled || isRecording}
        variant="outline"
        className={`${isRecording ? 'animate-pulse border-red-500 text-red-500' : 'hover:bg-blue-50'}`}
      >
        <Mic className="h-4 w-4 mr-2" />
        {isRecording ? 'Recording...' : 'Add Voice Note'}
      </Button>
    </div>
  );
};
