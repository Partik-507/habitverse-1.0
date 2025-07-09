
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserData } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Heart, Calendar, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

const moodEmojis = {
  happy: '😊',
  sad: '😢',
  excited: '🎉',
  calm: '😌',
  anxious: '😰',
  grateful: '🙏',
  motivated: '💪',
  tired: '😴'
};

export const RealJournal = () => {
  const { user } = useAuth();
  const { updateUserStats } = useUserData();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: '',
    tags: ''
  });

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast.error('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!user || !newEntry.title.trim() || !newEntry.content.trim()) return;

    try {
      const tags = newEntry.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      if (editingEntry) {
        const { error } = await supabase
          .from('journal_entries')
          .update({
            title: newEntry.title,
            content: newEntry.content,
            mood: newEntry.mood || null,
            tags: tags.length > 0 ? tags : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEntry.id);

        if (error) throw error;
        toast.success('Entry updated successfully!');
      } else {
        const { error } = await supabase
          .from('journal_entries')
          .insert({
            user_id: user.id,
            title: newEntry.title,
            content: newEntry.content,
            mood: newEntry.mood || null,
            tags: tags.length > 0 ? tags : null
          });

        if (error) throw error;

        // Update user stats for new entry
        await updateUserStats(20, 3, false, false, true);
        toast.success('Entry saved! +20 XP, +3 coins');
      }

      setNewEntry({ title: '', content: '', mood: '', tags: '' });
      setShowForm(false);
      setEditingEntry(null);
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('Failed to save entry');
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      fetchEntries();
      toast.success('Entry deleted');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood || '',
      tags: entry.tags?.join(', ') || ''
    });
    setShowForm(true);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setNewEntry({ title: '', content: '', mood: '', tags: '' });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Digital Journal
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          {editingEntry ? 'Cancel Edit' : 'New Entry'}
        </Button>
      </div>

      {showForm && (
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <CardTitle className="text-cyan-300">
              {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Entry title"
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              className="bg-white/10 border-cyan-500/30 text-white"
            />
            <Textarea
              placeholder="What's on your mind today?"
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              className="bg-white/10 border-cyan-500/30 text-white min-h-32"
            />
            <div className="flex space-x-4">
              <select
                value={newEntry.mood}
                onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value })}
                className="bg-black/40 border border-cyan-500/30 text-white rounded-md px-3 py-2"
              >
                <option value="">Select mood (optional)</option>
                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                  <option key={mood} value={mood}>
                    {emoji} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Tags (comma-separated)"
                value={newEntry.tags}
                onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                className="bg-white/10 border-cyan-500/30 text-white"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={saveEntry} className="bg-green-600 hover:bg-green-700">
                {editingEntry ? 'Update Entry' : 'Save Entry'}
              </Button>
              <Button onClick={cancelEditing} variant="outline" className="border-gray-500">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {entries.length === 0 ? (
          <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300">No journal entries yet. Start writing to capture your thoughts and memories!</p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-white">{entry.title}</h3>
                      {entry.mood && (
                        <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/50">
                          {moodEmojis[entry.mood as keyof typeof moodEmojis]} {entry.mood}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-400 mb-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(entry.created_at).toLocaleDateString()} at {new Date(entry.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => startEditing(entry)}
                      size="sm"
                      variant="outline"
                      className="border-cyan-500/50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => deleteEntry(entry.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-3 whitespace-pre-wrap">{entry.content}</p>
                
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
