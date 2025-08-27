import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flame, 
  TrendingUp, 
  Brain, 
  Trophy, 
  Gift, 
  Loader2, 
  Target,
  Zap,
  Users,
  Volume2,
  Wallet as WalletIcon,
  ArrowUpDown,
  Plus
} from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { useSound } from "@/components/SoundSystem";
import { ConnectWallet } from "@/components/ConnectWallet";
import type { Market, UserStats } from "@/hooks/useContract";
import { OWNER_ADDRESS } from "@/lib/contract";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { isConnected, account, flowBalance, predictBalance } = useWeb3();
  const { 
    getUserStats, 
    canClaimDaily, 
    getMarkets, 
    claimDaily, 
    deposit, 
    withdraw,
    placeBet,
    createMarket,
    claimWinnings,
    resolveMarket,
    loading 
  } = useContract();

  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [canClaim, setCanClaim] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<number>(1);

  // Market creation state (only for owner)
  const [newMarketQuestion, setNewMarketQuestion] = useState("");
  const [newMarketDays, setNewMarketDays] = useState("7");

  useEffect(() => {
    if (isConnected && account) {
      loadData();
    }
  }, [isConnected, account]);

  const loadData = async () => {
    const [stats, claimStatus, marketData] = await Promise.all([
      getUserStats(),
      canClaimDaily(),
      getMarkets()
    ]);
    
    setUserStats(stats);
    setCanClaim(claimStatus);
    setMarkets(marketData || []);
  };

  const handleClaimDaily = async () => {
    await claimDaily();
    await loadData();
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    await deposit(depositAmount);
    setDepositAmount("");
    await loadData();
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
    await withdraw(withdrawAmount);
    setWithdrawAmount("");
    await loadData();
  };

  const handlePlaceBet = async () => {
    if (!selectedMarket || !betAmount || parseFloat(betAmount) <= 0) return;
    await placeBet(selectedMarket.id, selectedOutcome, betAmount);
    setBetAmount("");
    setSelectedMarket(null);
    await loadData();
  };

  const handleCreateMarket = async () => {
    if (!newMarketQuestion.trim()) return;
    
    const resolveTime = Math.floor(Date.now() / 1000) + (parseInt(newMarketDays) * 24 * 60 * 60);
    const marketId = await createMarket(newMarketQuestion, resolveTime, account || OWNER_ADDRESS, true);
    
    if (marketId !== null) {
      setNewMarketQuestion("");
      setNewMarketDays("7");
      await loadData();
    }
  };

  const isOwner = account?.toLowerCase() === OWNER_ADDRESS.toLowerCase();

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <motion.div 
          className="text-center space-y-6 max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2">
            <h1 
              className="text-6xl font-bold"
              style={{
                background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
              }}
            >
              FlowBet
            </h1>
            <p className="text-xl text-muted-foreground">
              Gamified Prediction Markets on Flow EVM 🚀
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg text-foreground max-w-lg mx-auto">
              Connect your wallet to start betting on crypto markets, earn daily rewards, 
              and compete in the ultimate prediction game!
            </p>
            <ConnectWallet />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: Target, label: "Predict Markets", value: "∞" },
              { icon: Zap, label: "Daily Rewards", value: "100+" },
              { icon: Trophy, label: "Achievements", value: "12" },
              { icon: Users, label: "Players", value: "1K+" }
            ].map((stat, i) => (
              <Card key={i} className="neon-border bg-dark-card">
                <CardContent className="p-4 text-center">
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-neon-cyan" />
                  <div className="text-lg font-bold text-neon-cyan">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-4">
      <motion.div 
        className="max-w-7xl mx-auto space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 
              className="text-4xl font-bold"
              style={{
                background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))'
              }}
            >
              FlowBet Dashboard
            </h1>
            <p className="text-neon-cyan text-lg font-medium">
              Welcome back, {account?.slice(0, 6)}...{account?.slice(-4)}
            </p>
          </div>
          <ConnectWallet />
        </div>

       

        {/* Recent Hot Markets */}
        {markets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-neon-pink mb-4 text-glow">
              🔥 Trending Markets
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {markets
                .filter(m => !m.isResolved)
                .sort((a, b) => Number(b.totalPool) - Number(a.totalPool))
                .slice(0, 4)
                .map((market, i) => (
                  <motion.div
                    key={market.id}
                    className="bg-dark-card p-4 rounded-lg neon-border-pink hover:shadow-glow-pink transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02, y: -2 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    onClick={() => setSelectedMarket(market)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-foreground text-sm leading-tight flex-1 mr-2">
                        {market.question}
                      </h3>
                      <Badge className="bg-neon-orange/20 text-neon-orange shrink-0">
                        🔥 {Number(market.totalPool).toFixed(0)}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neon-green">YES: {Math.round((Number(market.yesPool || 0) / (Number(market.yesPool || 0) + Number(market.noPool || 0))) * 100) || 50}%</span>
                      <span className="text-red-400">NO: {Math.round((Number(market.noPool || 0) / (Number(market.yesPool || 0) + Number(market.noPool || 0))) * 100) || 50}%</span>
                    </div>
                  </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="neon-border bg-dark-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-neon-cyan">{userStats?.streak || 0}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
                <Flame className="w-6 h-6 mx-auto mt-2 text-neon-orange animate-pulse" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="neon-border bg-dark-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-neon-green">
                  {userStats?.totalEarnings ? `${parseFloat(userStats.totalEarnings).toFixed(2)}` : '0.00'}
                </div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
                <Trophy className="w-6 h-6 mx-auto mt-2 text-neon-green" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="neon-border bg-dark-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-neon-pink">{parseFloat(predictBalance).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">PREDICT Balance</div>
                <Brain className="w-6 h-6 mx-auto mt-2 text-neon-pink animate-pulse" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="neon-border bg-dark-card">
              <CardContent className="p-4 text-center">
                <Button 
                  variant={canClaim ? "hero" : "secondary"} 
                  size="sm"
                  disabled={!canClaim || loading}
                  onClick={handleClaimDaily}
                  className="w-full"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Gift className="w-4 h-4 mr-2" />
                  )}
                  {loading ? "Claiming..." : canClaim ? "Claim Daily!" : "Claimed Today"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="markets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            {isOwner && <TabsTrigger value="admin">Admin</TabsTrigger>}
          </TabsList>

          {/* Markets Tab */}
          <TabsContent value="markets" className="space-y-4">
            <div className="grid gap-4">
              {markets.length === 0 ? (
                <Card className="neon-border bg-dark-card">
                  <CardContent className="p-8 text-center">
                    <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No markets available yet</p>
                    {isOwner && <p className="text-sm text-neon-cyan mt-2">Create the first market in the Admin tab!</p>}
                  </CardContent>
                </Card>
              ) : (
                markets.map((market) => (
                  <Card key={market.id} className="neon-border bg-dark-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{market.question}</CardTitle>
                        {market.isResolved ? (
                          <Badge variant="secondary">Resolved</Badge>
                        ) : (
                          <Badge className="bg-neon-green/20 text-neon-green">Active</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Total Pool</div>
                          <div className="font-bold">{parseFloat(market.totalPool).toFixed(2)} PREDICT</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">YES Pool</div>
                          <div className="font-bold text-neon-green">{parseFloat(market.yesPool || '0').toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">NO Pool</div>
                          <div className="font-bold text-red-400">{parseFloat(market.noPool || '0').toFixed(2)}</div>
                        </div>
                      </div>
                      
                      {!market.isResolved && (
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => { setSelectedMarket(market); setSelectedOutcome(1); }}
                            variant="secondary"
                            className="flex-1"
                          >
                            Bet YES
                          </Button>
                          <Button 
                            onClick={() => { setSelectedMarket(market); setSelectedOutcome(0); }}
                            variant="secondary"
                            className="flex-1"
                          >
                            Bet NO
                          </Button>
                        </div>
                      )}

                      {market.isResolved && (
                        <Button 
                          onClick={() => claimWinnings(market.id)}
                          variant="hero"
                          className="w-full"
                        >
                          Claim Winnings
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Balances */}
              <Card className="neon-border bg-dark-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <WalletIcon className="w-5 h-5" />
                    Wallet Balances
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">FLOW</div>
                      <div className="text-2xl font-bold">{parseFloat(flowBalance).toFixed(4)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Native Token</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">PREDICT</div>
                      <div className="text-2xl font-bold text-neon-cyan">{parseFloat(predictBalance).toFixed(4)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Betting Token</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Deposit/Withdraw */}
              <Card className="neon-border bg-dark-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpDown className="w-5 h-5" />
                    Deposit / Withdraw
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deposit FLOW → PREDICT</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="0.0"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        type="number"
                      />
                      <Button onClick={handleDeposit} disabled={loading}>
                        Deposit
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Withdraw PREDICT → FLOW</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="0.0"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        type="number"
                      />
                      <Button onClick={handleWithdraw} disabled={loading}>
                        Withdraw
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-4">
            <Card className="neon-border bg-dark-card">
              <CardHeader>
                <CardTitle>Daily Rewards & Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-neon-cyan mb-2">
                    {userStats?.streak || 0} Days
                  </div>
                  <p className="text-muted-foreground mb-4">Current Streak</p>
                  <Button 
                    variant={canClaim ? "hero" : "secondary"} 
                    disabled={!canClaim || loading}
                    onClick={handleClaimDaily}
                    size="lg"
                    className="w-full max-w-md"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Gift className="w-4 h-4 mr-2" />
                    )}
                    {loading ? "Claiming..." : canClaim ? "Claim Daily Reward!" : "Come Back Tomorrow"}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { title: "First Bet", description: "Place your first bet", earned: true },
                    { title: "Week Warrior", description: "7 day streak", earned: (userStats?.streak || 0) >= 7 },
                    { title: "Market Master", description: "Win 5 markets", earned: false },
                    { title: "Legend", description: "30 day streak", earned: (userStats?.streak || 0) >= 30 },
                  ].map((achievement, i) => (
                    <Card key={i} className={`${achievement.earned ? 'neon-border bg-neon-cyan/10' : 'bg-dark-card'}`}>
                      <CardContent className="p-4 text-center">
                        <Trophy className={`w-8 h-8 mx-auto mb-2 ${achievement.earned ? 'text-neon-cyan' : 'text-muted-foreground'}`} />
                        <div className="font-bold text-sm">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Tab (Owner Only) */}
          {isOwner && (
            <TabsContent value="admin" className="space-y-4">
              <div className="grid gap-4">
                {/* Create Market Card */}
                <Card className="neon-border bg-dark-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Create New Market
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Market Question</label>
                      <Input
                        placeholder="e.g., Will BTC hit $150k this year?"
                        value={newMarketQuestion}
                        onChange={(e) => setNewMarketQuestion(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Resolve Time (Days from now)</label>
                      <Input
                        type="number"
                        placeholder="7"
                        value={newMarketDays}
                        onChange={(e) => setNewMarketDays(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleCreateMarket} 
                      disabled={loading || !newMarketQuestion.trim()}
                      variant="hero"
                      className="w-full"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Create Market
                    </Button>
                  </CardContent>
                </Card>

                {/* Manage Markets Card */}
                <Card className="neon-border bg-dark-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Manage Markets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {markets
                      .filter(market => !market.isResolved) // Removed time constraint
                      .map((market) => (
                        <div key={market.id} className="p-4 bg-dark-bg rounded-lg space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="font-medium text-sm">{market.question}</h4>
                              <p className="text-xs text-muted-foreground">
                                Created: {new Date(market.createdAt * 1000).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="secondary">Pending Resolution</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => resolveMarket(market.id, 1)}
                              disabled={loading}
                              className="w-full"
                            >
                              Resolve YES
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => resolveMarket(market.id, 0)}
                              disabled={loading}
                              className="w-full"
                            >
                              Resolve NO
                            </Button>
                          </div>
                        </div>
                    ))}
                    {markets.filter(market => !market.isResolved).length === 0 && (
                      <div className="text-center text-muted-foreground p-4">
                        No active markets to resolve
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Bet Modal */}
        {selectedMarket && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="neon-border bg-dark-card max-w-md w-full">
              <CardHeader>
                <CardTitle>Place Bet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Question</div>
                  <div className="font-medium">{selectedMarket.question}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Your Prediction</div>
                  <div className={`font-bold ${selectedOutcome === 1 ? 'text-neon-green' : 'text-red-400'}`}>
                    {selectedOutcome === 1 ? 'YES' : 'NO'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bet Amount (PREDICT)</label>
                  <Input
                    placeholder="0.0"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    type="number"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => setSelectedMarket(null)} variant="secondary" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handlePlaceBet} variant="hero" className="flex-1" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Place Bet"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;