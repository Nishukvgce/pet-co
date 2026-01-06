-- Add filter information columns to product table
-- These columns store extracted filter data from metadata.filters for efficient querying

-- Add brands column to store JSON array of brands
ALTER TABLE product ADD COLUMN brands TEXT COMMENT 'JSON array of brands';

-- Add life stages column to store JSON array of life stages  
ALTER TABLE product ADD COLUMN life_stages TEXT COMMENT 'JSON array of life stages';

-- Add breed sizes column to store JSON array of breed sizes
ALTER TABLE product ADD COLUMN breed_sizes TEXT COMMENT 'JSON array of breed sizes';

-- Add special diets column to store JSON array of special diets
ALTER TABLE product ADD COLUMN special_diets TEXT COMMENT 'JSON array of special diets';

-- Add protein sources column to store JSON array of protein sources
ALTER TABLE product ADD COLUMN protein_sources TEXT COMMENT 'JSON array of protein sources';

-- Add product weights column to store JSON array of available weights
ALTER TABLE product ADD COLUMN product_weights TEXT COMMENT 'JSON array of available weights';

-- Add price ranges column to store JSON array of price ranges
ALTER TABLE product ADD COLUMN price_ranges TEXT COMMENT 'JSON array of price ranges';

-- Create indexes for better query performance on commonly searched filter fields
CREATE INDEX idx_product_brands ON product (brands(255));
CREATE INDEX idx_product_life_stages ON product (life_stages(255));
CREATE INDEX idx_product_breed_sizes ON product (breed_sizes(255));
CREATE INDEX idx_product_special_diets ON product (special_diets(255));
CREATE INDEX idx_product_weights ON product (product_weights(255));
CREATE INDEX idx_product_price_ranges ON product (price_ranges(255));