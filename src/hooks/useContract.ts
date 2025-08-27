import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/contexts/Web3Context';
import { toast } from '@/hooks/use-toast';
import { addUserActivity, updateLeaderboard, updateMarketStats } from '@/lib/supabase';

export interface Quiz {
  question: string;
  answerHash: string;
  reward: bigint;
  deadline: number;
  active: boolean;
}

export interface Market {
  id: number;
  question: string;
  resolveTime: number;
  oracle: string;
  isResolved: boolean;
  winningOutcome: number;
  totalPool: string;
  isBinary: boolean;
  createdAt: number;
  creator: string;
  yesPool?: string;
  noPool?: string;
}

export interface UserStats {
  lastClaimTime: number;
  streak: number;
  totalClaims: number;
  totalEarnings: string;
}

export function useContract() {
  const { contract, account, refreshBalances } = useWeb3();
  const [loading, setLoading] = useState(false);

  // Deposit FLOW to get PREDICT tokens
  const deposit = useCallback(async (amount: string) => {
    if (!contract || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.deposit({
        value: ethers.parseEther(amount)
      });
      
      toast({
        title: "Transaction Sent! ⏳",
        description: "Depositing FLOW tokens...",
      });

      await tx.wait();
      
      await refreshBalances();
      
      // Log activity
      await addUserActivity({
        wallet_address: account,
        activity_type: 'deposit',
        description: `Deposited ${amount} FLOW`,
        amount: parseFloat(amount),
        transaction_hash: tx.hash,
      });

      toast({
        title: "Deposit Successful! 🎉",
        description: `Successfully deposited ${amount} FLOW for PREDICT tokens!`,
      });

    } catch (error: any) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit Failed",
        description: error.reason || error.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [contract, account, refreshBalances]);

  // Withdraw PREDICT tokens to get FLOW
  const withdraw = useCallback(async (amount: string) => {
    if (!contract || !account) return;

    setLoading(true);
    try {
      const tx = await contract.withdraw(ethers.parseEther(amount));
      
      toast({
        title: "Transaction Sent! ⏳",
        description: "Withdrawing PREDICT tokens...",
      });

      await tx.wait();
      await refreshBalances();

      // Log activity
      await addUserActivity({
        wallet_address: account,
        activity_type: 'withdraw',
        description: `Withdrew ${amount} PREDICT tokens`,
        amount: parseFloat(amount),
        transaction_hash: tx.hash,
      });

      toast({
        title: "Withdrawal Successful! 💰",
        description: `Successfully withdrew ${amount} PREDICT tokens for FLOW!`,
      });

    } catch (error: any) {
      console.error('Withdraw error:', error);
      toast({
        title: "Withdrawal Failed",
        description: error.reason || error.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [contract, account, refreshBalances]);

  // Place a bet on a market
  const placeBet = useCallback(async (marketId: number, outcome: number, amount: string) => {
    if (!contract || !account) return;

    setLoading(true);
    try {
      const tx = await contract.bet(marketId, outcome, ethers.parseEther(amount));
      
      toast({
        title: "Bet Placed! 🎯",
        description: "Placing your bet on the market...",
      });

      await tx.wait();
      await refreshBalances();

      // Log activity
      await addUserActivity({
        wallet_address: account,
        activity_type: 'bet',
        description: `Bet ${amount} PREDICT on ${outcome === 0 ? 'NO' : 'YES'}`,
        amount: parseFloat(amount),
        market_id: marketId,
        transaction_hash: tx.hash,
      });

      toast({
        title: "Bet Successful! 🚀",
        description: `Successfully placed ${amount} PREDICT bet!`,
      });

    } catch (error: any) {
      console.error('Bet error:', error);
      toast({
        title: "Bet Failed",
        description: error.reason || error.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [contract, account, refreshBalances]);

  // Claim daily rewards
  const claimDaily = useCallback(async () => {
    if (!contract || !account) return;

    setLoading(true);
    try {
      const tx = await contract.dailyClaim();
      
      toast({
        title: "Claiming Rewards! 🎁",
        description: "Claiming your daily PREDICT tokens...",
      });

      await tx.wait();
      await refreshBalances();

      // Get user stats to determine reward amount
      const stats = await contract.userStats(account);
      
      // Log activity
      await addUserActivity({
        wallet_address: account,
        activity_type: 'daily_claim',
        description: `Daily claim - Streak: ${stats.streak}`,
        transaction_hash: tx.hash,
      });

      toast({
        title: "Daily Claim Success! 💎",
        description: `Claimed daily rewards! Streak: ${stats.streak}`,
      });

    } catch (error: any) {
      console.error('Daily claim error:', error);
      toast({
        title: "Claim Failed",
        description: error.reason || error.message || "Already claimed today or transaction failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [contract, account, refreshBalances]);

  // Claim winnings from a resolved market
  const claimWinnings = useCallback(async (marketId: number) => {
    if (!contract || !account) return;

    setLoading(true);
    try {
      const tx = await contract.claim(marketId);
      
      toast({
        title: "Claiming Winnings! 💰",
        description: "Claiming your market winnings...",
      });

      await tx.wait();
      await refreshBalances();

      // Log activity
      await addUserActivity({
        wallet_address: account,
        activity_type: 'claim',
        description: `Claimed winnings from market #${marketId}`,
        market_id: marketId,
        transaction_hash: tx.hash,
      });

      toast({
        title: "Winnings Claimed! 🎉",
        description: "Successfully claimed your winnings!",
      });

    } catch (error: any) {
      console.error('Claim error:', error);
      toast({
        title: "Claim Failed",
        description: error.reason || error.message || "No winnings to claim or transaction failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [contract, account, refreshBalances]);

  // Create a new market (owner only)
  const createMarket = useCallback(async (
    question: string,
    resolveTime: number,
    oracle: string,
    isBinary: boolean = true
  ) => {
    if (!contract || !account) return;

    setLoading(true);
    try {
      const tx = await contract.createMarket(question, resolveTime, oracle, isBinary);
      
      toast({
        title: "Creating Market! 🏗️",
        description: "Creating new prediction market...",
      });

      const receipt = await tx.wait();
      
      // Get market ID from event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsedLog = contract.interface.parseLog(log);
          return parsedLog?.name === 'MarketCreated';
        } catch {
          return false;
        }
      });

      let marketId = 0;
      if (event) {
        const parsedLog = contract.interface.parseLog(event);
        marketId = parsedLog?.args?.marketId || 0;
      }

      toast({
        title: "Market Created! 🎯",
        description: `Successfully created market #${marketId}`,
      });

      return marketId;

    } catch (error: any) {
      console.error('Create market error:', error);
      toast({
        title: "Market Creation Failed",
        description: error.reason || error.message || "Only owner can create markets",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  // Answer a quiz
  const answerQuiz = useCallback(async (quizId: number, answer: string) => {
    if (!contract || !account) return;

    setLoading(true);
    try {
      const tx = await contract.answerQuiz(quizId, answer);
      
      toast({
        title: "Submitting Answer! 🧠",
        description: "Submitting your quiz answer...",
      });

      await tx.wait();
      await refreshBalances();

      // Log activity
      await addUserActivity({
        wallet_address: account,
        activity_type: 'quiz',
        description: `Answered quiz #${quizId}`,
        transaction_hash: tx.hash,
      });

      toast({
        title: "Answer Submitted! 📝",
        description: "Quiz answer submitted successfully!",
      });

    } catch (error: any) {
      console.error('Quiz error:', error);
      toast({
        title: "Quiz Failed",
        description: error.reason || error.message || "Already answered or quiz expired",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [contract, account, refreshBalances]);

  // Get all markets
  const getMarkets = useCallback(async (): Promise<Market[]> => {
    if (!contract) return [];

    try {
      const marketCount = await contract.marketCounter();
      const markets: Market[] = [];

      for (let i = 0; i < marketCount; i++) {
        try {
          const marketData = await contract.getMarket(i);
          const yesPool = await contract.getMarketPool(i, 1);
          const noPool = await contract.getMarketPool(i, 0);

          markets.push({
            id: i,
            question: marketData.question,
            resolveTime: Number(marketData.resolveTime),
            oracle: marketData.oracle,
            isResolved: marketData.isResolved,
            winningOutcome: marketData.winningOutcome,
            totalPool: ethers.formatEther(marketData.totalPool),
            isBinary: marketData.isBinary,
            createdAt: Number(marketData.createdAt),
            creator: marketData.creator,
            yesPool: ethers.formatEther(yesPool),
            noPool: ethers.formatEther(noPool),
          });
        } catch (err) {
          console.error(`Error fetching market ${i}:`, err);
        }
      }

      return markets;
    } catch (error) {
      console.error('Error fetching markets:', error);
      return [];
    }
  }, [contract]);

  // Get user stats
  const getUserStats = useCallback(async (): Promise<UserStats | null> => {
    if (!contract || !account) return null;

    try {
      const stats = await contract.userStats(account);
      return {
        lastClaimTime: Number(stats.lastClaimTime),
        streak: Number(stats.streak),
        totalClaims: Number(stats.totalClaims),
        totalEarnings: ethers.formatEther(stats.totalEarnings),
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }, [contract, account]);

  // Check if user can claim daily rewards
  const canClaimDaily = useCallback(async (): Promise<boolean> => {
    if (!contract || !account) return false;

    try {
      return await contract.canClaim(account);
    } catch (error) {
      console.error('Error checking claim status:', error);
      return false;
    }
  }, [contract, account]);

  // Get quote for payout estimation
  const getPayoutQuote = useCallback(async (
    marketId: number,
    outcome: number,
    stake: string
  ): Promise<string> => {
    if (!contract) return '0';

    try {
      const quote = await contract.quotePayout(marketId, outcome, ethers.parseEther(stake));
      return ethers.formatEther(quote);
    } catch (error) {
      console.error('Error getting payout quote:', error);
      return '0';
    }
  }, [contract]);

  // Resolve a market (owner only)
  const resolveMarket = useCallback(async (marketId: number, winningOutcome: number) => {
    if (!contract || !account) return;

    setLoading(true);
    try {
      const tx = await contract.resolveMarket(marketId, winningOutcome);
      
      toast({
        title: "Resolving Market! 🎯",
        description: "Setting the market outcome...",
      });

      await tx.wait();

      // Log activity
      await addUserActivity({
        wallet_address: account,
        activity_type: 'resolve_market',
        description: `Resolved market #${marketId} with outcome: ${winningOutcome === 1 ? 'YES' : 'NO'}`,
        market_id: marketId,
        transaction_hash: tx.hash,
      });

      toast({
        title: "Market Resolved! 🎉",
        description: `Successfully resolved market #${marketId}`,
      });

      return true;
    } catch (error: any) {
      console.error('Resolve market error:', error);
      toast({
        title: "Market Resolution Failed",
        description: error.reason || error.message || "Only owner/oracle can resolve markets",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  // Get quiz details
  const getQuiz = useCallback(async (quizId: number) => {
    if (!contract) return null;

    try {
      const quiz = await contract.quizzes(quizId);
      if (!quiz || !quiz.question) return null;
      
      return {
        question: quiz.question,
        answerHash: quiz.answerHash,
        reward: quiz.reward,
        deadline: Number(quiz.deadline),
        active: quiz.active
      } as Quiz;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      return null;
    }
  }, [contract]);

  // Create a quiz (owner only)
  const createQuiz = useCallback(async (
    question: string,
    answer: string,
    reward: string,
    deadline: number
  ) => {
    if (!contract || !account) return;

    setLoading(true);
    try {
      const answerHash = ethers.keccak256(ethers.toUtf8Bytes(answer));
      const tx = await contract.createQuiz(
        question,
        answerHash,
        ethers.parseEther(reward),
        deadline
      );
      
      toast({
        title: "Creating Quiz! 🧠",
        description: "Creating new brain teaser...",
      });

      const receipt = await tx.wait();
      
      toast({
        title: "Quiz Created! 📚",
        description: `Successfully created a new quiz!`,
      });

      return true;

    } catch (error: any) {
      console.error('Create quiz error:', error);
      toast({
        title: "Quiz Creation Failed",
        description: error.reason || error.message || "Only owner can create quizzes",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  return {
    loading,
    deposit,
    withdraw,
    placeBet,
    claimDaily,
    claimWinnings,
    createMarket,
    answerQuiz,
    getMarkets,
    getUserStats,
    canClaimDaily,
    getPayoutQuote,
    resolveMarket,
    createQuiz,
    getQuiz,
    contract, // Expose contract instance for direct calls
  };
}