import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import { useCart } from '../../contexts/CartContext';
import Footer from '../homepage/components/Footer';
import api from '../../services/api';
import productApi from '../../services/productApi';
import { normalizePrice } from '../../utils/priceNormalization';
import ProductCard from '../../components/ui/ProductCard';

const categories = [
  { id: 'tshirts', label: 'Tshirts', img: '/assets/images/pet-parents/t-shirts.webp' },
  { id: 'keychains', label: 'Key chains', img: '/assets/images/pet-parents/keychain.avif' },
  { id: 'floor', label: 'Floor cleaners', img: '/assets/images/pet-parents/room-cleaner.avif' },
  { id: 'lint', label: 'Lint rollers', img: '/assets/images/pet-parents/lint-rollers.avif' },
  { id: 'accessories', label: 'Accessories', img: '/assets/images/pet-parents/accessories.webp' },
  { id: 'mugs', label: 'Mugs', img: '/assets/images/pet-parents/mugs.webp' },
  { id: 'plants', label: 'Pet-safe plants', img: '/assets/images/pet-parents/plant.webp' },
  { id: 'carry', label: 'Everyday carry', img: '/assets/images/pet-parents/everyday-carry.webp' },
  { id: 'brooch', label: 'Brooch', img: '/assets/images/pet-parents/brooch.webp' },
  { id: 'wallart', label: 'Wall art', img: '/assets/images/pet-parents/wall-art.webp' },
  { id: 'fridgemagnets', label: 'Fridge magnets', img: '/assets/images/pet-parents/fridge-magnet.webp' },
  { id: 'air', label: 'Air freshners', img: '/assets/images/pet-parents/air-freshners.avif' },
  { id: 'charms', label: 'Charms', img: '/assets/images/pet-parents/charms.avif' },
  { id: 'stationary', label: 'Stationary', img: '/assets/images/pet-parents/stationary.avif' },
  { id: 'coasters', label: 'Coasters', img: '/assets/images/pet-parents/coasters.avif' },
  { id: 'furniture', label: 'Furniture', img: '/assets/images/pet-parents/furniture.avif' },
  { id: 'all', label: 'All Pet Parent Products', img: '/assets/images/pet-parents/accessories.webp' }
];

const sampleProducts = [
  { id: 'pp1', name: 'Cool Pet T-Shirt', image: '/assets/images/pet-parents/t-shirts.webp', badges: ['Best Seller'], variants: ['M','L'], price: 599 },
  { id: 'pp2', name: 'Dog Mom Mug', image: '/assets/images/pet-parents/mugs.webp', badges: ['Trending'], variants: ['One Size'], price: 349 },
  { id: 'pp3', name: 'Paw Print Keychain', image: '/assets/images/pet-parents/keychain.avif', badges: ['New'], variants: ['Small'], price: 149 }
];

