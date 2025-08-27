-- First, drop the existing check constraint
ALTER TABLE user_activity DROP CONSTRAINT user_activity_activity_type_check;

-- Then, add the new check constraint with the additional type
ALTER TABLE user_activity ADD CONSTRAINT user_activity_activity_type_check 
CHECK (activity_type IN ('bet', 'claim', 'daily_claim', 'quiz', 'deposit', 'withdraw', 'resolve_market'));
