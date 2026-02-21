import React, { useEffect, useState } from 'react';
import productApi from '../../../services/productApi';
import HomeProductCard from './HomeProductCard';

const BigDeals = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        // Fetch only dog food products for this section
        let res = [];
        try {
          res = await productApi.getCustomerProducts({ type: 'dog', category: 'Food', size: 12 });
        } catch (e) {
          // fallback: try a generic fetch
          try {
            res = await productApi.getCustomerProducts({ size: 12 });
          } catch (err) {
            res = [];
          }
        }
        if (mounted) setProducts(Array.isArray(res) ? res.slice(0, 12) : []);
      } catch (err) {
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="my-10 bg-[#fffaf6] py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">DOG FOOD</h2>
            <p className="text-gray-600 mt-1">Top discounts and limited-time offers — grab them before they're gone</p>
          </div>
          <div>
            <a href="/shop-for-dogs?category=Food" className="text-sm text-[#ff7a00] font-medium">View all →</a>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="py-8 bg-white rounded-lg shadow-sm text-center">Loading...</div>
          ) : products.length === 0 ? (
            <div className="py-8 bg-white rounded-lg shadow-sm text-center">No dog food products available</div>
          ) : (
            <div className="-mx-4 px-4 overflow-x-auto hide-scrollbar mt-4">
              <div className="flex items-stretch space-x-6 w-max py-2">
                {products.map(p => (
                  <div key={p.id} className="w-64 flex-shrink-0">
                    <HomeProductCard p={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BigDeals;
