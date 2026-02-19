import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';

const amounts = [50, 100, 150, 250, 500, 1000];

const PetCoFoundation = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        {/* Banner Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 lg:py-24">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm mb-6 shadow-sm">
                  Empowering Lives, One Paw at a Time
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  PET&CO <span className="text-orange-600">Foundation</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Every day for the last 6 years, we have partnered with NGOs and community caregivers to bridge the gap between urban animals and people. Creating a kinder city for our street animals.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <a href="#donate" className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-orange-200 transform hover:-translate-y-0.5">
                    Donate Now
                  </a>
                  <a href="#initiatives" className="px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-semibold rounded-full transition-all shadow-sm hover:shadow-md">
                    Our Initiatives
                  </a>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
                 {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
                
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="space-y-4 translate-y-8">
                    <img 
                      src="/assets/images/dog/dg1.webp" 
                      alt="Happy Dog" 
                      className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                    />
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-orange-50">
                       <p className="font-bold text-gray-800 text-lg">15k+</p>
                       <p className="text-sm text-gray-500">Meals Served</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-orange-600 p-4 rounded-2xl shadow-lg text-white">
                        <p className="font-bold text-lg">6+ Years</p>
                        <p className="text-sm text-orange-100">Of Impact</p>
                    </div>
                    <img 
                      src="/assets/images/cat/ct1.webp" 
                      alt="Curious Cat" 
                      className="w-full h-48 md:h-64 object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
                    />
                  </div>
                   {/* Central Logo Badge */}
                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-xl border-4 border-orange-50 z-20">
                      <img src="/assets/images/logo.png" alt="PET&CO" className="w-16 h-16 object-contain" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-orange-600 font-bold tracking-wider uppercase text-sm">About Us</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-gray-900">Building a Cohesive Community</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        The PET&CO Foundation is built on the belief that coexistence is key. We work tirelessly to support street animals through practical, on-the-ground initiatives. From daily feeding drives to emergency medical aid, our mission is to ensure that no animal in our city goes hungry or suffers in silence. We are not just an organization; we are a movement of compassion.
                    </p>
                </div>
            </div>
        </section>

        {/* Initiatives Section */}
        <section id="initiatives" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">Our Key Initiatives</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Initiative 1 */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                        <div className="h-48 overflow-hidden">
                            <img src="/assets/images/dog/dg2.webp" alt="Feeding Drive" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-8">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 text-orange-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Food & Nutrition</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Providing nutritious meals and supplements to malnourished animals across the city to boost their immunity and health.
                            </p>
                             <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Daily feeding drives</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Special diet for puppies</li>
                            </ul>
                        </div>
                    </div>

                    {/* Initiative 2 */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                         <div className="h-48 overflow-hidden">
                            <img src="/assets/images/cat/ct2.webp" alt="Medical Care" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-8">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Medical Aid</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Ensuring timely medical intervention, vaccinations, and deworming to prevent diseases and suffering.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Emergency response</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>Sterilization drives</li>
                            </ul>
                        </div>
                    </div>

                    {/* Initiative 3 */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                         <div className="h-48 overflow-hidden">
                             {/* Placeholder image from collage if needed, or re-using */}
                             <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                                 <svg className="w-16 h-16 text-orange-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                             </div>
                        </div>
                        <div className="p-8">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Community Support</h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                Installing water bowls, providing reflective collars, and educating the community to foster harmony.
                            </p>
                             <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Water bowl project</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Awareness campaigns</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Donation Section */}
        <section id="donate" className="py-24 bg-orange-900 text-white relative overflow-hidden">
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
             
             <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-orange-300 font-bold tracking-wider uppercase text-sm mb-2 block">Take Action</span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Help Us Feed a Dog in Need</h2>
                        <p className="text-orange-100 text-lg mb-8 leading-relaxed max-w-xl">
                            Your contribution directly provides food, medical care, and shelter to street animals. Every rupee counts and brings us closer to a hunger-free world for our furry friends.
                        </p>
                        <ul className="space-y-4 mb-8">
                             <li className="flex items-center text-orange-50">
                                <svg className="w-5 h-5 mr-3 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                100% Secure Payments
                             </li>
                             <li className="flex items-center text-orange-50">
                                <svg className="w-5 h-5 mr-3 text-orange-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                                Tax-Deductible Receipts
                             </li>
                        </ul>
                    </div>
                    
                    <div className="bg-white text-gray-900 rounded-3xl p-8 shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6 text-center">Choose an amount to donate</h3>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {amounts.map(amount => (
                                <button key={amount} className="py-3 border-2 border-orange-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all font-semibold text-lg text-gray-700">
                                    ₹{amount}
                                </button>
                            ))}
                        </div>
                        <button className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition-colors text-lg mb-4">
                            Donate Securely
                        </button>
                        <p className="text-xs text-center text-gray-500">
                            By donating, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
             </div>
        </section>

        {/* Become a Member Section */}
        <section className="py-20 bg-orange-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Video/Image Side */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video group cursor-pointer">
                            <img src="/assets/images/dog/dg1.webp" alt="Community Interaction" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-orange-600 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm mb-6">
                            Join Our Community
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Become a member of <br/><span className="text-orange-600">PET&CO Tribe</span>
                        </h2>
                        <div className="mb-8">
                            <img src="/assets/images/branding/logo.png" alt="Tribe Logo" className="h-12 object-contain mb-4" />
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            Become a part of the PET&CO Tribe, a community of dedicated animal enthusiasts! As a cherished member, you not only become part of a movement that values compassion and advocacy for animals but also gain the opportunity to contribute to the greater good. Together, let's make a positive impact and create a world where animals thrive.
                        </p>
                        
                        <div className="bg-orange-100 rounded-2xl p-8 border border-orange-200">
                            <h3 className="text-2xl font-bold text-orange-800 mb-2">Join PET&CO Tribe today</h3>
                            <p className="text-orange-700 mb-6">One-time Registration Fee. Regular price <strong>Rs. 99.00</strong></p>
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <button className="w-full sm:w-auto px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5">
                                    Join Now
                                </button>
                                <span className="text-sm text-orange-600 font-medium">✨ Get exclusive perks & updates</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Founder Section */}
        <section className="py-20 bg-amber-50">
             <div className="container mx-auto px-4">
                 <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border-l-8 border-orange-500 max-w-5xl mx-auto">
                     <div className="flex flex-col md:flex-row gap-8 items-start">
                         <div className="md:w-1/3 text-center md:text-left">
                             <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full mx-auto md:mx-0 overflow-hidden mb-4 border-4 border-orange-100 shadow-md">
                                 {/* Placeholder for Founder Image if available, else generic user icon */}
                                 <img src="https://ui-avatars.com/api/?name=Ajay+Karthik+Dass&background=random" alt="Ajay Karthik Dass" className="w-full h-full object-cover" />
                             </div>
                             <h3 className="text-2xl font-bold text-gray-900">Ajay Karthik Dass</h3>
                             <p className="text-orange-600 font-medium mb-4">Founder, PET&CO</p>
                         </div>
                         <div className="md:w-2/3 relative">
                             <svg className="absolute top-0 left-0 w-16 h-16 text-orange-100 transform -translate-x-4 -translate-y-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9C8.44772 16 8 15.5523 8 15V9C8 8.44772 8.44772 8 9 8H10V6H9C7.34315 6 6 7.34315 6 9V15C6 16.6569 7.34315 18 9 18H10V21H14.017ZM21.017 21L21.017 18C21.017 16.8954 20.1216 16 19.017 16H16C15.4477 16 15 15.5523 15 15V9C15 8.44772 15.4477 8 16 8H17V6H16C14.3431 6 13 7.34315 13 9V15C13 16.6569 14.3431 18 16 18H17V21H21.017Z"/></svg>
                             <div className="relative z-10">
                                 <h4 className="text-xl font-bold mb-4 text-gray-800">"Compassion is Action"</h4>
                                 <p className="text-gray-600 leading-relaxed italic text-lg mb-6">
                                     "PET&CO Foundation began with a simple belief: small, consistent acts can transform urban animal welfare. Over the years we’ve focused on practical programs that prevent suffering — regular feeding, rapid-response medical aid, adoption support and community education. Thank you for supporting a kinder city."
                                 </p>
                                 <img src="/assets/images/branding/logo.png" alt="Signature" className="h-10 opacity-50 grayscale hover:grayscale-0 transition-all" />
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </section>
        
        {/* Stories of Change Section */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                 <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Stories of Change</h2>
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Story Card 1 */}
                    <article className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
                      <div className="h-48 overflow-hidden">
                        <img src="/assets/images/dog/dg3.webp" alt="Rescue Story" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">Rescue</div>
                        <h4 className="font-bold text-xl mb-3 text-gray-900 leading-tight">A Second Chance for Bruno</h4>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">
                          Found injured and abandoned, Bruno's recovery journey is a testament to resilience. After weeks of critical care, he is now healthy, happy, and ready for his forever home.
                        </p>
                        <a href="#" className="inline-flex items-center text-orange-600 font-semibold text-sm hover:text-orange-700">
                          Read Bruno's Story <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                      </div>
                    </article>

                    {/* Story Card 2 */}
                    <article className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
                      <div className="h-48 overflow-hidden">
                        <img src="/assets/images/dog/dg2.webp" onError={(e) => e.target.src='/assets/images/dog/dg4.webp'} alt="Feeding Drive" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">Community</div>
                        <h4 className="font-bold text-xl mb-3 text-gray-900 leading-tight">Feeding 500 Souls Daily</h4>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">
                          Thanks to our dedicated volunteers, over 500 stray animals receive a nutritious meal every single day. This simple act of kindness keeps them healthy and builds trust within the community.
                        </p>
                        <a href="#" className="inline-flex items-center text-orange-600 font-semibold text-sm hover:text-orange-700">
                          Volunteer With Us <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                      </div>
                    </article>

                    {/* Story Card 3 */}
                    <article className="flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
                      <div className="h-48 overflow-hidden">
                        <img src="/assets/images/cat/ct1.webp" onError={(e) => e.target.src='/assets/images/dog/dg5.webp'} alt="Adoption Success" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">Adoption</div>
                        <h4 className="font-bold text-xl mb-3 text-gray-900 leading-tight">Finding Forever Homes</h4>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">
                          Adoption changes lives. Our latest drive saw 15 kittens and 8 puppies find loving families. Every adoption not only saves a life but also opens up a spot for another animal in need.
                        </p>
                        <a href="#" className="inline-flex items-center text-orange-600 font-semibold text-sm hover:text-orange-700">
                          Adopt a Pet <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                      </div>
                    </article>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default PetCoFoundation;
