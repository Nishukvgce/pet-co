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
      <section className="relative w-full min-h-[450px] lg:min-h-[500px] overflow-hidden bg-[#faefd4] flex flex-col md:flex-row items-center justify-center border-b border-[#e2d5bc]">
        {/* Grid Background */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(168, 126, 80, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(168, 126, 80, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px',
            backgroundPosition: 'center center'
          }}
        />

        {/* Brown Right Section Background (Slanted on Desktop) */}
        <div className="hidden md:block absolute top-0 bottom-0 right-0 w-[55%] lg:w-[58%] bg-[#a57b46] z-0 skew-x-0 md:-skew-x-[10deg] origin-bottom transform translate-x-12" />
        
        {/* Straight Brown block for Mobile (appears below the intro box) */}
        <div className="absolute top-[40%] sm:top-[45%] bottom-0 left-0 right-0 bg-[#a57b46] z-0 block md:hidden" />

        <div className="container max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between py-10 md:py-16 gap-6 lg:gap-10 h-full">
          
          {/* LEFT SIDE: Info Box & Images */}
          <div className="w-full md:w-[45%] lg:w-[42%] flex flex-col justify-center relative mt-4 md:mt-0">
            
            {/* T-Shirt Polaroid (Desktop) */}
            <div className="hidden lg:block absolute -top-26 lg:-top-24 left-4 lg:left-8 w-24 lg:w-32 bg-[#f8f8f8] p-2 pb-6 shadow-xl transform -rotate-[8deg] border border-[#e2d5bc]/50 z-0 hover:scale-105 transition-transform duration-300">
               <img src="/assets/images/pet-parents/t-shirts.webp" alt="T-Shirt" className="w-full h-auto object-cover border border-[#e2d5bc]/30" />
            </div>

            {/* Main Info Box */}
            <div className="bg-white/95 backdrop-blur-md px-6 py-6 md:px-8 md:py-10 shadow-lg relative z-10 border-l-[6px] border-[#a57b46] rounded-sm w-full max-w-md mx-auto md:mx-0 lg:ml-12">
              <h1 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-extrabold text-[#2d2d2d] mb-2 sm:mb-3 uppercase tracking-tight leading-tight" style={{ fontFamily: 'system-ui, sans-serif' }}>
                PET PARENT HUB
              </h1>
              <p className="text-sm md:text-base text-gray-600 font-medium leading-relaxed">
                Curated products and guides for pet parents — shop, learn, and care for your companion.
              </p>
            </div>

            {/* Plant Polaroid (Desktop) */}
            <div className="hidden lg:block absolute -bottom-16 lg:-bottom-24 right-4 lg:-right-4 w-24 lg:w-28 bg-[#f8f8f8] p-2 pb-6 shadow-xl transform rotate-[6deg] border border-[#e2d5bc]/50 z-20 hover:scale-105 transition-transform duration-300">
               <img src="/assets/images/pet-parents/plant.webp" alt="Plant" className="w-full h-auto object-cover border border-[#e2d5bc]/30" />
            </div>
          </div>

          {/* RIGHT SIDE: Text Content */}
          <div className="w-full md:w-[50%] lg:w-[55%] flex flex-col justify-center items-center text-center relative z-20 mt-6 md:mt-0 py-8 md:py-0">
            
            {/* Decorative Stars */}
            <svg className="absolute -top-4 md:-top-8 lg:-top-12 left-4 md:left-[15%] w-6 h-6 lg:w-8 lg:h-8 text-[#FAF2E5] hidden sm:block opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>

            {/* Mug Polaroid (Desktop) */}
            {/* <div className="hidden lg:block absolute -top-10 -right-48 lg:-right-2 w-28 lg:w-21 bg-[#f8f8f8] p-2 pb-6 shadow-xl transform rotate-[12deg] border border-[#e2d5bc]/50 z-30 hover:scale-105 transition-transform duration-300">
               <img src="/assets/images/pet-parents/mugs.webp" alt="Mug" className="w-full h-auto object-cover border border-[#e2d5bc]/30" />
            </div> */}

            <div className="w-full flex flex-col items-center px-2 sm:px-4 space-y-2">
              <h2 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] xl:text-[4.5rem] font-black uppercase text-transparent tracking-widest leading-none drop-shadow-sm w-full" 
                  style={{ WebkitTextStroke: '1.5px #fff' }}>
                FLAUNT YOUR
              </h2>
              <h2 className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.2rem] lg:text-[4.2rem] xl:text-[5rem] font-black uppercase text-[#fff] tracking-tighter leading-none w-full" 
                  style={{ textShadow: '2px 3px 0 #856133, 3px 4px 0 #856133' }}>
                PET-PARENT ERA
              </h2>
              <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 inline-block px-4 sm:px-6 py-2 sm:py-3 bg-[#4a361c]/30 md:bg-transparent rounded-full md:rounded-none backdrop-blur-sm md:backdrop-blur-none border border-white/20 md:border-none">
                <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm font-bold text-[#fff] tracking-[0.1em] md:tracking-[0.15em] lg:tracking-[0.2em] uppercase m-0 leading-tight md:leading-none shadow-sm md:shadow-none text-center">
                  PET-INSPIRED PRODUCTS SELECTED JUST FOR YOU!
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      <section className="container mx-auto px-4 mt-8">
        <div className="-mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {tiles.map(tile => (
              <article key={tile.key} className="text-center">
                <Link to={`/pet-parent/products?sub=${encodeURIComponent(tile.label)}`} className="block">
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
