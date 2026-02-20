import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BookingForm from './components/BookingForm';
import BoardingPlanCard from './components/BoardingPlanCard';
import AppImage from '../../components/AppImage';
import { useAuth } from '../../contexts/AuthContext';

const WHY_CHOOSE = [
  { icon: 'ShieldCheck', title: 'Verified & Trusted Hosts', desc: 'Every host is background-checked and trained to give your pet excellent, personalised care.' },
  { icon: 'Heart', title: 'Cage-Free Environment', desc: 'Your pet roams freely in a cosy, home-like space—no crates, no stress.' },
  { icon: 'Camera', title: 'Daily Photo Updates', desc: 'We send photos and activity updates so you can relax knowing your pet is thriving.' },
  { icon: 'Clock', title: 'Flexible Booking', desc: 'Hourly, daycare, or overnight stays—tailored to suit your exact schedule.' },
  { icon: 'Stethoscope', title: 'Health & Safety First', desc: 'Strict hygiene protocols and trained hosts ready to handle any health needs.' },
  { icon: 'Star', title: 'Premium Experience', desc: 'From tailored routines to enriched playtime, we go beyond basic boarding.' },
];

const HOME_BENEFITS = [
  { title: 'Cage-Free Comfort', desc: 'Open spaces and cosy areas let your pet relax and play freely, reducing stress.' },
  { title: 'Personalised Attention', desc: 'Hosts tailor care to your pet\'s personality—whether playful pup or calm kitty.' },
  { title: 'Trusted Hosts', desc: 'Every host undergoes thorough background checks and training for exceptional care.' },
  { title: 'Health and Safety First', desc: 'Strict hygiene standards and trained hosts handle your pet\'s every health need.' },
  { title: 'Tailored Routines', desc: 'Share your pet\'s daily schedule and our hosts will maintain it for consistency.' },
  { title: 'Daily Updates', desc: 'Receive photos and messages about your pet\'s activities for complete peace of mind.' },
  { title: 'Flexible Stays', desc: 'Short-term daycare or extended boarding, we cater to your schedule affordably.' },
];

