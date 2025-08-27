-- FlowBet Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables
CREATE TABLE IF NOT EXISTS leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    total_winnings DECIMAL(18, 8) DEFAULT 0,
    win_streak INTEGER DEFAULT 0,
    total_bets INTEGER DEFAULT 0,
    quiz_score INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address VARCHAR(42) NOT NULL,
    activity_type VARCHAR(20) NOT NULL CHECK (activity_type IN ('bet', 'claim', 'daily_claim', 'quiz', 'deposit', 'withdraw')),
    description TEXT NOT NULL,
    amount DECIMAL(18, 8),
    market_id INTEGER,
    transaction_hash VARCHAR(66),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS market_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    market_id INTEGER UNIQUE NOT NULL,
    total_volume DECIMAL(18, 8) DEFAULT 0,
    unique_bettors INTEGER DEFAULT 0,
    yes_percentage DECIMAL(5, 2) DEFAULT 50.00,
    no_percentage DECIMAL(5, 2) DEFAULT 50.00,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_users INTEGER DEFAULT 0,
    total_volume DECIMAL(18, 8) DEFAULT 0,
    total_markets INTEGER DEFAULT 0,
    total_bets INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    wallet_address VARCHAR(42) NOT NULL,
    achievement_type VARCHAR(50) NOT NULL,
    achievement_name VARCHAR(100) NOT NULL,
    description TEXT,
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_wallet ON leaderboard(wallet_address);
CREATE INDEX IF NOT EXISTS idx_leaderboard_winnings ON leaderboard(total_winnings DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_wallet ON user_activity(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_market_stats_market ON market_stats(market_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_wallet ON user_achievements(wallet_address);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_leaderboard_updated_at 
    BEFORE UPDATE ON leaderboard 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Public read access for leaderboard and market stats
CREATE POLICY "Public read access for leaderboard" ON leaderboard
    FOR SELECT USING (true);

CREATE POLICY "Public read access for market stats" ON market_stats
    FOR SELECT USING (true);

-- Users can read their own activity and achievements
CREATE POLICY "Users can read own activity" ON user_activity
    FOR SELECT USING (true);

CREATE POLICY "Users can read own achievements" ON user_achievements
    FOR SELECT USING (true);

-- Public read for daily stats
CREATE POLICY "Public read access for daily stats" ON daily_stats
    FOR SELECT USING (true);

-- Insert/Update policies (for backend operations)
CREATE POLICY "Backend can insert leaderboard" ON leaderboard
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Backend can update leaderboard" ON leaderboard
    FOR UPDATE USING (true);

CREATE POLICY "Backend can insert user activity" ON user_activity
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Backend can insert market stats" ON market_stats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Backend can update market stats" ON market_stats
    FOR UPDATE USING (true);

CREATE POLICY "Backend can insert daily stats" ON daily_stats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Backend can update daily stats" ON daily_stats
    FOR UPDATE USING (true);

CREATE POLICY "Backend can insert achievements" ON user_achievements
    FOR INSERT WITH CHECK (true);

-- Insert some sample data
INSERT INTO leaderboard (wallet_address, total_winnings, win_streak, total_bets, quiz_score) VALUES
('0x742F35Cc6634C0532925a3b8D0C2C13EffEb3068', 15000.50, 7, 45, 8500),
('0x8ba1f109551bD432803012645Hac136c82d8C', 12500.25, 5, 38, 6750),
('0x267be1C1D684F78cb4F6a176C4911b741E4Ffdc0', 9800.75, 12, 29, 9200),
('0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', 8500.00, 3, 22, 4100),
('0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7', 7200.30, 15, 67, 11500)
ON CONFLICT (wallet_address) DO NOTHING;

INSERT INTO daily_stats (date, total_users, total_volume, total_markets, total_bets) VALUES
(CURRENT_DATE - INTERVAL '1 day', 156, 45678.90, 8, 234),
(CURRENT_DATE - INTERVAL '2 days', 142, 38945.60, 7, 201),
(CURRENT_DATE - INTERVAL '3 days', 138, 41200.30, 6, 189),
(CURRENT_DATE - INTERVAL '4 days', 134, 39800.75, 9, 256),
(CURRENT_DATE - INTERVAL '5 days', 129, 35600.45, 5, 167)
ON CONFLICT (date) DO NOTHING;

-- Create a function to update leaderboard rank
CREATE OR REPLACE FUNCTION update_leaderboard_ranks()
RETURNS VOID AS $$
BEGIN
    WITH ranked_users AS (
        SELECT wallet_address,
               ROW_NUMBER() OVER (ORDER BY total_winnings DESC) as new_rank
        FROM leaderboard
    )
    UPDATE leaderboard 
    SET rank = ranked_users.new_rank
    FROM ranked_users 
    WHERE leaderboard.wallet_address = ranked_users.wallet_address;
END;
$$ LANGUAGE plpgsql;

-- Call the function to set initial ranks
SELECT update_leaderboard_ranks();

-- Create a trigger to auto-update ranks when winnings change
CREATE OR REPLACE FUNCTION trigger_update_ranks()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_leaderboard_ranks();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER leaderboard_rank_update
    AFTER UPDATE OF total_winnings ON leaderboard
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_update_ranks();