export default function PetParentProducts({ initialActive = 'All Pet Parent Products' }) {
  const [active, setActive] = useState(initialActive);
  const { getCartItemCount, cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Selected filters state
  const [selectedFilters, setSelectedFilters] = useState(() => ({}));

  useEffect(() => {
    try {
      const q = new URLSearchParams(location.search).get('sub') || new URLSearchParams(location.search).get('category');
      if (q) {
        const match = categories.find(c => c.label.toLowerCase() === q.toLowerCase() || c.id === q.toLowerCase());
        setActive(match ? match.label : q);
      } else {
        setActive('All Pet Parent Products');
      }
    } catch (err) {}
  }, [location.search]);

  // Load products with enhanced URL parameter handling
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const cleanUrlParam = (param) => {
          if (!param) return '';
          try {
            let decoded = decodeURIComponent(param);
            decoded = decoded.replace(/\+/g, ' ');
            return decoded.trim();
          } catch (error) {
            return param.replace(/\+/g, ' ').replace(/%20/g, ' ').replace(/%2C/g, ',').replace(/%26/g, '&').trim();
          }
        };

        const urlParams = new URLSearchParams(location.search);
        const urlSub = cleanUrlParam(urlParams.get('sub')) || '';

        console.log('PetParentProducts: URL parameters - sub:', urlSub);

        let apiCategory = 'Pet Parent'; 
        let apiSubcategory = null;

        if (urlSub && urlSub.trim()) {
          apiSubcategory = urlSub.trim();
        }

        const finalSubcategory = apiSubcategory || (active && active !== 'All Pet Parent Products' ? active : null);

        console.log('PetParentProducts: API parameters - category:', apiCategory, 'sub:', finalSubcategory);
        
        // Fetch all Pet Parent products because we might not have 'type: Dog' or similar mapped correctly for these
        const response = await productApi.getCustomerProducts({ category: 'Pet Parent' });
        // Also fallback to fetch everything if first fails, we handle filtering on frontend just in case
        let apiProducts = response || [];
        
        if (apiProducts.length === 0) {
           console.log('Fallback to all products to find Pet Parent items locally');
           const allResponse = await productApi.getCustomerProducts();
           apiProducts = (allResponse || []).filter(p => {
               const c = (p?.category || '').toLowerCase();
               return c.includes('pet parent') || c.includes('petparent') || c === 'parent';
           });
        }

        const normalize = (p) => {
          const candidate = p?.imageUrl || p?.image || p?.thumbnailUrl || p?.image_path;
          const base = api?.defaults?.baseURL || '';
          const image = candidate ? (/(https?:)?\/\//i.test(candidate) || candidate.startsWith('data:') ? candidate : (candidate.startsWith('/') ? `${base}${candidate}` : `${base}/${candidate}`)) : '/assets/images/no_image.png';
          
          const { price, originalPrice } = normalizePrice(p);
          
          return {
            id: p?.id,
            name: p?.name || p?.title || 'Unnamed',
            image,
            badges: p?.badges || [],
            variants: p?.variants?.map(v => v?.weight || v?.label || v) || ['Default'],
            price,
            original: originalPrice,
            brand: p?.brand || p?.manufacturer || '',
            category: p?.category || '',
            subcategory: p?.subcategory || p?.subcategoryLabel || '',
            // Additional filter properties
            animal: p?.animal || p?.type || '',
            productType: p?.productType || p?.product_type || '',
            size: p?.size || '',
            subCategory: p?.subCategory || p?.subcategory || p?.subcategoryLabel || ''
          };
        };

        if (!mounted) return;
        
        const normalizedProducts = apiProducts.map(normalize);
        
        setProducts(normalizedProducts.length > 0 ? normalizedProducts : sampleProducts);
        console.log('PetParentProducts: Loaded', normalizedProducts.length, 'products');
        
      } catch (err) {
        console.error('Failed to load pet parent products', err);
        if (mounted) setProducts(sampleProducts);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [active, location.search]);

  // Frontend filtering by category and subcategory
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    const urlSub = urlParams.get('sub');
    const norm = s => String(s||'').toLowerCase().trim();

    let working = products;
    
    // Filter by subcategory if specified
    const activeSubcategory = urlSub || (active && !active.toLowerCase().includes('all') ? active : null);
    if (activeSubcategory && activeSubcategory.trim()) {
      const targetSub = norm(activeSubcategory);
      // Sometimes category metadata might be inconsistent, loose matching helps
      working = working.filter(p => {
        const productSub = norm(p.subcategory || '');
        const productName = norm(p.name || '');
        return productSub === targetSub || 
               productSub.includes(targetSub) ||
               targetSub.includes(productSub) ||
               productName.includes(targetSub.substring(0, Math.max(targetSub.length - 1, 4))); // e.g., 'tshirt' in 'cool pet tshirt'
      });
    }
    
    setFilteredProducts(working);
  }, [products, active, location.search]);

  const topFilters = ['Brand','Price','Size','Sub Category'];
  const [selectedTopFilter, setSelectedTopFilter] = useState(topFilters[0]);
  const topRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const drawerContentRef = useRef(null);
  const sectionRefs = useRef({});

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
          setTimeout(() => {
            el.classList.remove('section-highlight');
          }, 1400);
        } catch (err) {}
      }
    };
    setTimeout(doScroll, 220);
  };

  const brands = ['Pet&Co', 'HappyTails', 'Pawsome', 'HomeDecor'];
  const priceRanges = ['INR 10 - INR 300','INR 301 - INR 500','INR 501 - INR 1000','INR 1000 - INR 2000','INR 2000+'];
  const sizes = ['Small','Medium','Large','Pack of 1','Pack of 2'];

  const toggleFilter = (key, value) => {
    setSelectedFilters(prev => {
      const copy = { ...prev };
      const setForKey = new Set(copy[key] || []);
      if (setForKey.has(value)) setForKey.delete(value);
      else setForKey.add(value);
      copy[key] = Array.from(setForKey);
      return copy;
    });
  };

  const clearFilters = () => setSelectedFilters({});

  const hasFilterSelections = (filterType) => {
    return selectedFilters[filterType] && selectedFilters[filterType].length > 0;
  };

  const getFilterCount = (filterType) => {
    return selectedFilters[filterType] ? selectedFilters[filterType].length : 0;
  };

  const displayedProducts = React.useMemo(() => {
    const keys = Object.keys(selectedFilters).filter(k => selectedFilters[k] && selectedFilters[k].length);
    if (!keys.length) return filteredProducts;
    return filteredProducts.filter(p => {
      for (const key of keys) {
        const values = selectedFilters[key];
        if (!values || !values.length) continue;
        let ok = false;
        
        if (key === 'Brand') ok = values.includes(p.brand);
        else if (key === 'Price') {
          ok = values.some(v => {
            if (!p.price) return false;
            const parts = v.replace(/INR|\s/g, '').split('-');
            if (parts.length === 2) {
              const low = parseInt(parts[0]) || 0;
              const high = parseInt(parts[1]) || Number.MAX_SAFE_INTEGER;
              return p.price >= low && p.price <= high;
            }
            if (v.includes('+')) {
              const num = parseInt(v) || 0;
              return p.price >= num;
            }
            return false;
          });
        } else if (key === 'Size') ok = values.includes(p.size);
        else if (key === 'Sub Category') ok = values.includes(p.subCategory) || values.includes(p.subcategory);
        else {
          const prop = p[key?.toLowerCase?.()];
          if (Array.isArray(prop)) ok = prop.some(x => values.includes(x));
          else ok = values.includes(prop);
        }
        if (!ok) return false;
      }
      return true;
    });
  }, [selectedFilters, filteredProducts]);

  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const scrollAmountRef = useRef(0);
  const scrollTopLeft = () => {
    if (topRef.current) {
      const amount = scrollAmountRef.current || topRef.current.clientWidth || 800;
      topRef.current.scrollBy({ left: -amount, behavior: 'smooth' });
    }
  };
  const scrollTopRight = () => {
    if (topRef.current) {
      const amount = scrollAmountRef.current || topRef.current.clientWidth || 800;
      topRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };
  const handleLeftWheel = (e) => { if (leftRef.current) { e.preventDefault(); leftRef.current.scrollTop += e.deltaY; } };
  const handleRightWheel = (e) => { if (rightRef.current) { e.preventDefault(); rightRef.current.scrollTop += e.deltaY; } };

  useEffect(() => {
    const update = () => { if (topRef.current) scrollAmountRef.current = topRef.current.clientWidth; };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <>
      <Helmet>
        <title>{`Pet Parent — ${active} | PET&CO`}</title>
       <style>{`
          .thin-gold-scroll {
            scrollbar-width: none;
            scrollbar-color: transparent transparent;
          }
          .thin-gold-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
          .thin-gold-scroll::-webkit-scrollbar-track { background: transparent; }
          .thin-gold-scroll::-webkit-scrollbar-thumb { background: transparent; }

          html, body, #root {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          html::-webkit-scrollbar, body::-webkit-scrollbar, #root::-webkit-scrollbar {
            display: none; width: 0; height: 0;
          }

          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar { display: none; }

          .top-scroll-btn { width: 34px; height: 34px; border-radius: 9999px; }

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
                onClick={() => { setActive(c.label); navigate(`/pet-parent/products?sub=${encodeURIComponent(c.label)}`); }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-lg border ${
                  active === c.label ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center p-1 ${
                  active === c.label ? 'ring-2 ring-orange-400' : ''
                }`}>
                  <img src={c.img} alt={c.label} className="w-full h-full object-contain" />
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
                    onClick={() => { setActive(c.label); navigate(`/pet-parent/products?sub=${encodeURIComponent(c.label)}`); }}
                    className="w-full text-left flex items-center gap-3 p-4"
                  >
                    <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border p-1 ${active===c.label ? 'ring-2 ring-orange-400' : 'border-gray-100'}`}>
                      <img src={c.img} alt={c.label} className="w-full h-full object-contain" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">{c.label}</span>
                  </button>
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
          <div className="mb-4 flex items-center justify-between">
            <div className="relative flex-1 overflow-hidden">
              <button
                onClick={scrollTopLeft}
                aria-label="Scroll left"
                className="top-scroll-btn hidden md:inline-flex items-center justify-center border border-border bg-white ml-1 mr-2 absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

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
                      className={`flex items-center gap-2 text-sm px-3 py-1 border border-border rounded-full bg-white ${selectedTopFilter === t ? 'ring-1 ring-orange-300' : (hasFilterSelections(t) ? 'ring-1 ring-orange-200 bg-orange-50' : '')}`}
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
                      {getFilterCount(t) > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-orange-500 rounded-full ml-2">{getFilterCount(t)}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading products...</div>
            ) : displayedProducts.length > 0 ? (
              displayedProducts.map(p=> (
                <ProductCard key={p.id} p={p} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">No products found</div>
            )}
          </div>
        </main>
      </div>
    </div>

    <div aria-hidden={!filterOpen} className={`fixed inset-0 z-50 pointer-events-none ${filterOpen ? '' : ''}`}>
      <div
        onClick={() => setFilterOpen(false)}
        className={`absolute inset-0 bg-black/40 transition-opacity ${filterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full bg-white w-full sm:w-96 shadow-xl transform transition-transform pointer-events-auto ${filterOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="text-sm font-semibold">Filter</div>
            <div className="text-xs text-muted-foreground">{displayedProducts.length} products</div>
          </div>
          <div>
            <button onClick={() => setFilterOpen(false)} className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

  <div ref={drawerContentRef} className="px-4 pt-4 pb-32 hide-scrollbar overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          <section className="mb-6">
            <h4 className="text-sm font-medium mb-3">Sort By</h4>
            <div className="flex flex-wrap gap-2">
              {['Featured','Best selling','Alphabetically, A-Z','Alphabetically, Z-A','Price, low to high','Price, high to low','Date, old to new','Date, new to old'].map(s=> (
                <button key={s} className="text-xs px-3 py-1 border border-border rounded bg-white">{s}</button>
              ))}
            </div>
          </section>

          <section ref={el => sectionRefs.current['Brand'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Brand</h4>
            <div className="flex flex-wrap gap-2">
              {brands.map(b=> (
                <button 
                  key={b} 
                  onClick={() => toggleFilter('Brand', b)}
                  className={`text-xs px-3 py-1 border rounded transition-colors ${
                    selectedFilters['Brand']?.includes(b) 
                      ? 'border-orange-400 bg-orange-50 text-orange-700' 
                      : 'border-border bg-white hover:border-orange-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </section>

          <section ref={el => sectionRefs.current['Size'] = el} className="mb-6">
            <h4 className="text-sm font-medium mb-3">Size</h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map(s=> (
                <button 
                  key={s} 
                  onClick={() => toggleFilter('Size', s)}
                  className={`text-xs px-3 py-1 border rounded transition-colors ${
                    selectedFilters['Size']?.includes(s) 
                      ? 'border-orange-400 bg-orange-50 text-orange-700' 
                      : 'border-border bg-white hover:border-orange-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

        </div>
      </aside>
    </div>
    <Footer />
    </>
  );
}
