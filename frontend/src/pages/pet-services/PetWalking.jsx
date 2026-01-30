import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AppImage from '../../components/AppImage';
import WalkingBookingForm from './components/WalkingBookingForm';

const PetWalkingPage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  
  const walkingOptions = [
    { name: 'Quick Walk - 30 mins', serviceType: 'pet-walking', price: 199, duration: '30 minutes', description: 'Perfect for busy schedules' },
    { name: 'Standard Walk - 45 mins', serviceType: 'pet-walking', price: 279, duration: '45 minutes', description: 'Balanced exercise & fun', popular: true },
    { name: 'Extended Walk - 60 mins', serviceType: 'pet-walking', price: 349, duration: '60 minutes', description: 'Maximum exercise & exploration' },
  ];
  
  const handleBook = (service) => { setSelectedService(service); setShowBookingForm(true); };
  const toggleReviewExpansion = (index) => {
    setExpandedReviews(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <>
      <Helmet>
        <title>Premium Pet Walking Services | PET&CO</title>
        <meta name="description" content="Professional pet walking with GPS tracking, certified walkers, and real-time updates. Book your pet's perfect walk today!" />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Professional background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-300/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            {/* Grid overlay for professional look */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Content */}
              <div className="space-y-8 md:space-y-12">
                <div className="space-y-6 md:space-y-8">
                  <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200/50 shadow-lg">
                    <Icon name="Award" size={20} className="text-blue-600" />
                    <span className="text-sm font-bold text-slate-700 tracking-wide">INDIA'S PREMIER PET WALKING SERVICE</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                    <span className="block text-slate-900">Premium Pet</span>
                    <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Walking Services
                    </span>
                    <span className="block text-slate-900">You Can Trust</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl font-medium">
                    Professional, GPS-tracked walks with certified pet care specialists. 
                    <span className="block mt-2">Real-time updates, flexible scheduling, and complete peace of mind for discerning pet parents.</span>
                  </p>
                </div>
                
                {/* Professional CTA Buttons */}
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 md:px-12 md:py-6 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 rounded-2xl border border-blue-500/20"
                    iconName="Footprints"
                    onClick={() => handleBook(walkingOptions[1])}
                  >
                    Book Premium Walk • ₹279
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-slate-300 hover:border-indigo-400 bg-white/90 backdrop-blur-sm px-8 py-4 md:px-12 md:py-6 text-lg font-bold hover:bg-indigo-50 transition-all duration-300 rounded-2xl group shadow-lg hover:shadow-xl"
                    iconName="Play"
                  >
                    <span className="group-hover:text-indigo-600 transition-colors text-slate-700">Watch Demo</span>
                  </Button>
                </div>
                
                {/* Professional trust indicators */}
                <div className="grid grid-cols-3 gap-8 pt-8">
                  <div className="text-center group">
                    <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                      200K+
                    </div>
                    <div className="text-sm font-semibold text-slate-500 mt-2 tracking-wide">SUCCESSFUL WALKS</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                      4.9★
                    </div>
                    <div className="text-sm font-semibold text-slate-500 mt-2 tracking-wide">CUSTOMER RATING</div>
                  </div>
                  <div className="text-center group">
                    <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                      24/7
                    </div>
                    <div className="text-sm font-semibold text-slate-500 mt-2 tracking-wide">PREMIUM SUPPORT</div>
                  </div>
                </div>
              </div>
              
              {/* Professional Hero Image */}
              <div className="relative mt-8 lg:mt-0">
                <div className="relative z-10 group">
                  {/* Main professional card */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 md:p-10 transform hover:scale-105 transition-all duration-500 hover:shadow-3xl">
                    <AppImage
                      src="/assets/images/petwalking/petwalking.jpg"
                      alt="Professional pet walking service"
                      className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl"
                    />
                    
                    {/* Professional live tracking notification */}
                    <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-2xl px-6 py-4 border border-emerald-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        <div>
                          <div className="font-bold text-sm">Live GPS Tracking</div>
                          <div className="text-xs opacity-90">Real-time location updates</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Professional certification badge */}
                    <div className="absolute -top-6 -right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-2xl px-6 py-3 border border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <Icon name="Shield" size={20} />
                        <span className="text-sm font-bold">Certified Professional</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Professional floating elements */}
                  <div className="absolute top-10 -left-10 bg-blue-500/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-blue-200/50 animate-float">
                    <Icon name="Heart" size={24} className="text-blue-600" />
                  </div>
                  
                  <div className="absolute bottom-10 -right-10 bg-emerald-500/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-emerald-200/50 animate-float delay-1000">
                    <Icon name="Star" size={24} className="text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Walking Options */}
        <section className="py-16 md:py-24 bg-white relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 md:mb-20">
              <div className="inline-flex items-center gap-3 bg-slate-100 px-6 py-3 rounded-full border border-slate-200 mb-6">
                <Icon name="Clock" size={20} className="text-slate-600" />
                <span className="text-sm font-bold text-slate-700 tracking-wide">CHOOSE YOUR PERFECT DURATION</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                Professional Walking
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Service Packages
                </span>
              </h2>
              
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
                Every pet is unique. Our certified professionals provide tailored walking experiences 
                <span className="block mt-2">that match your pet's specific energy level and exercise requirements.</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {walkingOptions.map((option, index) => (
                <div
                  key={option.name}
                  className={`relative group transform hover:-translate-y-2 transition-all duration-500 ${option.popular ? 'scale-105 z-10' : ''}`}
                >
                  {/* Professional popular badge */}
                  {option.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full text-sm font-bold shadow-xl z-20 border border-orange-400/50">
                      ⭐ MOST POPULAR
                    </div>
                  )}
                  
                  <div className={`bg-white rounded-3xl shadow-xl border-2 group-hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                    option.popular 
                      ? 'border-orange-200 bg-gradient-to-br from-orange-50/50 to-red-50/30' 
                      : 'border-slate-200 group-hover:border-blue-200'
                  }`}>
                    {/* Professional header section */}
                    <div className={`px-8 pt-8 pb-6 ${
                      option.popular 
                        ? 'bg-gradient-to-br from-orange-500/5 to-red-500/5'
                        : 'bg-gradient-to-br from-blue-500/5 to-indigo-500/5'
                    }`}>
                      {/* Duration badge */}
                      <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold mb-6 ${
                        option.popular 
                          ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200/50'
                          : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200/50'
                      }`}>
                        <Icon name="Timer" size={18} />
                        {option.duration}
                      </div>
                      
                      <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{option.name}</h3>
                      <p className="text-slate-600 mb-6 font-medium leading-relaxed">{option.description}</p>
                    </div>
                    
                    {/* Professional pricing section */}
                    <div className="px-8 pb-8">
                      <div className="flex items-end justify-between mb-8">
                        <div>
                          <span className="text-4xl font-black text-slate-900">₹{option.price}</span>
                          <span className="text-slate-500 ml-2 font-medium">per walk</span>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-xs font-bold border ${
                          option.popular 
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}>
                          GPS TRACKED
                        </div>
                      </div>
                      
                      <Button
                        className={`w-full py-4 text-lg font-bold rounded-2xl transition-all duration-300 border ${
                          option.popular
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl hover:shadow-2xl border-orange-500/20'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl border-blue-500/20'
                        }`}
                        onClick={() => handleBook(option)}
                        iconName="Calendar"
                      >
                        Book This Service
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Professional Benefits Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Professional Image */}
            <div className="relative order-1 lg:order-2 mb-6 lg:mb-0">
              <div className="absolute -top-6 -left-6 h-16 w-16 rounded-2xl bg-orange-200/30 blur-md" />
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/50">
                <AppImage 
                  src="/assets/images/petwalking/petwalking2.png" 
                  alt="Professional dog walker with happy dog"
                  className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                />
              </div>
            </div>

            {/* Benefits list */}
            <div className="order-2 lg:order-1">
              <div className="mb-8">
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-3 tracking-tight">
                  Why Choose Our
                  <span className="block bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Premium Services
                  </span>
                </h3>
                <p className="text-lg text-slate-600 font-medium">Professional pet care with unmatched attention to detail</p>
              </div>
              <ul className="mt-4 md:mt-6 space-y-3 md:space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-8 w-8 inline-flex items-center justify-center rounded-full bg-orange-100 text-orange-600"><Icon name="MapPin" size={18} /></span>
                  <p className="text-foreground">Live updates + walk history, all in-app.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-8 w-8 inline-flex items-center justify-center rounded-full bg-orange-100 text-orange-600"><Icon name="Dog" size={18} /></span>
                  <p className="text-foreground">Trained walkers who treat your dog like their own.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-8 w-8 inline-flex items-center justify-center rounded-full bg-orange-100 text-orange-600"><Icon name="Phone" size={18} /></span>
                  <p className="text-foreground">Cancel, reschedule, or book — your way.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-8 w-8 inline-flex items-center justify-center rounded-full bg-orange-100 text-orange-600"><Icon name="Clock" size={18} /></span>
                  <p className="text-foreground">Support from 10 am to 7 pm, every day.</p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-8 w-8 inline-flex items-center justify-center rounded-full bg-orange-100 text-orange-600"><Icon name="RefreshCcw" size={18} /></span>
                  <p className="text-foreground">If your walker can’t make it, we’ll find a replacement or give you an extra walk.</p>
                </li>
              </ul>
            </div>
            </div>
          </div>
        </section>

        {/* Reviews & Stats - Fixed Layout */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500 mb-3">OUR REVIEWS</h2>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* Google Review Card */}
              <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-lg p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  🐶
                </div>
                <h3 className="font-bold text-base text-gray-800 mb-2 leading-tight">
                  PET&CO – Dog walking and grooming services
                </h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-800">4.9</span>
                  <div className="flex text-yellow-500">
                    <Icon name="Star" size={16} className="fill-current" />
                    <Icon name="Star" size={16} className="fill-current" />
                    <Icon name="Star" size={16} className="fill-current" />
                    <Icon name="Star" size={16} className="fill-current" />
                    <Icon name="StarHalf" size={16} className="fill-current" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">powered by Google</p>
                <a href="https://www.google.com/search?q=PET%26CO+dog+walking+reviews" target="_blank" rel="noreferrer">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors duration-200 w-full">
                    Review us on Google
                  </button>
                </a>
              </div>

              {/* Individual Review Cards */}
              {[{
                name: 'Pattabiram', 
                initial: 'P', 
                time: 'a month ago', 
                text: 'Good service for my 3 pets. Nail clipping & teeth cleaning were great. Live updates were helpful.',
                fullText: 'Good service for my 3 pets. Nail clipping & teeth cleaning were great. Live updates were helpful. The walker was very professional and took excellent care of my pets. They provided detailed updates throughout the walk and even sent photos. The service exceeded my expectations and I would definitely recommend PET&CO to other pet parents. The pricing is reasonable for the quality of service provided.',
                bgColor: 'bg-blue-500'
              }, {
                name: 'Bhawna Joshi', 
                initial: 'B', 
                time: '5 months ago', 
                text: 'Exceptional service. Proactive, professional and safe. Highly recommend for busy pet parents.',
                fullText: 'Exceptional service. Proactive, professional and safe. Highly recommend for busy pet parents. The team at PET&CO goes above and beyond to ensure pet safety and happiness. They are very responsive to special requests and maintain excellent communication. The GPS tracking feature gives me peace of mind when I am at work. My dog comes back happy and tired after every walk.',
                bgColor: 'bg-blue-600'
              }, {
                name: 'Abhilasha M.', 
                initial: 'A', 
                time: '5 months ago', 
                text: 'Wonderful services. My dog feels extremely happy post walks. Walkers are professional and punctual.',
                fullText: 'Wonderful services. My dog feels extremely happy post walks. Walkers are professional and punctual. I have been using their services for over 6 months now and the consistency in quality is remarkable. The walkers treat my dog with love and care. The app interface is user-friendly and booking is very convenient. Great value for money and highly recommended for all pet parents.',
                bgColor: 'bg-blue-700'
              }].map((review, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full ${review.bgColor} flex items-center justify-center text-white font-bold text-lg`}>
                        {review.initial}
                      </div>
                      <div>
                        <p className="font-bold text-base text-gray-800">{review.name}</p>
                        <p className="text-sm text-gray-500">{review.time}</p>
                      </div>
                    </div>
                    <div className="flex text-yellow-500">
                      <Icon name="Star" size={14} className="fill-current" />
                      <Icon name="Star" size={14} className="fill-current" />
                      <Icon name="Star" size={14} className="fill-current" />
                      <Icon name="Star" size={14} className="fill-current" />
                      <Icon name="Star" size={14} className="fill-current" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {expandedReviews[index] ? review.fullText : review.text}
                  </p>
                  
                  <div className="flex justify-center">
                    <button 
                      onClick={() => toggleReviewExpansion(index)}
                      className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors duration-200"
                    >
                      <Icon name={expandedReviews[index] ? "ChevronUp" : "ChevronDown"} size={14} />
                      {expandedReviews[index] ? "Show Less" : "View Full Review"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { value: '2,00,000+', label: 'dog walks delivered' },
                { value: '5,000+', label: 'dogs walked' },
                { value: '1,300+', label: 'family of dog parents' },
                { value: '83,000 kms', label: 'tracked on the app' },
              ].map((s, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-black text-orange-500 mb-2">{s.value}</div>
                  <div className="text-sm md:text-base text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      {showBookingForm && (
        <WalkingBookingForm service={selectedService} options={walkingOptions} onClose={() => setShowBookingForm(false)} />
      )}
      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default PetWalkingPage;
