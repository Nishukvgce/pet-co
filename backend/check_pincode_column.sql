-- Check if pincode column exists in users table
DESCRIBE users;

-- Show current users and their pincode values
SELECT id, name, email, pincode FROM users LIMIT 10;