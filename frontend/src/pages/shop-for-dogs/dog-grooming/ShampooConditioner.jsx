import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../../components/ui/Header';
import { useCart } from '../../../contexts/CartContext';

const sampleProducts = [
  { id: 's1', name: 'Gentle Puppy Shampoo', image: '/assets/images/grooming/shampoo-product.webp', badges: ['Get Extra 5% OFF'], variants: ['200 ml','500 ml'], price: 399 }
];

import ProductCard from '../../../components/ui/ProductCard';

export default function ShampooConditioner() {
  const { getCartItemCount, cartItems } = useCart();
  return (
    <>
      <Helmet>
        <title>Shampoo & Conditioner — Grooming | PET&CO</title>
      </Helmet>
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Shampoo & Conditioner</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {sampleProducts.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </>
  );
}
