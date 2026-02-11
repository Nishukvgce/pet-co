-- Add service-specific columns to service_bookings table
-- This migration adds dedicated fields for different service types

-- Veterinary Service specific fields
ALTER TABLE service_bookings 
ADD COLUMN symptoms LONGTEXT COMMENT 'Current symptoms/concerns for veterinary services',
ADD COLUMN medical_history LONGTEXT COMMENT 'Previous medical history',
ADD COLUMN current_medications LONGTEXT COMMENT 'Current medications',
ADD COLUMN urgency VARCHAR(50) COMMENT 'Urgency level: emergency, urgent, normal',
ADD COLUMN preferred_platform VARCHAR(100) COMMENT 'For video consultation: zoom, teams, etc.',
ADD COLUMN home_address LONGTEXT COMMENT 'For home visit service',
ADD COLUMN access_instructions LONGTEXT COMMENT 'Access instructions for home visit';

-- Pet Walking specific fields  
ALTER TABLE service_bookings
ADD COLUMN walk_duration VARCHAR(50) COMMENT 'Walking duration: 30min, 45min, 60min',
ADD COLUMN route_preference LONGTEXT COMMENT 'Preferred walking routes',
ADD COLUMN behavior_notes LONGTEXT COMMENT 'Pet behavior notes',
ADD COLUMN walking_rules LONGTEXT COMMENT 'Walking specific rules and preferences (JSON)';

-- Pet Boarding specific fields
ALTER TABLE service_bookings
ADD COLUMN check_in_date DATE COMMENT 'Boarding check-in date',
ADD COLUMN check_out_date DATE COMMENT 'Boarding check-out date',
ADD COLUMN check_in_time VARCHAR(20) COMMENT 'Check-in time',
ADD COLUMN check_out_time VARCHAR(20) COMMENT 'Check-out time',  
ADD COLUMN dietary_requirements LONGTEXT COMMENT 'Special dietary needs',
ADD COLUMN emergency_contact VARCHAR(100) COMMENT 'Emergency contact for boarding',
ADD COLUMN vaccination_up_to_date BOOLEAN COMMENT 'Vaccination status';

-- Pet Grooming specific fields
ALTER TABLE service_bookings
ADD COLUMN package_type VARCHAR(100) COMMENT 'Package type: fresh-pack, pampered-pack, full-grooming',
ADD COLUMN selected_add_ons LONGTEXT COMMENT 'Selected grooming add-ons (JSON)',
ADD COLUMN grooming_preferences LONGTEXT COMMENT 'Special grooming requests',
ADD COLUMN temperament VARCHAR(100) COMMENT 'Pet temperament notes';

-- Add indexes for service-specific queries
CREATE INDEX idx_service_bookings_veterinary ON service_bookings(service_type, urgency) WHERE service_type IN ('veterinary_appointment', 'veterinary_home_visit', 'veterinary_video_consultation');
CREATE INDEX idx_service_bookings_walking ON service_bookings(service_type, walk_duration) WHERE service_type = 'pet-walking';
CREATE INDEX idx_service_bookings_boarding ON service_bookings(service_type, check_in_date, check_out_date) WHERE service_type = 'pet-boarding';
CREATE INDEX idx_service_bookings_grooming ON service_bookings(service_type, package_type) WHERE service_type LIKE '%grooming%';

-- Update existing records to set appropriate service types if needed
UPDATE service_bookings 
SET service_type = 'veterinary_appointment' 
WHERE service_name LIKE '%veterinary%' OR service_name LIKE '%appointment%'
  AND service_type IS NULL OR service_type = 'unknown';

UPDATE service_bookings 
SET service_type = 'veterinary_home_visit' 
WHERE service_name LIKE '%home visit%' OR service_name LIKE '%home%'
  AND service_name LIKE '%veterinary%'
  AND service_type IS NULL OR service_type = 'unknown';

UPDATE service_bookings 
SET service_type = 'veterinary_video_consultation' 
WHERE service_name LIKE '%video%' OR service_name LIKE '%consultation%'
  AND service_name LIKE '%veterinary%'
  AND service_type IS NULL OR service_type = 'unknown';