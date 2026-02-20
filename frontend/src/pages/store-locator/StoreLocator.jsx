import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Clock, Star, Navigation, ShoppingBag,
  Scissors, Search, ChevronRight, CheckCircle, Info
} from 'lucide-react';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';

const branches = [
  {
    id: 1,
    name: 'PET&CO Store & Spa – Mahadevapura, Bengaluru',
    area: 'Mahadevapura',
    city: 'Bengaluru',
    address: '8, 1st Main road, 12th Cross Rd, Pai Layout, Mahadevapura, Bengaluru, Karnataka – 560016',
    phone: '+91 90080 03096⁩',
    rating: 4.8,
    reviews: 214,
    hours: 'Mon–Sun: 10:00 AM – 9:00 PM',
    todayStatus: 'Open Now',
    services: ['Pet Store', 'Grooming Spa', 'Veterinary Consult'],
    image: '/assets/images/dog/dg1.webp',
    mapUrl: 'https://share.google/gcfmRIGxAH3MUUxsj',
    storeType: 'Flagship',
    badgeColor: 'bg-orange-500',
  },
  {
    id: 2,
    name: 'PET&CO Store & Spa – Koramangala, Bengaluru',
    area: 'Koramangala',
    city: 'Bengaluru',
    address: '45, 80 Feet Road, 4th Block, Koramangala, Bengaluru – 560034',
    phone: '+91 80 6789 0123',
    rating: 4.7,
    reviews: 178,
    hours: 'Mon–Sun: 10:00 AM – 9:00 PM',
    todayStatus: 'Open Now',
    services: ['Pet Store', 'Grooming Spa', 'Pet Boarding','Veterinary Consult'],
    image: '/assets/images/dog/dh1.webp',
    mapUrl: 'https://www.google.com/maps/search/pet+store+koramangala+bengaluru',
    storeType: 'Premium',
    badgeColor: 'bg-purple-600',
  },
];

const serviceIcons = {
  'Pet Store': <ShoppingBag className="w-4 h-4" />,
  'Grooming Spa': <Scissors className="w-4 h-4" />,
  'Veterinary Consult': <CheckCircle className="w-4 h-4" />,
  'Pet Boarding': <CheckCircle className="w-4 h-4" />,
};

const StoreCard = ({ branch, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.15 }}
    className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full"
  >
    {/* Store Image */}
    <div className="relative h-52 overflow-hidden flex-shrink-0">
      <img
        src={branch.image}
        alt={branch.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80';
        }}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Type badge */}
      <span className={`absolute top-4 left-4 ${branch.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>
        {branch.storeType}
      </span>

      {/* Open status */}
      <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse inline-block" />
        {branch.todayStatus}
      </span>

      {/* Area name */}
      <div className="absolute bottom-4 left-4 text-white">
        <p className="text-xs font-medium text-white/70 uppercase tracking-widest">{branch.city}</p>
        <p className="text-xl font-bold leading-tight">{branch.area}</p>
      </div>
    </div>

    {/* Store Info */}
    <div className="p-6 flex-1 flex flex-col">
      <div className="space-y-4">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(branch.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-sm font-bold text-gray-800">{branch.rating}</span>
          <span className="text-xs text-gray-400">({branch.reviews} reviews)</span>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-600 leading-relaxed">{branch.address}</p>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-orange-500 shrink-0" />
          <a href={`tel:${branch.phone}`} className="text-sm text-gray-600 hover:text-orange-600 transition-colors font-medium">
            {branch.phone}
          </a>
        </div>

        {/* Hours */}
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-orange-500 shrink-0" />
          <p className="text-sm text-gray-600">{branch.hours}</p>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2 pt-1">
          {branch.services.map((svc) => (
            <span
              key={svc}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-orange-50 text-orange-700 px-3 py-1 rounded-full border border-orange-100"
            >
              {serviceIcons[svc]}
              {svc}
            </span>
          ))}
        </div>
      </div>

      {/* Divider + actions should stick to bottom for uniform layout */}
      <div className="mt-6 border-t border-gray-100 pt-4 flex gap-3">
        <a
          href={branch.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-secondary text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-secondary/90 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Directions
        </a>
        <a
          href={`tel:${branch.phone}`}
          className="flex-1 flex items-center justify-center gap-2 border border-orange-200 text-orange-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-orange-50 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call Store
        </a>
      </div>
    </div>
  </motion.div>
);

const StoreLocator = () => {
  const [search, setSearch] = useState('');

  const filtered = branches.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.area.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fffbf2] font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary pt-28 pb-20">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-white/10 backdrop-blur border border-white/20 text-white/90 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
              🗺️ Store & Spa Locator
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight font-heading">
              Step Into a <span className="text-primary">PET&CO</span> Store Near You!
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Wagging tails, warm hearts, and everything your pet needs awaits. We can't wait to welcome you and your furry family!
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {['Expert Grooming', 'Personalised Advice', 'Great Deals & Discounts', 'All Pet Essentials'].map((f) => (
                <span key={f} className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-sm px-4 py-1.5 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" /> {f}
                </span>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by area or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white text-gray-800 placeholder-gray-400 text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bengaluru Notice Banner */}
      <section className="bg-orange-50 border-b border-orange-100 py-4">
        <div className="container mx-auto px-4 flex items-center justify-center gap-3 text-center flex-wrap">
          <Info className="w-5 h-5 text-orange-500 shrink-0" />
          <p className="text-sm text-orange-700 font-medium">
            Currently, PET&CO Store & Spa is available exclusively in <strong>Bengaluru</strong>. We're expanding soon — stay tuned!
          </p>
        </div>
      </section>

      {/* Stores Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary font-heading mb-3">
              Our Bengaluru Branches
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Visit one of our 2 premium stores in Bengaluru — packed with everything your pet loves.
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {filtered.map((branch, i) => (
                <StoreCard key={branch.id} branch={branch} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No stores match your search.</p>
              <p className="text-sm mt-1">Try searching "Indiranagar" or "Koramangala".</p>
            </div>
          )}
        </div>
      </section>

      {/* Coming to Your City Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Expanding Soon
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary font-heading mb-4">
              Coming to Your City!
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-8">
              PET&CO is growing fast. Interested in bringing a store to your city? Explore our franchise opportunities.
            </p>
            <a
              href="/franchise-details"
              className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              Explore Franchise <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StoreLocator;
