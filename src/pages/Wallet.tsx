import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet as WalletIcon, 
  ArrowUpDown, 
  History,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw
} from "lucide-react";
import { useWeb3 } from "@/contexts/Web3Context";
import { useContract } from "@/hooks/useContract";
import { useSound } from "@/components/SoundSystem";
import { toast } from "@/hooks/use-toast";
import { getUserActivity, type UserActivity } from "@/lib/supabase";

export function Wallet() {
  const { 
    isConnected, 
    account, 
    flowBalance, 
    predictBalance, 
    refreshBalances 
  } = useWeb3();
  
  const { deposit, withdraw, loading } = useContract();
  const { playSound } = useSound();
  
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [activity, setActivity] = useState<UserActivity[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  useEffect(() => {
    if (isConnected && account) {
      loadActivity();
    }
  }, [isConnected, account]);

  const loadActivity = async () => {
    if (!account) return;
    
    setLoadingActivity(true);
    try {
      const userActivity = await getUserActivity(account);
      setActivity(userActivity);
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(depositAmount) > parseFloat(flowBalance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough FLOW tokens",
        variant: "destructive",
      });
      return;
    }

    playSound('click');
    await deposit(depositAmount);
    setDepositAmount("");
    await loadActivity();
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(withdrawAmount) > parseFloat(predictBalance)) {
      toast({
        title: "Insufficient Balance", 
        description: "You don't have enough PREDICT tokens",
        variant: "destructive",
      });
      return;
    }

    playSound('click');
    await withdraw(withdrawAmount);
    setWithdrawAmount("");
    await loadActivity();
  };

  const copyAddress = async () => {
    if (!account) return;
    
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      playSound('success');
      toast({
        title: "Address Copied!",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: UserActivity['activity_type']) => {
    switch (type) {
      case 'deposit': return <TrendingUp className="w-4 h-4 text-neon-green" />;
      case 'withdraw': return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'bet': return <ArrowUpDown className="w-4 h-4 text-neon-cyan" />;
      case 'claim': return <TrendingUp className="w-4 h-4 text-yellow-400" />;
      case 'daily_claim': return <Clock className="w-4 h-4 text-neon-cyan" />;
      case 'quiz': return <TrendingUp className="w-4 h-4 text-purple-400" />;
      default: return <History className="w-4 h-4 text-muted-foreground" />;
    }
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto p-4">
        <Card className="neon-border bg-dark-card">
          <CardContent className="p-8 text-center">
            <WalletIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground">
              Connect your wallet to manage your tokens and view transaction history
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
        <h1 className="text-4xl font-bold text-neon-cyan mb-2">
          💰 Wallet Management
        </h1>
        <p className="text-muted-foreground">
          Manage your FLOW and PREDICT tokens
        </p>
      </div>

      {/* Wallet Address */}
      <Card className="neon-border bg-dark-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletIcon className="w-5 h-5" />
            Wallet Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 p-3 bg-dark-bg rounded-lg font-mono text-sm break-all">
              {account}
            </div>
            <Button
              onClick={copyAddress}
              variant="ghost"
              size="sm"
            >
              {copied ? (
                <Check className="w-4 h-4 text-neon-green" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              onClick={() => window.open(`https://evm-testnet.flowscan.io/address/${account}`, '_blank')}
              variant="ghost"
              size="sm"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="balances" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Balances Tab */}
        <TabsContent value="balances" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* FLOW Balance */}
            <Card className="neon-border bg-dark-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">F</span>
                    </div>
                    FLOW
                  </div>
                  <Button
                    onClick={refreshBalances}
                    variant="ghost"
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-foreground">
                      {parseFloat(flowBalance).toFixed(6)}
                    </div>
                    <div className="text-sm text-muted-foreground">Native Token</div>
                  </div>
                  
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <div className="text-sm text-blue-400 mb-1">💡 About FLOW</div>
                    <div className="text-xs text-muted-foreground">
                      Native token of Flow blockchain. Used for gas fees and deposits.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PREDICT Balance */}
            <Card className="neon-border bg-dark-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">P</span>
                    </div>
                    PREDICT
                  </div>
                  <Badge className="bg-neon-cyan/20 text-neon-cyan">Betting Token</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold text-neon-cyan">
                      {parseFloat(predictBalance).toFixed(6)}
                    </div>
                    <div className="text-sm text-muted-foreground">Prediction Token</div>
                  </div>
                  
                  <div className="p-3 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30">
                    <div className="text-sm text-neon-cyan mb-1">🎯 About PREDICT</div>
                    <div className="text-xs text-muted-foreground">
                      ERC20 token used for betting. Get by depositing FLOW (1:1 ratio).
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exchange Rate Info */}
          <Card className="neon-border bg-dark-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Exchange Rate:</span>
                  <span className="font-bold">1 FLOW = 1 PREDICT</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Withdrawal Fee:</span>
                  <span className="font-bold text-red-400">2%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transfer Tab */}
        <TabsContent value="transfer" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Deposit FLOW → PREDICT */}
            <Card className="neon-border bg-dark-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-neon-green" />
                  Deposit FLOW
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Convert FLOW tokens to PREDICT tokens for betting
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (FLOW)</label>
                  <Input
                    placeholder="0.0"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    type="number"
                    step="0.000001"
                  />
                  <div className="text-xs text-muted-foreground">
                    Available: {parseFloat(flowBalance).toFixed(6)} FLOW
                  </div>
                </div>

                {depositAmount && parseFloat(depositAmount) > 0 && (
                  <div className="p-3 bg-neon-green/10 rounded-lg">
                    <div className="text-sm text-muted-foreground">You will receive:</div>
                    <div className="text-lg font-bold text-neon-green">
                      {parseFloat(depositAmount).toFixed(6)} PREDICT
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleDeposit}
                  disabled={loading || !depositAmount || parseFloat(depositAmount) <= 0}
                  variant="hero"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Depositing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Deposit FLOW
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Withdraw PREDICT → FLOW */}
            <Card className="neon-border bg-dark-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-400" />
                  Withdraw PREDICT
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Convert PREDICT tokens back to FLOW (2% fee applies)
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (PREDICT)</label>
                  <Input
                    placeholder="0.0"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    type="number"
                    step="0.000001"
                  />
                  <div className="text-xs text-muted-foreground">
                    Available: {parseFloat(predictBalance).toFixed(6)} PREDICT
                  </div>
                </div>

                {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
                  <div className="p-3 bg-red-400/10 rounded-lg">
                    <div className="text-sm text-muted-foreground">You will receive:</div>
                    <div className="text-lg font-bold text-red-400">
                      {(parseFloat(withdrawAmount) * 0.98).toFixed(6)} FLOW
                    </div>
                    <div className="text-xs text-red-400">
                      (Fee: {(parseFloat(withdrawAmount) * 0.02).toFixed(6)} PREDICT)
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleWithdraw}
                  disabled={loading || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                  variant="secondary"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Withdraw PREDICT
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="neon-border bg-dark-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Transaction History
                </div>
                <Button
                  onClick={loadActivity}
                  variant="ghost"
                  size="sm"
                  disabled={loadingActivity}
                >
                  <RefreshCw className={`w-4 h-4 ${loadingActivity ? 'animate-spin' : ''}`} />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingActivity ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                      <div className="w-8 h-8 bg-muted rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-32 mb-1" />
                        <div className="h-3 bg-muted rounded w-24" />
                      </div>
                      <div className="h-4 bg-muted rounded w-16" />
                    </div>
                  ))}
                </div>
              ) : activity.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activity.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-3 bg-dark-bg rounded-lg hover:bg-dark-bg/80 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-dark-card flex items-center justify-center">
                        {getActivityIcon(item.activity_type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {item.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(item.created_at)}
                        </div>
                      </div>
                      
                      {item.amount && (
                        <div className="text-right">
                          <div className={`font-bold text-sm ${
                            item.activity_type === 'deposit' || item.activity_type === 'claim' || item.activity_type === 'daily_claim'
                              ? 'text-neon-green'
                              : 'text-red-400'
                          }`}>
                            {item.activity_type === 'deposit' || item.activity_type === 'claim' || item.activity_type === 'daily_claim' ? '+' : '-'}
                            {item.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.activity_type === 'deposit' ? 'FLOW' : 'PREDICT'}
                          </div>
                        </div>
                      )}
                      
                      {item.transaction_hash && (
                        <Button
                          onClick={() => window.open(`https://evm-testnet.flowscan.io/tx/${item.transaction_hash}`, '_blank')}
                          variant="ghost"
                          size="sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Wallet;