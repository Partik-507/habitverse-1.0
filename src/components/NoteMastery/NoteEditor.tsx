
// import React, { useState, useEffect, useRef } from 'react';
// import { Note } from '@/pages/NoteMastery';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { 
//   Bold, 
//   Italic, 
//   List, 
//   ListOrdered, 
//   Quote, 
//   Code, 
//   Mic,
//   Eye,
//   Edit,
//   Save,
//   Link
// } from 'lucide-react';
// import { toast } from 'sonner';

// interface NoteEditorProps {
//   note: Note;
//   notes: Note[];
//   onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
// }

// export function NoteEditor({ note, notes, onUpdateNote }: NoteEditorProps) {
//   const [title, setTitle] = useState(note.title);
//   const [content, setContent] = useState(note.content);
//   const [isPreviewMode, setIsPreviewMode] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showLinkSuggestions, setShowLinkSuggestions] = useState(false);
//   const [linkQuery, setLinkQuery] = useState('');
//   const [cursorPosition, setCursorPosition] = useState(0);
  
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const recognitionRef = useRef<any>(null);
//   const saveTimeoutRef = useRef<NodeJS.Timeout>();

//   useEffect(() => {
//     setTitle(note.title);
//     setContent(note.content);
//   }, [note]);

//   // Auto-save functionality
//   useEffect(() => {
//     if (saveTimeoutRef.current) {
//       clearTimeout(saveTimeoutRef.current);
//     }

//     saveTimeoutRef.current = setTimeout(() => {
//       if (title !== note.title || content !== note.content) {
//         onUpdateNote(note.id, { title, content });
//       }
//     }, 1000);

//     return () => {
//       if (saveTimeoutRef.current) {
//         clearTimeout(saveTimeoutRef.current);
//       }
//     };
//   }, [title, content, note.id, note.title, note.content, onUpdateNote]);

//   // Handle [[link]] detection
//   useEffect(() => {
//     const textarea = textareaRef.current;
//     if (!textarea) return;

//     const handleInput = () => {
//       const cursorPos = textarea.selectionStart;
//       const textBeforeCursor = content.substring(0, cursorPos);
//       const linkMatch = textBeforeCursor.match(/\[\[([^\]]*?)$/);
      
//       if (linkMatch) {
//         setLinkQuery(linkMatch[1]);
//         setShowLinkSuggestions(true);
//         setCursorPosition(cursorPos);
//       } else {
//         setShowLinkSuggestions(false);
//       }
//     };

//     textarea.addEventListener('input', handleInput);
//     return () => textarea.removeEventListener('input', handleInput);
//   }, [content]);

//   const insertText = (before: string, after: string = '') => {
//     const textarea = textareaRef.current;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = content.substring(start, end);
    
//     const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
//     setContent(newText);
    
//     // Focus and set cursor position
//     setTimeout(() => {
//       textarea.focus();
//       textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
//     }, 0);
//   };

//   const insertAtCursor = (text: string) => {
//     const textarea = textareaRef.current;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const newText = content.substring(0, start) + text + content.substring(start);
//     setContent(newText);
    
//     setTimeout(() => {
//       textarea.focus();
//       textarea.setSelectionRange(start + text.length, start + text.length);
//     }, 0);
//   };

//   const handleVoiceInput = () => {
//     if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
//       toast.error('Speech recognition not supported in this browser');
//       return;
//     }

//     if (isRecording) {
//       recognitionRef.current?.stop();
//       setIsRecording(false);
//       return;
//     }

//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
    
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'en-US';

//     recognition.onstart = () => {
//       setIsRecording(true);
//       toast.success('Listening... Speak now!');
//     };

//     recognition.onresult = (event: any) => {
//       let transcript = '';
//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         transcript += event.results[i][0].transcript;
//       }
      
//       if (event.results[event.resultIndex].isFinal) {
//         insertAtCursor(transcript + ' ');
//       }
//     };

