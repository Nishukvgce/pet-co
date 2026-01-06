# Product Database Structure - Filter Information Storage

## Overview
The product data structure has been optimized to store each piece of information in appropriate separate columns while maintaining variants and images in metadata as complete information objects.

## Database Schema Changes

### New Filter Information Columns
The following columns have been added to the `product` table to store extracted filter data:

| Column Name | Type | Description |
|-------------|------|-------------|
| `brands` | TEXT | JSON array of applicable brands `["Brand1", "Brand2"]` |
| `life_stages` | TEXT | JSON array of life stages `["Adult", "Puppy", "Senior"]` |
| `breed_sizes` | TEXT | JSON array of breed sizes `["Small Breed", "Large Breed"]` |
| `special_diets` | TEXT | JSON array of special diets `["Organic", "Grain Free"]` |
| `protein_sources` | TEXT | JSON array of protein sources `["Chicken", "Fish", "Beef"]` |
| `product_weights` | TEXT | JSON array of available weights `["50", "100", "1"]` |
| `price_ranges` | TEXT | JSON array of price ranges `["INR 10 - INR 300"]` |

### Existing Column Usage
Individual product attributes continue to be stored in dedicated columns:
- `name`, `description`, `brand`, `category`, `subcategory`
- `price`, `originalPrice`, `stockQuantity`, `inStock`
- `pet_type`, `food_type`, `type`
- `material`, `scent`, `texture`, `weight_unit`
- Nutrition fields: `nutrition_protein`, `nutrition_fat`, etc.
- Pharmacy fields: `dosage_form`, `strength`, etc.

### Metadata Structure (LONGTEXT JSON)
The `metadata` column now contains only essential complex structures:

```json
{
  "variants": [
    {
      "id": "default",
      "weight": "50", 
      "unitType": "weight",
      "weightUnit": "g",
      "price": 100,
      "originalPrice": 300,
      "stock": 999
    }
  ],
  "images": [
    "http://localhost:8081/api/admin/products/images/1767682557766_image.jpg",
    "http://localhost:8081/api/admin/products/images/1767682557775_image.jpg"
  ],
  "features": ["Feature 1", "Feature 2"],
  "nutrition": {
    "protein": "25%",
    "fat": "15%"
  }
}
```

## Data Flow Process

### 1. Input Processing
When product data is received with this structure:
```json
{
  "filters": {
    "brands": ["kk"],
    "dogCat": ["Dog"],
    "weights": ["50", "100", "1"],
    "priceRanges": ["INR 10 - INR 300"]
  },
  "variants": [...],
  "images": [...]
}
```

### 2. Normalization (`normalizeAndExtractFields`)
- Extracts `filters.brands` → `brands` column
- Extracts `filters.weights` → `product_weights` column  
- Extracts `filters.priceRanges` → `price_ranges` column
- Keeps `variants` in `metadata.variants`
- Keeps `images` in `metadata.images`

### 3. Cleanup (`filterNullFields`)
- Sets empty strings to `null` 
- Removes zero price values
- Cleans up all filter columns

### 4. Metadata Cleanup
- Removes duplicated data from metadata after extraction
- Removes `filters` object from metadata after column extraction
- Keeps only essential structures (variants, images, features, nutrition)

## Benefits

### 1. Efficient Querying
- Direct SQL queries on filter columns: `WHERE brands LIKE '%Brand1%'`
- Indexed columns for fast search performance
- No need to parse JSON in WHERE clauses

### 2. Data Integrity
- Each piece of information stored once in appropriate location
- No duplication between columns and metadata
- Variants stored as complete objects with all unit information preserved

### 3. Clean API Responses
- No more duplicate `variants` at root level and in metadata
- No more duplicate `images` at root level and in metadata
- Smaller JSON payload sizes

### 4. Frontend Compatibility
The `enrichProductMetadata` method reconstructs filter information for frontend:
```json
{
  "metadata": {
    "filters": {
      "brands": ["kk"],
      "weights": ["50", "100", "1"]
    },
    "variants": [...],
    "images": [...]
  }
}
```

## Implementation Notes

### Variant Storage
- Variants remain complete objects in `metadata.variants`
- Unit fields (`weightUnit`, `sizeUnit`) preserved exactly as entered
- No extraction to separate columns (variants are complex relational data)

### Image Storage  
- Images stored as array in `metadata.images`
- Primary image also stored in `imageUrl` column for backward compatibility
- No duplication at root level

### Database Migration
Apply the migration script `add_filter_columns.sql` to add new columns and indexes.

This structure ensures clean separation of concerns while maintaining efficient queryability and data integrity.