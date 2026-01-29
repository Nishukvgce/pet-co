/**
 * Smart Search Utility
 * Intelligently detects product categories and navigates to appropriate pages
 */

import productApi from '../services/productApi';

// Product category mapping with keywords
const PRODUCT_CATEGORIES = {
  // Dog Food Categories
  'dog-food': {
    keywords: ['dog food', 'dogfood', 'puppy food', 'canine food', 'dog meal'],
    route: '/shop-for-dogs/dogfood',
    subcategories: {
      'daily-meals': ['daily meal', 'regular meal', 'everyday food'],
      'dry-food': ['dry food', 'kibble', 'dry dog food', 'dry meal'],
      'wet-food': ['wet food', 'canned food', 'wet dog food', 'moist food'],
      'grain-free': ['grain free', 'grainfree', 'no grain'],
      'puppy-food': ['puppy food', 'puppy meal', 'young dog food'],
      'hypoallergenic': ['hypoallergenic', 'hypo allergenic', 'allergy free'],
      'veterinary-food': ['veterinary food', 'vet food', 'prescription food'],
      'food-toppers-and-gravy': ['food topper', 'gravy', 'meal topper']
    }
  },

  // Dog Treats Categories  
  'dog-treats': {
    keywords: ['dog treat', 'dogtreats', 'dog snack', 'puppy treat'],
    route: '/shop-for-dogs/dogtreats',
    subcategories: {
      'biscuits-snacks': ['biscuit', 'snack', 'cookie'],
      'soft-chewy': ['soft treat', 'chewy treat', 'soft snack'],
      'natural-treats': ['natural treat', 'organic treat'],
      'puppy-treats': ['puppy treat', 'puppy snack'],
      'vegetarian-treats': ['vegetarian treat', 'veg treat'],
      'dental-chew': ['dental chew', 'dental treat', 'teeth clean'],
      'grain-free-treat': ['grain free treat', 'grainfree treat']
    }
  },

  // Dog Grooming Categories
  'dog-grooming': {
    keywords: ['dog grooming', 'dog groom', 'dog shampoo', 'dog brush'],
    route: '/shop-for-dogs/dog-grooming',
    subcategories: {
      'brushes-combs': ['brush', 'comb', 'grooming brush'],
      'dry-bath-wipes-perfume': ['dry bath', 'wipe', 'perfume', 'dry shampoo'],
      'ear-eye-pawcare': ['ear care', 'eye care', 'paw care'],
      'oral-care': ['oral care', 'dental care', 'toothbrush', 'toothpaste'],
      'shampoo-conditioner': ['shampoo', 'conditioner', 'bath'],
      'tick-flea-control': ['tick control', 'flea control', 'pest control']
    }
  },

  // Dog Toys Categories
  'dog-toys': {
    keywords: ['dog toy', 'dogtoys', 'puppy toy', 'play toy'],
    route: '/shop-for-dogs/dog-toys',
    subcategories: {
      'balls': ['ball', 'tennis ball', 'rubber ball'],
      'chew-toys': ['chew toy', 'chew', 'chewing toy'],
      'crinkle-toys': ['crinkle toy', 'crinkle'],
      'fetch-toys': ['fetch toy', 'frisbee', 'throwing toy'],
      'interactive-toys': ['interactive toy', 'puzzle toy', 'smart toy'],
      'plush-toys': ['plush toy', 'soft toy', 'stuffed toy'],
      'rope-toys': ['rope toy', 'rope'],
      'squeaker-toys': ['squeaker toy', 'squeaky toy', 'squeak toy']
    }
  },

  // Walk Essentials
  'walk-essentials': {
    keywords: ['leash', 'collar', 'harness', 'walk', 'walking'],
    route: '/shop-for-dogs/walk-essentials',
    subcategories: {
      'collar': ['collar', 'neck collar'],
      'leash': ['leash', 'lead', 'walking leash'],
      'harness': ['harness', 'body harness'],
      'name-tags': ['name tag', 'id tag', 'dog tag'],
      'personalised': ['personalised', 'personalized', 'custom']
    }
  },

  // Cat Food Categories
  'cat-food': {
    keywords: ['cat food', 'catfood', 'kitten food', 'feline food'],
    route: '/shop-for-cats/cat-food',
    subcategories: {
      'dry-food': ['dry cat food', 'cat kibble'],
      'wet-food': ['wet cat food', 'canned cat food'],
      'grain-free': ['grain free cat food'],
      'kitten-food': ['kitten food', 'kitten meal'],
      'hypoallergenic': ['hypoallergenic cat food'],
      'veterinary-food': ['cat veterinary food', 'cat vet food']
    }
  },

  // Cat Treats
  'cat-treats': {
    keywords: ['cat treat', 'cattreats', 'kitten treat'],
    route: '/shop-for-cats/cat-treats',
    subcategories: {
      'crunchy-treats': ['crunchy cat treat', 'crispy treat'],
      'soft-treats': ['soft cat treat', 'chewy cat treat'],
      'natural-treats': ['natural cat treat'],
      'kitten-treats': ['kitten treat'],
      'dental-treats': ['cat dental treat']
    }
  }
};

