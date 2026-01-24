import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DogTreats from './DogTreats';
import WalkEssentials from './WalkEssentials';
import DogFood from './DogFood';
import DogTrainingEssentials from './DogTrainingEssentials';
import DogGrooming from './DogGrooming';
import DogClothing from './DogClothing';
import DogHealthHygiene from './DogHealthHygiene';
import DogBedding from './DogBedding';
import DogBowlsDiners from './DogBowlsDiners';
import DogTravelSupplies from './DogTravelSupplies';
import DogToys from './DogToys';
import MobileBottomNav from '../../components/ui/MobileBottomNav';

export default function ShopForDogsIndex() {
  const location = useLocation();
  const q = new URLSearchParams(location.search).get('category') || '';
  const sub = new URLSearchParams(location.search).get('sub') || '';
  const cat = q.toLowerCase();

  // Debug log to help troubleshoot routing issues
  console.log('ShopForDogsIndex routing:', { category: q, sub, normalizedCategory: cat });

  let Page = DogTreats; // Default fallback

  if (cat === 'walk-essentials' || cat === 'walkessentials' || cat === 'walk') {
    Page = WalkEssentials;
  } else if (cat.includes('groom')) {
    Page = () => <DogGrooming initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('treat')) {
    Page = DogTreats;
  } else if (cat.includes('train') || cat.includes('training') || cat === 'dog-training' || cat === 'dog-training-essentials') {
    Page = DogTrainingEssentials;
  } else if (cat.includes('food') || cat === 'dogfood' || cat === 'dog-food') {
    Page = () => <DogFood initialActive={sub ? decodeURIComponent(sub) : 'All Dog Food'} />;
  } else if (cat.includes('clothing') || cat === 'dog-clothing') {
    Page = () => <DogClothing initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('health') || cat === 'dog-health' || cat === 'dog-health-hygiene') {
    Page = () => <DogHealthHygiene initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('bedding') || cat === 'dog-bedding') {
    Page = () => <DogBedding initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('bowl') || cat.includes('diner') || cat === 'dog-bowls-diners') {
    Page = () => <DogBowlsDiners initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('travel') || cat === 'dog-travel-supplies') {
    Page = () => <DogTravelSupplies initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  } else if (cat.includes('toy') || cat === 'dog-toys') {
    Page = () => <DogToys initialActive={sub ? decodeURIComponent(sub) : undefined} />;
  }

  return (
    <>
      {/* If search query present, show SearchResults instead of category pages */}
      {new URLSearchParams(location.search).get('search') ? (
        <SearchResults query={new URLSearchParams(location.search).get('search')} />
      ) : (
        <Page />
      )}
      <MobileBottomNav />
    </>
  );
}

// Inline search results component used when ?search=... is present on /shop-for-dogs
export function SearchResults({ query }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await (await import('../../services/productApi')).default.getCustomerProducts({ type: 'Dog', limit: 500 });
        const list = res || [];

        const qLower = String(query || '').toLowerCase().trim();
        const buildSearchText = (p) => {
          const parts = [];
          if (p?.name) parts.push(p.name);
          if (p?.title) parts.push(p.title);
          if (p?.description) parts.push(p.description);
          // brand can be object or string
          if (p?.brand) parts.push(typeof p.brand === 'string' ? p.brand : (p.brand?.name || ''));
          // category/subcategory can be object or string
          if (p?.category) parts.push(typeof p.category === 'string' ? p.category : (p.category?.name || ''));
          if (p?.subcategory) parts.push(typeof p.subcategory === 'string' ? p.subcategory : (p.subcategory?.name || ''));
          if (p?.sub) parts.push(p.sub);
          if (p?.subCategory) parts.push(p.subCategory);
          // metadata fields often used for subcategory labels or filters
          if (p?.metadata && typeof p.metadata === 'object') {
            if (p.metadata.subcategoryLabel) parts.push(String(p.metadata.subcategoryLabel));
            if (p.metadata.manufacturer) parts.push(String(p.metadata.manufacturer));
            if (p.metadata.filters && typeof p.metadata.filters === 'object') {
              try {
                Object.values(p.metadata.filters).forEach(v => {
                  if (Array.isArray(v)) parts.push(v.join(' ')); else if (v) parts.push(String(v));
                });
              } catch (e) { /* ignore */ }
            }
          }
          if (Array.isArray(p?.tags)) parts.push(p.tags.join(' '));
          if (p?.sku) parts.push(String(p.sku));
          return parts.join(' ').toLowerCase();
        };

        const matches = list.filter(p => buildSearchText(p).includes(qLower));

        if (!mounted) return;

        const normalize = (p) => ({
          id: p?.id,
          name: p?.name || p?.title || 'Unnamed',
          image: p?.imageUrl || p?.image || p?.thumbnailUrl || p?.image_path || '/assets/images/no_image.png',
          price: (p?.price ?? p?.salePrice ?? 0),
          brand: p?.brand || '',
          category: p?.category || '',
        });

        setProducts(matches.map(normalize));
      } catch (err) {
        console.error('SearchResults: failed to load products', err);
        setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [query]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading results...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold mb-4">Search results for "{query}"</h2>
      {products.length === 0 ? (
        <div className="text-muted-foreground">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => (
            <article key={p.id} className="bg-white rounded-lg border border-border overflow-hidden shadow-sm p-3 text-center">
              <div className="h-36 flex items-center justify-center bg-[#f6f8fb] rounded mb-2">
                <img src={p.image} alt={p.name} className="max-h-32 object-contain mx-auto" />
              </div>
              <div className="text-sm font-medium line-clamp-2">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.brand ? `${p.brand} · ` : ''}{p.category}</div>
              <div className="text-base font-bold mt-2">₹{(p.price || 0).toFixed(2)}</div>
              <div className="mt-3 flex justify-center">
                <button onClick={() => navigate(`/product-details/${p.id}`)} className="bg-[#ff7a00] text-white px-3 py-1.5 rounded-full text-sm">View</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
