import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import ProductCard from '../../components/ui/ProductCard';
import productApi from '../../services/productApi';
import { normalizeProductFromApi } from '../../utils/productUtils';
import FilterDrawer from '../../components/FilterDrawer';
import { getFilterSections } from '../../data/categoryFilters';

export default function ShopIndex() {
  const location = useLocation();
  const q = new URLSearchParams(location.search).get('type') || '';
  const typeNorm = q ? q.toLowerCase() : '';

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedAge, setSelectedAge] = useState('all');

  // Layout refs for sidebar/top scroll behavior
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const topRef = useRef(null);

  // Filter drawer state
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});

  // Get filter sections — fallback to 'default' if specific not present
  const sections = getFilterSections('dogs', 'default');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const params = { type: q ? q : undefined, limit: 500 };
        const apiData = await productApi.getCustomerProducts(params);

        const normalized = (apiData || []).map(item => {
          const np = normalizeProductFromApi(item || {});
          const fallbackImage = Array.isArray(np.images) ? (typeof np.images[0] === 'object' ? (np.images[0].url || np.images[0].path || np.images[0].imageUrl) : np.images[0]) : undefined;
          return {
            ...np,
            id: np.id || item?.id,
            image: np.imageUrl || np.image || fallbackImage || '/assets/images/no_image.png'
          };
        });

        if (!mounted) return;
        setProducts(normalized);
      } catch (err) {
        console.error('ShopIndex: failed to load products', err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [q]);

  // Apply local filters (simple intersection using productUtils helper)
  useEffect(() => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let working = products;

    // Apply any appliedFilters (map to metadata keys)
    const filterBySelections = (prod) => {
      // Example: appliedFilters may be { brands: ['Tetra'], proteinSource: ['Fish'] }
      return Object.entries(appliedFilters).every(([key, selections]) => {
        if (!selections || selections.length === 0) return true;
        const prodVals = (prod.filters && prod.filters[key]) || [];
        const prodLower = prodVals.map(v => (v || '').toString().toLowerCase());
        return selections.some(s => prodLower.includes((s || '').toString().toLowerCase()));
      });
    };

    working = working.filter(filterBySelections);

    // Apply Age (life stage) filter when selected
    if (selectedAge && selectedAge !== 'all') {
      const ageLower = selectedAge.toString().toLowerCase();
      working = working.filter(p => {
        // Normalize possible lifeStage fields
        const life = (p.lifeStage || p.life_stage || '');
        if (life && life.toString().toLowerCase().includes(ageLower)) return true;
        // Also check normalized filters map
        const filterVals = (p.filters && (p.filters.lifeStages || p.filters.lifestages || p.filters.lifeStage)) || [];
        if (Array.isArray(filterVals) && filterVals.length) {
          return filterVals.some(v => (v || '').toString().toLowerCase().includes(ageLower));
        }
        return false;
      });
    }
    setFilteredProducts(working);
  }, [products, appliedFilters, selectedAge]);

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
      if ((selectedFilters[k] || []).length) params[k] = selectedFilters[k];
    });
    setAppliedFilters(params);
    setFilterOpen(false);
  };

  const scrollTopLeft = () => { if (topRef.current) topRef.current.scrollBy({ left: -220, behavior: 'smooth' }); };
  const scrollTopRight = () => { if (topRef.current) topRef.current.scrollBy({ left: 220, behavior: 'smooth' }); };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{q ? `${q.charAt(0).toUpperCase() + q.slice(1)} - Pet & Co` : 'Shop - Pet & Co'}</title>
      </Helmet>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className={`md:col-span-3 space-y-3 ${showSidebar ? 'hidden md:block' : 'hidden'}`}>
            <div ref={leftRef} className="bg-white rounded border border-border overflow-hidden thin-gold-scroll" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
              {/* Simple static Pet Type & Brand sections to match image */}
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium mb-3">Pet Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2"><input type="checkbox" /> Turtle (4)</label>
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-sm font-medium mb-3">Brand</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2"><input type="checkbox" /> Splashy Fin (17)</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> Tetra (9)</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> Tunai (7)</label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main ref={rightRef} className="col-span-12 md:col-span-9" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
            {/* Top controls: Filters toggle, Age dropdown, Sort */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setFilterOpen(true)} className="px-4 py-2 border rounded bg-white">FILTERS</button>
                <button onClick={() => setShowSidebar(s => !s)} className="px-3 py-2 border rounded bg-white">{showSidebar ? 'Hide' : 'Show'}</button>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 border rounded bg-white">Age :</div>
                  <select value={selectedAge} onChange={e => setSelectedAge(e.target.value)} className="border rounded px-2 py-2 bg-white text-sm">
                    <option value="all">all</option>
                    <option value="Puppy">Puppy</option>
                    <option value="Adult">Adult</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm">Sort By :</div>
                <select className="border rounded px-3 py-2 bg-white">
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Banner placeholder */}
           
        

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {(filteredProducts.length ? filteredProducts : products).map(p => (
                  <ProductCard key={p.id} p={p} />
                ))}
                {(filteredProducts.length === 0 && products.length === 0) && (
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
}
