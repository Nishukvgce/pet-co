// Enhanced category filters with proper type-category-subcategory hierarchy

const DEFAULT_SORT_OPTIONS = [
  'Featured',
  'Best selling',
  'Alphabetically, A-Z',
  'Alphabetically, Z-A',
  'Price, low to high',
  'Price, high to low',
  'Date, old to new',
  'Date, new to old'
];

// Helper functions for building filter configurations
const buildSection = (id, label, options = [], meta = {}) => ({
  id,
  label,
  options,
  ...meta
});

const buildSubcategoryConfig = (label, sections, meta = {}) => ({
  label,
  topFilters: sections.map(section => section.label),
  sections,
  sortOptions: DEFAULT_SORT_OPTIONS,
  ...meta
});

// Type-level configuration
export const PRODUCT_TYPES = {
  DOG: 'Dog',
  CAT: 'Cat',
  PHARMACY: 'Pharmacy',
  OUTLET: 'Outlet',
  RABBIT: 'Rabbit',
  FISH: 'Fish',
  BIRD: 'Bird',
  PET_PARENT: 'Pet Parent'
};

// Category mappings for consistent naming
export const CATEGORY_MAPPINGS = {
  // Dog categories
  'dog-food': 'Dog Food',
  'dogfood': 'Dog Food',
  'food': 'Dog Food',
  'dog-treats': 'Dog Treats',
  'dogtreats': 'Dog Treats',
  'treats': 'Dog Treats',
  'dog-toys': 'Dog Toys',
  'dogtoys': 'Dog Toys',
  'toys': 'Dog Toys',
  'dog-grooming': 'Dog Grooming',
  'doggrooming': 'Dog Grooming',
  'grooming': 'Dog Grooming',
  
  // Cat categories
  'cat-food': 'Cat Food',
  'catfood': 'Cat Food',
  'cat-treats': 'Cat Treats',
  'cattreats': 'Cat Treats',
  'cat-toys': 'Cat Toys',
  'cattoys': 'Cat Toys',
  'cat-grooming': 'Cat Grooming',
  'catgrooming': 'Cat Grooming'
};

// Subcategory mappings for consistent naming
export const SUBCATEGORY_MAPPINGS = {
  'dry': 'Dry Food',
  'dry-food': 'Dry Food',
  'wet': 'Wet Food',
  'wet-food': 'Wet Food',
  'grain-free': 'Grain Free',
  'grainfree': 'Grain Free',
  'puppy': 'Puppy Food',
  'puppy-food': 'Puppy Food',
  'kitten': 'Kitten Food',
  'kitten-food': 'Kitten Food',
  'hypoallergenic': 'Hypoallergenic',
  'hypo': 'Hypoallergenic',
  'veterinary': 'Veterinary Food',
  'vet': 'Veterinary Food',
  'veterinary-food': 'Veterinary Food',
  'chicken-free': 'Chicken Free',
  'chickenfree': 'Chicken Free'
};

const dogFoodSections = [
  // Age / Life stage first (puppy, adult, senior)
  buildSection('lifeStages', 'Life Stage', ['Puppy', 'Adult', 'Senior']),

  // Breed size (Small / Medium / Large etc.)
  buildSection('breedSizes', 'Breed Size', ['Mini', 'Small', 'Medium', 'Large', 'Giant', 'Max']),

  // Specific breeds (helps product filtering by targeted breeds)
  buildSection('breeds', 'Breed', [
    'Labrador Retriever', 'German Shepherd', 'Golden Retriever', 'Bulldog', 'Beagle', 'Pug', 'Boxer', 'Dachshund', 'Shih Tzu', 'Chihuahua', 'Rottweiler', 'Doberman', 'Siberian Husky', 'Corgi', 'Maltese', 'All Breeds'
  ]),

  // Brand list next
  buildSection('brands', 'Brand', [
    'Pet and Co',
    'Hearty',
    'Royal Canin',
    "Sara's",
    'Farmina',
    'Pedigree',
    'Acana',
    'Applaws',
    'Drools'
  ]),

  // Veg / Non-Veg
  buildSection('foodType', 'Veg / Non-Veg', ['Vegetarian', 'Non-Vegetarian']),

  // Product / sub-type
  buildSection('productTypes', 'Product Type', ['Combo', 'Dry Food', 'Baked Dry Food', 'Fresh Food', 'Food Toppers', 'Treat', 'Wet Food']),

  // Special diets and attributes
  buildSection('specialDiets', 'Special Diet', ['60% Protein', '100% Vegetarian', 'Chicken Free', 'Grain Free', 'High Protein', 'Hypoallergenic']),

  buildSection('proteinSource', 'Protein Source', ['Chicken', 'Fish', 'Turkey', 'Lamb', 'Beef', 'Egg', 'Duck', 'Fruits', 'Vegetables']),

  // Price ranges
  buildSection('priceRanges', 'Price', ['INR 10 - INR 300', 'INR 301 - INR 500', 'INR 501 - INR 1000', 'INR 1000 - INR 2000', 'INR 2000+']),

  // Weights for product filter
  buildSection('weights', 'Weight', ['70 g', '100 g', '150 g', '200 g', '300 g', '340 g', '370 g', '400 g', '500 g', '800 g', '1 kg', '1.5 kg', '2 kg', '3 kg', '5 kg', '10 kg', '20 kg']),

  buildSection('sizes', 'Size', ['1.5 kg', '4 kg'])
];

const dogGroomingSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('productTypes', 'Product Type', ['Combo', 'Dry Food', 'Wet Food', 'Food Toppers', 'Treat']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large'])
];

const catFoodSections = [
  buildSection('brands', 'Brand', ['Meowsi', 'Royal Canin', 'Whiskas', 'Purina', 'Applaws', 'Friskies', "Hill's", 'IAMS', 'Felix']),
  buildSection('dogCat', 'Dog/Cat', ['Cat', 'Dog']),
  buildSection('catKitten', 'Cat/Kitten', ['Kitten', 'Adult Cat']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('productTypes', 'Product Type', ['Combo', 'Dry Food', 'Wet Food', 'Food Toppers', 'Treat']),
  buildSection('specialDiets', 'Special Diet', ['Grain Free', 'Hypoallergenic', 'Chicken Free', 'Indoor Formula', 'Weight Control']),
  buildSection('proteinSource', 'Protein Source', ['Chicken', 'Fish', 'Turkey', 'Beef', 'Salmon', 'Tuna', 'Duck']),
  buildSection('priceRanges', 'Price', ['INR 10 - INR 300', 'INR 301 - INR 500', 'INR 501 - INR 1000', 'INR 1000 - INR 2000', 'INR 2000+']),
  buildSection('weights', 'Weight', ['70 g', '85 g', '100 g', '170 g', '300 g', '400 g', '500 g', '800 g', '1 kg', '1.5 kg', '2 kg', '3 kg', '5 kg', '10 kg']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large']),
  buildSection('subCategories', 'Sub Category', ['Dry Food', 'Wet Food', 'Daily Meals', 'Grain Free', 'Kitten Food', 'Hypoallergenic', 'Veterinary Food', 'Food Toppers & Gravy'])
];

const catCollarsAccessorySections = [
  buildSection('brands', 'Brand', ['Pet and Co', 'FashiCat', 'Paw Couture']),
  buildSection('materials', 'Material', ['Leather', 'Nylon', 'Velvet', 'Metal Chain']),
  buildSection('usage', 'Usage', ['Daily Wear', 'Training', 'Personalised', 'Safety Release']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['XS', 'S', 'M', 'L']),
  buildSection('subCategories', 'Sub Category', ['Collars', 'Leash & Harness Set', 'Name Tags', 'Bow Ties & Bandanas'])
];

const pharmacyDogSections = [
  buildSection('brands', 'Brand', ['Himalaya', 'Drools', 'Pedigree', 'Royal Canin', 'Farmina']),
  buildSection('petTypes', 'Pet Type', ['Dog']),
  buildSection('conditions', 'Condition', ['Skin Issues', 'Joint Pain', 'Digestive Problems', 'Dental Care']),
  buildSection('productTypes', 'Product Type', ['Medicine', 'Supplement', 'Prescription Food']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large'])
];

const catGroomingSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('productTypes', 'Product Type', ['Combo', 'Dry Food', 'Wet Food', 'Food Toppers', 'Treat']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large'])
];

const dogTreatsSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('productTypes', 'Product Type', ['Biscuits', 'Treats']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large']),
  buildSection('proteinSource', 'Protein Source', ['Chicken', 'Fish', 'Turkey', 'Beef', 'Salmon', 'Tuna', 'Duck']),
  buildSection('specialDiets', 'Special Diet', ['Gluten-Free', 'Grain Free']),
  buildSection('weights', 'Weight', ['320 g', '500 g', '800 g', '1kg'])
];

const catTreatsSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('productTypes', 'Product Type', ['Biscuits', 'Treats']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large']),
  buildSection('proteinSource', 'Protein Source', ['Chicken', 'Fish', 'Turkey', 'Beef', 'Salmon', 'Tuna', 'Duck']),
  buildSection('specialDiets', 'Special Diet', ['Gluten-Free', 'Grain Free']),
  buildSection('weights', 'Weight', ['320 g', '500 g', '800 g', '1kg'])
];

const dogWalkSections = [
  buildSection('brands', 'Brand', ['Pet and Co', 'Trixie', 'Farmina']),
  buildSection('productTypes', 'Product Type', ['Collars', 'Leashes', 'Harness', 'Name Tags', 'Personalised']),
  buildSection('materials', 'Material', ['Nylon', 'Leather', 'Rope', 'Canvas']),
  buildSection('sizes', 'Size', ['XS', 'S', 'M', 'L', 'XL']),
  buildSection('color', 'Color', ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Black', 'White', 'Gray'])
];

const catLitterSuppliesSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('productTypes', 'Product Type', ['cat litter']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('weights', 'Weight', ['2.1kg', '4.3kg', '6.3kg']),
  buildSection('color', 'Color', ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Black', 'White', 'Gray'])
];

const dogToysSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('productTypes', 'Product Type', ['toys']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large']),
  buildSection('color', 'Color', ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Black', 'White', 'Gray'])
];

const catToysSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('productTypes', 'Product Type', ['toys']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large']),
  buildSection('color', 'Color', ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Black', 'White', 'Gray'])
];

const dogBedsSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('productTypes', 'Product Type', ['beds']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large'])
];

const catBedsScratchersSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('productTypes', 'Product Type', ['beds']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large'])
];

const dogBowlsSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('productTypes', 'Product Type', ['bowls', 'diners']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large']),
  buildSection('color', 'Color', ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Black', 'White', 'Gray'])
];

const catBowlsSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('productTypes', 'Product Type', ['bowls', 'diners']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large']),
  buildSection('color', 'Color', ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Black', 'White', 'Gray'])
];

const dogHealthHygieneSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult', 'Senior']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('productTypes', 'Product Type', ['health', 'hygiene']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large']),
  buildSection('proteinSource', 'Protein Source', ['Fruits', 'Vegetables']),
  buildSection('specialDiets', 'Special Diet', ['Grain Free'])
];

const dogTravelSections = [
  buildSection('brands', 'Brand', ['Trixie', 'M-petrs', 'savic']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('productTypes', 'Product Type', ['travel']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large', 'Extra Large'])
];

const dogTrainingSections = [
  buildSection('brands', 'Brand', ['Pet and Co']),
  buildSection('lifeStages', 'Life Stage', ['Kitten', 'Adult']),
  buildSection('breedSizes', 'Breed Size', ['Small', 'Medium', 'Large', 'Persian', 'Maine Coon', 'Siamese']),
  buildSection('productTypes', 'Product Type', ['Agility']),
  buildSection('priceRanges', 'Price', ['INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['120cm', '160cm'])
];

const dogClothingSections = [
  buildSection('brands', 'Brand', ['Pet and Co', 'Sara\'s', 'FashiDog']),
  buildSection('apparelTypes', 'Apparel Type', ['Festive Special', 'T-Shirts & Dresses', 'Sweatshirts', 'Sweaters', 'Bow Ties & Bandanas', 'Raincoats', 'Shoes & Socks', 'Jackets', 'Personalised']),
  buildSection('sizes', 'Size', ['XS', 'S', 'M', 'L', 'XL', 'XXL']),
  buildSection('materials', 'Material', ['Cotton', 'Polyester', 'Wool', 'Nylon', 'Waterproof Coating']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+'])
];

const pharmacyCatSections = [
  buildSection('brands', 'Brand', ['Himalaya', 'Royal Canin', 'Whiskas']),
  buildSection('petTypes', 'Pet Type', ['Cat']),
  buildSection('conditions', 'Condition', ['Skin & Coat', 'Digestive Support', 'Weight Management']),
  buildSection('productTypes', 'Product Type', ['Medicine', 'Supplement', 'Prescription Food']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium'])
];

const pharmacyGeneralSections = [
  buildSection('brands', 'Brand', ['Himalaya', 'Drools', 'Pedigree', 'Royal Canin', 'Farmina']),
  buildSection('petTypes', 'Pet Type', ['Dog', 'Cat']),
  buildSection('conditions', 'Condition', ['Skin Issues', 'Joint Pain', 'Digestive Problems', 'Dental Care']),
  buildSection('productTypes', 'Product Type', ['Medicine', 'Supplement', 'Prescription Food']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large'])
];

// Outlet sections for outlet product filtering
const outletFoodSections = [
  buildSection('brands', 'Brand', ['Pedigree', 'Whiskas', 'Royal Canin', 'Drools', 'Farmina']),
  buildSection('petTypes', 'Pet Type', ['Dog', 'Cat']),
  buildSection('productTypes', 'Product Type', ['Dry Food', 'Wet Food', 'Treats', 'Special Diet']),
  buildSection('priceRanges', 'Price', ['INR 50 - INR 200', 'INR 201 - INR 500', 'INR 501 - INR 1000']),
  buildSection('weights', 'Weight', ['100g', '200g', '500g', '1kg', '2kg', '3kg', '5kg'])
];

const outletToysSections = [
  buildSection('brands', 'Brand', ['Generic', 'Local Brand', 'Imported']),
  buildSection('petTypes', 'Pet Type', ['Dog', 'Cat']),
  buildSection('toyTypes', 'Toy Type', ['Ball', 'Rope', 'Squeaky', 'Chew', 'Interactive', 'Catnip']),
  buildSection('materials', 'Material', ['Rubber', 'Plastic', 'Rope', 'Fabric', 'Natural']),
  buildSection('priceRanges', 'Price', ['INR 20 - INR 100', 'INR 101 - INR 300', 'INR 301 - INR 500']),
  buildSection('sizes', 'Size', ['Small', 'Medium', 'Large'])
];

const outletTrainingSections = [
  buildSection('brands', 'Brand', ['Training Pro', 'Pet Trainer', 'Basic Training']),
  buildSection('petTypes', 'Pet Type', ['Dog', 'Cat']),
  buildSection('trainingTypes', 'Training Type', ['Clicker', 'Treat Dispenser', 'Target Stick', 'Agility']),
  buildSection('priceRanges', 'Price', ['INR 50 - INR 200', 'INR 201 - INR 500', 'INR 501 - INR 1000']),
  buildSection('materials', 'Material', ['Plastic', 'Metal', 'Wood', 'Rubber'])
];

const outletGroomingSections = [
  buildSection('brands', 'Brand', ['Trixie', 'Wahl', 'Andis', 'Bio-Groom', 'Pet and Co']),
  buildSection('productTypes', 'Type', ['Brush', 'Comb', 'Shampoo', 'Conditioner', 'Tool']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+'])
];

const outletFeedingSections = [
  buildSection('brands', 'Brand', ['Trixie', 'Outward Hound', 'Loving Pets', 'Pet and Co']),
  buildSection('materials', 'Material', ['Stainless Steel', 'Plastic', 'Ceramic', 'Silicone']),
  buildSection('sizes', 'Size', ['S', 'M', 'L', 'XL']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+'])
];

const outletBedsSections = [
  buildSection('brands', 'Brand', ['Trixie', 'PawHut', 'Best Friends', 'Pet and Co']),
  buildSection('materials', 'Material', ['Plush', 'Memory Foam', 'Cotton', 'Polyester']),
  buildSection('sizes', 'Size', ['S', 'M', 'L', 'XL', 'XXL']),
  buildSection('priceRanges', 'Price', ['INR 500 - INR 1500', 'INR 1501 - INR 3000', 'INR 3000+'])
];

const outletWalkingSections = [
  buildSection('brands', 'Brand', ['Trixie', 'Flexi', 'Julius-K9', 'Pet and Co']),
  buildSection('productTypes', 'Type', ['Collar', 'Leash', 'Harness']),
  buildSection('materials', 'Material', ['Nylon', 'Leather', 'Polyester', 'Metal']),
  buildSection('sizes', 'Size', ['XS', 'S', 'M', 'L', 'XL']),
  buildSection('priceRanges', 'Price', ['INR 100 - INR 500', 'INR 501 - INR 1000', 'INR 1000+'])
];

const rabbitSections = [
  buildSection('brands', 'Brand', ['Science Selective', 'FloofYou', 'Oxbow', 'Boltz', 'Vetrina', 'Vitapol', 'M-Pets', 'Trixie']),
  buildSection('foodType', 'Veg/Non-Veg', ['Veg', 'Non-Veg']),
  buildSection('petTypes', 'Pet Type', ['Rabbits', 'Hamster & Guinea Pigs', 'Birds', 'Cats', 'Dogs']),
  buildSection('priceRanges', 'Price', ['INR 0 - INR 500', 'INR 501 - INR 1000', 'INR 1000 - INR 2000', 'INR 2000+'])
];

const fishSections = [
  buildSection('brands', 'Brand', ['Tetra', 'Hikari', 'API', 'Seachem', 'Aqueon']),
  buildSection('foodType', 'Veg/Non-Veg', ['Veg', 'Non-Veg']),
  buildSection('priceRanges', 'Price', ['INR 0 - INR 500', 'INR 501 - INR 1000', 'INR 1000 - INR 2000', 'INR 2000+'])
];

const birdSections = [
  buildSection('brands', 'Brand', ['Vitapol', 'Zupreem', 'Higgins', 'Kaytee']),
  buildSection('foodType', 'Veg/Non-Veg', ['Veg', 'Non-Veg']),
  buildSection('priceRanges', 'Price', ['INR 0 - INR 500', 'INR 501 - INR 1000', 'INR 1000 - INR 2000', 'INR 2000+'])
];

const petParentSections = [
  buildSection('brands', 'Brand', ['Pet and Co', 'Generic']),
  buildSection('priceRanges', 'Price', ['INR 0 - INR 500', 'INR 501 - INR 1000', 'INR 1000 - INR 2000', 'INR 2000+'])
];

export const CATEGORY_FILTERS = {
  dogs: {
    label: 'Dogs',
    type: 'Dog',
    subcategories: {
      default: buildSubcategoryConfig('Dog Collection', dogFoodSections),
      food: buildSubcategoryConfig('Dog Food', dogFoodSections),
      grooming: buildSubcategoryConfig('Dog Grooming', dogGroomingSections),
      treats: buildSubcategoryConfig('Dog Treats', dogTreatsSections),
      walkEssentials: buildSubcategoryConfig('Walk Essentials', dogWalkSections),
      toys: buildSubcategoryConfig('Dog Toys', dogToysSections),
      bedding: buildSubcategoryConfig('Dog Bedding', dogBedsSections),
      clothing: buildSubcategoryConfig('Dog Clothing & Accessories', dogClothingSections),
      bowls: buildSubcategoryConfig('Dog Bowls & Diners', dogBowlsSections),
      healthHygiene: buildSubcategoryConfig('Dog Health & Hygiene', dogHealthHygieneSections),
      travel: buildSubcategoryConfig('Dog Travel Supplies', dogTravelSections),
      training: buildSubcategoryConfig('Dog Training Essentials', dogTrainingSections)
    }
  },
  cats: {
    label: 'Cats',
    type: 'Cat',
    subcategories: {
      default: buildSubcategoryConfig('Cat Collection', catFoodSections),
      food: buildSubcategoryConfig('Cat Food', catFoodSections),
      treats: buildSubcategoryConfig('Cat Treats', catTreatsSections),
      litter: buildSubcategoryConfig('Cat Litter & Supplies', catLitterSuppliesSections),
      toys: buildSubcategoryConfig('Cat Toys', catToysSections),
      bedding: buildSubcategoryConfig('Cat Beds & Scratchers', catBedsScratchersSections),
      bowls: buildSubcategoryConfig('Cat Bowls & Diners', catBowlsSections),
      accessories: buildSubcategoryConfig('Cat Collars & Accessories', catCollarsAccessorySections),
      grooming: buildSubcategoryConfig('Cat Grooming', catGroomingSections)
    }
  },
  pharmacy: {
    label: 'Pharmacy',
    type: 'Pharmacy',
    subcategories: {
      default: buildSubcategoryConfig('Pharmacy', pharmacyGeneralSections),
      dogs: buildSubcategoryConfig('Dog Pharmacy', pharmacyDogSections),
      cats: buildSubcategoryConfig('Cat Pharmacy', pharmacyCatSections),
      medicines: buildSubcategoryConfig('Medicines', pharmacyGeneralSections),
      supplements: buildSubcategoryConfig('Supplements', pharmacyGeneralSections),
      prescription: buildSubcategoryConfig('Prescription Food', pharmacyGeneralSections)
    }
  },
  outlet: {
    label: 'Outlet',
    type: 'Outlet',
    subcategories: {
      default: buildSubcategoryConfig('Outlet Products', outletFoodSections),
      food: buildSubcategoryConfig('Outlet Food', outletFoodSections),
      toys: buildSubcategoryConfig('Outlet Toys', outletToysSections),
      training: buildSubcategoryConfig('Outlet Training', outletTrainingSections),
      feeding: buildSubcategoryConfig('Outlet Feeding', outletFeedingSections),
      beds: buildSubcategoryConfig('Outlet Beds', outletBedsSections),
      travel: buildSubcategoryConfig('Outlet Travel', dogTravelSections),
      accessories: buildSubcategoryConfig('Outlet Accessories', catCollarsAccessorySections),
      walking: buildSubcategoryConfig('Outlet Walking', outletWalkingSections),
      grooming: buildSubcategoryConfig('Outlet Grooming', outletGroomingSections),
      litter: buildSubcategoryConfig('Outlet Litter', catLitterSuppliesSections),
      all: buildSubcategoryConfig('All Outlet', outletFoodSections)
    }
  },
  rabbits: {
    label: 'Rabbits',
    type: 'Rabbit',
    subcategories: {
      default: buildSubcategoryConfig('Rabbit Products', rabbitSections),
      products: buildSubcategoryConfig('Rabbit Products', rabbitSections)
    }
  },
  fish: {
    label: 'Fish',
    type: 'Fish',
    subcategories: {
      default: buildSubcategoryConfig('Fish Products', fishSections),
      products: buildSubcategoryConfig('Fish Products', fishSections)
    }
  },
  birds: {
    label: 'Birds',
    type: 'Bird',
    subcategories: {
      default: buildSubcategoryConfig('Bird Products', birdSections),
      products: buildSubcategoryConfig('Bird Products', birdSections)
    }
  },
  'pet-parent': {
    label: 'Pet Parent',
    type: 'Pet Parent',
    subcategories: {
      default: buildSubcategoryConfig('Pet Parent Products', petParentSections),
      products: buildSubcategoryConfig('Pet Parent Products', petParentSections)
    }
  }
};

export const getFilterConfig = (categoryKey, subcategoryKey, fallbackSubKey = 'default') => {
  const category = CATEGORY_FILTERS[categoryKey] || {};
  const subcategories = category.subcategories || {};
  return subcategories[subcategoryKey] || subcategories[fallbackSubKey] || {
    label: '',
    topFilters: [],
    sections: [],
    sortOptions: DEFAULT_SORT_OPTIONS
  };
};

export const getFilterSections = (categoryKey, subcategoryKey, fallbackSubKey = 'default') => {
  const config = getFilterConfig(categoryKey, subcategoryKey, fallbackSubKey);
  return config.sections || [];
};

export const listFilterSubcategories = (categoryKey) => {
  const category = CATEGORY_FILTERS[categoryKey];
  if (!category) return [];
  return Object.keys(category.subcategories || {});
};

export const getSortOptions = (categoryKey, subcategoryKey, fallbackSubKey = 'default') => {
  const config = getFilterConfig(categoryKey, subcategoryKey, fallbackSubKey);
  return config.sortOptions || DEFAULT_SORT_OPTIONS;
};

export { DEFAULT_SORT_OPTIONS };
