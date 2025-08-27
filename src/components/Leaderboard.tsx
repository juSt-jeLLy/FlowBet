import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Flame, 
  TrendingUp,
  Zap,
  Star
} from "lucide-react";
import { getLeaderboard, type LeaderboardEntry } from "@/lib/supabase";
import { useWeb3 } from "@/contexts/Web3Context";

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { account } = useWeb3();

  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadLeaderboard = async () => {
    setLoading(true);
    const data = await getLeaderboard(50);
    setLeaderboard(data);
    setLoading(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🏆 LEGENDARY";
    if (rank <= 3) return "🥇 EPIC";
    if (rank <= 10) return "🎯 RARE";
    if (rank <= 50) return "⚡ COMMON";
    return "🔹 NOOB";
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥🔥🔥";
    if (streak >= 14) return "🔥🔥";
    if (streak >= 7) return "🔥";
    return "💫";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="neon-border bg-dark-card animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-32 mb-2" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
                <div className="h-4 bg-muted rounded w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-neon-cyan mb-2">
          🏆 LEADERBOARD 🏆
        </h2>
        <p className="text-muted-foreground">Top prediction masters on Flow EVM</p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.slice(0, 3).length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Second Place */}
          {leaderboard[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="neon-border bg-dark-card relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gray-400 text-white px-3 py-1">#2</Badge>
                </div>
                <CardContent className="p-4 text-center pt-8">
                  <Avatar className="w-16 h-16 mx-auto mb-3 ring-2 ring-gray-400">
                    <AvatarFallback className="bg-gradient-to-br from-gray-300 to-gray-500 text-white font-bold">
                      {leaderboard[1].wallet_address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium text-gray-400 mb-1">
                    {leaderboard[1].wallet_address.slice(0, 6)}...{leaderboard[1].wallet_address.slice(-4)}
                  </div>
                  <div className="text-lg font-bold text-neon-cyan">
                    {leaderboard[1].total_winnings.toFixed(2)} PREDICT
                  </div>
                  <div className="flex justify-center items-center gap-1 mt-2">
                    <Flame className="w-4 h-4 text-neon-orange" />
                    <span className="text-sm">{leaderboard[1].win_streak}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* First Place */}
          {leaderboard[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="transform -translate-y-4"
            >
              <Card className="neon-border bg-dark-card relative shadow-glow-cyan">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 font-bold">
                    👑 #1 LEGEND
                  </Badge>
                </div>
                <CardContent className="p-4 text-center pt-8">
                  <Avatar className="w-20 h-20 mx-auto mb-3 ring-4 ring-yellow-400">
                    <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-bold text-lg">
                      {leaderboard[0].wallet_address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium text-yellow-400 mb-1">
                    {leaderboard[0].wallet_address.slice(0, 6)}...{leaderboard[0].wallet_address.slice(-4)}
                  </div>
                  <div className="text-xl font-bold text-neon-cyan">
                    {leaderboard[0].total_winnings.toFixed(2)} PREDICT
                  </div>
                  <div className="flex justify-center items-center gap-1 mt-2">
                    <Flame className="w-5 h-5 text-neon-orange animate-pulse" />
                    <span className="text-sm font-bold">{leaderboard[0].win_streak} 🔥</span>
                  </div>
                  <Crown className="w-8 h-8 mx-auto mt-2 text-yellow-400 animate-bounce" />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Third Place */}
          {leaderboard[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="neon-border bg-dark-card relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-amber-600 text-white px-3 py-1">#3</Badge>
                </div>
                <CardContent className="p-4 text-center pt-8">
                  <Avatar className="w-16 h-16 mx-auto mb-3 ring-2 ring-amber-600">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold">
                      {leaderboard[2].wallet_address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm font-medium text-amber-500 mb-1">
                    {leaderboard[2].wallet_address.slice(0, 6)}...{leaderboard[2].wallet_address.slice(-4)}
                  </div>
                  <div className="text-lg font-bold text-neon-cyan">
                    {leaderboard[2].total_winnings.toFixed(2)} PREDICT
                  </div>
                  <div className="flex justify-center items-center gap-1 mt-2">
                    <Flame className="w-4 h-4 text-neon-orange" />
                    <span className="text-sm">{leaderboard[2].win_streak}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className={`neon-border transition-all duration-300 hover:shadow-glow-cyan ${
                entry.wallet_address.toLowerCase() === account?.toLowerCase() 
                  ? 'bg-neon-cyan/10 ring-2 ring-neon-cyan' 
                  : 'bg-dark-card hover:bg-dark-card/80'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-12 flex justify-center">
                    {getRankIcon(index + 1)}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-neon-cyan to-blue-500 text-white font-bold">
                      {entry.wallet_address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">
                        {entry.wallet_address.slice(0, 8)}...{entry.wallet_address.slice(-6)}
                      </span>
                      {entry.wallet_address.toLowerCase() === account?.toLowerCase() && (
                        <Badge variant="secondary" className="text-xs">YOU</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>🎯 {entry.total_bets} bets</span>
                      <span>{getStreakEmoji(entry.win_streak)} {entry.win_streak} streak</span>
                      <span>🧠 {entry.quiz_score} quiz</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-neon-cyan">
                      {entry.total_winnings.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">PREDICT</div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs mt-1"
                    >
                      {getRankBadge(index + 1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <Card className="neon-border bg-dark-card">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">No Rankings Yet</h3>
            <p className="text-muted-foreground">
              Be the first to make some predictions and climb the leaderboard!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}