import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import { useCart } from '../../contexts/CartContext';
import productApi from '../../services/productApi';
import apiClient from '../../services/api';
import { getFilterConfig, getSortOptions } from '../../data/categoryFilters';
import { normalizeProductFromApi } from '../../utils/productUtils';
import ProductCard from '../../components/ui/ProductCard';

const categories = [
  { id: 'all-rabbit-products', label: 'All Rabbit Products', img: '/assets/images/homecategory/rabbit.jpg' }
];

const sampleProducts = [
  {
    id: 'r1',
    name: 'Science Selective Timothy Hay For Rabbits And Guinea Pigs',
    image: '/assets/images/homecategory/rabbit.jpg',
    badges: ['EXTRA ₹100 Off Above ₹2000. Use Code SAVE100'],
    variants: ['2kg', '400g'],
    price: 2127,
    original: 2350
  },
  {
    id: 'r2',
    name: 'Boltz Premium Rabbit Food',
    image: '/assets/images/homecategory/rabbit.jpg',
    badges: ['Get Free Shipping on Orders Above ₹399. Use Code FREESHIPPING'],
    variants: ['1.2kg'],
    price: 432,
    original: 499
  },
  {
    id: 'r3',
    name: 'Oxbow Western Timothy Hay Dry Food For Rabbits And Guinea Pigs',
    image: '/assets/images/homecategory/rabbit.jpg',
    badges: ['Get Free Shipping on Orders Above ₹399. Use Code FREESHIPPING'],
    variants: ['425g'],
    price: 630,
    original: 700
  },
  {
    id: 'r4',
    name: 'Tunai All Life Stages Pellet Rabbit Food',
    image: '/assets/images/homecategory/rabbit.jpg',
    badges: ['Get Free Shipping on Orders Above ₹399. Use Code FREESHIPPING'],
    variants: ['520g'],
    price: 390,
    original: 599
  }
];