// Brand-specific mapping
const BRAND_MAPPING = {
  'royal canin': { route: '/brand/royal-canin' },
  'pedigree': { route: '/brand/pedigree' },
  'whiskas': { route: '/brand/whiskas' },
  'drools': { route: '/brand/drools' },
  'purepet': { route: '/brand/purepet' }
};

/**
 * Analyzes search query and returns smart navigation suggestion
 * @param {string} query - Search query from user
 * @param {Array} products - Optional array of products to search through
 * @returns {object} Navigation suggestion with route and details
 */
export const analyzeSearchQuery = async (query, products = null) => {
  if (!query || typeof query !== 'string') {
    return { type: 'general', route: '/shop-for-dogs', query };
  }

  const normalizedQuery = query.toLowerCase().trim();

  // Check for brand matches first
  for (const [brand, config] of Object.entries(BRAND_MAPPING)) {
    if (normalizedQuery.includes(brand)) {
      return {
        type: 'brand',
        route: config.route,
        brand,
        query: normalizedQuery
      };
    }
  }

  // Check for exact subcategory name matches first (most specific)
  for (const [categoryKey, categoryConfig] of Object.entries(PRODUCT_CATEGORIES)) {
    for (const [subKey, subKeywords] of Object.entries(categoryConfig.subcategories)) {
      // Check for exact subcategory name match
      const subKeyNormalized = subKey.toLowerCase().replace(/-/g, ' ');
      if (normalizedQuery === subKeyNormalized || 
          normalizedQuery.includes(subKeyNormalized) ||
          subKeywords.some(keyword => normalizedQuery === keyword.toLowerCase())) {
        return {
          type: 'subcategory',
          route: `${categoryConfig.route}/${subKey}`,
          category: categoryKey,
          subcategory: subKey,
          query: normalizedQuery
        };
      }
    }
  }

  // Check for category and subcategory matches by keywords
  for (const [categoryKey, categoryConfig] of Object.entries(PRODUCT_CATEGORIES)) {
    // Check main category keywords
    const categoryMatch = categoryConfig.keywords.some(keyword => 
      normalizedQuery.includes(keyword)
    );

    if (categoryMatch) {
      // Check for subcategory matches
      for (const [subKey, subKeywords] of Object.entries(categoryConfig.subcategories)) {
        const subMatch = subKeywords.some(keyword => 
          normalizedQuery.includes(keyword)
        );
        
        if (subMatch) {
          return {
            type: 'subcategory',
            route: `${categoryConfig.route}/${subKey}`,
            category: categoryKey,
            subcategory: subKey,
            query: normalizedQuery
          };
        }
      }

      // Return main category if no subcategory match
      return {
        type: 'category',
        route: categoryConfig.route,
        category: categoryKey,
        query: normalizedQuery
      };
    }
  }

  // Search for product names if products provided
  if (products && Array.isArray(products)) {
    const matchingProduct = products.find(product => 
      product.name && product.name.toLowerCase().includes(normalizedQuery)
    );
    
    if (matchingProduct) {
      // Determine the appropriate category route based on product metadata
      const productRoute = getProductCategoryRoute(matchingProduct);
      return {
        type: 'product',
        route: `/product-details/${matchingProduct.id}`,
        fallbackRoute: productRoute,
        product: matchingProduct,
        query: normalizedQuery
      };
    }
  }

  // Check for pet type (dog/cat) and default to appropriate section
  if (normalizedQuery.includes('dog') || normalizedQuery.includes('puppy')) {
    return {
      type: 'pet-type',
      route: '/shop-for-dogs',
      petType: 'dog',
      query: normalizedQuery
    };
  }

  if (normalizedQuery.includes('cat') || normalizedQuery.includes('kitten')) {
    return {
      type: 'pet-type', 
      route: '/shop-for-cats',
      petType: 'cat',
      query: normalizedQuery
    };
  }

  // Default fallback to general search
  return {
    type: 'general',
    route: '/shop-for-dogs',
    query: normalizedQuery
  };
};

