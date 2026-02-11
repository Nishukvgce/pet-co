import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import serviceBookingApi from '../../services/serviceBookingApi';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const VeterinaryService = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Pet Information
    petName: '',
    petType: '',
    petBreed: '',
    petAge: '',
    petWeight: '',
    
    // Owner Information
    ownerName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    
    // Service Information
    serviceName: '',
    serviceType: serviceType || 'appointment',
    preferredDate: '',
    preferredTime: '',
    urgency: 'normal',
    
    // Medical Information
    symptoms: '',
    medicalHistory: '',
    currentMedications: '',
    specialRequests: '',
    
    // Video Consultation specific
    preferredPlatform: 'zoom',
    
    // Home Visit specific
    homeAddress: '',
    accessInstructions: ''
  });

  const serviceConfig = {
    appointment: {
      title: 'Book Veterinary Appointment',
      description: 'Schedule a visit to our veterinary clinic',
      icon: 'Calendar',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    'home-visit': {
      title: 'Schedule Home Visit',
      description: 'Professional veterinary care at your home',
      icon: 'Home', 
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    'video-consultation': {
      title: 'Video Consultation',
      description: 'Online consultation with our veterinarians',
      icon: 'Video',
      bgColor: 'bg-purple-50', 
      iconColor: 'text-purple-500'
    }
  };

  useEffect(() => {
    if (serviceType) {
      const config = serviceConfig[serviceType];
      if (config) {
        setFormData(prev => ({
          ...prev,
          serviceName: config.title,
          serviceType: serviceType
        }));
      } else {
        navigate('/veterinary-service/appointment');
      }
    }
  }, [serviceType, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const bookingData = {
        ...formData,
        serviceName: serviceConfig[serviceType]?.title,
        serviceType: serviceType,
        // Map veterinary-specific fields to entity fields
        symptoms: formData.symptoms,
        medicalHistory: formData.medicalHistory,
        currentMedications: formData.currentMedications,
        urgency: formData.urgency,
        ...(serviceType === 'video-consultation' && {
          preferredPlatform: formData.preferredPlatform
        }),
        ...(serviceType === 'home-visit' && {
          homeAddress: formData.homeAddress,
          accessInstructions: formData.accessInstructions
        }),
        // Store medical data in addOns format for backward compatibility
        addOns: {
          medical: {
            symptoms: formData.symptoms,
            medicalHistory: formData.medicalHistory,
            medications: formData.currentMedications,
            urgency: formData.urgency,
            specialRequests: formData.specialRequests,
            ...(serviceType === 'video-consultation' && {
              preferredPlatform: formData.preferredPlatform
            }),
            ...(serviceType === 'home-visit' && {
              homeAddress: formData.homeAddress,
              accessInstructions: formData.accessInstructions
            })
          }
        },
        // Also include in additionalDetails for backward compatibility
        additionalDetails: {
          symptoms: formData.symptoms,
          medicalHistory: formData.medicalHistory,
          currentMedications: formData.currentMedications,
          specialRequests: formData.specialRequests,
          urgency: formData.urgency,
          ...(serviceType === 'video-consultation' && {
            preferredPlatform: formData.preferredPlatform
          }),
          ...(serviceType === 'home-visit' && {
            homeAddress: formData.homeAddress,
            accessInstructions: formData.accessInstructions
          })
        }
      };

      const response = await serviceBookingApi.createBooking(bookingData);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError('Failed to submit booking. Please try again.');
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError('An error occurred while submitting your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const config = serviceConfig[serviceType] || serviceConfig.appointment;

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Check" size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for booking with us. Our team will contact you shortly to confirm your appointment details.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/user-account-dashboard')}
                variant="default" 
                size="lg" 
                fullWidth
              >
                View My Bookings
              </Button>
              <Button 
                onClick={() => navigate('/veterinary-service/appointment')}
                variant="outline" 
                size="lg" 
                fullWidth
              >
                Book Another Service
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`${config.bgColor} rounded-lg p-6 mb-8`}>
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                <Icon name={config.icon} size={24} className={config.iconColor} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
                <p className="text-gray-600">{config.description}</p>
              </div>
            </div>
            
            {/* Service Type Switcher */}
            <div className="flex space-x-2 mt-4">
              <Link 
                to="/veterinary-service/appointment" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  serviceType === 'appointment' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Clinic Appointment
              </Link>
              <Link 
                to="/veterinary-service/home-visit" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  serviceType === 'home-visit' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Home Visit
              </Link>
              <Link 
                to="/veterinary-service/video-consultation" 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  serviceType === 'video-consultation' 
                    ? 'bg-purple-500 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Video Consultation
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Icon name="AlertCircle" size={20} className="text-red-500 mr-2" />
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {/* Pet Information */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon name="Heart" size={20} className="text-primary mr-2" />
                  Pet Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Pet Name"
                    name="petName"
                    value={formData.petName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your pet's name"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pet Type</label>
                    <select
                      name="petType"
                      value={formData.petType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select pet type</option>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="bird">Bird</option>
                      <option value="rabbit">Rabbit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Input
                    label="Breed"
                    name="petBreed"
                    value={formData.petBreed}
                    onChange={handleInputChange}
                    placeholder="e.g., Golden Retriever, Persian Cat"
                  />
                  <Input
                    label="Age"
                    name="petAge"
                    value={formData.petAge}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years, 6 months"
                  />
                  <Input
                    label="Weight (optional)"
                    name="petWeight"
                    value={formData.petWeight}
                    onChange={handleInputChange}
                    placeholder="e.g., 15 kg, 3.5 kg"
                  />
                </div>
              </section>

              {/* Owner Information */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon name="User" size={20} className="text-primary mr-2" />
                  Owner Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                  />
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your address"
                  />
                </div>
              </section>

              {/* Medical Information */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon name="Activity" size={20} className="text-primary mr-2" />
                  Medical Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Symptoms/Concerns <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="Describe your pet's symptoms or the reason for the consultation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                      <textarea
                        name="medicalHistory"
                        value={formData.medicalHistory}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Previous illnesses, surgeries, or medical conditions"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                      <textarea
                        name="currentMedications"
                        value={formData.currentMedications}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="List any medications your pet is currently taking"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Urgency Level</label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="normal">Normal - Within a few days</option>
                      <option value="urgent">Urgent - Within 24 hours</option>
                      <option value="emergency">Emergency - Immediately</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Service-specific sections */}
              {serviceType === 'home-visit' && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Icon name="Home" size={20} className="text-green-500 mr-2" />
                    Home Visit Details
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Home Address for Visit"
                      name="homeAddress"
                      value={formData.homeAddress}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter the complete address where the visit should take place"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Access Instructions
                      </label>
                      <textarea
                        name="accessInstructions"
                        value={formData.accessInstructions}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Any specific instructions for accessing your home (gate codes, parking, etc.)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </section>
              )}

              {serviceType === 'video-consultation' && (
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Icon name="Video" size={20} className="text-purple-500 mr-2" />
                    Video Consultation Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Platform</label>
                      <select
                        name="preferredPlatform"
                        value={formData.preferredPlatform}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="zoom">Zoom</option>
                        <option value="google-meet">Google Meet</option>
                        <option value="microsoft-teams">Microsoft Teams</option>
                        <option value="whatsapp">WhatsApp Video</option>
                      </select>
                    </div>
                  </div>
                </section>
              )}

              {/* Scheduling */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon name="Calendar" size={20} className="text-primary mr-2" />
                  Preferred Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Preferred Date"
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select time slot</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Special Requests */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon name="MessageSquare" size={20} className="text-primary mr-2" />
                  Additional Notes
                </h3>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any special requests or additional information you'd like to share"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </section>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={loading}
                  className="px-12"
                >
                  {loading ? 'Submitting...' : `Book ${config.title}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeterinaryService;