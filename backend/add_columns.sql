-- Add missing columns to requests table
USE maintainance_tracker;

-- Add notes column if it doesn't exist
ALTER TABLE requests 
ADD COLUMN IF NOT EXISTS notes TEXT AFTER feedback_rating;

-- Add feedback_comments column if it doesn't exist  
ALTER TABLE requests 
ADD COLUMN IF NOT EXISTS feedback_comments TEXT AFTER feedback_rating;

-- Verify the structure
DESCRIBE requests;
