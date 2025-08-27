# 🎮 FlowBet - Gamified Prediction Market

FlowBet is an epic gamified prediction market built on Flow EVM Testnet with full brainrot energy! Create markets, place bets, earn daily rewards, solve puzzles, and climb the leaderboards.

## 🚀 Features

### 🎯 Core Prediction Market
- **Binary Markets**: Bet YES/NO on crypto, sports, and custom events
- **Real-time Odds**: Live pari-mutuel betting system
- **Market Creation**: Owner can create new prediction markets
- **Claim Winnings**: Automatic payout calculation for winners

### 💎 Token Economy
- **FLOW ↔ PREDICT**: Deposit FLOW to mint PREDICT tokens
- **Withdrawal Fees**: 2% protocol fee on withdrawals
- **Staking Rewards**: Earn tokens through various activities

### 🎮 Gamification System
- **Daily Login Rewards**: Claim free tokens every 24 hours
- **Streak Multipliers**: 1.0x → 1.5x based on consecutive days
- **Brain Teasers**: Solve puzzles for bonus token rewards
- **Achievement System**: Common → Legendary achievements
- **Leaderboards**: Compete for top rankings

### 🎨 UI/UX
- **Cyberpunk Theme**: Neon colors and particle effects
- **Animated Interface**: Framer Motion transitions
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live market data and notifications

## 🔧 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **ethers.js** for Web3 integration
- **React Query** for data fetching

### Backend
- **Supabase** for real-time database
- **PostgreSQL** with Row Level Security
- **Real-time subscriptions** for live updates

### Smart Contract
- **Solidity 0.8.20**
- **OpenZeppelin** security standards
- **Flow EVM Testnet** deployment
- **ReentrancyGuard & Pausable** safety features

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │ Smart Contract  │
│                 │    │                 │    │                 │
│ • React/TS      │◄──►│ • PostgreSQL    │    │ • FlowBet.sol   │
│ • Web3 Context  │    │ • Real-time DB  │    │ • ERC20 Token   │
│ • Contract Hooks│    │ • Leaderboards  │    │ • Market Logic  │
│ • UI Components │    │ • User Activity │    │ • Rewards System│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Setup Instructions

### 1. Prerequisites
- **Node.js 18+** and npm
- **MetaMask** wallet extension
- **Supabase** account
- **Flow EVM Testnet** FLOW tokens

### 2. Environment Setup

Create `.env.local` file in project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics and other services
VITE_GA_TRACKING_ID=your_google_analytics_id
```

### 3. Supabase Database Setup

1. Create a new Supabase project
2. Copy the SQL from `database-schema.sql`
3. Run it in Supabase SQL Editor
4. Enable Row Level Security policies
5. Get your project URL and anon key for `.env.local`

### 4. Smart Contract Information

The FlowBet contract is deployed on Flow EVM Testnet:

```
Contract Address: 0x2D8C5F975394AC57Db7810bb09f58e39099c74a5
Network: Flow EVM Testnet
Chain ID: 545
RPC: https://testnet.evm.nodes.onflow.org
Explorer: https://evm-testnet.flowscan.io
```

### 5. Installation & Running

```bash
# Clone the repository
git clone <your-repo-url>
cd flowbet

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔗 Network Configuration

### MetaMask Setup for Flow EVM Testnet

Add this network to MetaMask:

- **Network Name**: Flow EVM Testnet
- **RPC URL**: https://testnet.evm.nodes.onflow.org
- **Chain ID**: 545
- **Currency Symbol**: FLOW
- **Block Explorer**: https://evm-testnet.flowscan.io

### Get Testnet FLOW

