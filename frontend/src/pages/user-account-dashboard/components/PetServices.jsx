import React, { useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import serviceBookingApi from '../../../services/serviceBookingApi';

const statusChip = (status = 'PENDING') => {
  const map = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-green-100 text-green-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-gray-100 text-gray-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-muted text-foreground';
};

const typeIcon = (type = '') => {
  const t = (type || '').toLowerCase();
  if (t.includes('walk')) return { name: 'Footprints', color: 'text-orange-500' };
  if (t.includes('board')) return { name: 'Home', color: 'text-blue-500' };
  if (t.includes('groom')) return { name: 'Scissors', color: 'text-purple-500' };
  if (t.includes('veterinary')) return { name: 'Heart', color: 'text-red-500' };
  return { name: 'PawPrint', color: 'text-primary' };
};

const getServiceDetails = (booking) => {
  if (!booking) return { type: 'general', icon: 'PawPrint', color: 'text-primary', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', details: {} };
  
  const serviceType = (booking.serviceType || '').toLowerCase();
  const serviceName = (booking.serviceName || '').toLowerCase();
  
  // Veterinary services
  if (serviceType.includes('veterinary') || serviceName.includes('veterinary') || serviceName.includes('appointment') || serviceName.includes('consultation')) {
    return {
      type: 'veterinary',
      icon: 'Heart',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      details: {
        symptoms: booking.symptoms || (booking.addOns?.medical?.symptoms),
        urgency: booking.urgency || (booking.addOns?.medical?.urgency) || 'normal',
        platform: booking.preferredPlatform || (booking.addOns?.medical?.preferredPlatform),
        homeAddress: booking.homeAddress || (booking.addOns?.medical?.homeAddress)
      }
    };
  }
  
  // Walking services  
  if (serviceType.includes('walk') || serviceName.includes('walk')) {
    return {
      type: 'walking',
      icon: 'Footprints', 
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      details: {
        duration: booking.walkDuration || (booking.addOns?.duration),
        routePreference: booking.routePreference,
        walkingRules: booking.walkingRules || (booking.addOns?.rules)
      }
    };
  }
  
  // Boarding services
  if (serviceType.includes('board') || serviceName.includes('board')) {
    return {
      type: 'boarding',
      icon: 'Home',
      color: 'text-blue-500', 
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      details: {
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        emergencyContact: booking.emergencyContact || (booking.addOns?.boardingExtras?.emergencyContact),
        vaccination: booking.vaccinationUpToDate || (booking.addOns?.boardingExtras?.vaccinationUpToDate)
      }
    };
  }
  
  // Grooming services
  if (serviceType.includes('groom') || serviceName.includes('groom') || serviceName.includes('pack')) {
    return {
      type: 'grooming',
      icon: 'Scissors',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50', 
      borderColor: 'border-purple-200',
      details: {
        packageType: booking.packageType,
        selectedAddOns: booking.selectedAddOns || (booking.addOns?.selectedAddOns),
        temperament: booking.temperament || (booking.addOns?.boardingExtras?.temperament)
      }
    };
  }
  
  return {
    type: 'general',
    icon: 'PawPrint',
    color: 'text-primary',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    details: {}
  };
};

const normalize = (raw = {}) => ({
  id: raw.id,
  serviceName: raw.serviceName,
  serviceType: raw.serviceType,
  petName: raw.petName,
  petBreed: raw.petBreed,
  petAge: raw.petAge,
  preferredDate: raw.preferredDate,
  preferredTime: raw.preferredTime,
  status: raw.status || 'PENDING',
  totalAmount: raw.totalAmount ?? raw.basePrice,
  ownerName: raw.ownerName,
  phone: raw.phone,
  email: raw.email,
  addOns: raw.addOns || {},
  userId: raw.userId || null,
  createdAt: raw.createdAt,
});

const sortByDateTime = (a, b) => {
  const da = new Date(`${a.preferredDate || a.createdAt} ${a.preferredTime || ''}`);
  const db = new Date(`${b.preferredDate || b.createdAt} ${b.preferredTime || ''}`);
  return db - da; // newest first
};

export default function PetServices({ user }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const load = async () => {
      if (!user) {
        console.log('[DEBUG] PetServices: No user provided, skipping load');
        return;
      }
      
      console.log('[DEBUG] PetServices: Loading bookings for user:', {
        id: user?.id,
        email: user?.email,
        phone: user?.phone,
        name: user?.name
      });
      
      setLoading(true);
      setError(null);
      try {
        const resp = await serviceBookingApi.getBookingsForUser({ 
          userId: user?.id, 
          email: user?.email, 
          phone: user?.phone 
        });
        
        console.log('[DEBUG] PetServices: API response:', resp);
        let results = (resp?.bookings || []).map(normalize);
        console.log('[DEBUG] PetServices: Normalized results:', results);
        setBookings(results.sort(sortByDateTime));
      } catch (e) {
        console.error('[ERROR] PetServices: Failed to load bookings', e);
        setError(e.message || 'Failed to load pet services');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id, user?.email, user?.phone, user?.name]);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'walking', label: 'Walking' },
    { id: 'boarding', label: 'Boarding' },
    { id: 'grooming', label: 'Grooming' },
    { id: 'veterinary', label: 'Veterinary' },
  ];

  const filtered = useMemo(() => {
    if (activeTab === 'all') return bookings;
    return bookings.filter(b => {
      const t = `${b.serviceType} ${b.serviceName}`.toLowerCase();
      if (activeTab === 'walking') return t.includes('walk');
      if (activeTab === 'boarding') return t.includes('board');
      if (activeTab === 'grooming') return t.includes('groom');
      if (activeTab === 'veterinary') return t.includes('veterinary') || t.includes('appointment') || t.includes('consultation');
      return true;
    });
  }, [bookings, activeTab]);

  const counts = useMemo(() => {
    const c = { all: bookings.length, walking: 0, boarding: 0, grooming: 0, veterinary: 0 };
    bookings.forEach(b => {
      const t = `${b.serviceType} ${b.serviceName}`.toLowerCase();
      if (t.includes('walk')) c.walking++;
      else if (t.includes('board')) c.boarding++;
      else if (t.includes('groom')) c.grooming++;
      else if (t.includes('veterinary') || t.includes('appointment') || t.includes('consultation')) c.veterinary++;
    });
    return c;
  }, [bookings]);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">My Pet Services</h2>
          <p className="text-sm text-muted-foreground">View your walking, boarding, and grooming bookings in one place.</p>
        </div>
        
        {/* Desktop tabs */}
        <div className="hidden md:flex gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${activeTab===t.id?'bg-primary text-primary-foreground border-primary':'bg-background hover:bg-muted border-border'}`}
            >
              {t.label}
              <span className="ml-2 text-xs opacity-80">{counts[t.id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="mt-4 md:hidden flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${activeTab===t.id?'bg-primary text-primary-foreground border-primary':'bg-background hover:bg-muted border-border'}`}
          >
            {t.label}
            <span className="ml-2 text-xs opacity-80">{counts[t.id] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6">
        {loading && (
          <div className="text-center text-muted-foreground">Loading your bookings…</div>
        )}
        {error && !loading && (
          <div className="text-center text-destructive">{error}</div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center text-muted-foreground p-8 border border-dashed border-border rounded-lg">
            <p>No bookings found yet.</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <a href="/pet-walking"><Button size="sm" variant="secondary" iconName="Footprints">Book Walking</Button></a>
              <a href="/pet-boarding"><Button size="sm" variant="secondary" iconName="Home">Book Boarding</Button></a>
              <a href="/shop-for-dogs/dog-grooming"><Button size="sm" variant="secondary" iconName="Scissors">Explore Grooming</Button></a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((b, index) => {
            try {
              const serviceInfo = getServiceDetails(b);
              
              return (
              <div key={b.id} className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all ${serviceInfo.borderColor}`}>
                {/* Main card content */}
                <div className={`p-4 ${serviceInfo.bgColor}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full bg-white flex items-center justify-center ${serviceInfo.color} border-2`}>
                        <Icon name={serviceInfo.icon} size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{b.serviceName}</div>
                        <div className="text-xs text-muted-foreground">For {b.petName}{b.petBreed?` • ${b.petBreed}`:''}</div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusChip(b.status)}`}>{b.status?.replace('_',' ')}</span>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground"><Icon name="Calendar" size={16} /><span>{b.preferredDate || '—'}</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Icon name="Clock" size={16} /><span>{b.preferredTime || '—'}</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Icon name="IndianRupee" size={16} /><span>₹{b.totalAmount}</span></div>
                    <div className="flex items-center gap-2 text-muted-foreground"><Icon name="User" size={16} /><span>{b.ownerName}</span></div>
                  </div>
                  
                  {/* Service-specific quick info */}
                  <div className="mt-3">
                    {serviceInfo.type === 'veterinary' && serviceInfo.details.symptoms && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <Icon name="AlertTriangle" size={16} />
                        <span className="font-medium">Symptoms:</span> 
                        <span className="truncate">{serviceInfo.details.symptoms}</span>
                      </div>
                    )}
                    {serviceInfo.type === 'walking' && serviceInfo.details.duration && (
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <Icon name="Clock" size={16} />
                        <span className="font-medium">Duration:</span> {serviceInfo.details.duration}
                      </div>
                    )}
                    {serviceInfo.type === 'boarding' && serviceInfo.details.checkInDate && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Icon name="Calendar" size={16} />
                        <span className="font-medium">Check-in:</span> {serviceInfo.details.checkInDate}
                      </div>
                    )}
                    {serviceInfo.type === 'grooming' && serviceInfo.details.packageType && (
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Icon name="Package" size={16} />
                        <span className="font-medium">Package:</span> {serviceInfo.details.packageType}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Created: {(() => {
                        try {
                          return new Date(b.createdAt).toLocaleDateString();
                        } catch {
                          return 'N/A';
                        }
                      })()}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${serviceInfo.color}`} style={{backgroundColor: serviceInfo.bgColor}}>
                      {serviceInfo.type.charAt(0).toUpperCase() + serviceInfo.type.slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            );
            } catch (renderError) {
              console.error('Error rendering booking:', renderError, b);
              return (
                <div key={b?.id || index} className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="text-red-600 font-medium">Error displaying service</div>
                  <div className="text-sm text-red-500 mt-1">Service: {b?.serviceName || 'Unknown'}</div>
                  <div className="text-xs text-red-400 mt-2">Please refresh the page or contact support if this persists.</div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