/**
 * Determines the appropriate category route for a product
 * @param {object} product - Product object
 * @returns {string} Category route for the product
 */
const getProductCategoryRoute = (product) => {
  if (!product) return '/shop-for-dogs';
  
  const { category, subcategory, type } = product;
  
  // Map product type to base route
  const typeRouteMap = {
    'dog': '/shop-for-dogs',
    'cat': '/shop-for-cats',
    'pharmacy': '/pharmacy',
    'outlet': '/shop-for-outlet'
  };
  
  const baseRoute = typeRouteMap[type?.toLowerCase()] || '/shop-for-dogs';
  
  // If we have category and subcategory, build specific route
  if (category && subcategory) {
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
    const normalizedSub = subcategory.toLowerCase().replace(/\s+/g, '-');
    
    // Try to match with our known category routes
    for (const [categoryKey, categoryConfig] of Object.entries(PRODUCT_CATEGORIES)) {
      if (categoryConfig.route.includes(normalizedCategory) || 
          normalizedCategory.includes(categoryKey.split('-')[1] || categoryKey)) {
        return `${categoryConfig.route}/${normalizedSub}`;
      }
    }
  }
  
  return baseRoute;
};

/**
 * Generates search URL with proper parameters
 * @param {object} analysis - Result from analyzeSearchQuery
 * @returns {string} Complete URL for navigation
 */
export const generateSearchUrl = (analysis) => {
  const { route, query, type } = analysis;
  
  if (type === 'brand') {
    return route;
  }
  
  if (type === 'subcategory' || type === 'category') {
    return route;
  }

  // For general searches, add search parameter
  const params = new URLSearchParams();
  if (query && query.trim()) {
    params.set('search', query.trim());
  }
  
  return `${route}${params.toString() ? `?${params.toString()}` : ''}`;
};

/**
 * Main smart search function
 * @param {string} query - Search query
 * @param {function} navigate - React Router navigate function
 * @param {function} onSearch - Optional callback for search event
 */
export const performSmartSearch = async (query, navigate, onSearch) => {
  console.log('Smart Search: Starting search for:', query);
  
  let products = null;
  
  // Try to fetch products for name searching if the query might be a product name
  if (query && query.length > 2 && !isObviousCategorySearch(query)) {
    try {
      console.log('Smart Search: Fetching products for product name search...');
      products = await productApi.getCustomerProducts();
      console.log('Smart Search: Fetched', products?.length || 0, 'products');
    } catch (error) {
      console.warn('Smart Search: Could not fetch products for search:', error);
    }
  }
  
  const analysis = await analyzeSearchQuery(query, products);
  console.log('Smart Search: Analysis result:', analysis);
  
  const url = generateSearchUrl(analysis);
  console.log('Smart Search: Generated URL:', url);

  // Navigate to the smart route
  try {
    navigate(url);
    console.log('Smart Search: Navigation successful');
  } catch (error) {
    console.error('Smart Search: Navigation failed:', error);
    // Fallback navigation
    navigate(`/shop-for-dogs?search=${encodeURIComponent(query.trim())}`);
  }
  
  // Call callback if provided
  if (onSearch && typeof onSearch === 'function') {
    try {
      onSearch(query.trim(), analysis);
    } catch (error) {
      console.error('Smart Search: Callback error:', error);
    }
  }

  return analysis;
};

