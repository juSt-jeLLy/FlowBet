// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract FlowBet is ERC20, Ownable, ReentrancyGuard, Pausable {
    
    // Events
    event MarketCreated(uint256 indexed marketId, string question, uint256 resolveTime);
    event BetPlaced(uint256 indexed marketId, address indexed user, uint8 outcome, uint256 amount);
    event MarketResolved(uint256 indexed marketId, uint8 winningOutcome);
    event Claimed(uint256 indexed marketId, address indexed user, uint256 amount);
    event DailyClaimed(address indexed user, uint256 amount, uint256 streak);
    event QuizAnswered(uint256 indexed quizId, address indexed user, bool correct, uint256 reward);
    event Deposited(address indexed user, uint256 flowAmount, uint256 predictAmount);
    event Withdrawn(address indexed user, uint256 predictAmount, uint256 flowAmount);

    // Structs
    struct Market {
        string question;
        uint256 resolveTime;
        address oracle;
        bool isResolved;
        uint8 winningOutcome;
        uint256 totalPool;
        mapping(uint8 => uint256) pools; // outcome => pool amount
        mapping(address => mapping(uint8 => uint256)) userBets; // user => outcome => amount
        bool isBinary;
        uint256 createdAt;
        address creator;
    }

    struct Quiz {
        string question;
        bytes32 answerHash;
        uint256 reward;
        uint256 deadline;
        bool active;
        mapping(address => bool) hasAnswered;
    }

    struct UserStats {
        uint256 lastClaimTime;
        uint256 streak;
        uint256 totalClaims;
        uint256 totalEarnings;
    }

    // State variables
    mapping(uint256 => Market) public markets;
    mapping(uint256 => Quiz) public quizzes;
    mapping(address => UserStats) public userStats;
    
    uint256 public marketCounter;
    uint256 public quizCounter;
    uint256 public depositRate = 1e18; // 1 FLOW = 1 PREDICT
    uint256 public withdrawFee = 200; // 2% (basis points)
    uint256 public protocolFee = 200; // 2% (basis points)
    address public feeRecipient;
    uint256 public dailyReward = 100e18; // 100 PREDICT base reward
    
    constructor() ERC20("FlowBet Predict", "PREDICT") Ownable(msg.sender) {
        feeRecipient = msg.sender;
    }

    // Deposit FLOW to get PREDICT tokens
    function deposit() external payable whenNotPaused {
        require(msg.value > 0, "Must deposit some FLOW");
        
        uint256 predictAmount = (msg.value * depositRate) / 1e18;
        _mint(msg.sender, predictAmount);
        
        emit Deposited(msg.sender, msg.value, predictAmount);
    }

    // Withdraw PREDICT tokens to get FLOW
    function withdraw(uint256 predictAmount) external nonReentrant whenNotPaused {
        require(predictAmount > 0, "Must withdraw some PREDICT");
        require(balanceOf(msg.sender) >= predictAmount, "Insufficient balance");
        
        uint256 flowAmount = (predictAmount * 1e18) / depositRate;
        uint256 fee = (flowAmount * withdrawFee) / 10000;
        uint256 netAmount = flowAmount - fee;
        
        require(address(this).balance >= netAmount, "Insufficient contract balance");
        
        _burn(msg.sender, predictAmount);
        payable(msg.sender).transfer(netAmount);
        if (fee > 0) {
            payable(feeRecipient).transfer(fee);
        }
        
        emit Withdrawn(msg.sender, predictAmount, netAmount);
    }

    // Create a new market
    function createMarket(
        string memory question,
        uint256 resolveTime,
        address oracle,
        bool isBinary
    ) external returns (uint256) {
        require(resolveTime > block.timestamp, "Resolve time must be in future");
        require(bytes(question).length > 0, "Question cannot be empty");
        
        uint256 marketId = marketCounter++;
        Market storage market = markets[marketId];
        market.question = question;
        market.resolveTime = resolveTime;
        market.oracle = oracle;
        market.isBinary = isBinary;
        market.createdAt = block.timestamp;
        market.creator = msg.sender;
        
        emit MarketCreated(marketId, question, resolveTime);
        return marketId;
    }

    // Place a bet on a market
    function bet(uint256 marketId, uint8 outcome, uint256 amount) external nonReentrant whenNotPaused {
        Market storage market = markets[marketId];
        require(!market.isResolved, "Market already resolved");
        require(block.timestamp < market.resolveTime, "Market expired");
        require(amount > 0, "Bet amount must be positive");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        if (market.isBinary) {
            require(outcome == 0 || outcome == 1, "Invalid outcome for binary market");
        }
        
        _transfer(msg.sender, address(this), amount);
        
        market.pools[outcome] += amount;
        market.totalPool += amount;
        market.userBets[msg.sender][outcome] += amount;
        
        emit BetPlaced(marketId, msg.sender, outcome, amount);
    }

    // Resolve a market (only oracle or owner)
    function resolveMarket(uint256 marketId, uint8 winningOutcome) external {
        Market storage market = markets[marketId];
        require(!market.isResolved, "Market already resolved");
        require(
            msg.sender == market.oracle || msg.sender == owner(),
            "Only oracle or owner can resolve"
        );
        
        market.isResolved = true;
        market.winningOutcome = winningOutcome;
        
        emit MarketResolved(marketId, winningOutcome);
    }

    // Claim winnings from a resolved market
    function claim(uint256 marketId) external nonReentrant {
        Market storage market = markets[marketId];
        require(market.isResolved, "Market not resolved");
        
        uint256 userBet = market.userBets[msg.sender][market.winningOutcome];
        require(userBet > 0, "No winning bet to claim");
        
        market.userBets[msg.sender][market.winningOutcome] = 0;
        
        uint256 winningPool = market.pools[market.winningOutcome];
        uint256 payout = 0;
        
        if (winningPool > 0) {
            // Calculate protocol fee
            uint256 fee = (market.totalPool * protocolFee) / 10000;
            uint256 netPool = market.totalPool - fee;
            
            // Calculate user's share of the winning pool
            payout = (userBet * netPool) / winningPool;
            
            if (fee > 0) {
                _transfer(address(this), feeRecipient, fee);
            }
        }
        
        if (payout > 0) {
            _transfer(address(this), msg.sender, payout);
        }
        
        emit Claimed(marketId, msg.sender, payout);
    }

    // Daily claim system
    function dailyClaim() external nonReentrant whenNotPaused {
        UserStats storage stats = userStats[msg.sender];
        
        require(
            block.timestamp >= stats.lastClaimTime + 1 days,
            "Must wait 24 hours between claims"
        );
        
        // Update streak
        if (block.timestamp <= stats.lastClaimTime + 2 days) {
            stats.streak++;
        } else {
            stats.streak = 1;
        }
        
        stats.lastClaimTime = block.timestamp;
        stats.totalClaims++;
        
        // Calculate reward with multiplier
        uint256 multiplier = getStreakMultiplier(stats.streak);
        uint256 reward = (dailyReward * multiplier) / 1e18;
        
        stats.totalEarnings += reward;
        _mint(msg.sender, reward);
        
        emit DailyClaimed(msg.sender, reward, stats.streak);
    }

    // Create a quiz
    function createQuiz(
        string memory question,
        bytes32 answerHash,
        uint256 reward,
        uint256 deadline
    ) external onlyOwner returns (uint256) {
        require(deadline > block.timestamp, "Deadline must be in future");
        
        uint256 quizId = quizCounter++;
        Quiz storage quiz = quizzes[quizId];
        quiz.question = question;
        quiz.answerHash = answerHash;
        quiz.reward = reward;
        quiz.deadline = deadline;
        quiz.active = true;
        
        return quizId;
    }

    // Answer a quiz
    function answerQuiz(uint256 quizId, string memory answer) external nonReentrant whenNotPaused {
        Quiz storage quiz = quizzes[quizId];
        require(quiz.active, "Quiz not active");
        require(block.timestamp <= quiz.deadline, "Quiz expired");
        require(!quiz.hasAnswered[msg.sender], "Already answered this quiz");
        
        quiz.hasAnswered[msg.sender] = true;
        
        bytes32 answerHash = keccak256(abi.encodePacked(answer));
        bool correct = answerHash == quiz.answerHash;
        
        if (correct) {
            _mint(msg.sender, quiz.reward);
            userStats[msg.sender].totalEarnings += quiz.reward;
        }
        
        emit QuizAnswered(quizId, msg.sender, correct, correct ? quiz.reward : 0);
    }

    // View functions
    function getMarket(uint256 marketId) external view returns (
        string memory question,
        uint256 resolveTime,
        address oracle,
        bool isResolved,
        uint8 winningOutcome,
        uint256 totalPool,
        bool isBinary,
        uint256 createdAt,
        address creator
    ) {
        Market storage market = markets[marketId];
        return (
            market.question,
            market.resolveTime,
            market.oracle,
            market.isResolved,
            market.winningOutcome,
            market.totalPool,
            market.isBinary,
            market.createdAt,
            market.creator
        );
    }

    function getMarketPool(uint256 marketId, uint8 outcome) external view returns (uint256) {
        return markets[marketId].pools[outcome];
    }

    function getUserBet(uint256 marketId, address user, uint8 outcome) external view returns (uint256) {
        return markets[marketId].userBets[user][outcome];
    }

    function quotePayout(uint256 marketId, uint8 outcome, uint256 stake) external view returns (uint256) {
        Market storage market = markets[marketId];
        if (market.isResolved) return 0;
        
        uint256 newPool = market.pools[outcome] + stake;
        uint256 newTotalPool = market.totalPool + stake;
        uint256 fee = (newTotalPool * protocolFee) / 10000;
        uint256 netPool = newTotalPool - fee;
        
        return (stake * netPool) / newPool;
    }

    function getStreakMultiplier(uint256 streak) public pure returns (uint256) {
        if (streak < 7) return 1e18;          // 1.0x
        if (streak < 14) return 11e17;        // 1.1x  
        if (streak < 30) return 125e16;       // 1.25x
        return 15e17;                         // 1.5x
    }

    function canClaim(address user) external view returns (bool) {
        UserStats storage stats = userStats[user];
        return block.timestamp >= stats.lastClaimTime + 1 days;
    }

    // Admin functions
    function setDepositRate(uint256 newRate) external onlyOwner {
        depositRate = newRate;
    }

    function setWithdrawFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        withdrawFee = newFee;
    }

    function setProtocolFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        protocolFee = newFee;
    }

    function setFeeRecipient(address newRecipient) external onlyOwner {
        feeRecipient = newRecipient;
    }

    function setDailyReward(uint256 newReward) external onlyOwner {
        dailyReward = newReward;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Emergency withdrawal (only owner)
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}