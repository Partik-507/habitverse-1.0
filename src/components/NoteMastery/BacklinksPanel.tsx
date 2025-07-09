
// import React from 'react';
// import { Note } from '@/pages/NoteMastery';
// import { Button } from '@/components/ui/button';
// import { FileText, ArrowLeft, ArrowRight } from 'lucide-react';

// interface BacklinksPanelProps {
//   note: Note;
//   backlinkedNotes: Note[];
//   onSelectNote: (note: Note) => void;
// }

// export function BacklinksPanel({ note, backlinkedNotes, onSelectNote }: BacklinksPanelProps) {
//   const getLinkedNotes = () => {
//     // Extract [[links]] from note content
//     const linkMatches = note.content.match(/\[\[(.*?)\]\]/g) || [];
//     return linkMatches.map(match => match.replace(/\[\[|\]\]/g, ''));
//   };

//   const linkedTitles = getLinkedNotes();

//   return (
//     <div className="h-full flex flex-col p-4">
//       <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//         Connections
//       </h3>

//       {/* Outgoing Links */}
//       <div className="mb-6">
//         <div className="flex items-center space-x-2 mb-3">
//           <ArrowRight className="h-4 w-4 text-gray-500" />
//           <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             Links from this note
//           </h4>
//         </div>
//         {linkedTitles.length > 0 ? (
//           <div className="space-y-2">
//             {linkedTitles.map((title, index) => (
//               <div
//                 key={index}
//                 className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
//               >
                // <FileText className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm text-gray-700 dark:text-gray-300">
//                   {title}
//                 </span>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             No outgoing links
//           </p>
//         )}
//       </div>

//       {/* Incoming Links (Backlinks) */}
//       <div>
//         <div className="flex items-center space-x-2 mb-3">
//           <ArrowLeft className="h-4 w-4 text-gray-500" />
//           <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
//             Linked to this note
//           </h4>
//         </div>
//         {backlinkedNotes.length > 0 ? (
//           <div className="space-y-2">
//             {backlinkedNotes.map(backlinkedNote => (
//               <div
//                 key={backlinkedNote.id}
//                 className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
//                 onClick={() => onSelectNote(backlinkedNote)}
//               >
//                 <FileText className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm text-gray-700 dark:text-gray-300">
//                   {backlinkedNote.title}
//                 </span>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             No backlinks yet
//           </p>
//         )}
//       </div>

//       {/* Note Metadata */}
//       <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
//         <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
//           <div>Created: {new Date(note.created_at).toLocaleDateString()}</div>
//           <div>Modified: {new Date(note.updated_at).toLocaleDateString()}</div>
//           <div>Words: {note.content.split(/\s+/).filter(word => word.length > 0).length}</div>
//           <div>Characters: {note.content.length}</div>
//           {note.tags.length > 0 && (
//             <div className="flex flex-wrap gap-1 mt-2">
//               {note.tags.map(tag => (
//                 <span
//                   key={tag}
//                   className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded text-xs"
//                 >
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
