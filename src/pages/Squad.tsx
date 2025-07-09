
// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Avatar } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import { Users, Plus, Crown, Trophy, Target, Zap, MessageCircle, UserPlus } from 'lucide-react';
// import { useAuth } from '@/hooks/useAuth';
// import { useUserData } from '@/hooks/useUserData';
// import { toast } from 'sonner';

// interface SquadMember {
//   id: string;
//   name: string;
//   level: number;
//   xp: number;
//   streak: number;
//   avatar?: string;
//   isLeader?: boolean;
// }

// interface Squad {
//   id: string;
//   name: string;
//   description: string;
//   members: SquadMember[];
//   isPublic: boolean;
//   category: string;
// }

// export default function Squad() {
//   const { user } = useAuth();
//   const { userStats, userProfile } = useUserData();
//   const [squads, setSquads] = useState<Squad[]>([]);
//   const [mySquads, setMySquads] = useState<Squad[]>([]);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [showJoinForm, setShowJoinForm] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [newSquad, setNewSquad] = useState({
//     name: '',
//     description: '',
//     category: 'general',
//     isPublic: true
//   });

//   useEffect(() => {
//     loadSquads();
//     loadMySquads();
//   }, []);

//   const loadSquads = () => {
//     // Mock data for public squads
//     const mockSquads: Squad[] = [
//       {
//         id: '1',
//         name: 'Morning Runners',
//         description: 'Early birds who love running at dawn',
//         category: 'fitness',
//         isPublic: true,
//         members: [
//           { id: '1', name: 'Sarah Chen', level: 12, xp: 12450, streak: 28, isLeader: true },
//           { id: '2', name: 'Mike Johnson', level: 9, xp: 8900, streak: 15 },
//           { id: '3', name: 'Emma Davis', level: 11, xp: 10200, streak: 22 }
//         ]
//       },
//       {
//         id: '2',
//         name: 'Code & Coffee',
//         description: 'Developers building habits together',
//         category: 'productivity',
//         isPublic: true,
//         members: [
//           { id: '4', name: 'Alex Rivera', level: 15, xp: 18900, streak: 42, isLeader: true },
//           { id: '5', name: 'Jordan Kim', level: 8, xp: 7600, streak: 12 },
//           { id: '6', name: 'Taylor Swift', level: 10, xp: 9800, streak: 19 }
//         ]
//       },
//       {
//         id: '3',
//         name: 'Mindfulness Masters',
//         description: 'Daily meditation and mindfulness practice',
//         category: 'wellness',
//         isPublic: true,
//         members: [
//           { id: '7', name: 'Zen Master', level: 20, xp: 25000, streak: 89, isLeader: true },
//           { id: '8', name: 'Peaceful Soul', level: 14, xp: 16800, streak: 35 }
//         ]
//       }
//     ];
//     setSquads(mockSquads);
//   };

//   const loadMySquads = () => {
//     // Mock data for user's squads
//     const mockMySquads: Squad[] = [
//       {
//         id: '4',
//         name: 'My Fitness Journey',
//         description: 'Personal accountability group',
//         category: 'fitness',
//         isPublic: false,
//         members: [
//           { 
//             id: user?.id || 'current', 
//             name: userProfile?.full_name || 'You', 
//             level: userStats?.level || 1, 
//             xp: userStats?.xp || 0, 
//             streak: userStats?.streak || 0, 
//             isLeader: true 
//           },
//           { id: '9', name: 'Workout Buddy', level: 7, xp: 6500, streak: 8 }
//         ]
//       }
//     ];
//     setMySquads(mockMySquads);
//   };

//   const createSquad = () => {
//     if (!newSquad.name.trim()) {
//       toast.error('Squad name is required');
//       return;
//     }

//     const squad: Squad = {
//       id: Date.now().toString(),
//       name: newSquad.name,
//       description: newSquad.description,
//       category: newSquad.category,
//       isPublic: newSquad.isPublic,
//       members: [{
//         id: user?.id || 'current',
//         name: userProfile?.full_name || 'You',
//         level: userStats?.level || 1,
//         xp: userStats?.xp || 0,
//         streak: userStats?.streak || 0,
//         isLeader: true
//       }]
//     };

//     setMySquads([...mySquads, squad]);
//     setNewSquad({ name: '', description: '', category: 'general', isPublic: true });
//     setShowCreateForm(false);
//     toast.success('Squad created successfully!');
//   };

//   const joinSquad = (squadId: string) => {
//     const squad = squads.find(s => s.id === squadId);
//     if (!squad) return;

//     const newMember: SquadMember = {
//       id: user?.id || 'current',
//       name: userProfile?.full_name || 'You',
//       level: userStats?.level || 1,
//       xp: userStats?.xp || 0,
//       streak: userStats?.streak || 0
//     };

//     const updatedSquad = {
//       ...squad,
//       members: [...squad.members, newMember]
//     };

//     setMySquads([...mySquads, updatedSquad]);
//     toast.success(`Joined ${squad.name}!`);
//   };

//   const filteredSquads = squads.filter(squad =>
//     squad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     squad.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getCategoryColor = (category: string) => {
//     switch (category) {
//       case 'fitness': return 'bg-green-100 text-green-800';
//       case 'productivity': return 'bg-blue-100 text-blue-800';
//       case 'wellness': return 'bg-purple-100 text-purple-800';
//       case 'learning': return 'bg-orange-100 text-orange-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Squad</h1>
//         <div className="flex space-x-2">
//           <Button
//             onClick={() => setShowCreateForm(!showCreateForm)}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Create Squad
//           </Button>
//           <Button
//             onClick={() => setShowJoinForm(!showJoinForm)}
//             variant="outline"
//           >
//             <UserPlus className="h-4 w-4 mr-2" />
//             Browse Squads
//           </Button>
//         </div>
//       </div>

