import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';

const tiles = [
  { key: 'tshirts', label: 'Tshirts', badge: 'Up to 70% off', img: '/assets/images/pet-parent/tiles/tshirts.jpg', fallback: 'https://images.unsplash.com/photo-1520975918208-6f6d1b8f1b2b?q=80&w=800&auto=format&fit=crop' },
  { key: 'keychains', label: 'Key chains', badge: 'Up to 38% off', img: '/assets/images/pet-parent/tiles/keychains.jpg', fallback: 'https://images.unsplash.com/photo-1602524817372-1f6a3b1b2b2b?q=80&w=800&auto=format&fit=crop' },
  { key: 'floor', label: 'Floor cleaners', badge: 'Up to 30% off', img: '/assets/images/pet-parent/tiles/floor.jpg', fallback: 'https://images.unsplash.com/photo-1581574201044-5f1a4a3a3a3a?q=80&w=800&auto=format&fit=crop' },
  { key: 'lint', label: 'Lint rollers', badge: 'Up to 70% off', img: '/assets/images/pet-parent/tiles/lint.jpg', fallback: 'https://images.unsplash.com/photo-1585386959984-a4155229a13a?q=80&w=800&auto=format&fit=crop' },
  { key: 'accessories', label: 'Accessories', badge: 'Up to 20% off', img: '/assets/images/pet-parent/tiles/accessories.jpg', fallback: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop' },
  { key: 'mugs', label: 'Mugs', badge: 'Up to 35% off', img: '/assets/images/pet-parent/tiles/mugs.jpg', fallback: 'https://images.unsplash.com/photo-1517686469429-8bdb8f3f3f3f?q=80&w=800&auto=format&fit=crop' },
  { key: 'plants', label: 'Pet-safe plants', badge: 'Up to 56% off', img: '/assets/images/pet-parent/tiles/plants.jpg', fallback: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop' },
  { key: 'carry', label: 'Everyday carry', badge: 'Up to 70% off', img: '/assets/images/pet-parent/tiles/carry.jpg', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop' },
  { key: 'brooch', label: 'Brooch', badge: 'Up to 10% off', img: '/assets/images/pet-parent/tiles/brooch.jpg', fallback: 'https://images.unsplash.com/photo-1526178611208-8e2a9f7b1b1b?q=80&w=800&auto=format&fit=crop' },
  { key: 'wallart', label: 'Wall art', badge: 'Up to 70% off', img: '/assets/images/pet-parent/tiles/wallart.jpg', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop' },
  { key: 'fridgemagnets', label: 'Fridge magnets', badge: 'Up to 23% off', img: '/assets/images/pet-parent/tiles/fridgemagnets.jpg', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop' },
  { key: 'air', label: 'Air freshners', badge: 'Starting ₹99', img: '/assets/images/pet-parent/tiles/air.jpg', fallback: 'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=800&auto=format&fit=crop' },
];

const PetParentPage = () => {
  return (
    <>
      <Header />
      <main className="pb-12">
      <section className="bg-gradient-to-r from-yellow-50 to-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-2 text-foreground">PET PARENT HUB</h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">Curated products and guides for pet parents — shop, learn, and care for your companion.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-8">
        <div className="-mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {tiles.map(tile => (
              <article key={tile.key} className="text-center">
                <Link to="/shop-for-dogs" className="block">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-black" style={{ borderRadius: 18 }}>
                    <div className="w-full aspect-square bg-pink-100 flex items-center justify-center p-3">
                      <img
                        src={tile.img}
                        onError={(e) => { e.target.onerror = null; e.target.src = tile.fallback; }}
                        alt={tile.label}
                        className="w-full h-full object-contain"
                        style={{ padding: 8 }}
                      />
                    </div>

                    <div style={{ position: 'absolute', left: 10, bottom: 10 }}>
                      <div style={{ background: '#baf75a', color: '#04121a', padding: '6px 10px', fontWeight: 700, border: '3px solid #04121a', borderTopRightRadius: 20, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
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
      </main>
      <Footer />
    </>
  );
};

export default PetParentPage;
