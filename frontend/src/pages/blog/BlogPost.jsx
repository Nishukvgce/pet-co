import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import { useCart } from '../../contexts/CartContext';

const BlogPost = () => {
  const { slug } = useParams();
  const { getCartItemCount, cartItems } = useCart();

  // Mock content based on slug
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="hidden lg:block">
        <Header cartItemCount={getCartItemCount()} cartItems={cartItems} />
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12">
        <Link to="/learn-with-petco" className="text-orange-600 hover:underline mb-4 inline-block">&larr; Back to Guides</Link>
        
        <article className="prose lg:prose-xl mx-auto">
          <h1 className="text-3xl lg:text-5xl font-heading font-bold mb-6">{title}</h1>
          <div className="w-full h-64 lg:h-96 bg-gray-200 rounded-xl mb-8 overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1544568100-847a948585b9?w=1200&h=800&fit=crop" 
               alt={title}
               className="w-full h-full object-cover"
             />
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            This is a placeholder for the full article content. In a real application, 
            this data would be fetched from a CMS or API based on the slug: <strong>{slug}</strong>.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;
