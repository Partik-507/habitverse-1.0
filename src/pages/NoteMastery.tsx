
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '@/components/AuthProvider';
// import { supabase } from '@/integrations/supabase/client';
// import { VaultSidebar } from '@/components/NoteMastery/VaultSidebar';
// import { NoteEditor } from '@/components/NoteMastery/NoteEditor';
// import { GraphView } from '@/components/NoteMastery/GraphView';
// import { CommandPalette } from '@/components/NoteMastery/CommandPalette';
// import { SearchBar } from '@/components/NoteMastery/SearchBar';
// import { BacklinksPanel } from '@/components/NoteMastery/BacklinksPanel';
// import { Brain, Search, Command, Share2 } from 'lucide-react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';

// export interface Note {
//   id: string;
//   title: string;
//   content: string;
//   folder_path: string;
//   tags: string[];
//   backlinks: string[];
//   created_at: string;
//   updated_at: string;
//   user_id: string;
// }

// export interface Folder {
//   id: string;
//   name: string;
//   path: string;
//   parent_id: string | null;
//   user_id: string;
// }

// export default function NoteMastery() {
//   const { user } = useAuth();
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [folders, setFolders] = useState<Folder[]>([]);
//   const [selectedNote, setSelectedNote] = useState<Note | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showCommandPalette, setShowCommandPalette] = useState(false);
//   const [showGraphView, setShowGraphView] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showBacklinks, setShowBacklinks] = useState(true);

//   useEffect(() => {
//     if (user) {
//       fetchNotesAndFolders();
//     }
//   }, [user]);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
//         e.preventDefault();
//         setShowCommandPalette(true);
//       }
//       if (e.key === 'Escape') {
//         setShowCommandPalette(false);
//         setShowGraphView(false);
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, []);

//   const fetchNotesAndFolders = async () => {
//     if (!user) return;

//     try {
//       setLoading(true);

//       // Fetch notes with proper typing
//       const { data: notesData, error: notesError } = await supabase
//         .from('notes')
//         .select('*')
//         .eq('user_id', user.id)
//         .order('updated_at', { ascending: false });

//       if (notesError) throw notesError;

//       // Fetch folders with proper typing
//       const { data: foldersData, error: foldersError } = await supabase
//         .from('note_folders')
//         .select('*')
//         .eq('user_id', user.id)
//         .order('path');

//       if (foldersError) throw foldersError;

//       // Map the data with proper type handling
//       const typedNotes: Note[] = (notesData || []).map((note) => ({
//         id: note.id,
//         title: note.title,
//         content: note.content || '',
//         folder_path: note.folder_path || '/',
//         tags: note.tags || [],
//         backlinks: note.backlinks || [],
//         created_at: note.created_at || '',
//         updated_at: note.updated_at || '',
//         user_id: note.user_id
//       }));

//       const typedFolders: Folder[] = (foldersData || []).map((folder) => ({
//         id: folder.id,
//         name: folder.name,
//         path: folder.path,
//         parent_id: folder.parent_id,
//         user_id: folder.user_id
//       }));

//       setNotes(typedNotes);
//       setFolders(typedFolders);
//     } catch (error) {
//       console.error('Error fetching notes and folders:', error);
//       toast.error('Failed to load notes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const createNote = async (title: string, folderPath: string = '/') => {
//     if (!user) return;

//     try {
//       const { data, error } = await supabase
//         .from('notes')
//         .insert({
//           title,
//           content: '',
//           folder_path: folderPath,
//           tags: [],
//           backlinks: [],
//           user_id: user.id
//         })
//         .select()
//         .single();

//       if (error) throw error;

//       const newNote: Note = {
//         id: data.id,
//         title: data.title,
//         content: data.content || '',
//         folder_path: data.folder_path || '/',
//         tags: data.tags || [],
//         backlinks: data.backlinks || [],
//         created_at: data.created_at || '',
//         updated_at: data.updated_at || '',
//         user_id: data.user_id
//       };

//       setNotes(prev => [newNote, ...prev]);
//       setSelectedNote(newNote);
//       toast.success('Note created successfully');
//     } catch (error) {
//       console.error('Error creating note:', error);
//       toast.error('Failed to create note');
//     }
//   };

//   const updateNote = async (noteId: string, updates: Partial<Note>) => {
//     if (!user) return;

//     try {
//       const dbUpdates: any = {};
//       if (updates.title !== undefined) dbUpdates.title = updates.title;
//       if (updates.content !== undefined) dbUpdates.content = updates.content;
//       if (updates.folder_path !== undefined) dbUpdates.folder_path = updates.folder_path;
//       if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
//       if (updates.backlinks !== undefined) dbUpdates.backlinks = updates.backlinks;

//       const { error } = await supabase
//         .from('notes')
//         .update(dbUpdates)
//         .eq('id', noteId);

//       if (error) throw error;

