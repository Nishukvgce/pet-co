import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Star } from 'lucide-react';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import productApi from '../../services/productApi';
import { useCart } from '../../contexts/CartContext';
import apiClient from '../../services/api';

const toSlug = (s='') => s.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
const normalizeBrand = (s='') => s.trim();

const BRAND_SYNONYMS = {
  'me-o': 'Me-O',
  'meo': 'Me-O',
  'royal-canin': 'Royal Canin',
  'whiskas': 'Whiskas',
  'pedigree': 'Pedigree',
  'nutriwag': 'NutriWag',
  'matisse': 'Matisse',
  'kennell-kitchen': 'Kennel Kitchen',
  'kennel-kitchen': 'Kennel Kitchen',
  'pro-plan': 'Pro Plan'
};

const resolveCanonicalBrand = (slugOrName='') => {
  const slug = toSlug(slugOrName);
  return BRAND_SYNONYMS[slug] || slugOrName;
};

import ProductCard from '../../components/ui/ProductCard';
import { resolveImageUrl } from '../../lib/imageUtils';

const BrandCollection = () => {
  const { brandSlug } = useParams();
  const [search] = useSearchParams();
  const select = search.get('brand') || brandSlug || '';
  const canonical = resolveCanonicalBrand(select);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // Fetch in-stock products; filter by brand on client
        const data = await productApi.getCustomerProducts({});
        const norm = (v) => toSlug(normalizeBrand(v || ''));
        const wanted = toSlug(canonical);
        const filtered = (Array.isArray(data) ? data : []).filter(p => {
          const b = p?.brand || p?.metadata?.brand || (p?.filters?.brands?.[0]) || '';
          return norm(b) === wanted;
        }).map(p => ({
          ...p,
          image: resolveImageUrl(p)
        }));
        if (mounted) setItems(filtered);
      } catch (e) {
        setError(e.message || 'Failed to load products');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [canonical]);

  return (
    <>
      <Helmet>
        <title>{canonical ? `${canonical} — Shop by Brand | PET&CO` : 'Shop by Brand | PET&CO'}</title>
        <meta name="description" content={`Discover ${canonical} products at PET&CO`} />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{canonical}</h1>
            <Link to="/" className="text-primary text-sm hover:underline">Back to Home</Link>
          </div>
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {loading ? (
            <div className="text-muted-foreground">Loading products…</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {items.map(p => (
                <ProductCard key={p.id} p={p} />
              ))}
              {items.length === 0 && (
                <div className="col-span-full text-muted-foreground">No products found for this brand.</div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default BrandCollection;
