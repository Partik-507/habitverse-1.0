
import { useState, useRef, useEffect } from "react";
import { Brain, Send, Mic, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "ai",
      message: "Hi! I'm your AI Life Coach. I can help you plan your day, analyze your habits, or answer questions about your progress. What would you like to explore?"
    }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", message: input };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = getAIResponse(input);
      setMessages(prev => [...prev, { type: "ai", message: aiResponse }]);
    }, 1000);

    setInput("");
  };

  const getAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("plan") && lowerInput.includes("day")) {
      return "Based on your calendar and priorities, I suggest: 1) Start with your morning meditation (20min), 2) Tackle the project proposal during your peak focus hours (9-11am), 3) Schedule the team standup, 4) End with your workout. This balances deep work with your wellness goals. Would you like me to time-block this?";
    } else if (lowerInput.includes("habit")) {
      return "Your habit game is strong! 🔥 You're maintaining a 7-day overall streak. I notice your reading habit is at 90% - you're crushing it! Your exercise habit could use a boost at 60%. Try pairing it with something you enjoy, like a podcast. What habit would you like to focus on improving?";
    } else if (lowerInput.includes("stress") || lowerInput.includes("overwhelm")) {
      return "I sense you might be feeling stretched thin. Let's recalibrate: 1) Take 3 deep breaths right now, 2) Review your top 3 priorities for today, 3) Consider moving 1-2 less urgent tasks to tomorrow. Remember, progress over perfection. What's the most important thing you need to accomplish today?";
    } else {
      return "That's an interesting question! I'm analyzing your patterns and goals to give you the best advice. Based on your recent activity, you're making excellent progress. Is there a specific area of your life you'd like to optimize - productivity, habits, wellness, or goal achievement?";
    }
  };

  const quickPrompts = [
    "Plan my day",
    "How are my habits?",
    "Weekly review",
    "Goal progress",
    "Focus tips"
  ];

  return (
    <div className="w-80 bg-black/40 backdrop-blur-xl border-l border-cyan-500/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-cyan-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white">AI Life Coach</div>
            <div className="text-xs text-cyan-400 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              Online & Learning
            </div>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="p-4 border-b border-cyan-500/20">
        <div className="text-sm text-gray-400 mb-2">Quick Actions</div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setInput(prompt)}
              className="text-xs bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 border border-cyan-500/30 rounded-full px-3 py-1 transition-all duration-200"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.type === 'user' 
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' 
                : 'bg-black/30 text-gray-100 border border-cyan-500/20'
            }`}>
              {msg.type === 'ai' && (
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-3 w-3 text-cyan-400" />
                  <span className="text-xs text-cyan-400">AI Coach</span>
                </div>
              )}
              <div className="text-sm">{msg.message}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-cyan-500/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your AI coach anything..."
            className="flex-1 bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={handleSend}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl p-2 transition-all duration-200"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-cyan-400">
            <Mic className="h-3 w-3" />
            <span>Voice input</span>
          </button>
          <div className="text-xs text-gray-400">Press Enter to send</div>
        </div>
      </div>
    </div>
  );
};
