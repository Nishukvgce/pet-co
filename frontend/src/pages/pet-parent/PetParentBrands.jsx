import React from 'react';
import { Link } from 'react-router-dom';

const brands = [
  { key: 'hoomans', name: 'Hoomans', img: '/assets/images/branding/proplan.png', caption: "Approved by pets, loved by Hoomans" },
  { key: 'indies', name: 'Indies', img: '/assets/images/branding/pedigree.png', caption: "It takes a Pack to raise a pet" },
  { key: 'furry', name: 'Furry Tales', img: '/assets/images/branding/meo.png', caption: 'Happy Pets, Happier Homes!' },
  { key: 'boho', name: 'Boho', img: '/assets/images/branding/matisse.png', caption: 'Let your boho soul bloom' },
];

const PetParentBrands = () => {
  return (
    <section className="py-10 lg:py-14">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6 text-pink-500" style={{ textShadow: '2px 2px 0 #000' }}>INDIA'S FAVOURITE BRANDS</h2>
        <div className="-mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {brands.map((b) => (
              <article key={b.key} className="relative">
                <Link to="/brands" className="block">
                  <div className="rounded-2xl overflow-hidden" style={{ borderRadius: 18 }}>
                    <div style={{ border: '6px solid #172106', borderRadius: 18, padding: 6, boxShadow: '6px 8px 0 rgba(0,0,0,0.6)' }}>
                      <div className="relative rounded-lg overflow-hidden bg-white" style={{ borderRadius: 12 }}>
                        <img
                          src={b.img}
                          onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/branding/proplan.png'; }}
                          alt={b.name}
                          className="w-full h-60 object-cover block"
                        />
                        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: -14 }}>
                          <div className="bg-white px-3 py-1 rounded-lg shadow-sm border" style={{ fontWeight: 700 }}>{b.name}</div>
                        </div>
                        <div className="p-4 bg-[#baf75a] mt-2 rounded-b-lg flex items-center justify-between" style={{ borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                          <div className="text-left text-sm font-medium text-[#04121a]">{b.caption}</div>
                          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#04121a"><path d="M10 17l5-5-5-5v10z" /></svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetParentBrands;
