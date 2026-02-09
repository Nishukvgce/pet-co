import React, {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import { useCart } from '../../contexts/CartContext';
import productApi from '../../services/productApi';
import dataService from '../../services/dataService';
import apiClient from '../../services/api';
import { resolveImageUrl } from '../../lib/imageUtils';
import { normalizeProductFromApi, isToyProduct } from '../../utils/productUtils';
import ProductCard from '../../components/ui/ProductCard';

const categories = [
  { id: 'all-cat-toys', label: 'All Cat Toys', img: '/assets/images/cat/Fil_plushtoys.webp' },
  { id: 'catnip-toys', label: 'Catnip Toys', img: '/assets/images/cat/Fil_catniptoys.webp' },
  { id: 'interactive-toys', label: 'Interactive Toys', img: '/assets/images/cat/Fil_interactivetoys.webp' },
  { id: 'plush-toys', label: 'Plush Toys', img: '/assets/images/cat/Fil_plushtoys.webp' },
  { id: 'teaser-wands', label: 'Teaser & Wands', img: '/assets/images/cat/Fil_teaserwandtoys.webp' },
  { id: 'all-toys', label: 'All Toys', img: '/assets/images/cat/Fil_catniptoys.webp' }
];

const sampleProducts = [
  { id: 'y1', name: 'Catnip Mouse Toy', image: '/assets/images/essential/meowsi.webp', badges: ['Popular'], variants: ['Single','Pack Of 3'], price: 249 },
  { id: 'y2', name: 'Feather Teaser Wand', image: '/assets/images/essential/whiskas.webp', badges: ['New'], variants: ['One Size'], price: 199 },
  { id: 'y3', name: 'Plush Cat Pillow', image: '/assets/images/essential/sheba.webp', badges: ['Soft'], variants: ['Small','Large'], price: 599 }
];

const CatToys = ({ initialActive = 'All Cat Toys' }) => {
  const [active, setActive] = useState(initialActive);
  const { getCartItemCount, cartItems } = useCart();
  const navigate = useNavigate();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const routeMap = {
    'All Cat Toys': '/shop-for-cats/cat-toys?sub=All%20Cat%20Toys',
    'Catnip Toys': '/shop-for-cats/cat-toys?sub=Catnip%20Toys',
    'Interactive Toys': '/shop-for-cats/cat-toys?sub=Interactive%20Toys',
    'Plush Toys': '/shop-for-cats/cat-toys?sub=Plush%20Toys',
    'Teaser & Wands': '/shop-for-cats/cat-toys?sub=Teaser%20%26%20Wands',
    'All Toys': '/shop-for-cats/cat-toys?sub=All%20Toys'
  };

  // Wheel handlers to keep wheel events scoped to the internal containers
  const handleLeftWheel = (e) => {
    const el = leftRef.current;
    if (!el) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
      el.scrollBy({ left: e.deltaX || e.deltaY, behavior: 'auto' });
    } else {
      el.scrollBy({ top: e.deltaY, behavior: 'auto' });
    }
    e.stopPropagation();
  };

  const handleRightWheel = (e) => {
    const el = rightRef.current;
    if (!el) return;
    el.scrollBy({ top: e.deltaY, behavior: 'auto' });
    e.stopPropagation();
  };

  // Filter bar state
  const topFilters = ['Brand','Cat/Kitten','Life Stage','Breed Size','Product Type','Special Diet','Protein Source','Price','Weight','Size','Sub Category'];
  const [selectedTopFilter, setSelectedTopFilter] = useState(topFilters[0]);
  const topRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const drawerContentRef = useRef(null);
  const sectionRefs = useRef({});

  // Filter selection state
  const [selectedFilters, setSelectedFilters] = useState({
    brands: [],
    catKitten: [],
    lifeStages: [],
    breedSizes: [],
    productTypes: [],
    specialDiets: [],
    proteinSource: [],
    priceRanges: [],
    weights: [],
    sizes: [],
    subCategories: [],
    sortBy: ''
  });

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value) 
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  // Handle URL parameter for active category selection
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSub = urlParams.get('sub');
      if (urlSub) {
        const decoded = decodeURIComponent(urlSub).trim();
        const match = categories.find(c => c.label.toLowerCase() === decoded.toLowerCase() || c.id === decoded.toLowerCase());
        setActive(match ? match.label : decoded);
      }
    } catch (err) {
      console.warn('Failed to parse URL parameters:', err);
    }
  }, []);

  const clearAllFilters = () => {
    setSelectedFilters({
      brands: [],
      catKitten: [],
      lifeStages: [],
      breedSizes: [],
      productTypes: [],
      specialDiets: [],
      proteinSource: [],
      priceRanges: [],
      weights: [],
      sizes: [],
      subCategories: [],
      sortBy: ''
    });
  };

  const openFilterAndScroll = (key) => {
    setSelectedTopFilter(key);
    setFilterOpen(true);
    const doScroll = () => {
      const container = drawerContentRef.current;
      const el = sectionRefs.current[key];
      if (container && el) {
        const drawerHeaderHeight = 64;
        const top = el.offsetTop;
        const scrollTo = Math.max(0, top - drawerHeaderHeight - 8);
        container.scrollTo({ top: scrollTo, behavior: 'smooth' });
        try {
          el.classList.add('section-highlight');
          setTimeout(() => { el.classList.remove('section-highlight'); }, 1400);
        } catch (err) {}
      }
    };
    setTimeout(doScroll, 220);
  };

  // cat toys specific filter data
  const brands = ['Cat Dancer','Petco','SmartyKat','KONG','Feliway','Jackson Galaxy','Petstages'];
  const dogCat = ['Cat','Dog'];
  const catKitten = ['Kitten','Adult Cat'];
  const lifeStages = ['Kitten','Adult','Senior'];
  const breedSizes = ['Small','Medium','Large','Persian','Maine Coon','Siamese'];
  const productTypes = ['Catnip Toys','Interactive Toys','Plush Toys','Feather Toys','Balls','Mice'];
  const specialDiets = ['Natural','Organic','Eco-Friendly'];
  const proteinSource = ['Catnip','Natural Materials','Organic'];
  const priceRanges = ['INR 50 - INR 200','INR 201 - INR 500','INR 501 - INR 1000','INR 1000+'];
  const weights = ['Light','Medium','Heavy'];
  const sizes = ['Small','Medium','Large','Extra Large'];
  const subCategories = ['Catnip Toys', 'Interactive Toys', 'Plush Toys', 'Teaser & Wands', 'All Toys'];

  const scrollTopLeft = () => { if (topRef.current) topRef.current.scrollBy({ left: -220, behavior: 'smooth' }); };
  const scrollTopRight = () => { if (topRef.current) topRef.current.scrollBy({ left: 220, behavior: 'smooth' }); };

  // use shared resolveImageUrl

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        // Enhanced URL parameter handling for all URL encoding formats
        const cleanUrlParam = (param) => {
          if (!param) return '';
          try {
            // First decode URI components (handles %20, %2C, %26, etc.)
            let decoded = decodeURIComponent(param);
            // Then handle + encoding for spaces (common in query parameters)
            decoded = decoded.replace(/\+/g, ' ');
            return decoded.trim();
          } catch (error) {
            // Fallback: if decoding fails, try basic replacements
            return param.replace(/\+/g, ' ').replace(/%20/g, ' ').replace(/%2C/g, ',').replace(/%26/g, '&').trim();
          }
        };
        
        // Create comprehensive category mapping for Cat Toys
        const categoryMap = {
          'cat-toys': 'Cat Toys',
          'cattoys': 'Cat Toys',
          'toys': 'Cat Toys',
          'pet-toys': 'Cat Toys'
        };
        
        // Create subcategory mapping for better matching
        const subcategoryMap = {
          'all-cat-toys': 'All Cat Toys',
          'all-toys': 'All Toys',
          'all': 'All Cat Toys',
          'catnip-toys': 'Catnip Toys',
          'catnip': 'Catnip Toys',
          'interactive-toys': 'Interactive Toys',
          'interactive': 'Interactive Toys',
          'plush-toys': 'Plush Toys',
          'plush': 'Plush Toys',
          'teaser-wands': 'Teaser & Wands',
          'teaser': 'Teaser & Wands',
          'wands': 'Teaser & Wands'
        };
        
        // Get URL parameters from current page
        const urlParams = new URLSearchParams(window.location.search);
        const urlCategory = cleanUrlParam(urlParams.get('category')) || '';
        const urlSub = cleanUrlParam(urlParams.get('sub')) || '';
        
        console.log('CatToys: URL parameters - category:', urlCategory, 'sub:', urlSub);
        
        // Build API parameters with intelligent mapping
        let apiCategory = 'Cat Toys'; // Always use Cat Toys for this page
        let apiSubcategory = null;
        
        // Map URL category to backend category (but always use Cat Toys for this page)
        if (urlCategory) {
          const cleanCategory = urlCategory.toLowerCase();
          if (categoryMap[cleanCategory]) {
            apiCategory = categoryMap[cleanCategory];
          } else if (cleanCategory.includes('toy')) {
            apiCategory = 'Cat Toys';
          }
        }
        
        // Map URL subcategory to backend subcategory
        if (urlSub && urlSub.trim()) {
          const cleanSub = urlSub.toLowerCase().trim();
          if (subcategoryMap[cleanSub]) {
            apiSubcategory = subcategoryMap[cleanSub];
          } else {
            // Use the cleaned subcategory directly
            apiSubcategory = urlSub.trim();
          }
        }
        
        // Also handle active pill state for subcategory filtering
        const finalSubcategory = apiSubcategory || (active && active !== 'All Cat Toys' ? active : null);
        
        console.log('CatToys: API parameters - category:', apiCategory, 'sub:', finalSubcategory);
        
        // Request products from backend using centralized productApi with explicit petType/category/sub
        // Fetch all Cat products - filtering will be done on frontend
        const params = {
          type: 'Cat'
        };
        console.log('CatToys: Calling productApi.getCustomerProducts with params:', params);
        const apiData = await productApi.getCustomerProducts(params);
        console.log('CatToys: API response received:', (apiData || []).length, 'products');
        
        // Process and filter the products from API
        const normalizedProducts = (apiData || []).map((item) => {
          const normalizedProduct = normalizeProductFromApi(item);
          return {
            ...normalizedProduct,
            image: resolveImageUrl(normalizedProduct)
          };
        }).filter(isToyProduct);
        
        // Apply additional local filtering based on URL parameters
        let filteredProducts = normalizedProducts;
        
        // Filter by category if specified in URL (additional safety check)
        if (urlCategory && urlCategory.toLowerCase() !== 'cat-toys') {
          filteredProducts = filteredProducts.filter(product => {
            const productCategory = (product.category || '').toLowerCase();
            return productCategory.includes('toy') || productCategory.includes('cat');
          });
        }
        
        // Filter by subcategory if specified in URL or active state
        if (finalSubcategory && finalSubcategory !== 'All Cat Toys') {
          filteredProducts = normalizedProducts.filter(product => {
            const productSubcategory = (product.subcategory || '').toLowerCase().trim();
            const productName = (product.name || '').toLowerCase();
            const productTags = (product.tags || []).map(tag => tag.toLowerCase());
            const productCategory = (product.category || '').toLowerCase();
            const searchTerm = finalSubcategory.toLowerCase().trim();
            
            // Create exact match patterns for each subcategory
            const exactMatches = {
              'catnip toys': () => productSubcategory.includes('catnip') || 
                                  productName.includes('catnip') ||
                                  productTags.some(tag => tag.includes('catnip')),
              'interactive toys': () => productSubcategory.includes('interactive') || 
                                       productName.includes('interactive') ||
                                       productTags.some(tag => tag.includes('interactive')),
              'plush toys': () => productSubcategory.includes('plush') || 
                                 productName.includes('plush') ||
                                 productName.includes('soft') ||
                                 productTags.some(tag => tag.includes('plush') || tag.includes('soft')),
              'teaser & wands': () => productSubcategory.includes('teaser') || 
                                     productSubcategory.includes('wand') ||
                                     productName.includes('teaser') ||
                                     productName.includes('wand') ||
                                     productTags.some(tag => tag.includes('teaser') || tag.includes('wand')),
              'all toys': () => productCategory.includes('toy') || 
                               productSubcategory.includes('toy') ||
                               productName.includes('toy')
            };
            
            // Check for exact match first
            if (exactMatches[searchTerm]) {
              return exactMatches[searchTerm]();
            }
            
            // Fallback to general matching
            return productSubcategory.includes(searchTerm) ||
                   productName.includes(searchTerm) ||
                   productTags.some(tag => tag.includes(searchTerm)) ||
                   (product.productType && product.productType.toLowerCase().includes(searchTerm));
          });
        }
        
        console.log('CatToys: Filtered products:', filteredProducts.length, 'from', normalizedProducts.length, 'total');
        
        if (filteredProducts.length > 0) {
          setProducts(filteredProducts);
          setFetchError('');
          console.log('CatToys: Successfully loaded filtered products from database');
        } else if (normalizedProducts.length > 0) {
          // If no filtered products but we have products, show all products
          setProducts(normalizedProducts);
          setFetchError('');
          console.log('CatToys: No filtered matches, showing all products from database');
        } else {
          console.log('CatToys: No products found in database, using sample data');
          setProducts(sampleProducts);
          setFetchError('No live cat toy items yet. Showing featured picks.');
        }
      } catch (error) {
        console.error('CatToys: Failed to load products', error);
        setFetchError(`Unable to reach live catalog: ${error.message}. Showing featured picks.`);
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [active]);

  // Apply filters and category filtering
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    // Frontend handles ALL filtering - match by category and subcategory names
    const pageCategory = 'Cat Toys'; // This page's category
    const urlParams = new URLSearchParams(window.location.search);
    const urlSub = urlParams.get('sub');
    const norm = s => String(s||'').toLowerCase().trim();

    let working = products;
    
    // Step 1: Filter by category (exact match, case-insensitive)
    working = working.filter(p => {
      const productCategory = norm(p.category || '');
      const targetCategory = norm(pageCategory);
      return productCategory === targetCategory || 
             productCategory.includes(targetCategory) ||
             targetCategory.includes(productCategory);
    });
    
    // Step 2: Filter by subcategory if specified (from URL or active pill)
    const activeSubcategory = urlSub || (active && !active.toLowerCase().includes('all') ? active : null);
    if (activeSubcategory && activeSubcategory.trim()) {
      const targetSub = norm(activeSubcategory);
      working = working.filter(p => {
        const productSub = norm(p.subcategory || '');
        return productSub === targetSub || 
               productSub.includes(targetSub) ||
               targetSub.includes(productSub);
      });
    }
    
    // Step 3: Apply additional filters (brand, price, etc.)

    // Apply selected filters
    if (selectedFilters.brands.length > 0) {
      working = working.filter(p => selectedFilters.brands.includes(p.brand));
    }
    if (selectedFilters.catKitten.length > 0) {
      working = working.filter(p => selectedFilters.catKitten.some(ck => 
        String(p.lifeStage || '').toLowerCase().includes(ck.toLowerCase()) ||
        (p.tags || []).some(tag => tag.toLowerCase().includes(ck.toLowerCase()))
      ));
    }
    if (selectedFilters.lifeStages.length > 0) {
      working = working.filter(p => selectedFilters.lifeStages.some(ls => 
        String(p.lifeStage || '').toLowerCase().includes(ls.toLowerCase())
      ));
    }
    if (selectedFilters.breedSizes.length > 0) {
      working = working.filter(p => selectedFilters.breedSizes.some(bs => 
        String(p.breedSize || '').toLowerCase().includes(bs.toLowerCase())
      ));
    }
    if (selectedFilters.productTypes.length > 0) {
      working = working.filter(p => selectedFilters.productTypes.some(pt => 
        String(p.productType || '').toLowerCase().includes(pt.toLowerCase()) ||
        String(p.subcategory || '').toLowerCase().includes(pt.toLowerCase()) ||
        String(p.name || '').toLowerCase().includes(pt.toLowerCase())
      ));
    }
    if (selectedFilters.specialDiets.length > 0) {
        working = working.filter(p => selectedFilters.specialDiets.some(sd => 
            String(p.specialDiet || '').toLowerCase().includes(sd.toLowerCase())
        ));
    }
    if (selectedFilters.proteinSource.length > 0) {
        working = working.filter(p => selectedFilters.proteinSource.some(ps => 
            String(p.proteinSource || '').toLowerCase().includes(ps.toLowerCase())
        ));
    }
    if (selectedFilters.priceRanges.length > 0) {
      working = working.filter(p => {
        const price = p.price || 0;
        return selectedFilters.priceRanges.some(range => {
          if (range === 'INR 50 - INR 200') return price >= 50 && price <= 200;
          if (range === 'INR 201 - INR 500') return price >= 201 && price <= 500;
          if (range === 'INR 501 - INR 1000') return price >= 501 && price <= 1000;
          if (range === 'INR 1000+') return price > 1000;
          return true;
        });
      });
    }
    if (selectedFilters.weights.length > 0) {
        working = working.filter(p => selectedFilters.weights.some(w => 
            String(p.weight || '').toLowerCase().includes(w.toLowerCase())
        ));
    }
    if (selectedFilters.sizes.length > 0) {
      working = working.filter(p => selectedFilters.sizes.some(s => 
        String(p.size || '').toLowerCase().includes(s.toLowerCase()) ||
        (p.variants || []).some(variant => String(variant).toLowerCase().includes(s.toLowerCase()))
      ));
    }
    if (selectedFilters.subCategories.length > 0) {
        working = working.filter(p => selectedFilters.subCategories.some(sc => 
            String(p.subcategory || '').toLowerCase().includes(sc.toLowerCase())
        ));
    }

    // Apply sorting
    switch (selectedFilters.sortBy) {
      case 'Price, low to high':
        working.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'Price, high to low':
        working.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'Alphabetically, A-Z':
        working.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'Alphabetically, Z-A':
        working.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
      default:
        break;
    }

    setFilteredProducts(working);
  }, [products, selectedFilters, initialActive]);
  return (
    <>
      <Helmet>
        <title>Shop for Cats — Cat Toys</title>
         <style>{`
          /* Hide scrollbars visually but keep scrolling functionality for this page */
          /* Scoped class for internal scroll containers */
          .thin-gold-scroll {
            scrollbar-width: none; /* Firefox */
            scrollbar-color: transparent transparent;
          }
          .thin-gold-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
          .thin-gold-scroll::-webkit-scrollbar-track { background: transparent; }
          .thin-gold-scroll::-webkit-scrollbar-thumb { background: transparent; }

          /* Also hide global browser scrollbars for this page's body so outer scrollbar isn't visible */
          html, body, #root {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE 10+ */
          }
          html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
            display: none; width: 0; height: 0;
          }

          /* hide scrollbar for horizontal top filters */
          .hide-scrollbar {
            -ms-overflow-style: none; /* IE and Edge */
            scrollbar-width: none; /* Firefox */
          }
          .hide-scrollbar::-webkit-scrollbar { display: none; }

          /* small scroll button styles (page-scoped) */
          .top-scroll-btn { width: 34px; height: 34px; border-radius: 9999px; }

          /* highlight animation for target section when opened from top pills */
          @keyframes highlightPulse {
            0% { background: rgba(255,245,230,0); }
            30% { background: rgba(255,245,230,0.9); }
            70% { background: rgba(255,245,230,0.6); }
            100% { background: rgba(255,245,230,0); }
          }
          .section-highlight {
            animation: highlightPulse 1.2s ease-in-out;
            border-radius: 6px;
          }
        `}</style>
      </Helmet>
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={() => {}} />

      <div className="container mx-auto px-4 py-8">
        {/* Mobile horizontal categories */}
        <div className="md:hidden mb-6">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {categories.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => { setActive(c.label); const p = routeMap[c.label]; if (p) navigate(p); }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-lg border ${
                  active === c.label ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center ${
                  active === c.label ? 'ring-2 ring-orange-400' : ''
                }`}>
                  <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-medium text-gray-800 text-center leading-tight">
                  {c.label}
                </span>
              </button>
            ))}
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6">
        {/* Desktop vertical sidebar */}
        <aside className="hidden md:block md:col-span-3 lg:col-span-3 xl:col-span-2">
          <div
            ref={leftRef}
            onWheel={handleLeftWheel}
            className="bg-white rounded border border-border overflow-hidden thin-gold-scroll"
            style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}
          >
            <ul className="divide-y">
              {categories.map((c, idx)=> (
                <li key={c.id} className={`relative border-b ${active===c.label ? 'bg-[#fff6ee]' : ''}`}>
                  <button
                    onClick={() => { setActive(c.label); const p = routeMap[c.label]; if (p) navigate(p); }}
                    className="w-full text-center flex flex-col items-center gap-1 p-2 md:flex-row md:text-left md:items-center md:gap-3 md:p-4"
                  >
                    <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border ${active===c.label ? 'ring-2 ring-orange-400' : 'border-gray-100'}`}>
                      <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-800 mt-1 md:mt-0">{c.label}</span>
                  </button>
                  {/* orange vertical accent on the right when active */}
                  {active===c.label && (
                    <div className="absolute right-0 top-0 h-full w-1 bg-orange-400" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main
          ref={rightRef}
          onWheel={handleRightWheel}
          className="col-span-1 md:col-span-9 lg:col-span-9 xl:col-span-10"
          style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}
        >
          {/* top filter bar (simple placeholder matching ref) */}
          <div className="mb-4 flex items-center justify-between">
            {/* prevent the top pill row from causing page-level overflow; keep scrolling internal */}
            <div className="relative flex-1 overflow-hidden">
              {/* left scroll button */}
              <button
                onClick={scrollTopLeft}
                aria-label="Scroll left"
                className="top-scroll-btn hidden md:inline-flex items-center justify-center border border-border bg-white ml-1 mr-2 absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* scrollable pill row */}
              <div
                ref={topRef}
                className="hide-scrollbar overflow-x-auto pl-10 pr-10"
                style={{ whiteSpace: 'nowrap' }}
              >
                <div className="inline-flex items-center gap-2">
                  {topFilters.map((t) => (
                    <button
                      key={t}
                      onClick={() => openFilterAndScroll(t)}
                      className={`flex items-center gap-2 text-sm px-3 py-1 border border-border rounded-full bg-white ${selectedTopFilter === t ? 'ring-1 ring-orange-300' : ''}`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {selectedTopFilter === t ? (
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-gray-100 rounded-sm">
                          <span className="w-2 h-2 bg-green-500 rounded" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-transparent rounded-sm" />
                      )}
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* right scroll button */}
              <button
                onClick={scrollTopRight}
                aria-label="Scroll right"
                className="top-scroll-btn hidden md:inline-flex items-center justify-center border border-border bg-white ml-2 mr-1 absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter drawer trigger (right side) */}
          <div className="absolute top-6 right-6 z-40 md:hidden">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 border border-border rounded px-3 py-1 bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              <span className="text-sm">Filter</span>
            </button>
          </div>

          {/* product grid: keep 2 columns on mobile, expand on md and up; tighter gaps on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">Loading cat toys...</div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(p=> (<ProductCard key={p.id} p={p} />))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">No products found.{fetchError && <div className="text-xs mt-2 text-orange-600">{fetchError}</div>}</div>
            )}
          </div>
        </main>
      </div>
    </div>

    {/* Right-side filter drawer */}
    <div aria-hidden={!filterOpen} className={`fixed inset-0 z-50 pointer-events-none ${filterOpen ? '' : ''}`}>
      {/* overlay */}
      <div
        onClick={() => setFilterOpen(false)}
        className={`absolute inset-0 bg-black/40 transition-opacity ${filterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
      />

      {/* drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full bg-white w-full sm:w-96 shadow-xl transform transition-transform pointer-events-auto ${filterOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="text-sm font-semibold">Filter</div>
            <div className="text-xs text-muted-foreground">250 products</div>
          </div>
          <div>
            <button onClick={() => setFilterOpen(false)} className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

  {/* scrollable content */}
  <div ref={drawerContentRef} className="px-4 pt-4 pb-32 hide-scrollbar overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {/* Sort By */}
          <section className="mb-6">
            <h4 className="text-sm font-medium mb-3">Sort By</h4>
            <div className="flex flex-wrap gap-2">
              {['Featured','Best selling','Alphabetically, A-Z','Alphabetically, Z-A','Price, low to high','Price, high to low','Date, old to new','Date, new to old'].map(s=> (
                <button 
                  key={s} 
                  onClick={() => setSelectedFilters(prev => ({...prev, sortBy: s}))}
                  className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.sortBy === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Brand */}
          <section ref={el => sectionRefs.current['Brand'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Brand</h4>
            <div className="flex flex-wrap gap-2">
              {brands.map(b=> (
                <button 
                  key={b} 
                  onClick={() => toggleFilter('brands', b)}
                  className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.brands.includes(b) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </section>

          {/* Dog/cat */}
          <section ref={el => sectionRefs.current['Cat/Kitten'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Dog/cat</h4>
            <div className="flex flex-wrap gap-2">{dogCat.map(d=> (
                <button 
                    key={d} 
                    onClick={() => toggleFilter('catKitten', d)} 
                    className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.catKitten.includes(d) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                    {d}
                </button>
            ))}</div>
          </section>

          {/* Life stage */}
          <section ref={el => sectionRefs.current['Life Stage'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Life stage</h4>
            <div className="flex flex-wrap gap-2">{lifeStages.map(l=> (
                <button 
                    key={l} 
                    onClick={() => toggleFilter('lifeStages', l)}
                    className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.lifeStages.includes(l) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                    {l}
                </button>
            ))}</div>
          </section>

          {/* Breed size */}
          <section ref={el => sectionRefs.current['Breed Size'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Breed size</h4>
            <div className="flex flex-wrap gap-2">{breedSizes.map(b=> (
                <button 
                    key={b} 
                    onClick={() => toggleFilter('breedSizes', b)}
                    className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.breedSizes.includes(b) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                    {b}
                </button>
            ))}</div>
          </section>

          {/* Product type */}
          <section ref={el => sectionRefs.current['Product Type'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Product type</h4>
            <div className="flex flex-wrap gap-2">{productTypes.map(p=> (
                <button 
                    key={p} 
                    onClick={() => toggleFilter('productTypes', p)}
                    className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.productTypes.includes(p) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                    {p}
                </button>
            ))}</div>
          </section>

          {/* Special diet */}
          <section ref={el => sectionRefs.current['Special Diet'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Special diet</h4>
            <div className="flex flex-wrap gap-2">{specialDiets.map(s=> (
                <button 
                    key={s} 
                    onClick={() => toggleFilter('specialDiets', s)}
                    className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.specialDiets.includes(s) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                    {s}
                </button>
            ))}</div>
          </section>

          {/* Protein source */}
          <section ref={el => sectionRefs.current['Protein Source'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Protein source</h4>
            <div className="flex flex-wrap gap-2">{proteinSource.map(p=> (
                <button 
                    key={p} 
                    onClick={() => toggleFilter('proteinSource', p)}
                    className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.proteinSource.includes(p) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                    {p}
                </button>
            ))}</div>
          </section>

          {/* Price */}
          <section ref={el => sectionRefs.current['Price'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Price</h4>
            <div className="flex flex-wrap gap-2">{priceRanges.map(r=> (
                <button 
                    key={r} 
                    onClick={() => toggleFilter('priceRanges', r)}
                    className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.priceRanges.includes(r) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                    {r}
                </button>
            ))}</div>
          </section>

          {/* Weight */}
          <section ref={el => sectionRefs.current['Weight'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Weight</h4>
            <div className="flex flex-wrap gap-2">{weights.map(w=> (
                <button 
                    key={w} 
                    onClick={() => toggleFilter('weights', w)}
                    className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.weights.includes(w) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                    {w}
                </button>
            ))}</div>
          </section>

          {/* Size */}
          <section ref={el => sectionRefs.current['Size'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Size</h4>
            <div className="flex flex-wrap gap-2">{sizes.map(s=> (
                <button 
                    key={s} 
                    onClick={() => toggleFilter('sizes', s)}
                    className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.sizes.includes(s) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                    {s}
                </button>
            ))}</div>
          </section>

          {/* Sub category */}
          <section ref={el => sectionRefs.current['Sub Category'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Sub category</h4>
            <div className="flex flex-wrap gap-2">{subCategories.map(s=> (
                <button 
                    key={s} 
                    onClick={() => toggleFilter('subCategories', s)}
                    className={`text-xs px-3 py-1 border border-border rounded ${selectedFilters.subCategories.includes(s) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                >
                    {s}
                </button>
            ))}</div>
          </section>
        </div>

        {/* footer actions */}
        <div className="fixed bottom-0 right-0 left-auto w-full sm:w-96 bg-white border-t p-4 flex items-center justify-between">
          <button onClick={clearAllFilters} className="text-sm text-orange-500">Clear All</button>
          <button onClick={() => setFilterOpen(false)} className="bg-orange-500 text-white px-5 py-2 rounded">Show Products</button>
        </div>
      </aside>
    </div>
    
    {/* Footer */}
    <Footer />

    {/* Mobile Bottom Navigation */}
    <MobileBottomNav />
    </>
  );
};

export default CatToys;