//     recognition.onerror = () => {
//       toast.error('Error occurred during speech recognition');
//       setIsRecording(false);
//     };

//     recognition.onend = () => {
//       setIsRecording(false);
//     };

//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   const insertLink = (linkedNote: Note) => {
//     const linkText = `[[${linkedNote.title}]]`;
//     const beforeLink = content.substring(0, cursorPosition - linkQuery.length - 2);
//     const afterLink = content.substring(cursorPosition);
    
//     setContent(beforeLink + linkText + afterLink);
//     setShowLinkSuggestions(false);
    
//     // Update backlinks
//     const updatedBacklinks = [...(linkedNote.backlinks || [])];
//     if (!updatedBacklinks.includes(note.id)) {
//       updatedBacklinks.push(note.id);
//       onUpdateNote(linkedNote.id, { backlinks: updatedBacklinks });
//     }
//   };

//   const renderMarkdown = (text: string) => {
//     // Simple markdown rendering for preview
//     return text
//       .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
//       .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
//       .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2">$1</h3>')
//       .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
//       .replace(/\*(.*?)\*/gim, '<em>$1</em>')
//       .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
//       .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
//       .replace(/`(.*?)`/gim, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</code>')
//       .replace(/\[\[(.*?)\]\]/gim, '<span class="text-purple-600 dark:text-purple-400 underline cursor-pointer">$1</span>')
//       .replace(/\n/gim, '<br>');
//   };

//   const filteredNotes = notes.filter(n => 
//     n.id !== note.id && 
//     n.title.toLowerCase().includes(linkQuery.toLowerCase())
//   );

//   return (
//     <div className="h-full flex flex-col">
//       {/* Editor Header */}
//       <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
//         <Input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="text-lg font-semibold border-none shadow-none p-0 bg-transparent"
//           placeholder="Untitled Note"
//         />
        
//         <div className="flex items-center space-x-2">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={handleVoiceInput}
//             className={isRecording ? 'text-red-500' : ''}
//           >
//             <Mic className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setIsPreviewMode(!isPreviewMode)}
//           >
//             {isPreviewMode ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//           </Button>
//         </div>
//       </div>

//       {/* Toolbar */}
//       {!isPreviewMode && (
//         <div className="flex items-center space-x-1 p-2 border-b border-gray-200 dark:border-gray-700">
//           <Button variant="ghost" size="sm" onClick={() => insertText('**', '**')}>
//             <Bold className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="sm" onClick={() => insertText('*', '*')}>
//             <Italic className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="sm" onClick={() => insertText('- ', '')}>
//             <List className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="sm" onClick={() => insertText('1. ', '')}>
//             <ListOrdered className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="sm" onClick={() => insertText('> ', '')}>
//             <Quote className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="sm" onClick={() => insertText('`', '`')}>
//             <Code className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="sm" onClick={() => insertText('[[', ']]')}>
//             <Link className="h-4 w-4" />
//           </Button>
//         </div>
//       )}

//       {/* Editor/Preview */}
//       <div className="flex-1 relative">
//         {isPreviewMode ? (
//           <div 
//             className="h-full p-6 overflow-y-auto prose prose-sm max-w-none dark:prose-invert"
//             dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
//           />
//         ) : (
//           <div className="relative h-full">
//             <Textarea
//               ref={textareaRef}
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="Start writing your note..."
//               className="h-full resize-none border-none shadow-none p-6 text-base leading-relaxed"
//             />
            
//             {/* Link Suggestions */}
//             {showLinkSuggestions && filteredNotes.length > 0 && (
//               <div className="absolute top-8 left-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-w-xs">
//                 {filteredNotes.slice(0, 5).map(linkedNote => (
//                   <div
//                     key={linkedNote.id}
//                     className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
//                     onClick={() => insertLink(linkedNote)}
//                   >
//                     {linkedNote.title}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
//         {content.length} characters • {content.split(/\s+/).filter(word => word.length > 0).length} words
//       </div>
//     </div>
//   );
// }
