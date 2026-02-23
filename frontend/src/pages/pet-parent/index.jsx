import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import PetParentBrands from './PetParentBrands';

const tiles = [
  { key: 'tshirts', label: 'Tshirts', badge: 'Up to 70% off', img: '/assets/images/pet-parents/t-shirts.webp', fallback: 'https://images.unsplash.com/photo-1520975918208-6f6d1b8f1b2b?q=80&w=800&auto=format&fit=crop' },
  { key: 'keychains', label: 'Key chains', badge: 'Up to 38% off', img: '/assets/images/pet-parents/keychain.avif', fallback: 'https://images.unsplash.com/photo-1602524817372-1f6a3b1b2b2b?q=80&w=800&auto=format&fit=crop' },
  { key: 'floor', label: 'Floor cleaners', badge: 'Up to 30% off', img: '/assets/images/pet-parents/room-cleaner.avif', fallback: 'https://images.unsplash.com/photo-1581574201044-5f1a4a3a3a3a?q=80&w=800&auto=format&fit=crop' },
  { key: 'lint', label: 'Lint rollers', badge: 'Up to 70% off', img: '/assets/images/pet-parents/lint-rollers.avif', fallback: 'https://images.unsplash.com/photo-1585386959984-a4155229a13a?q=80&w=800&auto=format&fit=crop' },
  { key: 'accessories', label: 'Accessories', badge: 'Up to 20% off', img: '/assets/images/pet-parents/accessories.webp', fallback: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop' },
  { key: 'mugs', label: 'Mugs', badge: 'Up to 35% off', img: '/assets/images/pet-parents/mugs.webp', fallback: 'https://images.unsplash.com/photo-1517686469429-8bdb8f3f3f3f?q=80&w=800&auto=format&fit=crop' },
  { key: 'plants', label: 'Pet-safe plants', badge: 'Up to 56% off', img: '/assets/images/pet-parents/plant.webp', fallback: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop' },
  { key: 'carry', label: 'Everyday carry', badge: 'Up to 70% off', img: '/assets/images/pet-parents/everyday-carry.webp', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop' },
  { key: 'brooch', label: 'Brooch', badge: 'Up to 10% off', img: '/assets/images/pet-parents/brooch.webp', fallback: 'https://images.unsplash.com/photo-1526178611208-8e2a9f7b1b1b?q=80&w=800&auto=format&fit=crop' },
  { key: 'wallart', label: 'Wall art', badge: 'Up to 70% off', img: '/assets/images/pet-parents/wall-art.webp', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop' },
  { key: 'fridgemagnets', label: 'Fridge magnets', badge: 'Up to 23% off', img: '/assets/images/pet-parents/fridge-magnet.webp', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop' },
  { key: 'air', label: 'Air freshners', badge: 'Starting ₹99', img: '/assets/images/pet-parents/air-freshners.avif', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop' },
  { key: 'charms', label: 'Charms', badge: 'Up to 35% off', img: '/assets/images/pet-parents/charms.avif', fallback: 'https://images.unsplash.com/photo-1517686469429-8bdb8f3f3f3f?q=80&w=800&auto=format&fit=crop' },
  { key: 'stationary', label: 'Stationary', badge: 'Up to 56% off', img: '/assets/images/pet-parents/stationary.avif', fallback: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop' },
 
  { key: 'coasters', label: 'Coasters', badge: 'Up to 70% off', img: '/assets/images/pet-parents/coasters.avif', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop' },
  { key: 'furniture', label: 'Furniture', badge: 'Up to 23% off', img: '/assets/images/pet-parents/furniture.avif', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop' },
];

const PetParentPage = () => {
  return (
    <>
      <Header />
      <main className="pb-12">
      <section className="relative">
        <div className="w-full">
          <img
            src="/assets/images/pet-parents/pet-parent-banner.png"
            alt="Pet Parent banner"
            className="w-full h-64 sm:h-96 lg:h-[480px] object-cover block"
            onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/pet-parents/pet-parent-banner.png'; }}
          />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl bg-white/60 dark:bg-black/30 backdrop-blur-sm rounded-lg p-6 lg:p-10">
              <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-3 text-foreground">PET PARENT HUB</h1>
              <p className="text-lg text-muted-foreground mb-0">Curated products and guides for pet parents — shop, learn, and care for your companion.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-8">
        <div className="-mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {tiles.map(tile => (
              <article key={tile.key} className="text-center">
                <Link to="/shop-for-dogs" className="block">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-black" style={{ borderRadius: 18 }}>
                    <div className="w-full aspect-square bg-white-100 flex items-center justify-center p-3">
                      <img
                        src={tile.img}
                        onError={(e) => { e.target.onerror = null; e.target.src = tile.fallback; }}
                        alt={tile.label}
                        className="w-full h-full object-contain"
                        style={{ padding: 8 }}
                      />
                    </div>

                    <div style={{ position: 'absolute', left: 10, bottom: 10 }}>
                      <div style={{ background: '#e9c92c', color: '#04121a', padding: '6px 10px', fontWeight: 700, border: '3px solid #04121a', borderTopRightRadius: 20, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                        <span style={{ fontSize: 14 }}>{tile.badge}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-base font-medium text-foreground">{tile.label}</div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PetParentBrands />
      </main>
      <Footer />
    </>
  );
};

export default PetParentPage;
