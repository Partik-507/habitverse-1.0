import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit3, Trash2, Calendar, Image, Hash, List, Type, Minus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { VoiceNoteButton } from '@/components/AIChat/VoiceNoteButton';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const slashCommands = [
    { command: '/heading', description: 'Large heading', icon: Type },
    { command: '/subheading', description: 'Smaller heading', icon: Type },
    { command: '/numbered', description: 'Numbered list', icon: List },
    { command: '/bullet', description: 'Bullet list', icon: List },
    { command: '/todo', description: 'Todo checkbox', icon: List },
    { command: '/divider', description: 'Horizontal line', icon: Minus },
    { command: '/image', description: 'Add image', icon: Image }
  ];

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            user_id: user.id,
            title: 'New Note',
            content: ''
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      const newNote = data;
      setNotes(prev => [newNote, ...prev]);
      setSelectedNote(newNote);
      setIsEditing(true);
      setEditTitle(newNote.title);
      setEditContent(newNote.content || '');
      toast.success('New note created! 📝');
    } catch (error) {
      console.error('Error creating note:', error);
      toast.error('Failed to create note');
    }
  };

  const updateNote = async () => {
    if (!selectedNote) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .update({
          title: editTitle,
          content: editContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedNote.id)
        .select()
        .single();

      if (error) throw error;

      const updatedNote = data;
      setNotes(prev => prev.map(note => 
        note.id === selectedNote.id ? updatedNote : note
      ));
      setSelectedNote(updatedNote);
      setIsEditing(false);
      toast.success('Note saved! ✨');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to save note');
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setIsEditing(false);
      }
      toast.success('Note deleted');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleVoiceText = (voiceText: string) => {
    const newContent = editContent + (editContent ? '\n\n' : '') + `🎤 Voice Note: ${voiceText}`;
    setEditContent(newContent);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    
    setEditContent(value);
    setCursorPosition(cursorPos);
    
    // Check for slash command
    const beforeCursor = value.substring(0, cursorPos);
    const lastSlash = beforeCursor.lastIndexOf('/');
    
    if (lastSlash !== -1 && lastSlash === cursorPos - 1) {
      // Show slash menu
      const textarea = e.target;
      const textBeforeCursor = beforeCursor.substring(0, cursorPos);
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines.length;
      const currentColumn = lines[lines.length - 1].length;
      
      setSlashMenuPosition({
        top: currentLine * 24, // Approximate line height
        left: currentColumn * 8 // Approximate character width
      });
      setShowSlashMenu(true);
    } else if (showSlashMenu && !beforeCursor.endsWith('/')) {
      setShowSlashMenu(false);
    }
  };

  const insertSlashCommand = (command: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const beforeCursor = editContent.substring(0, cursorPosition);
    const afterCursor = editContent.substring(cursorPosition);
    const lastSlash = beforeCursor.lastIndexOf('/');
    
    let replacement = '';
    switch (command) {
      case '/heading':
        replacement = '# Heading';
        break;
      case '/subheading':
        replacement = '## Subheading';
        break;
      case '/numbered':
        replacement = '1. Numbered item';
        break;
      case '/bullet':
        replacement = '• Bullet point';
        break;
      case '/todo':
        replacement = '☐ Todo item';
        break;
      case '/divider':
        replacement = '---';
        break;
      case '/image':
        replacement = '![Image description](image-url)';
        break;
    }

    const newContent = beforeCursor.substring(0, lastSlash) + replacement + afterCursor;
    setEditContent(newContent);
    setShowSlashMenu(false);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = lastSlash + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // For now, we'll simulate image upload since storage isn't configured
      const imageUrl = URL.createObjectURL(file);
      const imageMarkdown = `![${file.name}](${imageUrl})`;
      
      // Insert at cursor position
      const beforeCursor = editContent.substring(0, cursorPosition);
      const afterCursor = editContent.substring(cursorPosition);
      const newContent = beforeCursor + imageMarkdown + afterCursor;
      
      setEditContent(newContent);
      toast.success('Image added to note! 📷');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const renderContent = (content: string) => {
    if (!content) return <p className="text-gray-500 dark:text-gray-400 italic">This note is empty.</p>;

    // Simple markdown-like rendering
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('🎤 Voice Note: ')) {
        return (
          <div key={index} className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r">
            <span className="text-blue-600 dark:text-blue-400 text-sm">🎤 Voice Note</span>
            <p className="text-gray-900 dark:text-white mt-1">{line.replace('🎤 Voice Note: ', '')}</p>
          </div>
        );
      } else if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{line.substring(3)}</h2>;
      } else if (line.startsWith('• ')) {
        return <li key={index} className="ml-4 text-gray-900 dark:text-white">{line.substring(2)}</li>;
      } else if (line.match(/^\d+\./)) {
        return <li key={index} className="ml-4 list-decimal text-gray-900 dark:text-white">{line.replace(/^\d+\./, '')}</li>;
      } else if (line.startsWith('☐ ')) {
        return <div key={index} className="flex items-center space-x-2 text-gray-900 dark:text-white"><input type="checkbox" /><span>{line.substring(2)}</span></div>;
      } else if (line === '---') {
        return <hr key={index} className="my-4 border-gray-300 dark:border-gray-600" />;
      } else if (line.startsWith('![')) {
        const match = line.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          return <img key={index} src={match[2]} alt={match[1]} className="max-w-full h-auto rounded-lg my-2" />;
        }
      }
      return <p key={index} className="mb-2 text-gray-900 dark:text-white">{line}</p>;
    });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.content || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
        {/* Notes List */}
        <div className="lg:col-span-1">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full flex flex-col shadow-lg">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Notes</CardTitle>
                <Button onClick={createNote} size="sm" className="bg-white text-purple-600 hover:bg-gray-100">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-sm placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-0">
              {filteredNotes.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No notes found</p>
                  <Button onClick={createNote} className="mt-4 bg-purple-500 hover:bg-purple-600">
                    Create your first note
                  </Button>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredNotes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => {
                        setSelectedNote(note);
                        setIsEditing(false);
                      }}
                      className={`w-full p-4 text-left rounded-lg transition-all duration-200 ${
                        selectedNote?.id === note.id
                          ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 shadow-md'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white truncate">
                        {note.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        {note.content || 'No content'}
                      </div>
                      <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(note.updated_at).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Note Editor */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-full flex flex-col shadow-lg">
            {selectedNote ? (
              <>
                <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white flex-1 focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
                        placeholder="Note title"
                      />
                    ) : (
                      <CardTitle className="text-gray-900 dark:text-white">{selectedNote.title}</CardTitle>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <VoiceNoteButton onVoiceText={handleVoiceText} />
                          <Button onClick={updateNote} size="sm" className="bg-green-500 hover:bg-green-600">
                            Save
                          </Button>
                          <Button 
                            onClick={() => {
                              setIsEditing(false);
                              setEditTitle(selectedNote.title);
                              setEditContent(selectedNote.content || '');
                            }}
                            variant="outline" 
                            size="sm"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <Button
                            onClick={() => document.getElementById('image-upload')?.click()}
                            variant="outline"
                            size="sm"
                            className="hover:bg-purple-50"
                          >
                            <Image className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => {
                              setIsEditing(true);
                              setEditTitle(selectedNote.title);
                              setEditContent(selectedNote.content || '');
                            }}
                            variant="outline" 
                            size="sm"
                            className="hover:bg-blue-50"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => deleteNote(selectedNote.id)}
                            variant="outline" 
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated: {new Date(selectedNote.updated_at).toLocaleDateString()}
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-0 relative">
                  {isEditing ? (
                    <div className="relative h-full">
                      <textarea
                        ref={textareaRef}
                        value={editContent}
                        onChange={handleContentChange}
                        placeholder="Start writing... Use / for commands or click the voice button to dictate"
                        className="w-full h-full p-6 bg-transparent border-none outline-none resize-none text-gray-900 dark:text-white focus:ring-0 font-mono"
                        style={{ minHeight: 'calc(100vh - 300px)' }}
                      />
                      
                      {/* Slash Command Menu */}
                      {showSlashMenu && (
                        <div 
                          className="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-64"
                          style={{ top: slashMenuPosition.top + 20, left: slashMenuPosition.left }}
                        >
                          {slashCommands.map((cmd, index) => (
                            <button
                              key={index}
                              onClick={() => insertSlashCommand(cmd.command)}
                              className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                            >
                              <cmd.icon className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{cmd.command}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{cmd.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 h-full overflow-y-auto">
                      <div className="prose dark:prose-invert max-w-none">
                        {renderContent(selectedNote.content || '')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Select a note to view or edit</p>
                  <Button onClick={createNote} className="bg-purple-500 hover:bg-purple-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Note
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
