
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Mic, Check, X as XIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatBotModal = ({ isOpen, onClose }: ChatBotModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI assistant. I can help you with productivity, answer questions, and assist with your HabitVerse tasks. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const [showRecordingControls, setShowRecordingControls] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat history from sessionStorage
    const savedMessages = sessionStorage.getItem('habitverse-chat-history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }

    // Initialize Speech Recognition
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
        setShowRecordingControls(true);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setShowRecordingControls(false);
        toast.error('Voice recognition failed. Please try again.');
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  useEffect(() => {
    // Save messages to sessionStorage
    sessionStorage.setItem('habitverse-chat-history', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simple AI response logic - in real implementation, this would call the Hugging Face API
      const response = await generateAIResponse(messageContent);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const lowerInput = userInput.toLowerCase();

    // Task management responses
    if (lowerInput.includes('add task') || lowerInput.includes('create task')) {
      return "I'd be happy to help you add a task! You can create tasks in your Task Manager. Would you like me to guide you there, or would you like to tell me more details about the task you want to create?";
    }

    if (lowerInput.includes('habit') && (lowerInput.includes('create') || lowerInput.includes('add'))) {
      return "Creating habits is a great way to build consistency! You can set up new habits in your Habit Tracker. What kind of habit would you like to develop? I can suggest some popular productivity habits like reading, exercise, or meditation.";
    }

    if (lowerInput.includes('journal') || lowerInput.includes('write')) {
      return "Journaling is excellent for reflection and growth! You can use your Journal section to write about your thoughts, experiences, and goals. Would you like some journaling prompts to get started?";
    }

    if (lowerInput.includes('productivity') || lowerInput.includes('tips')) {
      return "Here are some proven productivity tips:\n\n1. **Time blocking** - Schedule specific times for different activities\n2. **The 2-minute rule** - If it takes less than 2 minutes, do it now\n3. **Pomodoro technique** - Work in 25-minute focused sessions\n4. **Single-tasking** - Focus on one thing at a time\n5. **Weekly reviews** - Reflect on your progress regularly\n\nWhich of these would you like to learn more about?";
    }

    if (lowerInput.includes('motivation') || lowerInput.includes('inspire')) {
      return "Here's some motivation for you: 'Success is not final, failure is not fatal: it is the courage to continue that counts.' - Winston Churchill\n\nRemember, every small step counts toward your bigger goals. You're already taking action by using HabitVerse to organize your life. Keep building those positive habits, one day at a time! 💪";
    }

    // General responses
    const responses = [
      "That's an interesting question! Could you tell me more about what you're looking for?",
      "I'm here to help you with productivity, habits, and achieving your goals. What specific area would you like to focus on?",
      "Great question! In HabitVerse, you have tools for task management, habit tracking, journaling, and more. What would you like to explore?",
      "I can help you optimize your productivity workflow. Are you looking to create new habits, manage tasks better, or something else?",
      "Thanks for asking! I'm designed to help you get the most out of HabitVerse. What's your main productivity challenge right now?"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(true);
      setShowRecordingControls(false);
      setRecordedText('');
      recognitionRef.current.start();
    } else {
      toast.error('Voice input not supported in your browser');
    }
  };

  const acceptRecording = () => {
    setInput(recordedText);
    setShowRecordingControls(false);
    setRecordedText('');
  };

  const cancelRecording = () => {
    setShowRecordingControls(false);
    setRecordedText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!isOpen) return null;

  const isMicSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                🤖
              </div>
              <span>AI Assistant</span>
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {showRecordingControls && (
            <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Recorded: "{recordedText}"</div>
              <div className="flex space-x-2">
                <Button onClick={acceptRecording} size="sm" className="bg-green-500 hover:bg-green-600">
                  <Check className="h-4 w-4" />
                </Button>
                <Button onClick={cancelRecording} size="sm" variant="outline">
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="pr-12"
                disabled={isLoading}
              />
              {isMicSupported && (
                <Button
                  onClick={startRecording}
                  disabled={isLoading || isRecording}
                  size="sm"
                  variant="ghost"
                  className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                    isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-blue-500'
                  }`}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {isRecording && (
            <div className="text-center text-sm text-blue-500 mt-2 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Listening...</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
