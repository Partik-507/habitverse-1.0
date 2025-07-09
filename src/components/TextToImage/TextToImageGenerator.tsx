
// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import { Image, Download, Share2, Sparkles, Wand2 } from 'lucide-react';
// import { toast } from 'sonner';

// export const TextToImageGenerator = () => {
//   const [prompt, setPrompt] = useState('');
//   const [style, setStyle] = useState('realistic');
//   const [loading, setLoading] = useState(false);
//   const [generatedImage, setGeneratedImage] = useState<string | null>(null);

//   const styles = [
//     { value: 'realistic', label: 'Realistic' },
//     { value: 'anime', label: 'Anime' },
//     { value: 'sketch', label: 'Sketch' },
//     { value: 'abstract', label: 'Abstract' },
//     { value: 'digital-art', label: 'Digital Art' },
//     { value: 'oil-painting', label: 'Oil Painting' }
//   ];

//   const handleGenerate = async () => {
//     if (!prompt.trim()) {
//       toast.error('Please enter a description');
//       return;
//     }

//     setLoading(true);
//     try {
//       // This would call your image generation API
//       // For demo purposes, we'll simulate the generation
//       await new Promise(resolve => setTimeout(resolve, 3000));
      
//       // Mock generated image - in real implementation, this would be the API response
//       setGeneratedImage(`https://picsum.photos/512/512?random=${Date.now()}`);
//       toast.success('Image generated successfully!');
//     } catch (error) {
//       toast.error('Failed to generate image');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!generatedImage) return;
    
//     const link = document.createElement('a');
//     link.href = generatedImage;
//     link.download = `habitverse-generated-${Date.now()}.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     toast.success('Image downloaded!');
//   };

//   const handleShare = async () => {
//     if (!generatedImage) return;
    
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: 'Generated Image',
//           text: `Check out this image I generated: "${prompt}"`,
//           url: generatedImage
//         });
//       } else {
//         await navigator.clipboard.writeText(generatedImage);
//         toast.success('Image URL copied to clipboard!');
//       }
//     } catch (error) {
//       toast.error('Failed to share image');
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <div className="mb-8">
//         <div className="flex items-center space-x-3 mb-4">
//           <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
//             <Wand2 className="h-6 w-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Image Generator</h1>
//             <p className="text-gray-600 dark:text-gray-400">Create stunning images from text descriptions</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Controls */}
//         <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <Sparkles className="h-5 w-5 text-pink-500" />
//               <span>Generation Settings</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="prompt">Describe your image</Label>
//               <Input
//                 id="prompt"
//                 placeholder="A futuristic city at sunset with flying cars..."
//                 value={prompt}
//                 onChange={(e) => setPrompt(e.target.value)}
//                 className="min-h-[100px]"
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && e.ctrlKey) {
//                     handleGenerate();
//                   }
//                 }}
//               />
//               <p className="text-xs text-gray-500">Press Ctrl+Enter to generate</p>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="style">Art Style</Label>
//               <Select value={style} onValueChange={setStyle}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Choose a style" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {styles.map((styleOption) => (
//                     <SelectItem key={styleOption.value} value={styleOption.value}>
//                       {styleOption.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <Button
//               onClick={handleGenerate}
//               disabled={loading || !prompt.trim()}
//               className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
//             >
//               {loading ? (
//                 <div className="flex items-center space-x-2">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   <span>Generating...</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-2">
//                   <Wand2 className="h-4 w-4" />
//                   <span>Generate Image</span>
//                 </div>
//               )}
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Generated Image */}
//         <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <Image className="h-5 w-5 text-orange-500" />
//               <span>Generated Image</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             {loading ? (
//               <div className="aspect-square bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/20 dark:to-orange-900/20 rounded-lg flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
//                   <p className="text-gray-600 dark:text-gray-300">Creating your masterpiece...</p>
//                 </div>
//               </div>
//             ) : generatedImage ? (
//               <div className="space-y-4">
//                 <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
//                   <img
//                     src={generatedImage}
//                     alt="Generated image"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="flex space-x-2">
//                   <Button
//                     onClick={handleDownload}
//                     variant="outline"
//                     className="flex-1"
//                   >
//                     <Download className="h-4 w-4 mr-2" />
//                     Download
//                   </Button>
//                   <Button
//                     onClick={handleShare}
//                     variant="outline"
//                     className="flex-1"
//                   >
//                     <Share2 className="h-4 w-4 mr-2" />
//                     Share
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
//                 <div className="text-center">
//                   <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
//                   <p className="text-gray-500 dark:text-gray-400">Your generated image will appear here</p>
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Sample Prompts */}
//       <Card className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//         <CardHeader>
//           <CardTitle>Sample Prompts</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {[
//               "A peaceful zen garden with cherry blossoms and a meditation pond",
//               "Futuristic space station orbiting a purple planet with multiple moons",
//               "Cozy library with floating books and magical golden light",
//               "Cyberpunk city street with neon signs reflecting on wet pavement",
//               "Serene mountain landscape at sunrise with misty valleys",
//               "Abstract geometric shapes in vibrant colors floating in space"
//             ].map((samplePrompt, index) => (
//               <Button
//                 key={index}
//                 variant="outline"
//                 className="text-left h-auto p-3 whitespace-normal"
//                 onClick={() => setPrompt(samplePrompt)}
//               >
//                 {samplePrompt}
//               </Button>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };
