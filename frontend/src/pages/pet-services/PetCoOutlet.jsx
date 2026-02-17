import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import Icon from '../../components/AppIcon';
import productApi from '../../services/productApi';
import apiClient from '../../services/api';
import { useCart } from '../../contexts/CartContext';

import ProductCard from '../../components/ui/ProductCard';
import { resolveImageUrl } from '../../lib/imageUtils';

const PetCoOutletPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('All');
  const sidebarItems = [
    {
      key: 'All',
      label: 'All Products',
      img: '/assets/images/essential/all%20dog%20food.webp'
    },
    {
      key: 'Food',
      label: 'Food',
      img: '/assets/images/essential/dry%20food.webp'
    },
    {
      key: 'Toys',
      label: 'Toys',
      img: '/assets/images/essential/toys.png'
    },
    {
      key: 'Training Material',
      label: 'Training Material',
      img: '/assets/images/essential/walk%20essentials.png'
    }
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        console.log('PetCoOutlet: Loading products with type-based filtering for section:', activeSection);
        
        // Map sidebar to subcategory and query backend with type first, then category/subcategory
        const subMap = {
          All: null,
          Food: 'food',
          Toys: 'toys',
          'Training Material': 'training'
        };
        const sub = subMap[activeSection] || null;
        const params = { type: 'Outlet', sub };
        
        console.log('PetCoOutlet: API parameters:', params);
        const res = await productApi.getCustomerProducts(params);
        const all = Array.isArray(res) ? res : [];
        
        console.log('PetCoOutlet: Received', all.length, 'outlet products from database');
        if (mounted) setProducts(all);
      } catch (e) {
        console.error('PetCoOutlet: Failed to load products:', e);
        setError(e.message || 'Failed to load outlet products');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [activeSection]);

  return (
    <>
      <Helmet>
        <title>PET&CO Outlet | PET&CO</title>
        <meta name="description" content="Explore curated products available at the PET&CO Outlet. In-store availability and exclusive offers." />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="bg-gradient-to-r from-sky-100 to-indigo-100 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Store" size={28} className="text-sky-700" />
                <h1 className="text-3xl font-heading font-bold text-gray-800">PET&CO Outlet</h1>
              </div>
              <p className="text-sm text-gray-700 max-w-3xl">
                Visit our physical outlet for premium pet supplies and exclusive in-store offers.
              </p>
            </div>
            <div className="p-6">
              {error && (
                <div className="text-red-600 mb-4">{error}</div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <aside className="lg:col-span-1">
                  <div className="bg-white border border-border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                      <Icon name="List" size={18} className="text-primary" />
                      <span className="font-semibold text-foreground">Outlet Categories</span>
                    </div>
                    <nav className="p-2 space-y-2">
                      {sidebarItems.map((item) => {
                        const isActive = activeSection === item.key;
                        return (
                          <button
                            key={item.key}
                            onClick={() => setActiveSection(item.key)}
                            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 border ${isActive ? 'bg-[#fff6e6] border-orange-300' : 'bg-white border-border hover:bg-muted'}`}
                          >
                            <div className={`w-10 h-10 rounded-full overflow-hidden ring-2 bg-muted ${isActive ? 'ring-orange-400' : 'ring-transparent'}`}>
                              <img src={item.img} alt={item.label} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                              {!item.img && (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Icon name="CircleAlert" size={18} className="text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-foreground'}`}>{item.label}</div>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </aside>

                {/* Products Grid */}
                <section className="lg:col-span-3">
                  {loading ? (
                    <div className="text-muted-foreground">Loading products...</div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {products
                        .filter((p) => {
                          if (activeSection === 'All') return true;
                          const name = String(p?.name || p?.title || '').toLowerCase();
                          const category = String(p?.category || p?.subcategory || p?.collection || '').toLowerCase();
                          const breadcrumbs = String(p?.breadcrumbs || '').toLowerCase();
                          const combine = `${name} ${category} ${breadcrumbs}`;
                          if (activeSection === 'Food') return /(food|meal|diet|treat|gravy|wet|dry)/.test(combine);
                          if (activeSection === 'Toys') return /(toy|ball|chew|rope|plush|squeaker|interactive)/.test(combine);
                          if (activeSection === 'Training Material') return /(training|leash|harness|collar|tag|agility)/.test(combine);
                          return true;
                        })
                        .map((p) => (
                          <ProductCard key={p.id || p.sku || p.name} p={{...p, image: resolveImageUrl(p)}} />
                        ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default PetCoOutletPage;
