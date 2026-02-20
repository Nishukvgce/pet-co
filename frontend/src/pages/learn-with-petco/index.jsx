import React from 'react';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import LearnWithPetCo from '../homepage/components/LearnWithPetCo';
import { useCart } from '../../contexts/CartContext';
import { Helmet } from 'react-helmet';

const LearnWithPetCoPage = () => {
  const { getCartItemCount, cartItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Learn With PET&amp;Co - Expert Pet Care Guides</title>
      </Helmet>
      
      <Header 
        cartItemCount={getCartItemCount()} 
        cartItems={cartItems}
      />

      <main className="flex-grow pb-20 md:pb-0">
        <LearnWithPetCo />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default LearnWithPetCoPage;
