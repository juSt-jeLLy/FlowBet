import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/contexts/Web3Context";
import { SoundProvider } from "@/components/SoundSystem";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Markets from "./pages/Markets";
import LeaderboardPage from "./pages/LeaderboardPage";
import Rewards from "./pages/Rewards";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Web3Provider>
      <SoundProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="relative min-h-screen bg-dark-bg">
              <ParticleBackground />
              <div className="relative z-10">
                <Navigation />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Index />} />
                  <Route path="/markets" element={<Markets />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/rewards" element={<Rewards />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </SoundProvider>
    </Web3Provider>
  </QueryClientProvider>
);

export default App;
