import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import { useCart } from '../../contexts/CartContext';
import productApi from '../../services/productApi';
import ProductCard from '../../components/ui/ProductCard';
import FilterDrawer from '../../components/FilterDrawer';
import { getFilterSections } from '../../data/categoryFilters';

// Outlet Food & Treats categories
const categories = [
  { id: 'raw-hide-bones', label: 'Raw Hide Bones', img: '/assets/images/outlet/row-hided-bones.png' },
  { id: 'knotted-bones', label: 'Knotted Bones', img: '/assets/images/outlet/knotted-bones.png' },
  { id: 'munchies', label: 'Munchies', img: '/assets/images/outlet/munchies.png' },
  { id: 'dental-treats', label: 'Dental Treats', img: '/assets/images/outlet/dental-treates.png' },
  { id: 'calcium-treats', label: 'Calcium Treats', img: '/assets/images/outlet/calcium-treats.png' },
  { id: 'wet-food-gravy', label: 'Wet Food / Gravy', img: '/assets/images/outlet/wetfood.png' },
  { id: 'puppy-treats', label: 'Puppy Treats', img: '/assets/images/outlet/puppy-treats.png' },
  { id: 'dry-food', label: 'Dry Food', img: '/assets/images/outlet/all-food-treats.png' },
  { id: 'treats', label: 'Treats', img: '/assets/images/outlet/twisted-snicks.png' },
  { id: 'all', label: 'All Food & Treats', img: '/assets/images/outlet/all-food-treats.png' }
];

