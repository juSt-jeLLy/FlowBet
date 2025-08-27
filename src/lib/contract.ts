export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x2D8C5F975394AC57Db7810bb09f58e39099c74a5";
export const OWNER_ADDRESS = import.meta.env.VITE_OWNER_ADDRESS || "0x50035499ebF1cc5f49B57b6C2Ed7BdFdb791bB2a";

export const FLOW_TESTNET = {
  chainId: '0x221', // 545 in hex
  chainName: 'Flow EVM Testnet',
  nativeCurrency: {
    name: 'FLOW',
    symbol: 'FLOW',
    decimals: 18,
  },
  rpcUrls: ['https://flow-testnet.g.alchemy.com/v2/UqKqNAsvnMX2rMo6KIJHi'],
  blockExplorerUrls: ['https://evm-testnet.flowscan.io'],
};

export const CONTRACT_ABI = [
  // ERC20 Functions
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // Core FlowBet Functions
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "predictAmount", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "question", "type": "string"},
      {"internalType": "uint256", "name": "resolveTime", "type": "uint256"},
      {"internalType": "address", "name": "oracle", "type": "address"},
      {"internalType": "bool", "name": "isBinary", "type": "bool"}
    ],
    "name": "createMarket",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"internalType": "uint8", "name": "outcome", "type": "uint8"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "bet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"internalType": "uint8", "name": "winningOutcome", "type": "uint8"}
    ],
    "name": "resolveMarket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "marketId", "type": "uint256"}],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dailyClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "question", "type": "string"},
      {"internalType": "bytes32", "name": "answerHash", "type": "bytes32"},
      {"internalType": "uint256", "name": "reward", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"}
    ],
    "name": "createQuiz",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "quizId", "type": "uint256"},
      {"internalType": "string", "name": "answer", "type": "string"}
    ],
    "name": "answerQuiz",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  
  // View Functions
  {
    "inputs": [{"internalType": "uint256", "name": "marketId", "type": "uint256"}],
    "name": "getMarket",
    "outputs": [
      {"internalType": "string", "name": "question", "type": "string"},
      {"internalType": "uint256", "name": "resolveTime", "type": "uint256"},
      {"internalType": "address", "name": "oracle", "type": "address"},
      {"internalType": "bool", "name": "isResolved", "type": "bool"},
      {"internalType": "uint8", "name": "winningOutcome", "type": "uint8"},
      {"internalType": "uint256", "name": "totalPool", "type": "uint256"},
      {"internalType": "bool", "name": "isBinary", "type": "bool"},
      {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
      {"internalType": "address", "name": "creator", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"internalType": "uint8", "name": "outcome", "type": "uint8"}
    ],
    "name": "getMarketPool",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint8", "name": "outcome", "type": "uint8"}
    ],
    "name": "getUserBet",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"internalType": "uint8", "name": "outcome", "type": "uint8"},
      {"internalType": "uint256", "name": "stake", "type": "uint256"}
    ],
    "name": "quotePayout",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "canClaim",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "userStats",
    "outputs": [
      {"internalType": "uint256", "name": "lastClaimTime", "type": "uint256"},
      {"internalType": "uint256", "name": "streak", "type": "uint256"},
      {"internalType": "uint256", "name": "totalClaims", "type": "uint256"},
      {"internalType": "uint256", "name": "totalEarnings", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "marketCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "quizCounter", 
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "quizzes",
    "outputs": [
      {"internalType": "string", "name": "question", "type": "string"},
      {"internalType": "bytes32", "name": "answerHash", "type": "bytes32"},
      {"internalType": "uint256", "name": "reward", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "bool", "name": "active", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositRate",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawFee",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dailyReward",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "question", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "resolveTime", "type": "uint256"}
    ],
    "name": "MarketCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint8", "name": "outcome", "type": "uint8"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": false, "internalType": "uint8", "name": "winningOutcome", "type": "uint8"}
    ],
    "name": "MarketResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "marketId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "Claimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "streak", "type": "uint256"}
    ],
    "name": "DailyClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "flowAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "predictAmount", "type": "uint256"}
    ],
    "name": "Deposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "predictAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "flowAmount", "type": "uint256"}
    ],
    "name": "Withdrawn",
    "type": "event"
  }
] as const;