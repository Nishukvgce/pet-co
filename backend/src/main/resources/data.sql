-- Ensure the service_bookings table exists and is properly configured
-- This will run after Hibernate creates the table to add any missing configurations

-- Create indexes for better performance (MySQL compatible syntax)
CREATE INDEX idx_service_type ON service_bookings(service_type);
CREATE INDEX idx_preferred_date ON service_bookings(preferred_date);
CREATE INDEX idx_status ON service_bookings(status);

-- Ensure the table can handle pet walking service types
-- Verify column lengths are sufficient for pet-walking service types
ALTER TABLE service_bookings 
MODIFY COLUMN service_type VARCHAR(50) NOT NULL DEFAULT 'unknown',
MODIFY COLUMN service_name VARCHAR(100) NOT NULL DEFAULT 'Unknown Service';

-- Add comment to identify pet walking support
ALTER TABLE service_bookings COMMENT = 'Service bookings for all pet services: grooming, boarding, walking';

-- Create admin user if not exists (for development/testing)
-- Use INSERT IGNORE for MySQL compatibility
INSERT IGNORE INTO users (email, name, password_hash, phone, role, is_active, loyalty_points, total_orders, member_since, created_at, updated_at, last_password_change)
VALUES (
    'admin@petco.com',
    'Admin',
    'admin123',
    '9845651468',
    'ADMIN', 
    true,
    0,
    0,
    '2025-09-24',
    '2025-09-24 10:35:10',
    '2025-09-24 10:35:10',
    '2025-09-24 10:35:10'
);
