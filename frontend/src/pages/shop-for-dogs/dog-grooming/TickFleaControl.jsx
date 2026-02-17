import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../../components/ui/Header';
import { useCart } from '../../../contexts/CartContext';

const sampleProducts = [
  { id: 't1', name: 'Tick & Flea Treatment', image: '/assets/images/grooming/brush-product.webp', badges: [], variants: ['Single Dose'], price: 599 }
];

import ProductCard from '../../../components/ui/ProductCard';

export default function TickFleaControl() {
  const { getCartItemCount, cartItems } = useCart();
  return (
    <>
      <Helmet>
        <title>Tick & Flea Control — Grooming | PET&CO</title>
      </Helmet>
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={() => {}} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Tick & Flea Control</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {sampleProducts.map(p => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </>
  );
}