1. Visit [Flow Faucet](https://testnet-faucet.onflow.org/)
2. Connect your wallet
3. Request testnet FLOW tokens
4. Use in FlowBet for deposits and transactions

## 📊 Database Schema

### Core Tables

#### `leaderboard`
```sql
- id (UUID, Primary Key)
- wallet_address (VARCHAR(42), Unique)
- total_winnings (DECIMAL(18,8))
- win_streak (INTEGER)
- total_bets (INTEGER)
- quiz_score (INTEGER)
- rank (INTEGER)
- created_at, updated_at (TIMESTAMPTZ)
```

#### `user_activity`
```sql
- id (UUID, Primary Key)
- wallet_address (VARCHAR(42))
- activity_type (ENUM: bet, claim, daily_claim, quiz, deposit, withdraw)
- description (TEXT)
- amount (DECIMAL(18,8))
- market_id (INTEGER)
- transaction_hash (VARCHAR(66))
- created_at (TIMESTAMPTZ)
```

#### `market_stats`
```sql
- id (UUID, Primary Key)
- market_id (INTEGER, Unique)
- total_volume (DECIMAL(18,8))
- unique_bettors (INTEGER)
- yes_percentage (DECIMAL(5,2))
- no_percentage (DECIMAL(5,2))
- last_updated (TIMESTAMPTZ)
```

## 🎮 How to Use

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection
- Switch to Flow EVM Testnet if prompted

### 2. Get PREDICT Tokens
- Go to Wallet section
- Enter FLOW amount to deposit
- Confirm transaction in MetaMask
- Receive PREDICT tokens 1:1 ratio

### 3. Place Bets
- Browse Markets section
- Select a market to bet on
- Choose YES or NO outcome
- Enter PREDICT token amount
- Confirm bet transaction

### 4. Daily Rewards
- Visit Dashboard daily
- Click "Claim Daily Reward"
- Maintain streak for multiplier bonuses
- Earn up to 1.5x base rewards

### 5. Solve Puzzles
- Go to Rewards Hub
- Answer brain teasers correctly
- Earn bonus PREDICT tokens
- Compete for quiz achievements

## 🛡️ Smart Contract Functions

### User Functions
```solidity
deposit() payable                          // Deposit FLOW → PREDICT
withdraw(uint256 amount)                   // Withdraw PREDICT → FLOW
bet(uint256 marketId, uint8 outcome, uint256 amount) // Place bet
claim(uint256 marketId)                    // Claim winnings
dailyClaim()                               // Daily reward claim
answerQuiz(uint256 quizId, string answer)  // Answer puzzle
```

### View Functions
```solidity
getMarket(uint256 marketId)               // Get market details
balanceOf(address user)                   // Get PREDICT balance
userStats(address user)                   // Get user statistics
canClaim(address user)                    // Check claim eligibility
quotePayout(marketId, outcome, stake)     // Estimate payout
```

### Owner Functions
```solidity
createMarket(question, resolveTime, oracle, isBinary) // Create market
resolveMarket(uint256 marketId, uint8 outcome)       // Resolve market
createQuiz(question, answerHash, reward, deadline)   // Create puzzle
```

## 🔐 Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Pausable**: Emergency stop functionality
- **Ownable**: Access control for admin functions
- **Rate Limiting**: 24-hour daily claim cooldown
- **Input Validation**: Comprehensive parameter checking
- **Safe Math**: Built-in overflow protection

## 📈 Analytics & Monitoring

The app tracks:
- **User Activity**: All transactions and interactions
- **Market Performance**: Volume, participants, outcomes
- **Daily Statistics**: Users, bets, markets created
- **Leaderboard Rankings**: Real-time competitive data

## 🎯 Roadmap

### Phase 1 ✅
- [x] Core prediction market functionality
- [x] Token deposit/withdrawal system
- [x] Daily rewards with streak system
- [x] Gamified UI with animations
- [x] Basic leaderboards

### Phase 2 🚧
- [ ] Multi-outcome markets (beyond binary)
- [ ] Social features and sharing
- [ ] Mobile app (React Native)
- [ ] Advanced trading features

### Phase 3 🔮
- [ ] Cross-chain integration
- [ ] NFT rewards and achievements
- [ ] DAO governance features
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Discord**: [FlowBet Community](https://discord.gg/flowbet)
- **Telegram**: [@FlowBetSupport](https://t.me/flowbetsupport)
- **Twitter**: [@FlowBetApp](https://twitter.com/flowbetapp)
- **Email**: support@flowbet.com

## ⚠️ Disclaimer

FlowBet is a testnet application for demonstration purposes. Do not use real funds. This is not financial advice. Gamble responsibly.

---

Built with 💜 for the Flow ecosystem. Happy betting! 🚀