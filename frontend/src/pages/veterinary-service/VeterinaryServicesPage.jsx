import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../homepage/components/Footer';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import Icon from '../../components/AppIcon';

const VeterinaryServicesPage = () => {
  const navigate = useNavigate();

  const veterinaryServices = [
    {
      id: 'appointment',
      title: 'Book Appointment',
      description: 'Schedule a visit to our veterinary clinic for comprehensive checkups and treatments',
      icon: 'Calendar',
      color: 'blue',
      bgGradient: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-500',
      textColor: 'text-blue-800',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      features: [
        'Complete health checkups',
        'Professional examination',
        'Vaccination services', 
        'Treatment planning',
        'Medical consultation'
      ],
      path: '/veterinary-service/appointment'
    },
    {
      id: 'home-visit',
      title: 'Home Visit',
      description: 'Professional veterinary care delivered to the comfort of your home',
      icon: 'Home',
      color: 'green',
      bgGradient: 'from-green-50 to-green-100',
      iconBg: 'bg-green-500',
      textColor: 'text-green-800',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      features: [
        'Veterinarian visits your home',
        'Stress-free for your pet',
        'Convenient scheduling',
        'Basic treatments available',
        'Follow-up care'
      ],
      path: '/veterinary-service/home-visit'
    },
    {
      id: 'video-consultation',
      title: 'Video Consultation',
      description: 'Get professional veterinary advice through secure video calls',
      icon: 'Video',
      color: 'purple',
      bgGradient: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
      textColor: 'text-purple-800',
      buttonColor: 'bg-purple-500 hover:bg-purple-600',
      features: [
        'Instant veterinary consultation',
        'Multiple platform options',
        'Quick advice and guidance',
        'Follow-up consultations',
        'Cost-effective solution'
      ],
      path: '/veterinary-service/video-consultation'
    }
  ];

  const handleServiceSelect = (service) => {
    navigate(service.path);
  };

  return (
    <>
      <Helmet>
        <title>Veterinary Services - Professional Pet Healthcare | PET&CO</title>
        <meta
          name="description"
          content="Professional veterinary services for your pets. Book appointments, schedule home visits, or get online consultations with qualified veterinarians."
        />
        <meta name="keywords" content="veterinary services, pet healthcare, vet appointments, home visits, video consultation, pet medical care" />
        <meta property="og:title" content="Veterinary Services - Professional Pet Healthcare | PET&CO" />
        <meta property="og:description" content="Professional veterinary services including appointments, home visits, and video consultations." />
      </Helmet>

      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
                Veterinary Services
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                Professional healthcare for your beloved pets. Choose from clinic appointments, 
                convenient home visits, or instant video consultations with qualified veterinarians.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <Icon name="Shield" size={20} />
                  <span className="font-medium">Licensed Veterinarians</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-blue-700">
                  <Icon name="Clock" size={20} />
                  <span className="font-medium">Flexible Scheduling</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-purple-700">
                  <Icon name="Heart" size={20} />
                  <span className="font-medium">Compassionate Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Choose Your Veterinary Service
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We offer flexible veterinary care options to suit your pet's needs and your schedule. 
              Select the service that works best for you.
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {veterinaryServices.map((service) => (
              <div
                key={service.id}
                className={`bg-gradient-to-br ${service.bgGradient} rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105`}
              >
                <div className="p-8">
                  {/* Service Icon */}
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${service.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon name={service.icon} size={32} className="text-white" />
                    </div>
                    <h3 className={`text-2xl font-heading font-bold ${service.textColor} mb-2`}>
                      {service.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="mb-6">
                    <h4 className={`font-semibold ${service.textColor} mb-3`}>What's Included:</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <Icon name="Check" size={16} className={service.textColor} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleServiceSelect(service)}
                    className={`w-full ${service.buttonColor} text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2`}
                  >
                    <Icon name={service.icon} size={18} />
                    {service.id === 'appointment' ? 'Book Now' : 
                     service.id === 'home-visit' ? 'Schedule Visit' : 'Start Consultation'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="bg-card rounded-lg border border-border p-8">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
              Why Choose Our Veterinary Services?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="UserCheck" size={24} className="text-green-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Qualified Professionals</h4>
                <p className="text-sm text-muted-foreground">Licensed and experienced veterinarians</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Clock" size={24} className="text-blue-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Flexible Scheduling</h4>
                <p className="text-sm text-muted-foreground">Available 7 days a week with flexible timings</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Shield" size={24} className="text-purple-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Comprehensive Care</h4>
                <p className="text-sm text-muted-foreground">Full range of veterinary services</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Heart" size={24} className="text-orange-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Compassionate Care</h4>
                <p className="text-sm text-muted-foreground">Gentle and loving treatment for your pets</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-12 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Icon name="AlertTriangle" size={24} className="text-red-600" />
              <h4 className="text-lg font-semibold text-red-800">Emergency Services</h4>
            </div>
            <p className="text-red-700 mb-4">
              For urgent medical emergencies, please contact our 24/7 emergency hotline immediately.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="tel:+911234567890" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Icon name="Phone" size={18} />
                Call Emergency: +91 12345 67890
              </a>
              <Link
                to="/veterinary-service/appointment"
                className="bg-white hover:bg-gray-50 text-red-600 border border-red-300 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Icon name="Calendar" size={18} />
                Book Emergency Appointment
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </>
  );
};

export default VeterinaryServicesPage;