//       setNotes(prev => prev.map(note => 
//         note.id === noteId ? { ...note, ...updates } : note
//       ));

//       if (selectedNote?.id === noteId) {
//         setSelectedNote(prev => prev ? { ...prev, ...updates } : null);
//       }
//     } catch (error) {
//       console.error('Error updating note:', error);
//       toast.error('Failed to update note');
//     }
//   };

//   const deleteNote = async (noteId: string) => {
//     if (!user || !confirm('Are you sure you want to delete this note?')) return;

//     try {
//       const { error } = await supabase
//         .from('notes')
//         .delete()
//         .eq('id', noteId);

//       if (error) throw error;

//       setNotes(prev => prev.filter(note => note.id !== noteId));
//       if (selectedNote?.id === noteId) {
//         setSelectedNote(null);
//       }
//       toast.success('Note deleted successfully');
//     } catch (error) {
//       console.error('Error deleting note:', error);
//       toast.error('Failed to delete note');
//     }
//   };

//   const createFolder = async (name: string, parentPath: string = '/') => {
//     if (!user) return;

//     try {
//       const fullPath = parentPath === '/' ? `/${name}` : `${parentPath}/${name}`;
      
//       const { data, error } = await supabase
//         .from('note_folders')
//         .insert({
//           name,
//           path: fullPath,
//           parent_id: null, // We'll use path-based organization for simplicity
//           user_id: user.id
//         })
//         .select()
//         .single();

//       if (error) throw error;

//       const newFolder: Folder = {
//         id: data.id,
//         name: data.name,
//         path: data.path,
//         parent_id: data.parent_id,
//         user_id: data.user_id
//       };

//       setFolders(prev => [...prev, newFolder]);
//       toast.success('Folder created successfully');
//     } catch (error) {
//       console.error('Error creating folder:', error);
//       toast.error('Failed to create folder');
//     }
//   };

//   const filteredNotes = notes.filter(note => {
//     if (!searchQuery) return true;
//     const query = searchQuery.toLowerCase();
//     return (
//       note.title.toLowerCase().includes(query) ||
//       note.content.toLowerCase().includes(query) ||
//       note.tags.some(tag => tag.toLowerCase().includes(query))
//     );
//   });

//   const getBacklinkedNotes = (noteId: string) => {
//     return notes.filter(note => note.backlinks.includes(noteId));
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
//             <Brain className="h-5 w-5 text-white" />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900 dark:text-white">Note Mastery</h1>
//             <p className="text-sm text-gray-600 dark:text-gray-400">Your second brain</p>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <SearchBar 
//             value={searchQuery}
//             onChange={setSearchQuery}
//             placeholder="Search notes..."
//           />
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setShowGraphView(true)}
//           >
//             <Share2 className="h-4 w-4 mr-2" />
//             Graph
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setShowCommandPalette(true)}
//           >
//             <Command className="h-4 w-4 mr-2" />
//             Commands
//           </Button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Left Sidebar - Vault */}
//         <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//           <VaultSidebar
//             notes={filteredNotes}
//             folders={folders}
//             selectedNote={selectedNote}
//             onSelectNote={setSelectedNote}
//             onCreateNote={createNote}
//             onCreateFolder={createFolder}
//             onDeleteNote={deleteNote}
//           />
//         </div>

//         {/* Center - Editor */}
//         <div className="flex-1 flex flex-col">
//           {selectedNote ? (
//             <NoteEditor
//               note={selectedNote}
//               notes={notes}
//               onUpdateNote={updateNote}
//             />
//           ) : (
//             <div className="flex-1 flex items-center justify-center">
//               <div className="text-center">
//                 <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                   Select a note to start writing
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400 mb-6">
//                   Choose a note from the sidebar or create a new one
//                 </p>
//                 <Button
//                   onClick={() => createNote('Untitled Note')}
//                   className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
//                 >
//                   Create New Note
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Sidebar - Backlinks */}
//         {showBacklinks && selectedNote && (
//           <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
//             <BacklinksPanel
//               note={selectedNote}
//               backlinkedNotes={getBacklinkedNotes(selectedNote.id)}
//               onSelectNote={setSelectedNote}
//             />
//           </div>
//         )}
//       </div>

//       {/* Command Palette */}
//       {showCommandPalette && (
//         <CommandPalette
//           isOpen={showCommandPalette}
//           onClose={() => setShowCommandPalette(false)}
//           onCreateNote={createNote}
//           onCreateFolder={createFolder}
//           notes={notes}
//           folders={folders}
//           onSelectNote={setSelectedNote}
//         />
//       )}

//       {/* Graph View */}
//       {showGraphView && (
//         <GraphView
//           isOpen={showGraphView}
//           onClose={() => setShowGraphView(false)}
//           notes={notes}
//           onSelectNote={setSelectedNote}
//         />
//       )}
//     </div>
//   );
// }
