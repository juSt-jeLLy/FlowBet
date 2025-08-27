import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Users, 
  Filter,
  Search,
  Flame,
  Zap,
  DollarSign,
  Calendar,
  Activity,
  Coins,
  Gamepad2
} from "lucide-react";
import marketCrypto from "@/assets/market-crypto.jpg";
import marketSports from "@/assets/market-sports.jpg";
import marketTech from "@/assets/market-tech.jpg";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { useSound } from "@/components/SoundSystem";
import type { Market } from "@/hooks/useContract";

export function Markets() {
  const { isConnected } = useWeb3();
  const { getMarkets, placeBet, getPayoutQuote, loading } = useContract();
  const { playSound } = useSound();
  
  const [markets, setMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [betAmount, setBetAmount] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "resolved" | "hot">("all");
  const [payoutQuote, setPayoutQuote] = useState("0");

  useEffect(() => {
    if (isConnected) {
      loadMarkets();
      const interval = setInterval(loadMarkets, 10000); // Refresh every 10s
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  useEffect(() => {
    applyFilters();
  }, [markets, searchTerm, filter]);

  useEffect(() => {
    if (selectedMarket && betAmount) {
      updatePayoutQuote();
    }
  }, [selectedMarket, betAmount, selectedOutcome]);

  const loadMarkets = async () => {
    const marketData = await getMarkets();
    setMarkets(marketData || []);
  };

  const applyFilters = () => {
    let filtered = markets;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(market =>
        market.question.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    switch (filter) {
      case "active":
        filtered = filtered.filter(market => !market.isResolved);
        break;
      case "resolved":
        filtered = filtered.filter(market => market.isResolved);
        break;
      case "hot":
        filtered = filtered
          .filter(market => !market.isResolved && Number(market.totalPool) > 0)
          .sort((a, b) => Number(b.totalPool) - Number(a.totalPool))
          .slice(0, 10);
        break;
    }

    setFilteredMarkets(filtered);
  };

  const updatePayoutQuote = async () => {
    if (!selectedMarket || !betAmount || parseFloat(betAmount) <= 0) {
      setPayoutQuote("0");
      return;
    }

    try {
      const quote = await getPayoutQuote(selectedMarket.id, selectedOutcome, betAmount);
      setPayoutQuote(quote);
    } catch (error) {
      console.error('Error getting payout quote:', error);
      setPayoutQuote("0");
    }
  };

  const handlePlaceBet = async () => {
    if (!selectedMarket || !betAmount || parseFloat(betAmount) <= 0) return;
    
    playSound('bet');
    await placeBet(selectedMarket.id, selectedOutcome, betAmount);
    setBetAmount("");
    setSelectedMarket(null);
    setPayoutQuote("0");
    await loadMarkets();
  };

  const getOddsPercentage = (market: Market, outcome: number) => {
    const yesPool = Number(market.yesPool || 0);
    const noPool = Number(market.noPool || 0);
    const totalPool = yesPool + noPool;
    
    if (totalPool === 0) return 50;
    
    if (outcome === 1) {
      return Math.round((yesPool / totalPool) * 100);
    } else {
      return Math.round((noPool / totalPool) * 100);
    }
  };

  const getTimeRemaining = (resolveTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = resolveTime - now;
    
    if (remaining <= 0) return "Expired";
    
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isHotMarket = (market: Market) => {
    return Number(market.totalPool) > 100; // Markets with >100 PREDICT are "hot"
  };

  const getMarketImage = (question: string) => {
    const q = question.toLowerCase();
    if (q.includes('crypto') || q.includes('bitcoin') || q.includes('eth') || q.includes('price')) {
      return marketCrypto;
    } else if (q.includes('sport') || q.includes('game') || q.includes('match') || q.includes('team')) {
      return marketSports;
    } else {
      return marketTech;
    }
  };

  const getMarketIcon = (question: string) => {
    const q = question.toLowerCase();
    if (q.includes('crypto') || q.includes('bitcoin') || q.includes('eth') || q.includes('price')) {
      return Coins;
    } else if (q.includes('sport') || q.includes('game') || q.includes('match') || q.includes('team')) {
      return Gamepad2;
    } else {
      return Activity;
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto p-4">
        <Card className="neon-border bg-dark-card">
          <CardContent className="p-8 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Connect your wallet to view and participate in prediction markets
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 
          className="text-4xl font-bold mb-2"
          style={{
            background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))'
          }}
        >
          🎯 Prediction Markets
        </h1>
        <p className="text-muted-foreground">
          Bet on the future with real money. Your knowledge = your profit.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search markets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="hot">🔥 Hot</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Markets Grid */}
      <div className="grid gap-4">
        {filteredMarkets.length === 0 ? (
          <Card className="neon-border bg-dark-card">
            <CardContent className="p-8 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No Markets Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "No markets match your search." : "No markets available yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredMarkets.map((market, index) => (
            <motion.div
              key={market.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`neon-border bg-dark-card hover:shadow-glow-cyan transition-all duration-300 cyber-shake ${
                isHotMarket(market) ? 'ring-2 ring-neon-orange/50 shadow-glow-orange' : ''
              }`}>
                <div className="flex h-full">
                  {/* Market Image */}
                  <div className="w-24 h-24 relative overflow-hidden rounded-l-lg shrink-0">
                    <img 
                      src={getMarketImage(market.question)} 
                      alt="Market category"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-card/50"></div>
                    <div className="absolute top-2 left-2">
                      {(() => {
                        const Icon = getMarketIcon(market.question);
                        return <Icon className="w-4 h-4 text-neon-cyan" />;
                      })()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <CardHeader className="p-0 pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-base leading-tight">{market.question}</CardTitle>
                            {isHotMarket(market) && (
                              <Badge className="bg-neon-orange/20 text-neon-orange border-neon-orange/50 text-xs animate-pulse">
                                🔥 HOT
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {market.isResolved ? "Resolved" : getTimeRemaining(market.resolveTime)}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {parseFloat(market.totalPool).toFixed(1)} PREDICT
                            </div>
                          </div>
                        </div>
                        
                        {market.isResolved ? (
                          <Badge variant="secondary" className="text-xs">
                            {market.winningOutcome === 1 ? "YES Won" : "NO Won"}
                          </Badge>
                        ) : (
                          <Badge className="bg-neon-green/20 text-neon-green text-xs">Active</Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-0 space-y-3">
                      {/* Market Meta - Compact */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-dark-bg/50 p-2 rounded">
                          <div className="text-muted-foreground">ID #{market.id}</div>
                          <div className="text-neon-cyan font-medium">{market.oracle.slice(0,4)}...{market.oracle.slice(-2)}</div>
                        </div>
                        <div className="bg-dark-bg/50 p-2 rounded">
                          <div className="text-muted-foreground">Resolve</div>
                          <div className="text-neon-pink font-medium">{market.isResolved ? 'Done' : new Date(market.resolveTime*1000).toLocaleDateString()}</div>
                        </div>
                      </div>

                      {/* Odds Display - Compact */}
                      <div className="grid grid-cols-2 gap-2">
                        <motion.div 
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            selectedMarket?.id === market.id && selectedOutcome === 1
                              ? 'border-neon-green bg-neon-green/20 shadow-glow-green'
                              : 'border-neon-green/30 bg-neon-green/5 hover:bg-neon-green/10'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-center">
                            <div className="text-lg font-bold text-neon-green">YES</div>
                            <div className="text-xs text-muted-foreground">{getOddsPercentage(market, 1)}%</div>
                            <div className="text-xs mt-1">{parseFloat(market.yesPool || '0').toFixed(1)}</div>
                          </div>
                          <Progress 
                            value={getOddsPercentage(market, 1)} 
                            className="mt-1 h-1" 
                          />
                        </motion.div>

                        <motion.div 
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            selectedMarket?.id === market.id && selectedOutcome === 0
                              ? 'border-red-400 bg-red-400/20 shadow-glow-pink'
                              : 'border-red-400/30 bg-red-400/5 hover:bg-red-400/10'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-center">
                            <div className="text-lg font-bold text-red-400">NO</div>
                            <div className="text-xs text-muted-foreground">{getOddsPercentage(market, 0)}%</div>
                            <div className="text-xs mt-1">{parseFloat(market.noPool || '0').toFixed(1)}</div>
                          </div>
                          <Progress 
                            value={getOddsPercentage(market, 0)} 
                            className="mt-1 h-1"
                          />
                        </motion.div>
                      </div>

                      {/* Action Buttons */}
                      {!market.isResolved && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              setSelectedMarket(market);
                              setSelectedOutcome(1);
                              playSound('click');
                            }}
                            variant="secondary"
                            size="sm"
                            className="flex-1 pulse-glow"
                          >
                            <Target className="w-3 h-3 mr-1" />
                            YES
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedMarket(market);
                              setSelectedOutcome(0);
                              playSound('click');
                            }}
                            variant="secondary"
                            size="sm"
                            className="flex-1 pulse-glow"
                          >
                            <Target className="w-3 h-3 mr-1" />
                            NO
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Bet Modal */}
      {selectedMarket && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedMarket(null);
              setBetAmount("");
              setPayoutQuote("0");
            }
          }}
        >
          <Card className="neon-border bg-dark-card max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Place Your Bet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Question</div>
                <div className="font-medium">{selectedMarket.question}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Your Prediction</div>
                <div className={`text-lg font-bold ${
                  selectedOutcome === 1 ? 'text-neon-green' : 'text-red-400'
                }`}>
                  {selectedOutcome === 1 ? '✅ YES' : '❌ NO'}
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

              {betAmount && parseFloat(betAmount) > 0 && (
                <div className="p-3 bg-neon-cyan/10 rounded-lg">
                  <div className="text-sm text-muted-foreground">Estimated Payout</div>
                  <div className="text-xl font-bold text-neon-cyan">
                    {parseFloat(payoutQuote).toFixed(4)} PREDICT
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Profit: {(parseFloat(payoutQuote) - parseFloat(betAmount)).toFixed(4)} PREDICT
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setSelectedMarket(null);
                    setBetAmount("");
                    setPayoutQuote("0");
                  }}
                  variant="secondary" 
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePlaceBet}
                  variant="hero" 
                  className="flex-1"
                  disabled={loading || !betAmount || parseFloat(betAmount) <= 0}
                >
                  {loading ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-spin" />
                      Betting...
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Place Bet
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

export default Markets;