const OutletFoodTreats = ({ initialActive = 'All Food & Treats' }) => {
  const [active, setActive] = useState(initialActive);
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Layout refs
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const topRef = useRef(null);

  // Filters
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTopFilter, setSelectedTopFilter] = useState('Brand'); // Default
  const [selectedFilters, setSelectedFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});

  const sections = getFilterSections('outlet', 'food');
  // Dynamic top filters from sections
  const topFilters = sections.map(s => s.label);

  // Scroll handlers
  const handleLeftWheel = (e) => { if (leftRef.current) { e.preventDefault(); leftRef.current.scrollTop += e.deltaY; } };
  const handleRightWheel = (e) => { if (rightRef.current) { e.preventDefault(); rightRef.current.scrollTop += e.deltaY; } };
  const scrollTopLeft = () => { if (topRef.current) topRef.current.scrollBy({ left: -220, behavior: 'smooth' }); };
  const scrollTopRight = () => { if (topRef.current) topRef.current.scrollBy({ left: 220, behavior: 'smooth' }); };

  const openFilterAndScroll = (label) => {
    setSelectedTopFilter(label);
    setFilterOpen(true);
  };

  const toggleFilterOption = (sectionId, option) => {
    setSelectedFilters(prev => {
      const current = new Set(prev[sectionId] || []);
      if (current.has(option)) current.delete(option); else current.add(option);
      return { ...prev, [sectionId]: Array.from(current) };
    });
  };

  const clearFilters = () => setSelectedFilters({});

  const applyFilters = () => {
    const params = {};
    Object.keys(selectedFilters).forEach(k => {
      if ((selectedFilters[k] || []).length) params[k] = selectedFilters[k].join(',');
    });
    setAppliedFilters(params);
    setFilterOpen(false);
  };

  // Load products
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = { type: 'Outlet', ...appliedFilters };
        const apiData = await productApi.getCustomerProducts(params);

        // Normalize
        const normalized = (apiData || []).map(item => ({
          id: item?.id,
          name: item?.name,
          image: item?.imageUrl || (item?.images?.[0]) || '/assets/images/no_image.png',
          badges: item?.badges || ['Outlet'],
          variants: item?.variants?.length ? item.variants : [{
            weight: 'Default',
            price: Number(item?.price || 0),
            originalPrice: Number(item?.originalPrice || item?.mrp || 0),
            stock: item?.stockQuantity || 0
          }],
          price: Number(item?.price || 0),
          original: Number(item?.originalPrice || item?.mrp || 0) || null,
          category: item?.category || '',
          subcategory: item?.subcategory || '',
          brand: item?.brand || '',
          stockQuantity: item?.stockQuantity || 0
        }));
        
        setProducts(normalized);
      } catch (err) {
        console.error('Outlet Food & Treats: load failed', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [appliedFilters]);

  // Filter products locally by active category
  useEffect(() => {
    let working = products;

    // Category filter
    if (active !== 'All Food & Treats') {
      working = working.filter(p => !active || p.subcategory === active || (p.category === active));
    } else {
       // Filter for food/treats general
       working = working.filter(p => {
          const cat = (p.category || '').toLowerCase();
          const sub = (p.subcategory || '').toLowerCase();
          return cat.includes('food') || cat.includes('treat') || cat.includes('outlet') || sub.includes('food') || sub.includes('treat');
       });
    }

    setFilteredProducts(working);
  }, [products, active]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Outlet Food & Treats - Pet & Co</title>
      </Helmet>
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Mobile horizontal categories */}
        <div className="md:hidden mb-6">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {categories.map((c) => (
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
                  <img src={c.img} alt={c.label} className="w-8 h-8 object-cover" onError={(e) => e.target.src = '/assets/images/no_image.png'} />
                </div>
                <span className={`text-xs font-medium text-center leading-tight ${active === c.label ? 'text-orange-600' : 'text-gray-600'}`}>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="hidden md:block md:col-span-3 space-y-3">
            <div ref={leftRef} onWheel={handleLeftWheel} className="bg-white rounded border border-border overflow-hidden thin-gold-scroll" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
              <ul className="divide-y">
                {categories.map((c) => (
                  <li key={c.id} className={`relative border-b ${active === c.label ? 'bg-[#fff6ee]' : ''}`}>
                    <button onClick={() => setActive(c.label)} className="w-full text-center flex flex-col items-center gap-1 p-2 md:flex-row md:text-left md:items-center md:gap-3 md:p-4 transition-colors hover:bg-orange-50">
                      <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border ${active === c.label ? 'ring-2 ring-orange-400' : 'border-gray-100'}`}>
                        <img src={c.img} alt={c.label} className="w-full h-full object-cover" onError={(e)=>e.target.src='/assets/images/no_image.png'} />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-gray-800 mt-1 md:mt-0">{c.label}</span>
                    </button>
                    {active === c.label && <div className="absolute right-0 top-0 h-full w-1 bg-orange-400" />}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <main ref={rightRef} onWheel={handleRightWheel} className="col-span-12 md:col-span-9" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>

            {/* Top Filters */}
            <div className="mb-4 flex items-center justify-between">
              <div className="relative flex-1 overflow-hidden">
                <button onClick={scrollTopLeft} className="hidden md:inline-flex items-center justify-center border border-border bg-white ml-1 mr-2 absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-6 h-6 rounded-full shadow-sm hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>

                <div ref={topRef} className="hide-scrollbar overflow-x-auto pl-8 pr-8" style={{ whiteSpace: 'nowrap' }}>
                  <div className="inline-flex items-center gap-2">
                    {topFilters.map((t) => (
                      <button key={t} onClick={() => openFilterAndScroll(t)} className={`flex items-center gap-2 text-sm px-4 py-1.5 border border-border rounded-full bg-white hover:bg-gray-50 transition-colors ${selectedTopFilter === t ? 'ring-1 ring-orange-300' : ''}`}>
                        {selectedTopFilter === t ? <span className="w-2 h-2 bg-green-500 rounded-full" /> : null}
                        <span>{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={scrollTopRight} className="hidden md:inline-flex items-center justify-center border border-border bg-white ml-2 mr-1 absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-6 h-6 rounded-full shadow-sm hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map(p => (
                   <ProductCard key={p.id} p={p} />
                ))}
                {filteredProducts.length === 0 && (
                   <div className="col-span-full text-center py-10 text-muted-foreground">No products found.</div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        sections={sections}
        selected={selectedFilters}
        onToggle={toggleFilterOption}
        onClear={clearFilters}
        onApply={applyFilters}
        total={products.length}
      />

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default OutletFoodTreats;