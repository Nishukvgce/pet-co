import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import Icon from '../../components/AppIcon';
import PetModal from './components/PetModal';

const AdoptPetPage = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sample pet data - Replace with actual data from your API
  const pets = [
    {
      id: 1,
      name: 'Coffee',
      breed: 'Indie',
      age: '4M',
      gender: 'Female',
      image: '/assets/images/dog/dg1.webp',
      location: 'Bangalore, Karnataka',
      shelter: 'Happy Paws by Monica',
      shelterAddress: 'Survey number 93/2, Happy Paws by Monica, near SMR Concrete, near Stadium Football Club, BEL layout, Yelahanka, Bengaluru, Karnataka 560119',
      shelterEmail: 'pooja.sy1@gmail.com',
      spocName: 'Pooja Yadav',
      shelterContact: '+919673124029',
      vaccinated: true,
      sterilized: false,
      story: 'Meet Coffee, a healthy 4-month-old female puppy looking for her forever home! 💕 She\'s fully vaccinated & dewormed, trained, cute, playful & super cuddly. Currently being fostered in a loving home (paid shelter). She\'s full of love and would make the perfect companion. Please share within your groups/networks, or call me if you\'re interested! 🥰💕',
      traits: ['Fully vaccinated & dewormed', 'Trained, cute, playful & super cuddly', 'Currently being fostered in a loving home (paid shelter)']
    },
    {
      id: 2,
      name: 'Charlie',
      breed: 'Golden Retriever Mix',
      age: '2Y',
      gender: 'Male',
      image: '/assets/images/dog/dg2.webp',
      location: 'Mumbai, Maharashtra',
      shelter: 'Paws & Hearts Rescue',
      shelterAddress: 'Lane 5, Bandra West, Mumbai, Maharashtra 400050',
      shelterEmail: 'rescue@pawshearts.in',
      spocName: 'Rajesh Kumar',
      shelterContact: '+919876543210',
      vaccinated: true,
      sterilized: true,
      story: 'Charlie is a gentle 2-year-old Golden Retriever mix who loves children and other dogs. He was rescued from the streets and has been in our care for 6 months. Charlie is house-trained, knows basic commands, and is looking for a family who can give him lots of love and exercise.',
      traits: ['Great with children', 'House trained', 'Knows basic commands', 'Loves other dogs']
    },
    {
      id: 3,
      name: 'Bella',
      breed: 'Labrador Mix',
      age: '1Y',
      gender: 'Female',
      image: '/assets/images/dog/dg3.webp',
      location: 'Delhi, Delhi',
      shelter: 'Delhi Animal Shelter',
      shelterAddress: 'Sector 15, Rohini, Delhi 110089',
      shelterEmail: 'info@delhishelter.org',
      spocName: 'Priya Singh',
      shelterContact: '+919123456789',
      vaccinated: true,
      sterilized: false,
      story: 'Bella is a playful 1-year-old Labrador mix who loves to fetch and go on walks. She\'s very social and gets along well with other pets. Bella is looking for an active family who can provide her with plenty of exercise and mental stimulation.',
      traits: ['Very playful and energetic', 'Loves to fetch', 'Social with other pets', 'Needs active family']
    },
    {
      id: 4,
      name: 'Rocky',
      breed: 'German Shepherd Mix',
      age: '3Y',
      gender: 'Male',
      image: '/assets/images/dog/dg4.webp',
      location: 'Pune, Maharashtra',
      shelter: 'Pune Pet Care',
      shelterAddress: 'Koregaon Park, Pune, Maharashtra 411001',
      shelterEmail: 'contact@punepetcare.com',
      spocName: 'Amit Sharma',
      shelterContact: '+919988776655',
      vaccinated: true,
      sterilized: true,
      story: 'Rocky is a loyal and protective 3-year-old German Shepherd mix. He\'s well-trained and would make an excellent guard dog for a family. Rocky needs an experienced owner who understands his breed and can provide consistent training and socialization.',
      traits: ['Loyal and protective', 'Well-trained', 'Good guard dog', 'Needs experienced owner']
    }
  ];

  const handlePetClick = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPet(null);
  };

  return (
    <>
      <Helmet>
        <title>Adopt a Pet - Find Your Forever Friend | PET&CO</title>
        <meta
          name="description"
          content="Find your perfect companion! Browse adoptable dogs and cats from verified shelters. Give a rescue pet a loving forever home today."
        />
        <meta name="keywords" content="adopt pet, dog adoption, cat adoption, rescue pets, pet shelter, forever home" />
        <meta property="og:title" content="Adopt a Pet - Find Your Forever Friend | PET&CO" />
        <meta property="og:description" content="Browse adoptable pets from verified shelters and give a rescue pet their forever home." />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-background pb-20 md:pb-0">
        {/* Hero Banner */}
        <div className="relative bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 py-10 md:py-20 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              <div className="lg:col-span-7">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-foreground mb-4 leading-tight">
                  Find Your Forever Friend
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-3xl">
                  Every pet deserves a loving home. Browse adoptable pets from verified shelters and
                  connect with them directly. Adopt, don't shop — change a life today.
                </p>

                <div className="flex flex-wrap gap-6 sm:gap-10 mt-4">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-foreground">100+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Happy Adoptions</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-foreground">Verified</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Shelters Only</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-foreground">Health</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Guaranteed</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 hidden sm:block">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {pets.slice(0, 4).map((p) => (
                    <div key={p.id} className="rounded-2xl overflow-hidden shadow-lg border border-white/30 bg-white/60">
                      <img src={p.image} alt={p.name} className="w-full h-28 sm:h-36 object-cover" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-sm text-muted-foreground">Click a pet below to view full details and contact the shelter.</div>
              </div>
            </div>
          </div>

          <div className="absolute right-4 top-4 opacity-10 transform translate-x-10 -translate-y-6 pointer-events-none">
            <img src="/assets/images/branding/paws-pattern.png" alt="" className="w-64" />
          </div>
        </div>

        {/* Pets Grid Section */}
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-3">
              Pets Looking for Homes
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Click on any pet to learn more about their story and how you can give them a loving home.
            </p>
          </div>

          {/* Filter Section */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <button className="px-4 sm:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base">
              All Pets
            </button>
            <button className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">
              Dogs
            </button>
            <button className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">
              Cats
            </button>
            <button className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">
              Puppies
            </button>
            <button className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base">
              Kittens
            </button>
          </div>

          {/* Pets Grid — 2 columns on mobile, 3 on md, 4 on xl */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {pets.map((pet) => (
              <div 
                key={pet.id}
                className="bg-card rounded-xl border border-border overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handlePetClick(pet)}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <h3 className="text-base sm:text-xl font-heading font-bold text-foreground">
                      {pet.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      pet.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {pet.gender}
                    </span>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                      <Icon name="Calendar" size={14} />
                      <span className="truncate">{pet.age} • {pet.breed}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                      <Icon name="MapPin" size={14} />
                      <span className="truncate">{pet.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                      <Icon name="Shield" size={14} className={pet.vaccinated ? 'text-green-500' : 'text-gray-400'} />
                      <span className={pet.vaccinated ? 'text-green-600' : 'text-gray-500'}>
                        {pet.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}
                      </span>
                    </div>
                  </div>
                  
                  <button className="w-full bg-primary text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 text-sm">
                    <Icon name="Heart" size={15} />
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8 sm:mt-12">
            <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Load More Pets
            </button>
          </div>
        </div>

        {/* How to Adopt Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-foreground mb-3">
                How to Adopt
              </h2>
              <p className="text-base md:text-lg text-muted-foreground">
                Simple steps to bring your new family member home
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-white text-xl sm:text-2xl font-bold">1</span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-2">
                  Browse &amp; Connect
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Find a pet you connect with and contact the shelter directly through our platform.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-white text-xl sm:text-2xl font-bold">2</span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-2">
                  Meet &amp; Greet
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Visit the shelter to meet your potential new family member and ensure it's a good fit.
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-white text-xl sm:text-2xl font-bold">3</span>
                </div>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-2">
                  Complete Adoption
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Complete the adoption paperwork and welcome your new family member home!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pet Detail Modal */}
      {showModal && selectedPet && (
        <PetModal pet={selectedPet} onClose={closeModal} />
      )}

      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default AdoptPetPage;