//       {showCreateForm && (
//         <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//           <CardHeader>
//             <CardTitle className="text-gray-900 dark:text-white">Create New Squad</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <Input
//               placeholder="Squad name"
//               value={newSquad.name}
//               onChange={(e) => setNewSquad({ ...newSquad, name: e.target.value })}
//             />
//             <Input
//               placeholder="Description"
//               value={newSquad.description}
//               onChange={(e) => setNewSquad({ ...newSquad, description: e.target.value })}
//             />
//             <div className="flex space-x-4">
//               <select
//                 value={newSquad.category}
//                 onChange={(e) => setNewSquad({ ...newSquad, category: e.target.value })}
//                 className="p-2 border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//               >
//                 <option value="general">General</option>
//                 <option value="fitness">Fitness</option>
//                 <option value="productivity">Productivity</option>
//                 <option value="wellness">Wellness</option>
//                 <option value="learning">Learning</option>
//               </select>
//               <label className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={newSquad.isPublic}
//                   onChange={(e) => setNewSquad({ ...newSquad, isPublic: e.target.checked })}
//                 />
//                 <span className="text-gray-700 dark:text-gray-300">Public Squad</span>
//               </label>
//             </div>
//             <div className="flex space-x-2">
//               <Button onClick={createSquad} className="bg-green-600 hover:bg-green-700">
//                 Create Squad
//               </Button>
//               <Button onClick={() => setShowCreateForm(false)} variant="outline">
//                 Cancel
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {showJoinForm && (
//         <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//           <CardHeader>
//             <CardTitle className="text-gray-900 dark:text-white">Browse Public Squads</CardTitle>
//             <Input
//               placeholder="Search squads..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="mt-2"
//             />
//           </CardHeader>
//           <CardContent>
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {filteredSquads.map((squad) => (
//                 <Card key={squad.id} className="border border-gray-200 dark:border-gray-600">
//                   <CardContent className="p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="font-semibold text-gray-900 dark:text-white">{squad.name}</h3>
//                       <Badge className={getCategoryColor(squad.category)}>
//                         {squad.category}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{squad.description}</p>
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-1">
//                         <Users className="h-4 w-4 text-gray-500" />
//                         <span className="text-sm text-gray-500">{squad.members.length} members</span>
//                       </div>
//                       <Button
//                         size="sm"
//                         onClick={() => joinSquad(squad.id)}
//                         className="bg-blue-600 hover:bg-blue-700"
//                       >
//                         Join
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//             <div className="mt-4">
//               <Button onClick={() => setShowJoinForm(false)} variant="outline">
//                 Close
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* My Squads */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Squads</h2>
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {mySquads.map((squad) => (
//             <Card key={squad.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle className="text-gray-900 dark:text-white">{squad.name}</CardTitle>
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{squad.description}</p>
//                   </div>
//                   <Badge className={getCategoryColor(squad.category)}>
//                     {squad.category}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between text-sm">
//                     <span className="text-gray-600 dark:text-gray-300">Members</span>
//                     <span className="font-medium">{squad.members.length}</span>
//                   </div>
                  
//                   {/* Member List */}
//                   <div className="space-y-2">
//                     {squad.members.slice(0, 3).map((member) => (
//                       <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                         <div className="flex items-center space-x-2">
//                           <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                             <span className="text-white text-xs font-medium">
//                               {member.name[0]}
//                             </span>
//                           </div>
//                           <div>
//                             <div className="flex items-center space-x-1">
//                               <span className="text-sm font-medium text-gray-900 dark:text-white">
//                                 {member.name}
//                               </span>
//                               {member.isLeader && <Crown className="h-3 w-3 text-yellow-500" />}
//                             </div>
//                             <div className="flex items-center space-x-2 text-xs text-gray-500">
//                               <span>Lv.{member.level}</span>
//                               <span>🔥 {member.streak}</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {member.xp} XP
//                         </div>
//                       </div>
//                     ))}
//                     {squad.members.length > 3 && (
//                       <div className="text-xs text-gray-500 text-center">
//                         +{squad.members.length - 3} more members
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex space-x-2 pt-2">
//                     <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
//                       <MessageCircle className="h-3 w-3 mr-1" />
//                       Chat
//                     </Button>
//                     <Button size="sm" variant="outline" className="flex-1">
//                       <Trophy className="h-3 w-3 mr-1" />
//                       Leaderboard
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
//         <CardContent className="p-6">
//           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Squad Stats</h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <div className="text-center">
//               <div className="text-2xl font-bold text-blue-600">{mySquads.length}</div>
//               <div className="text-sm text-gray-600 dark:text-gray-300">Squads Joined</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-green-600">
//                 {mySquads.reduce((acc, squad) => acc + squad.members.length, 0)}
//               </div>
//               <div className="text-sm text-gray-600 dark:text-gray-300">Total Connections</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-purple-600">{userStats?.level || 1}</div>
//               <div className="text-sm text-gray-600 dark:text-gray-300">Your Level</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-orange-600">{userStats?.streak || 0}</div>
//               <div className="text-sm text-gray-600 dark:text-gray-300">Current Streak</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
