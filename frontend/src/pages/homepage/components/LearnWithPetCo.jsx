import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon'; // Assuming this exists based on other files

const articles = [
  {
    id: 1,
    category: 'Dog Care',
    title: '5 Tips for a Happy, Healthy Dog',
    excerpt: 'Discover simple ways to keep your furry friend active and joyful every day.',
    image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=400&fit=crop',
    readTime: '5 min read',
    slug: 'happy-healthy-dog-tips'
  },
  {
    id: 2,
    category: 'Nutrition',
    title: 'Understanding Pet Nutrition Labels',
    excerpt: 'Learn how to read and understand what goes into your pet\'s food for better health.',
    image: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?w=600&h=400&fit=crop',
    readTime: '7 min read',
    slug: 'pet-nutrition-labels-guide'
  },
  {
    id: 3,
    category: 'Training',
    title: 'Basic Commands Every Pet Should Know',
    excerpt: 'Master the essentials of training with these easy-to-follow steps for beginners.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop',
    readTime: '6 min read',
    slug: 'basic-pet-training-commands'
  }
];

const LearnWithPetCo = () => {
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        {/* Premium Banner Header */}
        <div className="relative rounded-3xl overflow-hidden bg-[#faf4f0] mb-12 lg:mb-20">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f2e6e1] skew-x-12 transform origin-bottom-right opacity-50"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            {/* Text Content */}
            <div className="p-8 lg:p-12 lg:pr-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <span className="w-12 h-1 bg-orange-500 rounded-full"></span>
                  <span className="text-sm font-bold tracking-widest text-orange-600 uppercase">
                    Trusted Expert Advice
                  </span>
                </div>
                
                <h2 className="text-4xl lg:text-6xl font-heading font-black text-gray-900 mb-6 leading-tight">
                  Learn with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">PET&CO</span>
                </h2>
                
                <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                  Empowering pet parents with over 20 years of expert knowledge. From nutrition to behavior, explore our curated guides to give your companions the happy, healthy life they deserve.
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <span className="text-green-500">✓</span>
                    <span>Vet Approved</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <span className="text-green-500">✓</span>
                    <span>Research Backed</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Banner Image */}
            <div className="relative h-64 lg:h-[500px] lg:order-last overflow-hidden">
               <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  src="/assets/images/essential/dog_birthday.jpg" 
                  alt="Happy Dog Learning" 
                  className="w-full h-full object-cover object-center lg:rounded-l-3xl"
               />
               
               {/* Decorative floating card */}
               <motion.div 
                 initial={{ y: 50, opacity: 0 }}
                 whileInView={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.5, duration: 0.6 }}
                 className="absolute bottom-6 left-6 lg:bottom-12 lg:left-12 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 max-w-xs hidden sm:block"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                     </svg>
                   </div>
                   <div>
                     <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Community Favorite</p>
                     <p className="text-sm font-semibold text-gray-900">Training Essentials</p>
                   </div>
                 </div>
               </motion.div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-60 overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                   <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold rounded-md shadow-sm">
                      {article.category}
                   </span>
                </div>
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              
              <div className="flex flex-col flex-grow p-6 lg:p-8">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                   <span>{article.readTime}</span>
                   <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                   <span>Feb 20, 2026</span>
                </div>
                
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  <Link to={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-6 flex-grow leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                  <Link 
                    to={`/blog/${article.slug}`}
                    className="flex items-center text-sm font-semibold text-orange-600 group-hover:text-orange-700 transition-colors"
                  >
                    Read Article
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 lg:mt-16">
          <Link 
            to="/blog" 
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gray-900 hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-orange-500/30"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LearnWithPetCo;
