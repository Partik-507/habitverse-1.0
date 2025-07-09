
import { useState } from "react";
import { BookOpen, Plus, Calendar, Heart, Brain, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export const Journal = () => {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: "2024-01-15",
      title: "Morning Reflections",
      content: "Started the day with meditation and feel centered. Working on the project proposal is challenging but exciting. I'm grateful for the opportunity to grow.",
      mood: "optimistic",
      tags: ["morning", "meditation", "work", "gratitude"],
      aiInsights: "Strong positive sentiment. Focus on gratitude and growth mindset detected."
    },
    {
      id: 2,
      date: "2024-01-14",
      title: "Evening Wind Down",
      content: "Had a productive day but feeling a bit overwhelmed with deadlines. Need to remember to take breaks and celebrate small wins.",
      mood: "reflective",
      tags: ["evening", "work", "stress", "self-care"],
      aiInsights: "Stress indicators present. Recommend implementing break strategies and celebrating achievements."
    }
  ]);

  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "neutral"
  });

  const [showNewEntry, setShowNewEntry] = useState(false);

  const moods = [
    { value: "joyful", color: "yellow", emoji: "😊" },
    { value: "optimistic", color: "green", emoji: "🌟" },
    { value: "neutral", color: "blue", emoji: "😐" },
    { value: "reflective", color: "purple", emoji: "🤔" },
    { value: "stressed", color: "orange", emoji: "😰" },
    { value: "frustrated", color: "red", emoji: "😤" }
  ];

  const addEntry = () => {
    if (!newEntry.title || !newEntry.content) return;

    const entry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      tags: extractTags(newEntry.content),
      aiInsights: generateAIInsight(newEntry.content, newEntry.mood)
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({ title: "", content: "", mood: "neutral" });
    setShowNewEntry(false);
  };

  const extractTags = (content: string): string[] => {
    const words = content.toLowerCase().split(/\s+/);
    const commonTags = ["work", "health", "family", "goals", "gratitude", "stress", "happiness", "learning"];
    return commonTags.filter(tag => words.some(word => word.includes(tag)));
  };

  const generateAIInsight = (content: string, mood: string): string => {
    const positiveWords = ["grateful", "excited", "happy", "accomplished", "proud"];
    const negativeWords = ["stressed", "overwhelmed", "frustrated", "tired", "worried"];
    
    const hasPositive = positiveWords.some(word => content.toLowerCase().includes(word));
    const hasNegative = negativeWords.some(word => content.toLowerCase().includes(word));

    if (hasPositive && !hasNegative) {
      return "Strong positive sentiment detected. Great emotional state for productivity and creativity.";
    } else if (hasNegative && !hasPositive) {
      return "Some stress indicators found. Consider meditation, exercise, or talking to someone.";
    } else {
      return "Balanced emotional state. Good self-awareness and reflection present.";
    }
  };

  const getMoodData = (mood: string) => {
    return moods.find(m => m.value === mood) || moods[2];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Digital Journal</h2>
          <p className="text-gray-300">Reflect, grow, and track your inner journey</p>
        </div>
        
        <button
          onClick={() => setShowNewEntry(true)}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl px-6 py-3 flex items-center space-x-2 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/30 p-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-purple-400" />
            <div>
              <div className="text-2xl font-bold text-white">{entries.length}</div>
              <div className="text-sm text-purple-300">Total Entries</div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500/20 to-yellow-500/20 border-green-500/30 p-4">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-green-400" />
            <div>
              <div className="text-2xl font-bold text-white">7</div>
              <div className="text-sm text-green-300">Day Streak</div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30 p-4">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-orange-400" />
            <div>
              <div className="text-2xl font-bold text-white">85%</div>
              <div className="text-sm text-orange-300">Positive Sentiment</div>
            </div>
          </div>
        </Card>
      </div>

      {/* New Entry Form */}
      {showNewEntry && (
        <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-cyan-500/30 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">New Journal Entry</h3>
          
          <div className="space-y-4">
            <input
              type="text"
              value={newEntry.title}
              onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Entry title..."
              className="w-full bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
            />
            
            <textarea
              value={newEntry.content}
              onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
              placeholder="What's on your mind today? Reflect on your thoughts, feelings, and experiences..."
              rows={6}
              className="w-full bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 resize-none"
            />
            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">How are you feeling?</label>
              <div className="flex space-x-2">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.value }))}
                    className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
                      newEntry.mood === mood.value
                        ? `bg-${mood.color}-500/30 border border-${mood.color}-500/50 text-${mood.color}-300`
                        : "bg-black/30 border border-gray-600 text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <span>{mood.emoji}</span>
                    <span className="text-sm capitalize">{mood.value}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={addEntry}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-xl px-6 py-2 transition-all duration-200"
              >
                Save Entry
              </button>
              <button
                onClick={() => setShowNewEntry(false)}
                className="bg-gray-600 hover:bg-gray-700 rounded-xl px-6 py-2 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Journal Entries */}
      <div className="space-y-6">
        {entries.map((entry) => {
          const moodData = getMoodData(entry.mood);
          
          return (
            <Card key={entry.id} className={`bg-gradient-to-br from-${moodData.color}-500/10 to-black/20 border-${moodData.color}-500/30 p-6 hover:scale-[1.01] transition-all duration-200`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{entry.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>{moodData.emoji}</span>
                      <span className="capitalize">{entry.mood}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-200 mb-4 leading-relaxed">{entry.content}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {entry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 text-xs rounded-full bg-${moodData.color}-500/20 text-${moodData.color}-300 border border-${moodData.color}-500/30`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              {/* AI Insights */}
              <div className={`bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-cyan-500/20 rounded-xl p-4`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm font-medium text-cyan-300">AI Insight</span>
                </div>
                <p className="text-sm text-gray-300">{entry.aiInsights}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No journal entries yet. Start reflecting on your journey!</p>
        </div>
      )}
    </div>
  );
};
