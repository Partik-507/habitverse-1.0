
// import React, { useState } from 'react';
// import { Note, Folder } from '@/pages/NoteMastery';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { 
//   FileText, 
//   Folder as FolderIcon, 
//   FolderOpen, 
//   Plus, 
//   Search,
//   MoreHorizontal,
//   Trash2,
//   Edit
// } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// interface VaultSidebarProps {
//   notes: Note[];
//   folders: Folder[];
//   selectedNote: Note | null;
//   onSelectNote: (note: Note) => void;
//   onCreateNote: (title: string, folderPath?: string) => void;
//   onCreateFolder: (name: string, parentPath?: string) => void;
//   onDeleteNote: (noteId: string) => void;
// }

// export function VaultSidebar({
//   notes,
//   folders,
//   selectedNote,
//   onSelectNote,
//   onCreateNote,
//   onCreateFolder,
//   onDeleteNote
// }: VaultSidebarProps) {
//   const [showNewNote, setShowNewNote] = useState(false);
//   const [showNewFolder, setShowNewFolder] = useState(false);
//   const [newNoteName, setNewNoteName] = useState('');
//   const [newFolderName, setNewFolderName] = useState('');
//   const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/']));

//   const handleCreateNote = () => {
//     if (newNoteName.trim()) {
//       onCreateNote(newNoteName);
//       setNewNoteName('');
//       setShowNewNote(false);
//     }
//   };

//   const handleCreateFolder = () => {
//     if (newFolderName.trim()) {
//       onCreateFolder(newFolderName);
//       setNewFolderName('');
//       setShowNewFolder(false);
//     }
//   };

//   const toggleFolder = (folderPath: string) => {
//     const newExpanded = new Set(expandedFolders);
//     if (newExpanded.has(folderPath)) {
//       newExpanded.delete(folderPath);
//     } else {
//       newExpanded.add(folderPath);
//     }
//     setExpandedFolders(newExpanded);
//   };

//   const organizeNotesByFolder = () => {
//     const organized: { [key: string]: Note[] } = {};
    
//     notes.forEach(note => {
//       const folderPath = note.folder_path || '/';
//       if (!organized[folderPath]) {
//         organized[folderPath] = [];
//       }
//       organized[folderPath].push(note);
//     });

//     return organized;
//   };

//   const renderFolderTree = (parentPath: string = '/', level: number = 0) => {
//     const organizedNotes = organizeNotesByFolder();
//     const currentFolders = folders.filter(folder => 
//       folder.path.startsWith(parentPath) && 
//       folder.path !== parentPath &&
//       folder.path.split('/').length === parentPath.split('/').length + (parentPath === '/' ? 1 : 2)
//     );

//     return (
//       <div>
//         {/* Render folders */}
//         {currentFolders.map(folder => {
//           const isExpanded = expandedFolders.has(folder.path);
//           return (
//             <div key={folder.id}>
//               <div 
//                 className="flex items-center justify-between py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer group"
//                 style={{ paddingLeft: `${8 + level * 16}px` }}
//                 onClick={() => toggleFolder(folder.path)}
//               >
//                 <div className="flex items-center space-x-2">
//                   {isExpanded ? (
//                     <FolderOpen className="h-4 w-4 text-blue-500" />
//                   ) : (
//                     <FolderIcon className="h-4 w-4 text-blue-500" />
//                   )}
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                     {folder.name}
//                   </span>
//                 </div>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">
//                       <MoreHorizontal className="h-3 w-3" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent>
//                     <DropdownMenuItem onClick={() => onCreateNote('Untitled Note', folder.path)}>
//                       <FileText className="h-4 w-4 mr-2" />
//                       New Note
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => onCreateFolder('New Folder', folder.path)}>
//                       <FolderIcon className="h-4 w-4 mr-2" />
//                       New Subfolder
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//               {isExpanded && renderFolderTree(folder.path, level + 1)}
//             </div>
//           );
//         })}

//         {/* Render notes in current folder */}
//         {organizedNotes[parentPath]?.map(note => (
//           <div
//             key={note.id}
//             className={`flex items-center justify-between py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer group ${
//               selectedNote?.id === note.id ? 'bg-purple-100 dark:bg-purple-900' : ''
//             }`}
//             style={{ paddingLeft: `${8 + level * 16}px` }}
//             onClick={() => onSelectNote(note)}
//           >
//             <div className="flex items-center space-x-2 flex-1 min-w-0">
//               <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
//               <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
//                 {note.title}
//               </span>
//             </div>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">
//                   <MoreHorizontal className="h-3 w-3" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 <DropdownMenuItem onClick={() => onDeleteNote(note.id)}>
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Delete
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="h-full flex flex-col p-4">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Vault</h2>
//         <div className="flex space-x-1">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setShowNewNote(true)}
//             title="New Note"
//           >
//             <Plus className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setShowNewFolder(true)}
//             title="New Folder"
//           >
//             <FolderIcon className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* New Note Input */}
//       {showNewNote && (
//         <div className="mb-3 space-y-2">
//           <Input
//             placeholder="Note name..."
//             value={newNoteName}
//             onChange={(e) => setNewNoteName(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') handleCreateNote();
//               if (e.key === 'Escape') setShowNewNote(false);
//             }}
//             className="text-sm"
//             autoFocus
//           />
//           <div className="flex space-x-2">
//             <Button size="sm" onClick={handleCreateNote}>Create</Button>
//             <Button size="sm" variant="outline" onClick={() => setShowNewNote(false)}>Cancel</Button>
//           </div>
//         </div>
//       )}

//       {/* New Folder Input */}
//       {showNewFolder && (
//         <div className="mb-3 space-y-2">
//           <Input
//             placeholder="Folder name..."
//             value={newFolderName}
//             onChange={(e) => setNewFolderName(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === 'Enter') handleCreateFolder();
//               if (e.key === 'Escape') setShowNewFolder(false);
//             }}
//             className="text-sm"
//             autoFocus
//           />
//           <div className="flex space-x-2">
//             <Button size="sm" onClick={handleCreateFolder}>Create</Button>
//             <Button size="sm" variant="outline" onClick={() => setShowNewFolder(false)}>Cancel</Button>
//           </div>
//         </div>
//       )}

//       {/* Notes Tree */}
//       <div className="flex-1 overflow-y-auto">
//         {renderFolderTree()}
//       </div>

//       {/* Stats */}
//       <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//         <div className="text-xs text-gray-500 dark:text-gray-400">
//           {notes.length} notes • {folders.length} folders
//         </div>
//       </div>
//     </div>
//   );
// }
