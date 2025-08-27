import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  Brain, 
  Trophy, 
  Flame, 
  Star,
  Zap,
  Crown,
  Medal,
  Target,
  Calendar,
  Clock,
  CheckCircle,
  Lock
} from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { useSound } from "@/components/SoundSystem";
import type { UserStats } from "@/hooks/useContract";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
  progress: number;
  maxProgress: number;
  earned: boolean;
  reward: number;
}

export function Rewards() {
  const { isConnected, account } = useWeb3();
  const { getUserStats, canClaimDaily, claimDaily, answerQuiz, loading } = useContract();
  const { playSound } = useSound();
  
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState("");

  useEffect(() => {
    if (isConnected && account) {
      loadUserData();
    }
  }, [isConnected, account]);

  const loadUserData = async () => {
    const [stats, claimStatus] = await Promise.all([
      getUserStats(),
      canClaimDaily()
    ]);
    
    setUserStats(stats);
    setCanClaim(claimStatus);
  };

  const handleClaimDaily = async () => {
    playSound('claim');
    await claimDaily();
    await loadUserData();
  };

  const getStreakMultiplier = (streak: number): number => {
    if (streak < 7) return 1.0;
    if (streak < 14) return 1.1;
    if (streak < 30) return 1.25;
    return 1.5;
  };

  const getNextMilestone = (streak: number): { days: number; multiplier: number } => {
    if (streak < 7) return { days: 7, multiplier: 1.1 };
    if (streak < 14) return { days: 14, multiplier: 1.25 };
    if (streak < 30) return { days: 30, multiplier: 1.5 };
    return { days: streak + 7, multiplier: 1.5 }; // Beyond 30 days
  };

  const achievements: Achievement[] = [
    {
      id: 'first_bet',
      title: 'First Blood',
      description: 'Place your first prediction bet',
      icon: Target,
      rarity: 'common',
      requirement: 'Place 1 bet',
      progress: 1, // This should come from actual user data
      maxProgress: 1,
      earned: true,
      reward: 50
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: 'Maintain a 7-day login streak',
      icon: Flame,
      rarity: 'rare',
      requirement: '7 day streak',
      progress: userStats?.streak || 0,
      maxProgress: 7,
      earned: (userStats?.streak || 0) >= 7,
      reward: 200
    },
    {
      id: 'market_master',
      title: 'Market Master',
      description: 'Win 5 prediction markets',
      icon: Crown,
      rarity: 'epic',
      requirement: 'Win 5 markets',
      progress: 2, // This should come from win tracking
      maxProgress: 5,
      earned: false,
      reward: 500
    },
    {
      id: 'legend_status',
      title: 'Legend Status',
      description: 'Maintain a 30-day login streak',
      icon: Star,
      rarity: 'legendary',
      requirement: '30 day streak',
      progress: userStats?.streak || 0,
      maxProgress: 30,
      earned: (userStats?.streak || 0) >= 30,
      reward: 1000
    },
    {
      id: 'quiz_master',
      title: 'Quiz Master',
      description: 'Answer 10 brain teasers correctly',
      icon: Brain,
      rarity: 'rare',
      requirement: 'Answer 10 quizzes',
      progress: 3, // This should come from quiz tracking
      maxProgress: 10,
      earned: false,
      reward: 300
    },
    {
      id: 'high_roller',
      title: 'High Roller',
      description: 'Place a bet worth 100+ PREDICT',
      icon: Trophy,
      rarity: 'epic',
      requirement: 'Bet 100+ PREDICT',
      progress: 0,
      maxProgress: 1,
      earned: false,
      reward: 750
    }
  ];

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
      case 'rare': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'epic': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'legendary': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    }
  };

  const getRarityEmoji = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return '🔹';
      case 'rare': return '💎';
      case 'epic': return '🌟';
      case 'legendary': return '👑';
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto p-4">
        <Card className="neon-border bg-dark-card">
          <CardContent className="p-8 text-center">
            <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Connect your wallet to view rewards and achievements
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextMilestone = getNextMilestone(userStats?.streak || 0);
  const dailyReward = 100 * getStreakMultiplier(userStats?.streak || 0);

  return (
      <div className="min-h-screen matrix-bg relative overflow-hidden">
        {/* Floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-4 h-4 bg-neon-green rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-neon-pink rounded-full float opacity-40"></div>
          <div className="absolute bottom-40 left-20 w-5 h-5 bg-neon-cyan rounded-full animate-pulse opacity-50"></div>
          <div className="absolute bottom-20 right-10 w-3 h-3 bg-neon-orange rounded-full bounce-glow opacity-60"></div>
        </div>

        <div className="container mx-auto p-4 space-y-8 relative z-10">
          {/* EPIC Header */}
          <div className="text-center space-y-4">
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-black text-rainbow text-glow mb-4 animate-cyber-shake">
                💎 REWARDS
              </h1>
              <div className="text-2xl md:text-3xl font-bold text-neon-pink text-flash">
                ZONE 🚀
              </div>
            </div>
            <p className="text-xl text-neon-cyan text-glow max-w-2xl mx-auto">
              EARN 🔥 FLEX 💎 DOMINATE 👑
            </p>
          </div>

          {/* DAILY REWARDS - SICK CARD */}
          <Card className="spin-border neon-border-green bg-dark-card/95 backdrop-blur-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-matrix opacity-10"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Calendar className="w-8 h-8 text-neon-green animate-pulse" />
                <span className="text-neon-green text-glow">DAILY BAG 💰</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-8">
                {/* STREAK COUNTER - FIRE MODE */}
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-neon-orange/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-dark-card border-2 border-neon-orange rounded-full p-8 pulse-glow">
                      <Flame className="w-16 h-16 text-neon-orange mx-auto mb-4 animate-bounce" />
                      <div className="text-6xl font-black text-neon-orange text-glow animate-cyber-shake">
                        {userStats?.streak || 0}
                      </div>
                      <div className="text-xl font-bold text-neon-yellow mt-2">STREAK FIRE 🔥</div>
                    </div>
                  </div>
              
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-neon-cyan">NEXT LEVEL:</span>
                      <span className="text-neon-pink">{nextMilestone.days} DAYS</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neon-yellow">MULTIPLIER:</span>
                      <span className="text-neon-orange">{nextMilestone.multiplier}x BOOST</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={((userStats?.streak || 0) / nextMilestone.days) * 100} 
                        className="h-4 bg-dark-bg border-2 border-neon-cyan/30"
                      />
                      <div className="absolute inset-0 bg-gradient-cyber opacity-60 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* CLAIM ZONE - MASSIVE BUTTON */}
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-neon-cyan/20 rounded-xl blur-xl animate-pulse"></div>
                    <div className="relative bg-dark-card border-2 border-neon-cyan rounded-xl p-6 pulse-glow">
                      <div className="text-4xl font-black text-neon-cyan text-glow mb-2">
                        {dailyReward.toFixed(0)}
                      </div>
                      <div className="text-xl font-bold text-neon-green mb-1">PREDICT TOKENS 💎</div>
                      <div className="text-sm text-neon-yellow">
                        BASE: 100 × {getStreakMultiplier(userStats?.streak || 0)}x MULTIPLIER
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleClaimDaily}
                    disabled={!canClaim || loading}
                    variant={canClaim ? "fire" : "cyber"}
                    size="lg"
                    className="w-full text-xl py-6 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-fire opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    {loading ? (
                      <>
                        <Zap className="w-6 h-6 mr-3 animate-spin" />
                        CLAIMING BAG...
                      </>
                    ) : canClaim ? (
                      <>
                        <Gift className="w-6 h-6 mr-3 animate-bounce" />
                        CLAIM DAILY BAG! 🚀
                      </>
                    ) : (
                      <>
                        <Clock className="w-6 h-6 mr-3 animate-pulse" />
                        COMEBACK TOMORROW 😤
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BRAIN TEASER - PURPLE CHAOS */}
          <Card className="neon-border-pink bg-dark-card/95 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-fire opacity-5 animate-pulse"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Brain className="w-8 h-8 text-neon-purple animate-bounce" />
                <span className="text-neon-purple text-glow">BRAIN MELTER 🧠</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-purple/10 rounded-xl blur-md"></div>
                <div className="relative p-6 bg-dark-card/80 border-2 border-neon-purple/60 rounded-xl spin-border">
                  <h3 className="text-xl font-bold text-neon-pink mb-4 text-flash">🔥 TODAY'S CHALLENGE:</h3>
                  <p className="text-lg text-foreground mb-6 leading-relaxed">
                    "What cryptocurrency was the first to implement smart contracts on a blockchain?"
                  </p>
                  <div className="space-y-4">
                    <Input
                      placeholder="DROP YOUR ANSWER... 🎯"
                      value={quizAnswer}
                      onChange={(e) => setQuizAnswer(e.target.value)}
                      className="text-lg py-3 bg-dark-bg border-2 border-neon-cyan/40 text-neon-cyan placeholder:text-neon-cyan/60 focus:border-neon-cyan focus:shadow-glow-cyan"
                    />
                    <Button 
                      variant="matrix" 
                      disabled={!quizAnswer.trim() || loading}
                      onClick={async () => {
                        playSound('click');
                        await answerQuiz(0, quizAnswer.trim());
                        setQuizAnswer("");
                        await loadUserData();
                      }}
                      className="w-full text-xl py-4"
                    >
                      {loading ? (
                        <>
                          <Brain className="w-6 h-6 mr-3 animate-spin" />
                          PROCESSING...
                        </>
                      ) : (
                        <>
                          <Zap className="w-6 h-6 mr-3" />
                          SUBMIT ANSWER! ⚡
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="text-center mt-4 p-3 bg-neon-purple/10 rounded-lg border border-neon-purple/30">
                    <div className="text-lg font-bold text-neon-yellow">
                      💎 REWARD: 150 PREDICT TOKENS
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

      {/* Achievements */}
      <Card className="neon-border bg-dark-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`transition-all duration-300 ${
                  achievement.earned 
                    ? `border ${getRarityColor(achievement.rarity)} shadow-glow-cyan` 
                    : 'bg-dark-bg border-dark-border opacity-60'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        achievement.earned ? getRarityColor(achievement.rarity) : 'bg-muted text-muted-foreground'
                      }`}>
                        {achievement.earned ? (
                          <achievement.icon className="w-8 h-8" />
                        ) : (
                          <Lock className="w-8 h-8" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{achievement.title}</h3>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {getRarityEmoji(achievement.rarity)} {achievement.rarity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        
                        {!achievement.earned && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{achievement.requirement}</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.maxProgress) * 100} 
                              className="h-1"
                            />
                          </div>
                        )}
                        
                        {achievement.earned && (
                          <div className="flex items-center gap-2 text-sm text-neon-green">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </div>
                        )}
                      </div>

                      {/* Reward */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-neon-cyan">
                          +{achievement.reward}
                        </div>
                        <div className="text-xs text-muted-foreground">PREDICT</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <Card className="neon-border bg-dark-card">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-dark-bg rounded-lg">
              <div className="text-2xl font-bold text-neon-cyan">
                {userStats?.totalEarnings ? parseFloat(userStats.totalEarnings).toFixed(0) : '0'}
              </div>
              <div className="text-xs text-muted-foreground">Total Earned</div>
            </div>
            
            <div className="text-center p-3 bg-dark-bg rounded-lg">
              <div className="text-2xl font-bold text-neon-green">
                {userStats?.totalClaims || 0}
              </div>
              <div className="text-xs text-muted-foreground">Claims Made</div>
            </div>
            
            <div className="text-center p-3 bg-dark-bg rounded-lg">
              <div className="text-2xl font-bold text-neon-orange">
                {achievements.filter(a => a.earned).length}
              </div>
              <div className="text-xs text-muted-foreground">Achievements</div>
            </div>
            
            <div className="text-center p-3 bg-dark-bg rounded-lg">
              <div className="text-2xl font-bold text-neon-pink">
                {userStats?.streak || 0}
              </div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}

export default Rewards;