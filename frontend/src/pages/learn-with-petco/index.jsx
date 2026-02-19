import React from 'react';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import LearnWithPetCo from '../homepage/components/LearnWithPetCo';
import { useCart } from '../../contexts/CartContext';
import { Helmet } from 'react-helmet';

const LearnWithPetCoPage = () => {
  const { getCartItemCount, cartItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Learn With PET&Co - Expert Pet Care Guides</title>
      </Helmet>
      
      {/* Reusing Dashboard/Home Header logic if possible, or just standard Header */}
      <div className="hidden lg:block">
        <Header 
          cartItemCount={getCartItemCount()} 
          cartItems={cartItems}
        />
      </div>
      
      {/* Mobile Header placeholder or reuse MobileBottomNav if needed, 
          but for now assuming simple page structure */}

      <main className="flex-grow pt-20 lg:pt-0">
         {/* We can reuse the component we built, checking if it needs adjustment. 
             The component has its own padding/container. */}
         <LearnWithPetCo />
      </main>

      <Footer />
    </div>
  );
};

export default LearnWithPetCoPage;
