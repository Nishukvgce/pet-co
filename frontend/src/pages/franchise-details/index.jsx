import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, Users, TrendingUp, Award, Heart, ArrowRight } from 'lucide-react';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';

const FranchisePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    investment: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your interest! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', city: '', investment: '', message: '' });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="font-sans text-gray-700 bg-[#fffbf2]"> {/* Warm off-white background */}
      <Header />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/images/dog/dg1.webp" 
            alt="Happy dog in store" 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'; }}
          />
          {/* Gradient Overlay: Dark to warm tint for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#fffbf2]"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto mt-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide mb-6">
              PARTNER WITH LEADERS
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-heading">
              Build Your Legacy with <span className="text-primary">PET&CO</span>
            </h1>
            <p className="text-lg md:text-2xl mb-10 font-light text-gray-100 max-w-3xl mx-auto">
              Join India's premiere pet care ecosystem. Delivering happiness to pets and prosperity to partners.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('inquiry-form').scrollIntoView({ behavior: 'smooth' })}
                className="bg-primary hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-warm-lg flex items-center justify-center gap-2"
              >
                Apply for Franchise <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-semibold py-4 px-8 rounded-full transition-all">
                Download Brochure
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Floating Cards */}
      <section className="relative -mt-20 z-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Outlets Nationwide", value: "15+", icon: MapPin },
              { label: "Happy Customers", value: "50,000+", icon: Heart },
              { label: "Years Impact", value: "6+", icon: Award }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-warm-lg border border-orange-50 flex items-center gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-primary">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-secondary font-heading">{stat.value}</h3>
                  <p className="text-gray-500 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why PET&CO Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h4 className="text-primary font-bold tracking-widest uppercase mb-3 text-sm">Review Changes</h4>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary font-heading">Why Choose PET&CO?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              We define excellence in pet retail. Our franchise model is built on transparency, support, and a proven track record of profitability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Award className="w-6 h-6" />, title: "Proven Expertise", desc: "Leverage 6+ years of industry leadership and operational excellence." },
              { icon: <TrendingUp className="w-6 h-6" />, title: "High ROI Model", desc: "Designed for profitability with optimized operational costs and margins." },
              { icon: <Users className="w-6 h-6" />, title: "360° Support", desc: "From site selection to staff training, we guide you every step of the way." },
              { icon: <CheckCircle className="w-6 h-6" />, title: "Premium Brand", desc: "Be part of a brand synonymous with trust, quality, and luxury." },
              { icon: <MapPin className="w-6 h-6" />, title: "Strategic Locations", desc: "Data-driven insights to help you choose the perfect store location." },
              { icon: <Heart className="w-6 h-6" />, title: "Community First", desc: "We build more than stores; we build inclusive pet-loving communities." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-10 rounded-3xl hover:shadow-warm-xl transition-all duration-300 border border-transparent hover:border-orange-100"
              >
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-secondary">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section - Split Layout */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50/50 rounded-l-[100px] z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                  <img 
                    src="/assets/images/dog/dh1.webp" 
                    alt="Pet store interior" 
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="font-heading text-2xl font-bold">"More than a store. It's a sanctuary."</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">The Vision</h4>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-secondary font-heading leading-tight">
                Crafting Experiences, <br/> Not Just Transactions.
              </h2>
              <div className="space-y-6 text-lg text-gray-600 font-light">
                <p>
                  PET&CO was born from a simple observation: pet parents didn't just want products; they wanted a partner. We saw an industry filled with goods but void of connection.
                </p>
                <p>
                  We reimagined the pet retail experience as something warm, inviting, and knowledgeable. A place where every tail wag is celebrated, and every concern is addressed with expertise.
                </p>
                <p>
                  Today, we invite you to carry this torch forward. To be the face of compassion and quality in your city.
                </p>
              </div>
              <div className="mt-10">
                <a href="#inquiry-form" className="text-primary font-bold hover:text-orange-700 inline-flex items-center gap-2 group">
                  Start Your Story <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Styled */}
      <section className="py-24 bg-[#fffbf2]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-secondary font-heading">Partner Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { 
                name: "Rahul Mehta", 
                loc: "Mumbai", 
                quote: "Partnering with PET&CO was the best decision. Their operational support strategy helped me break even in record time.",
                img: "https://ui-avatars.com/api/?name=Rahul+Mehta&background=ff7a00&color=fff"
              },
              { 
                name: "Sneha K.", 
                loc: "Bangalore", 
                quote: "The brand's premium reputation immediately attracted the right clientele. The team is incredibly supportive and always accessible.",
                img: "https://ui-avatars.com/api/?name=Sneha+K&background=8b4513&color=fff" 
              }
            ].map((testi, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-orange-50/50 hover:shadow-warm-md transition-shadow relative">
                <div className="text-6xl text-orange-200 absolute top-6 right-8 font-serif">"</div>
                <div className="flex text-warning mb-6">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-lg">★</span>)}
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed relative z-10">{testi.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-orange-100">
                     <img src={testi.img} alt={testi.name} />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary text-lg">{testi.name}</h4>
                    <p className="text-sm text-gray-500">{testi.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form - Premium Card */}
      <section id="inquiry-form" className="py-24 bg-white relative">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-secondary"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-5 min-h-[600px]">
              {/* Form Sidebar */}
              <div className="md:col-span-2 bg-secondary text-white p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold font-heading mb-4">Let's Build Together</h3>
                  <p className="text-orange-100/80 mb-8">Fill the details and our franchise expansion team will reach out to you within 24 hours.</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-white/60">Join a network of</div>
                        <div className="font-bold">25+ Partners</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm text-white/60">Average ROI</div>
                        <div className="font-bold">18-24 Months</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Abstract shapes */}
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute top-10 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
              </div>

              {/* Form Fields */}
              <div className="md:col-span-3 p-10 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name</label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all outline-none"
                        placeholder="Your Name"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all outline-none"
                        placeholder="email@address.com"
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all outline-none"
                        placeholder="+91 90000 00000"
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">City</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all outline-none"
                        placeholder="Current Location"
                        required 
                      />
                    </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Budget</label>
                     <select 
                        name="investment"
                        value={formData.investment}
                        onChange={handleChange} 
                        className="w-full px-4 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all outline-none"
                     >
                       <option value="">Select Investment Range</option>
                       <option value="15-25L">₹15 Lakhs - ₹25 Lakhs</option>
                       <option value="25-50L">₹25 Lakhs - ₹50 Lakhs</option>
                       <option value="50L+">Above ₹50 Lakhs</option>
                     </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-all outline-none h-24 resize-none"
                      placeholder="Share your background or ask a question..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 text-lg"
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FranchisePage;