const PetBoardingPage = () => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const defaultService = {
    name: 'Pet Boarding',
    serviceType: 'pet-boarding',
    price: 799,
    duration: '24 hours',
    petType: 'dog',
  };

  const handleBook = (plan) => {
    if (!user) {
      navigate('/user-login', {
        state: { from: '/pet-boarding', message: 'Please sign in to book pet boarding services' },
      });
      return;
    }
    setSelectedPlan(plan || defaultService);
    setShowBookingForm(true);
  };

  const handlePlanSelect = (p) => {
    if (!user) {
      navigate('/user-login', {
        state: { from: '/pet-boarding', message: 'Please sign in to book pet boarding services' },
      });
      return;
    }
    setSelectedPlan({
      name: `${p.petType === 'cat' ? 'Cat' : 'Dog'} Boarding - ${p.name}`,
      serviceType: `${p.petType}-boarding`,
      price: p.price,
      duration: p.duration,
      petType: p.petType,
    });
    setShowBookingForm(true);
  };

  return (
    <>
      <Helmet>
        <title>Pet Boarding | PET&CO</title>
        <meta name="description" content="Safe and comfortable overnight pet boarding with supervised care, meals, and playtime." />
      </Helmet>
      <Header />

      <main className="min-h-screen bg-background">

        {/* ── HERO BANNER ── */}
        <section className="relative w-full h-[480px] sm:h-[560px] overflow-hidden">
          <AppImage
            src="/assets/images/boarding/pet borading.jpeg"
            alt="Pet Boarding at PET&CO"
            className="absolute inset-0 w-full h-full object-cover object-center scale-105"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
          {/* Orange accent line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />

          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
            <div className="max-w-xl">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5 backdrop-blur-sm">
                <Icon name="Home" size={13} />
                PET&CO Services
              </span>
              <h1 className="text-4xl sm:text-5xl font-heading font-bold text-white leading-tight mb-4">
                Premium<br />
                <span className="text-primary">Pet Boarding</span>
              </h1>
              <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed">
                Safe, clean, and cage-free stays with personalised attention, meals, playtime, and daily photo updates.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" iconName="Calendar" onClick={() => handleBook(null)}>
                  Book a Stay
                </Button>
                <a
                  href="#plans"
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white text-sm font-semibold px-5 py-3 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  View Plans
                  <Icon name="ArrowDown" size={15} />
                </a>
              </div>
            </div>
          </div>

          {/* Floating stats */}
          <div className="absolute bottom-8 right-6 hidden lg:flex gap-4">
            {[
              { label: 'Happy Pets', value: '5000+' },
              { label: 'Trusted Hosts', value: '200+' },
              { label: 'Cities', value: '15+' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 text-center">
                <p className="text-primary font-bold text-xl font-heading">{s.value}</p>
                <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICE COST ── */}
        <section id="plans" className="bg-background py-16">
          <div className="container mx-auto px-4">
            {/* Section header */}
            <div className="text-center mb-12">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                Service <span className="text-primary">Cost</span>
              </h2>
              <div className="mx-auto mt-3 h-1 w-16 bg-primary rounded-full" />
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                Explore transparent boarding packages — priced per pet, no hidden fees.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BoardingPlanCard
                title="Dog Boarding Plans"
                imageSrc="/assets/images/boarding/dogborading.jpg"
                petType="dog"
                plans={[
                  { name: 'Hourly', subtitle: 'Upto 4 hours', price: 599, petType: 'dog', duration: 'Up to 4 hours' },
                  { name: 'Daycare', subtitle: 'Upto 10 hours', price: 799, petType: 'dog', duration: 'Up to 10 hours' },
                  { name: 'Overnight', subtitle: 'Upto 24 hours', price: 899, petType: 'dog', duration: 'Up to 24 hours' },
                ]}
                onSelectPlan={handlePlanSelect}
              />
              <BoardingPlanCard
                title="Cat Boarding Plans"
                imageSrc="/assets/images/boarding/catborading.webp"
                petType="cat"
                plans={[
                  { name: 'Hourly', subtitle: 'Upto 4 hours', price: 499, petType: 'cat', duration: 'Up to 4 hours' },
                  { name: 'Daycare', subtitle: 'Upto 10 hours', price: 599, petType: 'cat', duration: 'Up to 10 hours' },
                  { name: 'Overnight', subtitle: 'Upto 24 hours', price: 649, petType: 'cat', duration: 'Up to 24 hours' },
                ]}
                onSelectPlan={handlePlanSelect}
              />
            </div>
          </div>
        </section>

        {/* ── HOME PET BOARDING BENEFITS ── */}
        <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50/60 to-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Image with decorative frame */}
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-2xl -z-0" />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-2xl -z-0" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-primary/20 shadow-warm-xl z-10">
                  <AppImage
                    src="/assets/images/boarding/homepethorading.jpg"
                    alt="Home pet boarding, cosy and cage-free"
                    className="w-full h-[420px] object-cover"
                  />
                  {/* Badge overlay */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
                    <Icon name="PawPrint" size={16} className="text-primary" />
                    <span className="text-sm font-semibold text-foreground">Cage-Free & Loving</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
                  Why It's Better
                </span>
                <div className="flex items-baseline gap-2 mb-2">
                  <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">Home</h2>
                  <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary">Pet Boarding</h2>
                </div>
                <div className="h-1 w-20 bg-primary rounded-full mb-6" />
                <ul className="space-y-4">
                  {HOME_BENEFITS.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center mt-0.5 group-hover:bg-primary/25 transition-colors">
                        <Icon name="Check" size={13} className="text-primary" />
                      </span>
                      <p className="text-sm text-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">{item.title}: </span>
                        <span className="text-muted-foreground">{item.desc}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPARISON: HOME BOARDING vs KENNELS ── */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                The Difference
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                Home Boarding <span className="text-primary">vs</span> Kennels
              </h2>
              <div className="mx-auto mt-3 h-1 w-16 bg-primary rounded-full" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
              {/* Home Boarding – Winner card */}
              <div className="relative bg-gradient-to-br from-primary/10 to-amber-50 rounded-3xl p-7 border-2 border-primary/30 shadow-warm-md">
                <div className="absolute -top-3 left-6">
                  <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    ✓ Recommended
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-5 mt-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Icon name="Home" size={18} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground">Home Pet Boarding</h3>
                </div>
                <ul className="space-y-3.5">
                  {[
                    'Pets stay in a warm, home-like setting, not a facility.',
                    'Treated as family with one-on-one, personalised care.',
                    'Perfect for all pets, offering a calm, social space.',
                    'Free to move – no cages, mimicking their home comfort.',
                    'Modern care reflects how we cherish pets as family.',
                  ].map((txt, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Icon name="CheckCircle" size={17} className="text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{txt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Centre image */}
              <div className="rounded-3xl overflow-hidden shadow-warm-lg border border-border">
                <AppImage
                  src="/assets/images/boarding/pet borading.jpeg"
                  alt="Home pet boarding comfort"
                  className="w-full h-full min-h-[300px] object-cover"
                />
              </div>

              {/* Kennels */}
              <div className="bg-gray-50 rounded-3xl p-7 border border-border">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                    <Icon name="Building" size={18} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-muted-foreground">Traditional Kennels</h3>
                </div>
                <ul className="space-y-3.5">
                  {[
                    'Pets are kept in cages, a traditional, outdated method.',
                    'Minimal attention, often causing stress in loud settings.',
                    'Best for pets used to crates or many animals around.',
                    'Limited personal care – attention split among many pets.',
                    'Less personal, lacking the family-like love pets need.',
                  ].map((txt, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Icon name="XCircle" size={17} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{txt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE PET&CO ── */}
        <section className="py-16 bg-gradient-to-br from-amber-50/80 via-orange-50/50 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                Our Promise
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                Why Choose <span className="text-primary">PET&CO</span>
              </h2>
              <div className="mx-auto mt-3 h-1 w-16 bg-primary rounded-full" />
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                We don't just board pets — we give them a second home filled with love, safety, and fun.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_CHOOSE.map((item, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl p-6 border border-border shadow-warm hover:shadow-warm-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon name={item.icon} size={22} className="text-primary" />
                  </div>
                  <h4 className="font-heading font-bold text-foreground mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="py-14 bg-gradient-to-r from-primary via-amber-500 to-secondary">
          <div className="container mx-auto px-4 text-center">
            <Icon name="PawPrint" size={36} className="text-white/80 mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">
              Your Pet Deserves the Best Stay
            </h2>
            <p className="text-white/85 text-base mb-8 max-w-lg mx-auto">
              Book a cage-free, personalised boarding experience today and travel with complete peace of mind.
            </p>
            <button
              onClick={() => handleBook(null)}
              className="inline-flex items-center gap-2 bg-white text-primary font-bold text-base px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <Icon name="Calendar" size={18} />
              Book a Stay Now
            </button>
          </div>
        </section>

        {/* ── GALLERY ── */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wider">
                Gallery
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                Our Boarding <span className="text-primary">Gallery</span>
              </h2>
              <div className="mx-auto mt-3 h-1 w-16 bg-primary rounded-full" />
              <p className="text-muted-foreground mt-4 max-w-md mx-auto text-sm">
                A glimpse into the loving, safe, and fun environment your pet enjoys while in our care.
              </p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {[
                { src: '/assets/images/boarding/boadingGallary/dogshelter.jpeg', alt: 'Dog shelter boarding environment' },
                { src: '/assets/images/boarding/boadingGallary/lovely-pets.jpeg', alt: 'Lovely pets enjoying their stay' },
                { src: '/assets/images/boarding/boadingGallary/petandcoentrence.jpeg', alt: 'PET&CO boarding entrance' },
                { src: '/assets/images/boarding/boadingGallary/petboarding.jpeg', alt: 'Pet boarding facility' },
                { src: '/assets/images/boarding/boadingGallary/petshelter.jpeg', alt: 'Pet shelter cosy area' },
                { src: '/assets/images/boarding/boadingGallary/petshelter1.jpeg', alt: 'Pet shelter comfortable space' },
                { src: '/assets/images/boarding/boadingGallary/playroom.jpeg', alt: 'Playroom for pets' },
                { src: '/assets/images/boarding/boadingGallary/playroom1.jpeg', alt: 'Fun playroom activities' },
                { src: '/assets/images/boarding/boadingGallary/playroom2.jpeg', alt: 'Spacious play area' },
                { src: '/assets/images/boarding/boadingGallary/playroom3.jpeg', alt: 'Pets playing together' },
                { src: '/assets/images/boarding/boadingGallary/swimming.jpeg', alt: 'Pet swimming session' },
              ].map((img, idx) => (
                <div
                  key={idx}
                  className="break-inside-avoid rounded-2xl overflow-hidden border border-border group cursor-pointer shadow-sm hover:shadow-warm-md transition-all duration-300"
                >
                  <AppImage
                    src={img.src}
                    alt={img.alt}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {showBookingForm && (
        <BookingForm service={selectedPlan || defaultService} onClose={() => setShowBookingForm(false)} />
      )}
      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default PetBoardingPage;
