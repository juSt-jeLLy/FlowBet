import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Zap, 
  Trophy, 
  Users,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Link } from "react-router-dom";
import { useWeb3 } from "@/contexts/Web3Context";

const Home = () => {
  const { isConnected } = useWeb3();

  const features = [
    {
      title: "Predict Markets",
      description: "Bet on various market outcomes using PREDICT tokens",
      icon: Target,
      color: "neon-cyan",
    },
    {
      title: "Daily Rewards",
      description: "Earn daily rewards and maintain your streak",
      icon: Zap,
      color: "neon-pink",
    },
    {
      title: "Compete & Win",
      description: "Top predictors earn exclusive rewards",
      icon: Trophy,
      color: "neon-green",
    },
    {
      title: "Community Driven",
      description: "Join thousands of predictors worldwide",
      icon: Users,
      color: "neon-orange",
    },
  ];

  const stats = [
    { label: "Active Markets", value: "25+", icon: Target },
    { label: "Daily Players", value: "1.2K", icon: Users },
    { label: "Total Volume", value: "$500K", icon: TrendingUp },
    { label: "Success Rate", value: "89%", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-green opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.1)_0%,transparent_70%)]" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
              }}
            >
              Predict. Compete. Win.
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The Ultimate Prediction Market Platform on Flow Network
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {!isConnected ? (
                <ConnectWallet />
              ) : (
                <Link to="/dashboard">
                  <Button variant="hero" size="lg" className="min-w-[200px]">
                    Go to Dashboard
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
              <Link to="/markets">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  <Target className="w-5 h-5 mr-2" />
                  Explore Markets
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-dark-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="bg-dark-card hover:bg-dark-card/80 transition-colors border-neon-cyan/20 hover:border-neon-cyan/40">
                  <CardContent className="p-6">
                    <feature.icon className={`w-10 h-10 mb-4 text-${feature.color}`} />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="bg-dark-card border-neon-cyan/20">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="w-8 h-8 mx-auto mb-3 text-neon-cyan" />
                    <div className="text-2xl font-bold text-neon-cyan mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-matrix relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Ready to Start Predicting?
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join thousands of traders making smarter predictions on Flow Network
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {!isConnected ? (
                <ConnectWallet />
              ) : (
                <Link to="/markets">
                  <Button variant="hero" size="lg">
                    <Target className="w-5 h-5 mr-2" />
                    Start Trading Now
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