const RabbitProducts = ({ initialActive = 'All Rabbit Products' }) => {
  const [active, setActive] = useState(initialActive);
  const [products, setProducts] = useState(sampleProducts);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const { getCartItemCount, cartItems } = useCart();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const filterConfig = getFilterConfig('rabbits', 'products');
  const sortOptions = getSortOptions('rabbits', 'products');
  const filterSections = filterConfig.sections || [];
  
  const topFilters = (filterConfig.topFilters && filterConfig.topFilters.length > 0)
    ? filterConfig.topFilters
    : ['Brand', 'Veg/Non-Veg', 'Pet Type', 'Price'];
    
  const [selectedTopFilter, setSelectedTopFilter] = useState(topFilters[0] || '');
  const topRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const drawerContentRef = useRef(null);
  const sectionRefs = useRef({});

  const initialSortOption = sortOptions[0] || 'Featured';
  const buildEmptyFilterState = useCallback(() => {
    const base = { sortBy: initialSortOption };
    filterSections.forEach(section => {
      base[section.id] = [];
    });
    return base;
  }, [filterSections, initialSortOption]);

  const [selectedFilters, setSelectedFilters] = useState(() => buildEmptyFilterState());

  useEffect(() => {
    setSelectedFilters(buildEmptyFilterState());
  }, [buildEmptyFilterState]);

  const toggleFilter = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: (prev[category] || []).includes(value)
        ? prev[category].filter(item => item !== value)
        : [...(prev[category] || []), value]
    }));
  };

  const setSortBy = (sortValue) => {
    setSelectedFilters(prev => ({ ...prev, sortBy: sortValue }));
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
        } catch (err) { }
      }
    };
    setTimeout(doScroll, 220);
  };

  const scrollTopLeft = () => { if (topRef.current) topRef.current.scrollBy({ left: -220, behavior: 'smooth' }); };
  const scrollTopRight = () => { if (topRef.current) topRef.current.scrollBy({ left: 220, behavior: 'smooth' }); };
  const leftRef = useRef(null);
  const rightRef = useRef(null);

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

  const resolveImageUrl = (p) => {
    const candidate = p?.imageUrl || p?.image || p?.thumbnailUrl || p?.image_path;
    if (!candidate) return '/assets/images/no_image.png';
    if (/^(https?:)?\/\//i.test(candidate) || candidate.startsWith('data:')) return candidate;
    const base = apiClient?.defaults?.baseURL || '';
    return candidate.startsWith('/') ? `${base}${candidate}` : `${base}/${candidate}`;
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingProducts(true);
      try {
        const params = { type: 'Rabbit' };
        const apiData = await productApi.getCustomerProducts(params);
        
        const normalizedProducts = (apiData || []).map((item) => {
          const normalizedProduct = normalizeProductFromApi(item);
          const filters = { ...(normalizedProduct.filters || {}) };
          const brand = normalizedProduct.brand || item?.brand || '';
          
          if (brand) {
            const list = Array.isArray(filters.brands) ? filters.brands.slice() : [];
            if (!list.map(v => `${v}`.toLowerCase()).includes(`${brand}`.toLowerCase())) {
              list.push(brand);
            }
            filters.brands = list;
          }
          
          return {
            ...normalizedProduct,
            image: resolveImageUrl(normalizedProduct),
            filters
          };
        });

        if (normalizedProducts.length > 0) {
          setProducts(normalizedProducts);
          setFetchError('');
        } else {
          setProducts(sampleProducts);
          setFetchError('No live rabbit items found. Showing featured picks.');
        }
      } catch (error) {
        setFetchError(`Unable to reach live catalog: ${error.message}. Showing featured picks.`);
        setProducts(sampleProducts);
      } finally {
        setLoadingProducts(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [active]);

  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let working = products;

    if ((selectedFilters.brands || []).length > 0) {
      working = working.filter(p => selectedFilters.brands.includes(p.brand));
    }

    if ((selectedFilters.foodType || []).length > 0) {
      working = working.filter(p => selectedFilters.foodType.some(ft =>
        String(p.foodType || '').toLowerCase().includes(ft.toLowerCase()) ||
        String(p.name || '').toLowerCase().includes(ft.toLowerCase()) ||
        String(p.category || '').toLowerCase().includes(ft.toLowerCase())
      ));
    }

    if ((selectedFilters.petTypes || []).length > 0) {
      working = working.filter(p => selectedFilters.petTypes.some(pt =>
        String(p.type || p.animal || '').toLowerCase().includes(pt.toLowerCase()) ||
        String(p.name || '').toLowerCase().includes(pt.toLowerCase()) ||
        String(p.category || '').toLowerCase().includes(pt.toLowerCase())
      ));
    }

    if ((selectedFilters.priceRanges || []).length > 0) {
      working = working.filter(p => {
        const price = p.price || 0;
        return selectedFilters.priceRanges.some(range => {
          if (range === 'INR 0 - INR 500') return price >= 0 && price <= 500;
          if (range === 'INR 501 - INR 1000') return price >= 501 && price <= 1000;
          if (range === 'INR 1000 - INR 2000') return price >= 1000 && price <= 2000;
          if (range === 'INR 2000+') return price > 2000;
          return true;
        });
      });
    }

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
  }, [products, selectedFilters, active]);

  const displayedProducts = useMemo(() => {
    return filteredProducts;
  }, [filteredProducts]);

  return (
    <>
      <Helmet>
        <title>Shop for Rabbits — Rabbit Products</title>
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
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={() => { }} />

      <div className="container mx-auto px-4 py-8">
        
        <div className="md:hidden mb-6">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {categories.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => setActive(c.label)}
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
                {categories.map((c, idx) => (
                  <li key={c.id} className={`relative border-b ${active === c.label ? 'bg-[#fff6ee]' : ''}`}>
                    <button
                      onClick={() => setActive(c.label)}
                      className="w-full text-left flex items-center gap-3 p-4"
                    >
                      <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border ${active === c.label ? 'ring-2 ring-orange-400' : 'border-gray-100'}`}>
                        <img src={c.img} alt={c.label} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{c.label}</span>
                    </button>
                    {active === c.label && (
                      <div className="absolute right-0 top-0 h-full w-1 bg-orange-400" />
                    )}
                  </li>
                ))}
                
                {filterSections.map(section => (
                  <li key={section.id} className="p-4 border-b">
                     <h4 className="text-sm font-semibold mb-3">{section.label}</h4>
                     <div className="flex flex-col gap-2">
                        {section.options.map((option, idx) => {
                           const isSelected = (selectedFilters[section.id] || []).includes(option);
                           return (
                               <label key={idx} className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                     type="checkbox" 
                                     className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                                     checked={isSelected}
                                     onChange={() => toggleFilter(section.id, option)}
                                  />
                                  <span className="text-sm text-gray-700">{option}</span>
                               </label>
                           );
                        })}
                     </div>
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
                    <button className="flex items-center gap-2 text-sm px-3 py-1 border border-border rounded-full bg-white ring-1 ring-gray-300 mr-2 md:hidden" onClick={() => setFilterOpen(true)}>
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                       </svg>
                       FILTERS
                    </button>
                    {/* Add visual sort order like image reference */}
                    <div className="hidden md:flex items-center gap-2 text-sm px-3 py-1 border border-border rounded-full bg-white ml-auto cursor-pointer">
                        <span className="text-gray-500">Sort By :</span>
                        <select 
                          className="bg-transparent outline-none focus:outline-none cursor-pointer"
                          value={selectedFilters.sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                            {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {loadingProducts ? (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  Loading rabbit products...
                </div>
              ) : displayedProducts.length > 0 ? (
                displayedProducts.map((product) => <ProductCard key={product.id} p={product} />)
              ) : (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No rabbit products match the selected filters yet.
                  {fetchError && <div className="text-xs mt-2 text-orange-600">{fetchError}</div>}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <div aria-hidden={!filterOpen} className={`fixed inset-0 z-50 pointer-events-none md:hidden ${filterOpen ? '' : ''}`}>
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
                {sortOptions.map(option => {
                  const isSelected = selectedFilters.sortBy === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={`text-xs px-3 py-1 border border-border rounded ${isSelected ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </section>

            {filterSections.map(section => (
              <section
                key={section.id}
                ref={el => { sectionRefs.current[section.label] = el; }}
                className="mb-6"
              >
                <h4 className="text-sm font-medium mb-3">{section.label}</h4>
                {section.options.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {section.options.map(option => {
                      const isSelected = (selectedFilters[section.id] || []).includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() => toggleFilter(section.id, option)}
                          className={`text-xs px-3 py-1 border border-border rounded ${isSelected ? 'bg-orange-500 text-white border-orange-500' : 'bg-white'}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">No options available</div>
                )}
              </section>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
};

export default RabbitProducts;
