-- Add pincode column to users table for delivery location tracking
-- Pincode starting with 560 indicates Bangalore delivery area

ALTER TABLE users ADD COLUMN pincode VARCHAR(6);

-- Add index for faster pincode lookups (optional but recommended)
CREATE INDEX idx_users_pincode ON users(pincode);

-- Update existing test users with sample pincodes for testing (optional)
-- Bangalore pincodes start with 560
UPDATE users 
SET pincode = '560001' 
WHERE email = 'admin@petco.com' AND pincode IS NULL;

UPDATE users 
SET pincode = '560001' 
WHERE email = 'nishu@gmail.com' AND pincode IS NULL;