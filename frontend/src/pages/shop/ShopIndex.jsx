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

  // Sidebar filter state
  const [brandOptions, setBrandOptions] = useState([]);
  const [petTypeOptions, setPetTypeOptions] = useState([]);
  const [brandCounts, setBrandCounts] = useState({});
  const [petTypeCounts, setPetTypeCounts] = useState({});
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPetTypes, setSelectedPetTypes] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(2000);
  const [priceRange, setPriceRange] = useState([0, 2000]);

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
          const fallbackImage = Array.isArray(np.images)
            ? (typeof np.images[0] === 'object' ? (np.images[0].url || np.images[0].path || np.images[0].imageUrl) : np.images[0])
            : undefined;
          if (!np.image && fallbackImage) np.image = fallbackImage;
          return np;
        });

        try {
          const brands = Array.from(new Set((normalized || []).map(p => (p.brand || '').toString()).filter(Boolean)));
          const petTypes = Array.from(new Set((normalized || []).map(p => (p.petType || p.petTypeLabel || p.type || '').toString()).filter(Boolean)));
          const prices = (normalized || []).map(p => Number(p.price || p.pricePerUnit || 0)).filter(n => !Number.isNaN(n));
          const minP = prices.length ? Math.min(...prices) : 0;
          const maxP = prices.length ? Math.max(...prices) : 2000;
          const bCounts = (normalized || []).reduce((acc, p) => { const b = (p.brand||'').toString(); if (!b) return acc; acc[b] = (acc[b] || 0) + 1; return acc; }, {});
          const ptCounts = (normalized || []).reduce((acc, p) => { const t = (p.petType || p.petTypeLabel || p.type || '').toString(); if (!t) return acc; acc[t] = (acc[t] || 0) + 1; return acc; }, {});
          setBrandOptions(brands);
          setPetTypeOptions(petTypes);
          setBrandCounts(bCounts);
          setPetTypeCounts(ptCounts);
          setPriceMin(Math.floor(minP));
          setPriceMax(Math.ceil(maxP));
          setPriceRange([Math.floor(minP), Math.ceil(maxP)]);
        } catch (e) { /* ignore */ }

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
    // Apply Brand filter
    if (selectedBrands && selectedBrands.length) {
      const brandsLower = selectedBrands.map(b => b.toString().toLowerCase());
      working = working.filter(p => (p.brand || '').toString().split(',').some(b => brandsLower.includes(b.trim().toLowerCase())));
    }

    // Apply Pet Type filter
    if (selectedPetTypes && selectedPetTypes.length) {
      const petLower = selectedPetTypes.map(b => b.toString().toLowerCase());
      working = working.filter(p => {
        const candidate = (p.petType || p.petTypeLabel || p.type || '').toString().toLowerCase();
        return petLower.includes(candidate) || petLower.some(v => candidate.includes(v));
      });
    }

    // Apply Price range
    try {
      const min = Number(priceRange[0] || priceMin);
      const max = Number(priceRange[1] || priceMax);
      working = working.filter(p => {
        const pr = Number(p.price || p.pricePerUnit || 0) || 0;
        return pr >= min && pr <= max;
      });
    } catch (e) { /* ignore */ }

    setFilteredProducts(working);
  }, [products, appliedFilters, selectedAge]);

  const toggleFilterOption = (sectionId, option) => {
    setSelectedFilters(prev => {
      const current = new Set(prev[sectionId] || []);
      if (current.has(option)) current.delete(option); else current.add(option);
      return { ...prev, [sectionId]: Array.from(current) };
    });
  };

  // Brand checkbox toggle (applies immediately)
  const toggleBrand = (brand) => {
    setSelectedBrands(prev => {
      const s = new Set(prev || []);
      if (s.has(brand)) s.delete(brand); else s.add(brand);
      const arr = Array.from(s);
      setSelectedBrands(arr);
      // apply immediately
      setAppliedFilters(prevApplied => ({ ...prevApplied, brands: arr }));
      return arr;
    });
  };

  const togglePetType = (ptype) => {
    setSelectedPetTypes(prev => {
      const s = new Set(prev || []);
      if (s.has(ptype)) s.delete(ptype); else s.add(ptype);
      const arr = Array.from(s);
      setSelectedPetTypes(arr);
      setAppliedFilters(prevApplied => ({ ...prevApplied, petTypes: arr }));
      return arr;
    });
  };

  const handlePriceRangeChange = (min, max) => {
    // normalize inputs to numbers and clamp to allowed bounds
    let a = Number(min) || 0;
    let b = Number(max) || 0;
    if (a < priceMin) a = priceMin;
    if (b > priceMax) b = priceMax;
    if (a > b) {
      // swap so the lower value is first
      const tmp = a; a = b; b = tmp;
    }
    setPriceRange([Math.floor(a), Math.ceil(b)]);
  };

  const handlePriceInputChange = (index, raw) => {
    const val = Number(raw);
    if (Number.isNaN(val)) return;
    const next = [...priceRange];
    next[index] = val;
    // enforce bounds
    if (next[0] < priceMin) next[0] = priceMin;
    if (next[1] > priceMax) next[1] = priceMax;
    if (next[0] > next[1]) {
      // keep them ordered; if user sets min > max, swap
      const tmp = next[0]; next[0] = next[1]; next[1] = tmp;
    }
    setPriceRange([Math.floor(next[0]), Math.ceil(next[1])]);
  };

  const handleMaxPriceChange = (raw) => {
    const val = Number(raw);
    if (Number.isNaN(val)) return;
    let v = Math.ceil(val);
    if (v < priceMin) v = priceMin;
    if (v > priceMax) v = priceMax;
    setPriceRange([priceMin, v]);
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
          <div className={`md:col-span-3 space-y-3 ${showSidebar ? 'md:block' : 'hidden'}`}>
            <div ref={leftRef} className="bg-white rounded border border-border overflow-hidden thin-gold-scroll" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
              {/* Simple static Pet Type & Brand sections to match image */}
              <div className="p-4 border-b">
                <h4 className="text-sm font-medium mb-3">Price</h4>
                <div className="px-2 py-4">
                  <div className="w-full mb-2">
                    <input aria-label="max-price" type="range" min={priceMin} max={priceMax} value={priceRange[1]} onChange={e => handleMaxPriceChange(e.target.value)} className="w-full" />
                  </div>
                  <div className="flex justify-between text-xs mt-2 text-gray-600"><span>₹{priceMin}</span><span>₹{priceRange[1]}</span></div>
                  <div className="mt-3 flex gap-2">
                    <div className="w-full">
                      <input aria-label="max-price-input" type="number" className="w-full border px-2 py-1" value={priceRange[1]} onChange={e => handleMaxPriceChange(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-b">
                <h4 className="text-sm font-medium mb-3">Pet Type</h4>
                <div className="space-y-2">
                  {petTypeOptions.length ? petTypeOptions.map(pt => (
                    <label key={pt} className="flex items-center gap-2"><input type="checkbox" checked={selectedPetTypes.includes(pt)} onChange={() => togglePetType(pt)} /> {pt} <span className="text-xs text-muted-foreground ml-1">({petTypeCounts[pt] || 0})</span></label>
                  )) : <div className="text-xs text-muted-foreground">No pet types</div>}
                </div>
              </div>

              <div className="p-4">
                <h4 className="text-sm font-medium mb-3">Brand</h4>
                <div className="space-y-2">
                  {brandOptions.length ? brandOptions.map(b => (
                    <label key={b} className="flex items-center gap-2"><input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} /> {b} <span className="text-xs text-muted-foreground ml-1">({brandCounts[b] || 0})</span></label>
                  )) : <div className="text-xs text-muted-foreground">No brands</div>}
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
                <div>
                  <select value={selectedAge} onChange={e => setSelectedAge(e.target.value)} className="border rounded px-3 py-2 bg-white">
                    <option value="all">All Ages</option>
                    <option value="Adult">Adult</option>
                    <option value="Kitten">Kitten</option>
                    <option value="Puppy">Puppy</option>
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
            {/* Brand chips (driven from backend) */}
            <div className="mb-4">
              <div className="flex items-center gap-2 overflow-x-auto" ref={topRef}>
                {brandOptions.length ? brandOptions.map(b => (
                  <button
                    key={b}
                    onClick={() => toggleBrand(b)}
                    className={`text-sm px-3 py-1 rounded border whitespace-nowrap ${selectedBrands.includes(b) ? 'bg-white border-gray-300' : 'bg-white border-border'}`}
                  >
                    {b} <span className="text-xs text-muted-foreground ml-2">({brandCounts[b] || 0})</span>
                  </button>
                )) : (
                  <div className="text-sm text-muted-foreground">No brands</div>
                )}
              </div>
            </div>
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
