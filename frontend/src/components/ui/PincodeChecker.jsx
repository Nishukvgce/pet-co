import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import deliveryApi from '../../services/deliveryApi';
import Button from './Button';
import Icon from '../AppIcon';

const PincodeChecker = ({ className = '' }) => {
  const { user } = useAuth();
  const [pincode, setPincode] = useState('');
  const [userPincode, setUserPincode] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  // Load user's current pincode on component mount
  useEffect(() => {
    if (user?.email) {
      loadUserPincode();
    }
  }, [user]);

  const loadUserPincode = async () => {
    try {
      setLoading(true);
      const response = await deliveryApi.getUserPincode(user.email);
      setUserPincode(response.pincode);
      setDeliveryInfo(response.deliveryInfo);
      setPincode(response.pincode || '');
    } catch (error) {
      console.error('Failed to load user pincode:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\\D/g, '').slice(0, 6);
    setPincode(value);
    setError('');
  };

  const handleCheckDelivery = async () => {
    if (!pincode || pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }

    if (!pincode.startsWith('560')) {
      setError('We only deliver to Bangalore area (pincodes starting with 560)');
      return;
    }

    try {
      setChecking(true);
      setError('');
      
      // Check delivery availability
      const response = await deliveryApi.checkDelivery(pincode);
      setDeliveryInfo(response);
      
      // If user is logged in, update their pincode
      if (user?.email && pincode !== userPincode) {
        await deliveryApi.updateUserPincode(user.email, pincode);
        setUserPincode(pincode);
      }
    } catch (error) {
      console.error('Failed to check delivery:', error);
      setError('Failed to check delivery. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCheckDelivery();
    }
  };

  if (loading) {
    return (
      <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-muted-foreground">Loading delivery info...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Icon name="MapPin" size={20} className="text-primary" />
        <h3 className="font-heading font-semibold text-foreground">Check Delivery</h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter pincode (e.g. 560001)"
            value={pincode}
            onChange={handlePincodeChange}
            onKeyPress={handleKeyPress}
            className="flex-1 px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            maxLength="6"
          />
          <Button
            onClick={handleCheckDelivery}
            disabled={checking || !pincode || pincode.length !== 6}
            size="sm"
            className="px-4"
          >
            {checking ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Check'
            )}
          </Button>
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <Icon name="AlertTriangle" size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
      
      {deliveryInfo && (
        <div className={`p-3 rounded-md border ${
          deliveryInfo.available 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Icon 
              name={deliveryInfo.available ? 'CheckCircle' : 'XCircle'} 
              size={16}
              className={deliveryInfo.available ? 'text-green-600' : 'text-red-600'} 
            />
            <span className="font-medium text-sm">{deliveryInfo.status}</span>
          </div>
          
          <p className="text-sm mb-2">{deliveryInfo.message}</p>
          
          {deliveryInfo.available && (
            <div className="space-y-1 text-xs">
              {deliveryInfo.deliveryCharge !== null && (
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="font-medium">
                    {deliveryInfo.deliveryCharge === 0 ? 'Free' : `₹${deliveryInfo.deliveryCharge}`}
                  </span>
                </div>
              )}
              {deliveryInfo.estimatedTime && (
                <div className="flex justify-between">
                  <span>Estimated Time:</span>
                  <span className="font-medium">{deliveryInfo.estimatedTime}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PincodeChecker;