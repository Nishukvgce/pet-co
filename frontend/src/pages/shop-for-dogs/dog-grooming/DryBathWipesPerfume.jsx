import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../../components/ui/Header';
import { useCart } from '../../../contexts/CartContext';

const sampleProducts = [
  { id: 'w1', name: 'Dry Bath Wipes (Pack of 10)', image: '/assets/images/grooming/wipes.webp', badges: ['New'], variants: ['10 pcs'], price: 249 },
  { id: 'w2', name: 'Fragrance Spray', image: '/assets/images/grooming/wipes.webp', badges: [], variants: ['150 ml'], price: 199 }
];

import ProductCard from '../../../components/ui/ProductCard';

export default function DryBathWipesPerfume() {
  const { getCartItemCount, cartItems } = useCart();
  return (
    <>
      <Helmet>
        <title>Dry Bath, Wipes & Perfume — Grooming | PET&CO</title>
      </Helmet>
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Dry Bath, Wipes & Perfume</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {sampleProducts.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </>
  );
}
