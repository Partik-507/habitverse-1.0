
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Brain from "./pages/Brain";
// import ImageGenerator from "./pages/ImageGenerator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/tasks" element={<Index />} />
                    <Route path="/habits" element={<Index />} />
                    <Route path="/journal" element={<Index />} />
                    <Route path="/calendar" element={<Index />} />
                    <Route path="/notes" element={<Index />} />
                    <Route path="/goals" element={<Index />} />
                    <Route path="/brain" element={<Index />} />
                    {/* <Route path="/note-mastery" element={<Index />} /> */}
                    {/* <Route path="/images" element={<Index />} /> */}
                    <Route path="/analytics" element={<Index />} />
                    <Route path="/ai-coach" element={<Index />} />
                    {/* <Route path="/squad" element={<Index />} /> */}
                    <Route path="/achievements" element={<Index />} />
                    <Route path="/settings" element={<Index />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
