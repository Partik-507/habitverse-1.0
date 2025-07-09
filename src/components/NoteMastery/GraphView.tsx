
// import React, { useEffect, useRef, useState } from 'react';
// import { Note } from '@/pages/NoteMastery';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// interface GraphViewProps {
//   isOpen: boolean;
//   onClose: () => void;
//   notes: Note[];
//   onSelectNote: (note: Note) => void;
// }

// interface Node {
//   id: string;
//   title: string;
//   x: number;
//   y: number;
//   connections: string[];
// }

// export function GraphView({ isOpen, onClose, notes, onSelectNote }: GraphViewProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [nodes, setNodes] = useState<Node[]>([]);
//   const [selectedNode, setSelectedNode] = useState<string | null>(null);
//   const [zoom, setZoom] = useState(1);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

//   useEffect(() => {
//     if (!isOpen) return;

//     // Create nodes from notes
//     const newNodes: Node[] = notes.map((note, index) => {
//       const angle = (index / notes.length) * 2 * Math.PI;
//       const radius = Math.min(200, 50 + notes.length * 5);
      
//       return {
//         id: note.id,
//         title: note.title,
//         x: 400 + Math.cos(angle) * radius,
//         y: 300 + Math.sin(angle) * radius,
//         connections: extractConnections(note.content, notes)
//       };
//     });

//     setNodes(newNodes);
//   }, [isOpen, notes]);

//   const extractConnections = (content: string, allNotes: Note[]): string[] => {
//     const linkMatches = content.match(/\[\[(.*?)\]\]/g) || [];
//     const linkedTitles = linkMatches.map(match => match.replace(/\[\[|\]\]/g, ''));
    
//     return allNotes
//       .filter(note => linkedTitles.includes(note.title))
//       .map(note => note.id);
//   };

//   const drawGraph = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     // Apply transform
//     ctx.save();
//     ctx.translate(offset.x, offset.y);
//     ctx.scale(zoom, zoom);

//     // Draw connections
//     ctx.strokeStyle = '#e5e7eb';
//     ctx.lineWidth = 2;
    
//     nodes.forEach(node => {
//       node.connections.forEach(connectedId => {
//         const connectedNode = nodes.find(n => n.id === connectedId);
//         if (connectedNode) {
//           ctx.beginPath();
//           ctx.moveTo(node.x, node.y);
//           ctx.lineTo(connectedNode.x, connectedNode.y);
//           ctx.stroke();
//         }
//       });
//     });

//     // Draw nodes
//     nodes.forEach(node => {
//       const isSelected = selectedNode === node.id;
//       const isConnected = selectedNode && (
//         node.id === selectedNode ||
//         node.connections.includes(selectedNode) ||
//         nodes.find(n => n.id === selectedNode)?.connections.includes(node.id)
//       );

//       // Draw node circle
//       ctx.beginPath();
//       ctx.arc(node.x, node.y, isSelected ? 12 : 8, 0, 2 * Math.PI);
      
//       if (isSelected) {
//         ctx.fillStyle = '#8b5cf6';
//       } else if (isConnected) {
//         ctx.fillStyle = '#a78bfa';
//       } else {
//         ctx.fillStyle = '#6b7280';
//       }
      
//       ctx.fill();
      
//       // Draw node border
//       ctx.strokeStyle = '#ffffff';
//       ctx.lineWidth = 2;
//       ctx.stroke();

//       // Draw title
//       ctx.fillStyle = '#374151';
//       ctx.font = isSelected ? 'bold 12px Inter' : '11px Inter';
//       ctx.textAlign = 'center';
      
//       const maxWidth = 100;
//       const title = node.title.length > 15 ? node.title.substring(0, 15) + '...' : node.title;
//       ctx.fillText(title, node.x, node.y + 25);
//     });

//     ctx.restore();
//   };

//   useEffect(() => {
//     drawGraph();
//   }, [nodes, selectedNode, zoom, offset]);

//   const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = (e.clientX - rect.left - offset.x) / zoom;
//     const y = (e.clientY - rect.top - offset.y) / zoom;

//     // Find clicked node
//     const clickedNode = nodes.find(node => {
//       const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
//       return distance <= 12;
//     });

//     if (clickedNode) {
//       if (selectedNode === clickedNode.id) {
//         // Double click - open note
//         const note = notes.find(n => n.id === clickedNode.id);
//         if (note) {
//           onSelectNote(note);
//           onClose();
//         }
//       } else {
//         setSelectedNode(clickedNode.id);
//       }
//     } else {
//       setSelectedNode(null);
//     }
//   };

//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     setIsDragging(true);
//     setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (isDragging) {
//       setOffset({
//         x: e.clientX - dragStart.x,
//         y: e.clientY - dragStart.y
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   const resetView = () => {
//     setZoom(1);
//     setOffset({ x: 0, y: 0 });
//     setSelectedNode(null);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-4xl h-[80vh] p-0">
//         <DialogHeader className="p-4 border-b">
//           <div className="flex items-center justify-between">
//             <DialogTitle>Knowledge Graph</DialogTitle>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))}
//               >
//                 <ZoomIn className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.2))}
//               >
//                 <ZoomOut className="h-4 w-4" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={resetView}
//               >
//                 <RotateCcw className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </DialogHeader>

//         <div className="flex-1 relative">
//           <canvas
//             ref={canvasRef}
//             width={800}
//             height={600}
//             className="w-full h-full cursor-grab active:cursor-grabbing"
//             onClick={handleCanvasClick}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={handleMouseUp}
//           />
          
//           <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-2 rounded shadow text-xs">
//             <div>Zoom: {Math.round(zoom * 100)}%</div>
//             <div>Nodes: {nodes.length}</div>
//             {selectedNode && (
//               <div className="mt-2 text-purple-600 dark:text-purple-400">
//                 Selected: {nodes.find(n => n.id === selectedNode)?.title}
//               </div>
//             )}
//           </div>

//           <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded shadow text-xs">
//             <div>Click to select • Double-click to open</div>
//             <div>Drag to pan • Scroll to zoom</div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
