-- Add columns for manufacturer details captured in admin UI
ALTER TABLE `product`
  ADD COLUMN `sku` VARCHAR(150) DEFAULT NULL,
  ADD COLUMN `country_of_origin` VARCHAR(150) DEFAULT NULL,
  ADD COLUMN `manufacturer_address` TEXT DEFAULT NULL,
  ADD COLUMN `marketed_by` TEXT DEFAULT NULL;
