import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, FLOW_TESTNET } from '@/lib/contract';
import { toast } from '@/hooks/use-toast';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  contract: ethers.Contract | null;
  isConnected: boolean;
  isConnecting: boolean;
  flowBalance: string;
  predictBalance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: () => Promise<void>;
  isCorrectNetwork: boolean;
  refreshBalances: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [flowBalance, setFlowBalance] = useState('0.0');
  const [predictBalance, setPredictBalance] = useState('0.0');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const checkNetwork = async () => {
    if (!window.ethereum) return false;
    
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const isCorrect = chainId === FLOW_TESTNET.chainId;
      setIsCorrectNetwork(isCorrect);
      return isCorrect;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  };

  const switchNetwork = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: FLOW_TESTNET.chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [FLOW_TESTNET],
          });
        } catch (addError) {
          toast({
            title: "Network Error",
            description: "Failed to add Flow EVM Testnet to your wallet.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Network Switch Failed",
          description: "Please manually switch to Flow EVM Testnet.",
          variant: "destructive",
        });
      }
    }
  };

  const refreshBalances = async () => {
    if (!provider || !account || !contract) return;

    try {
      // Get FLOW balance
      const flowBalance = await provider.getBalance(account);
      setFlowBalance(ethers.formatEther(flowBalance));

      // Get PREDICT balance
      const predictBalance = await contract.balanceOf(account);
      setPredictBalance(ethers.formatEther(predictBalance));
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Check if we're on the correct network first
      const networkCheck = await checkNetwork();
      if (!networkCheck) {
        await switchNetwork();
        // Recheck after switching
        const recheckNetwork = await checkNetwork();
        if (!recheckNetwork) {
          throw new Error('Failed to switch to Flow EVM Testnet');
        }
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setProvider(browserProvider);
      setContract(contractInstance);
      setAccount(accounts[0]);

      toast({
        title: "Wallet Connected! 🚀",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });

    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setFlowBalance('0.0');
    setPredictBalance('0.0');
    setIsCorrectNetwork(false);
    
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from wallet.",
    });
  };

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          if (provider && contract) {
            // Reconnect with new account
            connectWallet();
          }
        }
      };

      const handleChainChanged = () => {
        checkNetwork();
        // Refresh the page to reset state when network changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account, provider, contract]);

  // Refresh balances when account or contract changes
  useEffect(() => {
    if (account && contract && provider) {
      refreshBalances();
    }
  }, [account, contract, provider]);

  // Check network on mount
  useEffect(() => {
    checkNetwork();
  }, []);

  const value: Web3ContextType = {
    account,
    provider,
    contract,
    isConnected: !!account && !!contract && isCorrectNetwork,
    isConnecting,
    flowBalance,
    predictBalance,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    isCorrectNetwork,
    refreshBalances,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}