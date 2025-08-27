import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SoundToggle } from '@/components/SoundSystem';
import { ConnectWallet } from '@/components/ConnectWallet';
import { 
  Home, 
  TrendingUp, 
  Trophy, 
  Wallet,
  Menu,
  X,
  Target,
  Gift
} from 'lucide-react';
import { useSound } from '@/components/SoundSystem';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/dashboard', label: 'Dashboard', icon: TrendingUp },
  { path: '/markets', label: 'Markets', icon: Target },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/rewards', label: 'Rewards', icon: Gift },
  { path: '/wallet', label: 'Wallet', icon: Wallet },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { playSound } = useSound();

  const handleNavClick = (path: string) => {
    playSound('click');
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between p-4 bg-dark-card/90 backdrop-blur-sm border-b border-neon-cyan/20 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2" onClick={() => handleNavClick('/')}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold text-white hover:text-neon-cyan transition-colors duration-200"
              style={{
                background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              FlowBet
            </motion.div>
          </Link>

          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-neon-cyan/10 ${
                  location.pathname === item.path
                    ? 'text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30'
                    : 'text-muted-foreground hover:text-neon-cyan'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <SoundToggle />
          <ConnectWallet />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-dark-card/90 backdrop-blur-sm border-b border-neon-cyan/20 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2" onClick={() => handleNavClick('/')}>
            <div 
              className="text-xl font-bold"
              style={{
                background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              FlowBet
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <SoundToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="relative"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-neon-cyan/20"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30'
                      : 'text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              
              <div className="pt-3 border-t border-neon-cyan/20">
                <ConnectWallet />
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}