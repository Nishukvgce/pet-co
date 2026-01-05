import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import { useCart } from '../../contexts/CartContext';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import productApi from '../../services/productApi';
import { resolveImageUrl } from '../../lib/imageUtils';
import FilterDrawer from '../../components/FilterDrawer';
import { getFilterSections } from '../../data/categoryFilters';
import MobileCategorySidebar from '../../components/MobileCategorySidebar';

// Outlet Toys categories - matching backend subcategory names
const categories = [
  { id: 'soft-toys', label: 'Soft Toys', img: '/assets/images/dog/db1.webp' },
  { id: 'rubber-toys', label: 'Rubber Toys', img: '/assets/images/dog/db2.webp' },
  { id: 'rope-toys', label: 'Rope Toys', img: '/assets/images/dog/db3.webp' },
  { id: 'squeaky-toys', label: 'Squeaky Toys', img: '/assets/images/dog/db4.webp' },
  { id: 'interactive-toys', label: 'Interactive Toys', img: '/assets/images/essential/dry-food.webp' },
  { id: 'chew-toys', label: 'Chew Toys', img: '/assets/images/essential/treats.webp' },
  { id: 'puzzle-toys', label: 'Puzzle Toys', img: '/assets/images/essential/wet-food.webp' },
  { id: 'all', label: 'All Toys', img: '/assets/images/essential/all-food.webp' }
];

