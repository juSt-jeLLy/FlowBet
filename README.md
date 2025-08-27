# 🎮 FlowBet – Predict. Bet. Win. Ascend.

**FlowBet** is the **ultimate gamified prediction market** built on Flow EVM Testnet with pure brainrot energy! 🧠⚡ 

Create markets, place epic bets, earn daily rewards, solve mind-bending puzzles, and dominate the leaderboards. This isn't just betting—it's **financial gaming warfare**.

---

## 🚀 **What Makes FlowBet Legendary?**

### 🎯 **Core Prediction Engine**
* 💰 **Binary Markets:** Bet YES/NO on crypto moonshots, sports chaos, and custom wild events
* ⚡ **Real-time Odds:** Live pari-mutuel betting system that adapts faster than your portfolio tanks
* 🏗️ **Market Creation:** Owners can spawn new prediction battlegrounds
* 🤑 **Auto-Payouts:** Smart contract handles winnings like a crypto slot machine

### 💎 **Token Economics That Hit Different**
* 🔄 **FLOW ↔ PREDICT:** Seamless 1:1 token conversion system
* 📈 **Protocol Fees:** 2% withdrawal tax keeps the ecosystem thriving
* 🎁 **Staking Rewards:** Earn through multiple engagement vectors

### 🎮 **Gamification System (The Sauce)**
* 🗓️ **Daily Login Rewards:** Free tokens every 24 hours (don't break the chain!)
* 🔥 **Streak Multipliers:** 1.0x → 1.5x based on your commitment level
* 🧠 **Brain Teasers:** IQ-testing puzzles for bonus token drops
* 🏆 **Achievement System:** Common → Legendary status unlocks
* 📊 **Leaderboards:** Compete for digital supremacy and bragging rights

### 🎨 **UI/UX That Goes Hard**
* 🌃 **Cyberpunk Aesthetic:** Neon-soaked interface with particle effects
* ⚡ **Framer Motion Magic:** Buttery smooth animations and transitions  
* 📱 **Mobile-First Design:** Optimized for degens on the go
* 🔴 **Live Updates:** Real-time market data and push notifications

---

## 🔧 **Tech Stack (The Arsenal)**

### **🖥️ Frontend Weaponry**
| Technology | Purpose | Why We Chose It |
|------------|---------|-----------------|
| **React 18 + TypeScript** | Core framework | Type safety + modern hooks |
| **Vite** | Build tool | Lightning-fast dev experience |
| **Tailwind CSS** | Styling system | Utility-first responsive design |
| **Framer Motion** | Animations | Smooth AF transitions |
| **ethers.js** | Web3 integration | Rock-solid blockchain interactions |
| **React Query** | Data fetching | Smart caching + real-time sync |

### **⚡ Backend Infrastructure**
| Service | Role | Superpower |
|---------|------|------------|
| **Supabase** | Real-time database | PostgreSQL + instant subscriptions |
| **PostgreSQL** | Data persistence | ACID compliance + RLS security |
| **Real-time Subscriptions** | Live updates | WebSocket magic for instant UI sync |

### **🔗 Smart Contract Foundation**
| Component | Details | Security Level |
|-----------|---------|----------------|
| **Solidity 0.8.20** | Contract language | Latest features + security |
| **OpenZeppelin** | Security standards | Battle-tested libraries |
| **Flow EVM Testnet** | Deployment target | Fast + cheap transactions |
| **Safety Features** | ReentrancyGuard + Pausable | Fort Knox level protection |

---

## 🏗️ **System Architecture**

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   🎨 Frontend        │    │   💾 Supabase       │    │   ⛓️ Smart Contract │
│                     │    │                     │    │                     │
│ • React/TS Magic    │◄──►│ • PostgreSQL Core   │    │ • FlowBet.sol       │
│ • Web3 Context      │    │ • Real-time Engine  │    │ • ERC20 Token       │
│ • Contract Hooks    │    │ • Leaderboard Data  │    │ • Market Logic      │
│ • UI Components     │    │ • Activity Tracking │    │ • Rewards System    │
│ • Cyberpunk Theme   │    │ • Row-Level Security│    │ • Safety Guards     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

---

## 🛠️ **Setup Instructions (Level Up Your Dev Game)**

### **1. 📋 Prerequisites Checklist**
- ✅ **Node.js 18+** and npm installed
- ✅ **MetaMask** wallet extension ready
- ✅ **Supabase** account created
- ✅ **Flow EVM Testnet** FLOW tokens acquired

### **2. 🔧 Environment Configuration**

Create `.env.local` in your project root:

```bash
# 🚀 Supabase Configuration (Required)
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 📊 Optional: Analytics & Tracking
VITE_GA_TRACKING_ID=your_google_analytics_id
VITE_POSTHOG_KEY=your_posthog_project_key

# 🎮 Optional: Feature Flags
VITE_ENABLE_BETA_FEATURES=false
VITE_DEBUG_MODE=development
```

### **3. 🗄️ Supabase Database Setup**

**Step-by-step database initialization:**

1. 🌐 Create a new Supabase project at [supabase.com](https://supabase.com)
2. 📋 Copy the SQL schema from `database-schema.sql`
3. 🔧 Run the schema in Supabase SQL Editor
4. 🔒 Enable Row Level Security policies (critical for security!)
5. 📝 Grab your project URL and anon key for `.env.local`

### **4. ⛓️ Smart Contract Information**

**FlowBet Contract Deployment Details:**

```bash
📍 Contract Address: 0x2D8C5F975394AC57Db7810bb09f58e39099c74a5
🌐 Network: Flow EVM Testnet
🆔 Chain ID: 545
🔗 RPC Endpoint: https://testnet.evm.nodes.onflow.org
🔍 Block Explorer: https://evm-testnet.flowscan.io
```

### **5. 🚀 Installation & Launch Sequence**

```bash
# 📥 Clone the legendary codebase
git clone https://github.com/your-username/flowbet.git
cd flowbet

# 📦 Install all dependencies
npm install

# 🔥 Fire up development server
npm run dev

# 🏗️ Build for production deployment
npm run build

# 👀 Preview production build locally
npm run preview

# 🧪 Run test suite
npm run test

# 🔍 Lint and format code
npm run lint
npm run format
```

---

## 🔗 **Flow EVM Testnet Configuration**

### **🦊 MetaMask Network Setup**

Add this network configuration to MetaMask:

| Setting | Value |
|---------|--------|
| **Network Name** | Flow EVM Testnet |
| **RPC URL** | `https://testnet.evm.nodes.onflow.org` |
| **Chain ID** | `545` |
| **Currency Symbol** | `FLOW` |
| **Block Explorer** | `https://evm-testnet.flowscan.io` |

### **💰 Getting Testnet FLOW Tokens**

1. 🌊 Visit the [Flow Faucet](https://testnet-faucet.onflow.org/)
2. 🔌 Connect your MetaMask wallet
3. 💧 Request free testnet FLOW tokens
4. ⏳ Wait for confirmation (usually < 30 seconds)
5. 🎮 Start using FlowBet with your new tokens!

---

## 📊 **Database Schema (The Data Architecture)**

### **🏆 Core Tables Overview**

#### **`leaderboard` - The Hall of Fame**
```sql
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  total_winnings DECIMAL(18,8) DEFAULT 0,
  win_streak INTEGER DEFAULT 0,
  total_bets INTEGER DEFAULT 0,
  quiz_score INTEGER DEFAULT 0,
  rank INTEGER,
  achievements TEXT[],
  last_daily_claim TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **`user_activity` - The Action Log**
```sql
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) NOT NULL,
  activity_type activity_enum NOT NULL,
  description TEXT,
  amount DECIMAL(18,8),
  market_id INTEGER,
  transaction_hash VARCHAR(66),
  block_number BIGINT,
  gas_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity types: 'bet', 'claim', 'daily_claim', 'quiz', 'deposit', 'withdraw'
```

#### **`market_stats` - Market Intelligence**
```sql
CREATE TABLE market_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id INTEGER UNIQUE NOT NULL,
  total_volume DECIMAL(18,8) DEFAULT 0,
  unique_bettors INTEGER DEFAULT 0,
  yes_percentage DECIMAL(5,2) DEFAULT 50.00,
  no_percentage DECIMAL(5,2) DEFAULT 50.00,
  prediction_accuracy DECIMAL(5,2),
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🎮 **How to Dominate FlowBet (User Guide)**

### **1. 🔌 Connect Your Wallet**
- Click the **"Connect Wallet"** button in the top right
- Approve MetaMask connection request
- Switch to Flow EVM Testnet if prompted
- Your wallet address appears in the UI ✨

### **2. 💰 Acquire PREDICT Tokens**
- Navigate to the **Wallet** section
- Enter desired FLOW amount to deposit
- Confirm the transaction in MetaMask
- Receive PREDICT tokens at 1:1 ratio instantly
- *Pro Tip: Start with small amounts to test the system*

### **3. 🎯 Master the Art of Betting**
- Browse the **Markets** section for active predictions
- Select a market that speaks to your soul
- Choose **YES** or **NO** outcome
- Enter your PREDICT token stake amount
- Review odds and potential payout
- Confirm bet transaction and wait for magic ⚡

### **4. 🗓️ Maximize Daily Rewards**
- Visit **Dashboard** daily (seriously, don't miss it!)
- Click **"Claim Daily Reward"** button
- Maintain consecutive login streaks
- Watch your multiplier grow: 1.0x → 1.5x
- *Golden Rule: Consistency = Profit*

### **5. 🧠 Conquer the Brain Teasers**
- Head to the **Rewards Hub**
- Tackle mind-bending puzzles and riddles
- Submit correct answers for bonus tokens
- Build your quiz score for leaderboard dominance
- Unlock **Puzzle Master** achievements

---

## 🛡️ **Smart Contract Functions (Dev Reference)**

### **👤 User-Facing Functions**

```solidity
// 💰 Token Management
function deposit() external payable;                    // Deposit FLOW → PREDICT
function withdraw(uint256 amount) external;             // Withdraw PREDICT → FLOW

// 🎲 Betting Functions  
function bet(uint256 marketId, uint8 outcome, uint256 amount) external;
function claim(uint256 marketId) external;              // Claim your winnings

// 🎁 Gamification Functions
function dailyClaim() external;                         // 24-hour reward claim
function answerQuiz(uint256 quizId, string memory answer) external;
```

### **👁️ View Functions (Read-Only)**

```solidity
// 📊 Market Data
function getMarket(uint256 marketId) external view returns (Market memory);
function getMarketStats(uint256 marketId) external view returns (uint256, uint256);

// 👤 User Information
function balanceOf(address user) external view returns (uint256);
function userStats(address user) external view returns (UserStats memory);
function canClaim(address user) external view returns (bool);

// 💡 Betting Intelligence
function quotePayout(uint256 marketId, uint8 outcome, uint256 stake) 
    external view returns (uint256);
```

### **👑 Owner/Admin Functions**

```solidity
// 🏗️ Market Management
function createMarket(
    string memory question,
    uint256 resolveTime,
    address oracle,
    bool isBinary
) external onlyOwner returns (uint256);

function resolveMarket(uint256 marketId, uint8 outcome) external onlyOwner;

// 🧩 Quiz Management
function createQuiz(
    string memory question,
    bytes32 answerHash,
    uint256 reward,
    uint256 deadline
) external onlyOwner returns (uint256);
```

---

## 🔐 **Security Features (Fort Knox Level)**

### **🛡️ Smart Contract Security**
- ✅ **ReentrancyGuard:** Prevents reentrancy attack vectors
- ✅ **Pausable:** Emergency stop mechanism for critical situations
- ✅ **Ownable:** Role-based access control for admin functions
- ✅ **Rate Limiting:** 24-hour cooldown on daily claims
- ✅ **Input Validation:** Comprehensive parameter sanitization
- ✅ **SafeMath:** Built-in overflow/underflow protection

### **🔒 Frontend Security**
- ✅ **Environment Variables:** Sensitive keys stored securely
- ✅ **HTTPS Enforcement:** All communications encrypted
- ✅ **Input Sanitization:** XSS prevention on all user inputs
- ✅ **Wallet Validation:** Address format verification
- ✅ **Transaction Verification:** Double-confirmation on critical actions

---

## 📈 **Analytics & Performance Monitoring**

### **📊 Tracked Metrics**
| Category | Metrics | Purpose |
|----------|---------|---------|
| **User Engagement** | DAU, WAU, MAU, Session Duration | Growth analytics |
| **Financial Activity** | Total Volume, Bet Frequency, Win Rates | Economic health |
| **Market Performance** | Accuracy, Participation, Liquidity | Market quality |
| **Gamification** | Streaks, Achievements, Quiz Scores | Engagement optimization |

### **🔍 Real-Time Monitoring**
- **Supabase Analytics:** Database performance and query optimization
- **Web3 Events:** On-chain transaction monitoring and error tracking  
- **User Experience:** Page load times, interaction latency, error rates
- **Business Intelligence:** Revenue metrics, user lifetime value, churn analysis

---

## 🤝 **Contributing to the Revolution**

### **🔥 How to Contribute**

1. **🍴 Fork the Repository**
   ```bash
   git clone https://github.com/your-username/flowbet.git
   cd flowbet
   ```

2. **🌿 Create Feature Branch**
   ```bash
   git checkout -b feature/your-amazing-feature
   ```

3. **💻 Write Epic Code**
   - Follow our TypeScript/Solidity style guides
   - Add comprehensive tests for new functionality
   - Update documentation for API changes

4. **✅ Test Everything**
   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   ```

5. **🚀 Submit Pull Request**
   ```bash
   git commit -m 'feat: add incredible new feature'
   git push origin feature/your-amazing-feature
   ```

---

## 📄 **License & Legal**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for full details.

### **⚠️ Important Disclaimers**

- **🧪 Testnet Only:** FlowBet operates on Flow EVM Testnet for demonstration purposes
- **💸 No Real Money:** Do not deposit real funds - testnet tokens only
- **📚 Not Financial Advice:** This platform is for entertainment and educational purposes
- **🎲 Responsible Gaming:** Users must be 18+ and gamble responsibly
- **🔒 Beta Software:** Use at your own risk during testing phases

---

## 🎊 **Final Words**

FlowBet isn't just another prediction market—it's a **revolution in blockchain gaming** that combines the thrill of betting with the addictive nature of gamification. We're building the future where predictions, rewards, and community converge in a cyberpunk paradise.

**Ready to ascend the leaderboards?** 🚀

**Built with 💜 for the Flow ecosystem by degens, for degens.**

*Happy betting, and may the odds be forever in your favor!* 🎲✨