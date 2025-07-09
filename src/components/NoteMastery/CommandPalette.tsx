
// import React, { useState, useEffect } from 'react';
// import { Note, Folder } from '@/pages/NoteMastery';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { 
//   FileText, 
//   FolderIcon, 
//   Search, 
//   Command,
//   Plus
// } from 'lucide-react';

// interface CommandPaletteProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onCreateNote: (title: string) => void;
//   onCreateFolder: (name: string) => void;
//   notes: Note[];
//   folders: Folder[];
//   onSelectNote: (note: Note) => void;
// }

// interface Command {
//   id: string;
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   action: () => void;
// }

// export function CommandPalette({
//   isOpen,
//   onClose,
//   onCreateNote,
//   onCreateFolder,
//   notes,
//   folders,
//   onSelectNote
// }: CommandPaletteProps) {
//   const [query, setQuery] = useState('');
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const baseCommands: Command[] = [
//     {
//       id: 'create-note',
//       title: 'Create New Note',
//       description: 'Create a new markdown note',
//       icon: <FileText className="h-4 w-4" />,
//       action: () => {
//         onCreateNote('Untitled Note');
//         onClose();
//       }
//     },
//     {
//       id: 'create-folder',
//       title: 'Create New Folder',
//       description: 'Create a new folder to organize notes',
//       icon: <FolderIcon className="h-4 w-4" />,
//       action: () => {
//         onCreateFolder('New Folder');
//         onClose();
//       }
//     }
//   ];

//   const noteCommands: Command[] = notes
//     .filter(note => note.title.toLowerCase().includes(query.toLowerCase()))
//     .slice(0, 10)
//     .map(note => ({
//       id: `note-${note.id}`,
//       title: note.title,
//       description: `Open note • ${note.content.length} characters`,
//       icon: <FileText className="h-4 w-4" />,
//       action: () => {
//         onSelectNote(note);
//         onClose();
//       }
//     }));

//   const allCommands = query.length > 0 
//     ? [...baseCommands.filter(cmd => cmd.title.toLowerCase().includes(query.toLowerCase())), ...noteCommands]
//     : [...baseCommands, ...noteCommands];

//   useEffect(() => {
//     setSelectedIndex(0);
//   }, [query, allCommands.length]);

//   useEffect(() => {
//     if (!isOpen) {
//       setQuery('');
//       setSelectedIndex(0);
//     }
//   }, [isOpen]);

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     switch (e.key) {
//       case 'ArrowDown':
//         e.preventDefault();
//         setSelectedIndex(prev => Math.min(prev + 1, allCommands.length - 1));
//         break;
//       case 'ArrowUp':
//         e.preventDefault();
//         setSelectedIndex(prev => Math.max(prev - 1, 0));
//         break;
//       case 'Enter':
//         e.preventDefault();
//         if (allCommands[selectedIndex]) {
//           allCommands[selectedIndex].action();
//         }
//         break;
//       case 'Escape':
//         onClose();
//         break;
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-2xl p-0">
//         <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4 py-3">
//           <Command className="h-4 w-4 text-gray-400 mr-3" />
//           <Input
//             placeholder="Type a command or search..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="border-none shadow-none p-0 text-base"
//             autoFocus
//           />
//         </div>

//         <div className="max-h-96 overflow-y-auto">
//           {allCommands.length > 0 ? (
//             <div className="p-2">
//               {allCommands.map((command, index) => (
//                 <div
//                   key={command.id}
//                   className={`flex items-center space-x-3 p-3 rounded cursor-pointer ${
//                     index === selectedIndex 
//                       ? 'bg-purple-100 dark:bg-purple-900' 
//                       : 'hover:bg-gray-100 dark:hover:bg-gray-700'
//                   }`}
//                   onClick={command.action}
//                 >
//                   <div className="text-gray-500">{command.icon}</div>
//                   <div className="flex-1">
//                     <div className="font-medium text-gray-900 dark:text-white">
//                       {command.title}
//                     </div>
//                     <div className="text-sm text-gray-500 dark:text-gray-400">
//                       {command.description}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="p-8 text-center text-gray-500 dark:text-gray-400">
//               No commands found
//             </div>
//           )}
//         </div>

//         <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
//           Use ↑↓ to navigate, Enter to select, Esc to close
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