const ProductCard = ({ p }) => {
  const { addToCart } = useCart();
  const [variantIdx, setVariantIdx] = useState(0);
  const variants = p.variants || [{ weight: 'Default', price: p.price, originalPrice: p.original, stock: 1 }];
  const currentVariant = variants[variantIdx];
  const currentPrice = currentVariant.price || p.price || 0;
  const originalPrice = currentVariant.originalPrice || p.original || 0;
  const discount = originalPrice > currentPrice ? Math.round(100 - (currentPrice / originalPrice) * 100) : 0;
  const isInStock = currentVariant.stock > 0;

  // Resolve image URL using shared helper so backend baseURL and various path formats are handled
  const getImageUrl = (imageUrl) => {
    const resolved = resolveImageUrl(imageUrl || '');
    return resolved || '/assets/images/no_image.png';
  };

  const handleAddToCart = async () => {
    if (!isInStock) return;
    try {
      await addToCart({
        productId: p.id,
        id: p.id,
        name: p.name,
        image: getImageUrl(p.image),
        price: currentPrice,
        variant: currentVariant.weight ? `${currentVariant.weight}${currentVariant.weightUnit || ''}` : 'Default',
        quantity: 1,
        category: 'Outlet Toys'
      });
    } catch (e) {
      // addToCart already shows notifications; swallow to avoid uncaught promise
    }
  };

  return (
    <article className={`bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${
      !isInStock ? 'opacity-75' : ''
    }`}>
      <div className="p-3 md:p-4">
        {/* Badge and discount */}
        <div className="h-6 flex items-center justify-between mb-3">
          <div className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isInStock ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
          }`}>
            {!isInStock ? 'Out of Stock' : (p.badges?.[0] || 'Outlet')}
          </div>
          {discount > 0 && (
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Product Image with overlays */}
        <div className="relative mb-4">
          <div className="h-40 md:h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
            <Link to={`/product-full/${p.id}`} aria-label={`Open ${p.name} full page`} className="block w-full h-full flex items-center justify-center">
              <img 
                src={getImageUrl(p.image)} 
                alt={p.name} 
                className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = '/assets/images/no_image.png'; }}
              />
            </Link>

            {!isInStock && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg z-10">
                <span className="text-white font-bold text-sm">Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-sm md:text-base font-semibold text-foreground mb-3 line-clamp-2 leading-tight overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{p.name}</h3>

        {/* Variant chips (show weight + price) */}
        {variants.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button 
                key={i}
                onClick={() => setVariantIdx(i)}
                className={`flex flex-col items-center text-xs font-medium px-3 py-2 border rounded-lg cursor-pointer transition-all duration-200 ${i === variantIdx ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-border hover:border-orange-300 hover:bg-orange-50'}`}>
                <span className="leading-tight">{v.weight ? `${v.weight}${v.weightUnit || ''}` : 'Default'}</span>
                <span className="text-[11px] text-muted-foreground mt-1">₹{(v.price || currentPrice).toLocaleString()}</span>
              </button>
            ))}
          </div>
        )}

        {/* Price and circular Add button */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-lg md:text-xl font-bold text-foreground">₹{currentPrice.toLocaleString()}</div>
            {originalPrice > currentPrice && (
              <div className="text-sm text-muted-foreground line-through">₹{originalPrice.toLocaleString()}</div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`w-12 h-12 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center ${isInStock ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-md' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
            {isInStock ? 'Add' : '—'}
          </button>
        </div>
      </div>
    </article>
  );
};

const OutletToys = ({ initialActive = 'All Toys' }) => {
  const [active, setActive] = useState(initialActive);
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [appliedFilters, setAppliedFilters] = useState({});

  const sections = getFilterSections('outlet', 'toys');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Get all outlet products first; include applied filters
        const params = { type: 'Outlet', ...appliedFilters };
        const apiData = await productApi.getCustomerProducts(params);

        // Filter products based on category and subcategory
        let filteredProducts = (apiData || []).filter(item => {
          // Check if item has the correct category
          const categoryMatch = item?.category?.toUpperCase() === 'OUTLET TOYS' || 
                               item?.category?.toUpperCase() === 'TOYS';
          
          if (!categoryMatch) return false;
          
          // If "All Toys" is selected, show all toy products
          if (active === 'All Toys') {
            return true;
          }
          
          // Otherwise, filter by subcategory
          const subcategoryMatch = item?.subcategory === active;
          return subcategoryMatch;
        });

        // Normalize the filtered products
        const normalized = filteredProducts.map(item => {
          const variants = item?.variants || [];
          const hasValidVariants = variants.length > 0;
          
          // Get the primary image
          const primaryImage = item?.imageUrl || 
                               (item?.images && item.images.length > 0 ? item.images[0] : null) || 
                               '/assets/images/no_image.png';
          
          return {
            id: item?.id,
            name: item?.name,
            image: primaryImage,
            badges: item?.badges || ['Outlet'],
            variants: hasValidVariants ? variants : [{
              weight: 'Default',
              price: Number(item?.price || 0),
              originalPrice: Number(item?.originalPrice || item?.mrp || 0),
              stock: item?.stockQuantity || 0
            }],
            price: Number(item?.price || 0),
            original: Number(item?.originalPrice || item?.mrp || 0) || null,
            category: item?.category || '',
            subcategory: item?.subcategory || '',
            stockQuantity: item?.stockQuantity || 0
          };
        });

        console.log('Filtered toy products for', active, ':', normalized);
        setProducts(normalized);
      } catch (err) {
        console.error('Outlet Toys: load failed', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [active, appliedFilters]);

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

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Outlet Toys - Pet & Co</title>
        <meta name="description" content="Discounted toys for dogs and cats at Pet & Co Outlet" />
      </Helmet>

      <Header />

      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Outlet Toys</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Discounted toys to keep your pets entertained - same fun, better prices!
          </p>
        </div>

        <div className="flex flex-row gap-6">
          {/* Mobile vertical category sidebar (top-down) - placed to the left on small screens */}
          <div className="block lg:hidden w-20">
            <MobileCategorySidebar categories={categories} active={active} setActive={setActive} />
          </div>
          {/* Category Sidebar (desktop) */}
          <div className="hidden lg:block w-64 xl:w-72 space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-4">Categories</h3>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActive(c.label)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 hover:shadow-md ${
                  active === c.label
                    ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-500 shadow-md'
                    : 'bg-white hover:bg-gray-50 border border-border shadow-sm'
                }`}
              >
                <div className="flex-shrink-0">
                  <img 
                    src={c.img} 
                    alt={c.label} 
                    className="w-14 h-14 object-cover rounded-lg shadow-sm"
                    onError={(e) => {
                      e.target.src = '/assets/images/no_image.png';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${
                    active === c.label ? 'text-orange-600' : 'text-foreground'
                  }`}>
                    {c.label}
                  </div>
                  {active === c.label && (
                    <div className="text-xs text-orange-500 mt-1">Currently viewing</div>
                  )}
                </div>
                {active === c.label && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 bg-white rounded-lg p-4 border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-2">{active}</h2>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : `${products.length} products found`}
                </p>
                <button onClick={() => setFilterOpen(true)} className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded text-sm bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                  </svg>
                  <span>Filter</span>
                </button>
                {/* {products.length > 0 && !loading && (
                  <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Live inventory
                  </div>
                )} */}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-border">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <div className="text-muted-foreground">Loading products...</div>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-border">
                <div className="text-center">
                  <div className="text-6xl mb-4">🧸</div>
                  <div className="text-foreground font-semibold mb-2">No toys found in "{active}"</div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Check other categories or try again later.
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                {products.map(p => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            )}
          </div>
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

export default OutletToys;