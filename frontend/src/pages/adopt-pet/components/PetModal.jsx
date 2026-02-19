import React from 'react';
import Icon from '../../../components/AppIcon';

const PetModal = ({ pet, onClose }) => {
  if (!pet) return null;

  const handleWhatsAppContact = () => {
    const message = `Hi! I'm interested in adopting ${pet.name}, a ${pet.age} old ${pet.breed}. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/${pet.shelterContact.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailContact = () => {
    const subject = `Adoption Inquiry for ${pet.name}`;
    const body = `Hi,\n\nI am interested in adopting ${pet.name}, a ${pet.age} old ${pet.breed}. Could you please provide more details about the adoption process?\n\nThank you!`;
    const emailUrl = `mailto:${pet.shelterEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(emailUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Meet {pet.name}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Pet Image */}
            <div>
              <div className="aspect-square rounded-xl overflow-hidden">
                <img 
                  src={pet.image} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Side - Pet Information */}
            <div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-4">
                Facts About Me
              </h3>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Name</span>
                    <span className="font-medium">{pet.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Breed*</span>
                    <span className="font-medium">{pet.breed}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Age</span>
                    <span className="font-medium">{pet.age}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Gender</span>
                    <span className="font-medium">{pet.gender}</span>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground block mb-1">City/State</span>
                  <span className="font-medium">{pet.location}</span>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground block mb-1">Shelter Name</span>
                  <span className="font-medium">{pet.shelter}</span>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground block mb-1">Shelter Email address</span>
                  <span className="font-medium text-blue-600">{pet.shelterEmail}</span>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground block mb-1">Shelter Full Address</span>
                  <span className="font-medium text-sm leading-relaxed">{pet.shelterAddress}</span>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground block mb-1">SPOC Name</span>
                  <span className="font-medium">{pet.spocName}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Sterilisation</span>
                    <span className="font-medium">{pet.sterilized ? 'Yes' : 'No'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">Vaccinated</span>
                    <span className="font-medium">{pet.vaccinated ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* My Story Section */}
              <div className="mb-6">
                <h3 className="text-lg font-heading font-bold text-foreground mb-3">
                  My Story
                </h3>
                <div className="bg-orange-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-600">🐕</span>
                    <span className="font-medium text-sm">Adoption Alert - {pet.location.split(',')[0]} 🐕</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm leading-relaxed">
                  <p>{pet.story}</p>
                  
                  <div className="space-y-2">
                    {pet.traits.map((trait, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✅</span>
                        <span>{trait}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="font-medium">
                      Please share within your groups/networks, or call me if you're interested! 🥰💕
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">Contact Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium">{pet.spocName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Number</span>
                    <span className="text-sm font-medium text-blue-600">{pet.shelterContact}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={handleWhatsAppContact}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="MessageCircle" size={18} />
                    WhatsApp
                  </button>
                  <button 
                    onClick={handleEmailContact}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="Mail" size={18} />
                    Email
                  </button>
                  <a 
                    href={`tel:${pet.shelterContact}`}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icon name="Phone" size={18} />
                    Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetModal;