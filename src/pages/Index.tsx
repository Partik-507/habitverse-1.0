
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { useUserData } from "@/hooks/useUserData";
import { ModernSidebar } from "@/components/ModernSidebar";
import { ModernHeader } from "@/components/ModernHeader";
import { RealDashboard } from "@/components/RealDashboard";
import { RealTaskManager } from "@/components/RealTaskManager";
import { RealHabitTracker } from "@/components/RealHabitTracker";
import { RealJournal } from "@/components/RealJournal";
import { Analytics } from "@/components/Analytics";
import { ModernSettings } from "@/components/ModernSettings";
import { AICoachPanel } from "@/components/AICoach/AICoachPanel";
import { FloatingAIButton } from "@/components/AICoach/FloatingAIButton";
import { ChatBotModal } from "@/components/AIChat/ChatBotModal";
import { FloatingChatButton } from "@/components/AIChat/FloatingChatButton";
import Calendar from "./Calendar";
import Notes from "./Notes";
import Goals from "./Goals";
// import Squad from "./Squad";
import Achievements from "./Achievements";
import AICoach from "./AICoach";
import SecondBrain from "./SecondBrain";
// import ImageGenerator from "./ImageGenerator";
// import NoteMastery from "./NoteMastery";

const Index = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { userStats, userProfile } = useUserData();
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [isAICoachMinimized, setIsAICoachMinimized] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  // Create user object for components
  const sidebarUser = {
    name: userProfile?.full_name || 'Digital Pioneer',
    level: userStats?.level || 1,
    xp: userStats?.xp || 0,
    coins: userStats?.coins || 0,
    streak: userStats?.streak || 0
  };

  const renderContent = () => {
    switch (location.pathname) {
      case '/':
        return <RealDashboard />;
      case '/tasks':
        return <RealTaskManager />;
      case '/habits':
        return <RealHabitTracker />;
      case '/journal':
        return <RealJournal />;
      case '/calendar':
        return <Calendar />;
      case '/notes':
        return <Notes />;
      case '/goals':
        return <Goals />;
      case '/brain':
        return <SecondBrain />;
      case '/note-mastery':
        return <NoteMastery />;
      // case '/images':
      //   return <ImageGenerator />;
      case '/analytics':
        return <Analytics />;
      case '/ai-coach':
        return <AICoach />;
      // case '/squad':
      //   return <Squad />;
      case '/achievements':
        return <Achievements />;
      case '/settings':
        return <ModernSettings />;
      default:
        return <RealDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex">
      <ModernSidebar user={sidebarUser} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <ModernHeader user={sidebarUser} />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {/* AI Coach System (existing) */}
      {!isAICoachOpen && location.pathname !== '/ai-coach' && (
        <FloatingAIButton onClick={() => setIsAICoachOpen(true)} />
      )}
      
      <AICoachPanel
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
        onMinimize={() => setIsAICoachMinimized(!isAICoachMinimized)}
        isMinimized={isAICoachMinimized}
      />

      {/* New ChatBot System */}
      <FloatingChatButton 
        onClick={() => setIsChatBotOpen(true)} 
        isActive={isChatBotOpen}
      />
      
      <ChatBotModal
        isOpen={isChatBotOpen}
        onClose={() => setIsChatBotOpen(false)}
      />
    </div>
  );
};

export default Index;