/**
 * Helper to determine if a query is obviously a category search
 * @param {string} query - Search query
 * @returns {boolean} True if it's obviously a category search
 */
const isObviousCategorySearch = (query) => {
  const normalizedQuery = query.toLowerCase();
  const categoryKeywords = ['dog', 'cat', 'food', 'treat', 'toy', 'grooming', 'leash', 'collar'];
  return categoryKeywords.some(keyword => normalizedQuery.includes(keyword));
};

/**
 * Get search suggestions based on partial query
 * @param {string} partialQuery - Partial search query
 * @param {Array} products - Optional array of products for product name suggestions
 * @returns {Array} Array of search suggestions
 */
export const getSearchSuggestions = (partialQuery, products = null) => {
  if (!partialQuery || partialQuery.length < 2) {
    return [];
  }

  const normalized = partialQuery.toLowerCase();
  const suggestions = [];
  
  console.log('📝 Generating suggestions for:', partialQuery, 'normalized:', normalized);

  // Add subcategory name suggestions first (exact matches are most relevant)
  Object.entries(PRODUCT_CATEGORIES).forEach(([categoryKey, categoryConfig]) => {
    Object.entries(categoryConfig.subcategories).forEach(([subKey, subKeywords]) => {
      const subKeyDisplay = subKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const subKeyNormalized = subKey.toLowerCase().replace(/-/g, ' ');
      
      // Check if search matches subcategory name or keywords
      if (subKeyNormalized.includes(normalized) || 
          subKeywords.some(keyword => keyword.toLowerCase().includes(normalized))) {
        
        const suggestion = {
          text: subKeyDisplay,
          type: 'subcategory',
          category: categoryKey,
          subcategory: subKey,
          route: `${categoryConfig.route}/${subKey}`
        };
        
        if (!suggestions.find(s => s.text === subKeyDisplay)) {
          suggestions.push(suggestion);
          console.log('   ✅ Added subcategory suggestion:', suggestion);
        }
      }
    });
  });

  // Add product name suggestions
  if (products && Array.isArray(products)) {
    products
      .filter(product => product.name && product.name.toLowerCase().includes(normalized))
      .slice(0, 3) // Limit product suggestions
      .forEach(product => {
        const suggestion = {
          text: product.name,
          type: 'product',
          product,
          route: `/product-details/${product.id}`
        };
        
        suggestions.push(suggestion);
        console.log('   ✅ Added product suggestion:', suggestion);
      });
  }

  // Add category suggestions
  Object.entries(PRODUCT_CATEGORIES).forEach(([categoryKey, categoryConfig]) => {
    categoryConfig.keywords.forEach(keyword => {
      if (keyword.includes(normalized) && !suggestions.find(s => s.text === keyword)) {
        const suggestion = {
          text: keyword,
          type: 'category',
          category: categoryKey,
          route: categoryConfig.route
        };
        
        suggestions.push(suggestion);
        console.log('   ✅ Added category suggestion:', suggestion);
      }
    });
  });

  // Add brand suggestions
  Object.entries(BRAND_MAPPING).forEach(([brand, config]) => {
    if (brand.includes(normalized)) {
      const suggestion = {
        text: brand,
        type: 'brand',
        route: config.route
      };
      
      suggestions.push(suggestion);
      console.log('   ✅ Added brand suggestion:', suggestion);
    }
  });

  // Sort by relevance: exact matches first, then by position of match
  const sorted = suggestions
    .sort((a, b) => {
      const aExact = a.text.toLowerCase() === normalized;
      const bExact = b.text.toLowerCase() === normalized;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.text.toLowerCase().indexOf(normalized) - b.text.toLowerCase().indexOf(normalized);
    })
    .slice(0, 8);
    
  console.log('📋 Final suggestions:', sorted);
  return sorted;
};