import React, { useEffect, useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useAuth } from '../../../contexts/AuthContext';
import userApi from '../../../services/userApi';
import Icon from '../../../components/AppIcon';

/**
 * ShippingForm Component - Step 1 of Checkout Process
 * 
 * This component handles address selection for delivery:
 * 1. Shows saved addresses if available
 * 2. Allows adding new address
 * 3. Validates address information
 * 4. Saves selection to backend before proceeding
 * 
 * Props:
 * - onNext: Function to proceed to next step
 * - onAddressSelect: Function to handle address selection
 * - user: Current user object
 * - isLoading: Loading state for form submission
 */
const ShippingForm = ({ onNext, onAddressSelect, user, isLoading = false }) => {
  const { user: authUser } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [saved, setSaved] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    latitude: null,
    longitude: null
  });
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [errors, setErrors] = useState({});
  const [saveAddress, setSaveAddress] = useState(false);

  const stateOptions = [
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'west-bengal', label: 'West Bengal' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' }
  ];

  // Load saved addresses from backend
  useEffect(() => {
    const load = async () => {
      try {
        if (!authUser?.email) return;
        const list = await userApi.getAddresses(authUser.email);
        const addressList = Array.isArray(list) ? list : [];
        setSaved(addressList);

        // If no saved addresses, automatically show new address form
        if (addressList.length === 0) {
          setShowNewAddressForm(true);
        }
      } catch (e) {
        setSaved([]);
        // If error loading addresses, show new address form
        setShowNewAddressForm(true);
      }
    };
    load();
  }, [authUser?.email]);

  const handleInputChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Check if form is valid without setting errors (for button state)
   */
  const isFormValid = () => {
    return formData?.firstName?.trim() &&
      formData?.lastName?.trim() &&
      formData?.email?.trim() &&
      /\S+@\S+\.\S+/?.test(formData?.email) &&
      formData?.phone?.trim() &&
      /^[+]?[91]?[6-9]\d{9}$/?.test(formData?.phone?.replace(/\s/g, '')) &&
      formData?.address?.trim() &&
      formData?.city?.trim() &&
      formData?.state &&
      formData?.pincode?.trim() &&
      /^\d{6}$/?.test(formData?.pincode);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData?.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/?.test(formData?.email)) newErrors.email = 'Invalid email format';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[+]?[91]?[6-9]\d{9}$/?.test(formData?.phone?.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid Indian phone number';
    }
    if (!formData?.address?.trim()) newErrors.address = 'Address is required';
    if (!formData?.city?.trim()) newErrors.city = 'City is required';
    if (!formData?.state) newErrors.state = 'State is required';
    if (!formData?.pincode?.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/?.test(formData?.pincode)) newErrors.pincode = 'Invalid pincode format';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  /**
   * Handle form submission
   * Validates form data and proceeds to next step
   */
  const handleSubmit = async (e) => {
    e?.preventDefault();

    try {
      if (selectedAddress) {
        // Use selected saved address
        const address = saved?.find(a => String(a?.id) === String(selectedAddress));
        if (!address) {
          throw new Error('Selected address not found');
        }

        if (onAddressSelect) onAddressSelect(address);
        onNext(address);
        return;
      }

      if (showNewAddressForm && validateForm()) {
        // Create new address
        let created = null;

        // Save to backend if requested
        if (saveAddress && authUser?.email) {
          try {
            const payload = {
              name: `${formData.firstName} ${formData.lastName}`.trim(),
              phone: formData.phone,
              street: formData.address + (formData.apartment ? `, ${formData.apartment}` : ''),
              city: formData.city,
              state: typeof formData.state === 'string' ? formData.state : formData.state?.value,
              pincode: formData.pincode,
              landmark: '',
               addressType: 'Home',
               default: saved?.length === 0,
               latitude: formData.latitude,
               longitude: formData.longitude
             };
            created = await userApi.addAddress(authUser.email, payload);
            setSaved(prev => [...prev, created]);
            console.log('New address saved to backend:', created);
          } catch (error) {
            console.error('Failed to save address to backend:', error);
            // Continue with local address creation
          }
        }

        // Create address object for checkout
        const addressToUse = created || {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          street: formData.address + (formData.apartment ? `, ${formData.apartment}` : ''),
          city: formData.city,
           state: typeof formData.state === 'string' ? formData.state : formData.state?.value,
           pincode: formData.pincode,
           landmark: '',
           addressType: 'Home',
           latitude: formData.latitude,
           longitude: formData.longitude
         };

        if (onAddressSelect) onAddressSelect(addressToUse);
        onNext(addressToUse);
      }
    } catch (error) {
      console.error('Error in address submission:', error);
      setErrors({ submit: error.message || 'Failed to process address selection' });
    }
  };

  const handleAddressSelection = (addressId) => {
    setSelectedAddress(addressId);
    setShowNewAddressForm(false);
    if (onAddressSelect) {
      const address = saved?.find(addr => String(addr?.id) === String(addressId));
      onAddressSelect(address);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-heading font-semibold text-xl text-foreground mb-6">
        Shipping Information
      </h2>

      {/* Guidance Banner */}
      <div className="bg-primary/10 border-l-4 border-primary p-4 mb-8 rounded-r-lg flex items-start space-x-3 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="bg-primary text-primary-foreground p-1.5 rounded-full mt-0.5">
          <Icon name="Info" size={16} />
        </div>
        <div>
          <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wide">Step 1: Shipping Information</h3>
          <p className="font-body text-foreground text-sm mt-1">
            Please select a saved address or add a new one to proceed with your delivery.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Saved Addresses */}
        {saved?.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-body font-medium text-foreground">
              Choose from saved addresses
            </h3>
            <div className="space-y-3">
              {saved?.map((address) => (
                <label
                  key={address?.id}
                  className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 relative group ${
                    selectedAddress === address?.id?.toString()
                      ? 'border-primary bg-primary/5 selection-shadow ring-2 ring-primary/10' 
                      : 'border-border hover:border-primary/40 hover:bg-muted/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    value={address?.id}
                    checked={selectedAddress === address?.id?.toString()}
                    onChange={(e) => handleAddressSelection(e?.target?.value)}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          address?.addressType === 'Home' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {address?.addressType || 'Other'}
                        </span>
                        {address?.isDefault && (
                          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                            Default
                          </span>
                        )}
                      </div>
                      <p className={`font-body text-sm transition-colors duration-300 ${selectedAddress === address?.id?.toString() ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {address?.street}
                      </p>
                      <p className="font-body text-sm text-muted-foreground">
                        {address?.city}, {address?.state} - {address?.pincode}
                      </p>
                      <p className="font-data text-sm text-muted-foreground">
                        {address?.phone}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedAddress === address?.id?.toString()
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-border group-hover:border-primary/50'
                    }`}>
                      {selectedAddress === address?.id?.toString() ? (
                        <Icon name="Check" size={12} strokeWidth={3} />
                      ) : (
                        <div className="w-2 h-2 bg-transparent rounded-full" />
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowNewAddressForm(true);
                setSelectedAddress('');
              }}
              iconName="Plus"
              iconPosition="left"
              className="w-full"
            >
              Add New Address
            </Button>
          </div>
        )}

        {/* New Address Form */}
        {(showNewAddressForm || saved?.length === 0) && (
          <div className="space-y-4">
            {saved?.length > 0 && (
              <div className="flex items-center justify-between">
                <h3 className="font-body font-medium text-foreground">
                  Add New Address
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewAddressForm(false)}
                  iconName="X"
                  iconPosition="left"
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Fetch Current Location Button */}
            <div className="flex flex-col space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setLocationLoading(true);
                  setLocationError(null);
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setFormData(prev => ({
                          ...prev,
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude
                        }));
                        setLocationLoading(false);
                        console.log('Location fetched:', position.coords);
                      },
                      (error) => {
                        console.error('Error fetching location:', error);
                        setLocationError('Failed to get location. Please allow location access.');
                        setLocationLoading(false);
                      }
                    );
                  } else {
                    setLocationError('Geolocation is not supported by your browser.');
                    setLocationLoading(false);
                  }
                }}
                disabled={locationLoading}
                iconName="MapPin"
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                {locationLoading ? 'Fetching Location...' : 'Use Current Location'}
              </Button>
              {formData.latitude && (
                <p className="text-xs text-green-600 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  Location Captured ({formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)})
                </p>
              )}
              {locationError && (
                <p className="text-xs text-red-500">{locationError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={<div className="flex items-center">First Name <span className="text-red-500 ml-1">*</span></div>}
                type="text"
                name="firstName"
                value={formData?.firstName}
                onChange={handleInputChange}
                error={errors?.firstName}
                required
                placeholder="Enter first name"
              />
              <Input
                label={<div className="flex items-center">Last Name <span className="text-red-500 ml-1">*</span></div>}
                type="text"
                name="lastName"
                value={formData?.lastName}
                onChange={handleInputChange}
                error={errors?.lastName}
                required
                placeholder="Enter last name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={<div className="flex items-center">Email Address <span className="text-red-500 ml-1">*</span></div>}
                type="email"
                name="email"
                value={formData?.email}
                onChange={handleInputChange}
                error={errors?.email}
                required
                placeholder="your.email@example.com"
              />
              <Input
                label={<div className="flex items-center">Phone Number <span className="text-red-500 ml-1">*</span></div>}
                type="tel"
                name="phone"
                value={formData?.phone}
                onChange={handleInputChange}
                error={errors?.phone}
                required
                placeholder="+91 99025 23333"
              />
            </div>

            <Input
              label={<div className="flex items-center">Street Address <span className="text-red-500 ml-1">*</span></div>}
              type="text"
              name="address"
              value={formData?.address}
              onChange={handleInputChange}
              error={errors?.address}
              required
              placeholder="House number, street name"
            />

            <Input
              label="Apartment, suite, etc. (optional)"
              type="text"
              name="apartment"
              value={formData?.apartment}
              onChange={handleInputChange}
              placeholder="Apartment, suite, unit, building, floor, etc."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label={<div className="flex items-center">City <span className="text-red-500 ml-1">*</span></div>}
                type="text"
                name="city"
                value={formData?.city}
                onChange={handleInputChange}
                error={errors?.city}
                required
                placeholder="Enter city"
              />
              <Select
                label={<div className="flex items-center">State <span className="text-red-500 ml-1">*</span></div>}
                options={stateOptions}
                value={formData?.state}
                onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                error={errors?.state}
                required
                placeholder="Select state"
              />
              <Input
                label={<div className="flex items-center">Pincode <span className="text-red-500 ml-1">*</span></div>}
                type="text"
                name="pincode"
                value={formData?.pincode}
                onChange={handleInputChange}
                error={errors?.pincode}
                required
                placeholder="560001"
                maxLength={6}
              />
            </div>

            <Checkbox
              label="Save this address for future orders"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e?.target?.checked)}
            />
          </div>
        )}

        {/* Error Display */}
        {errors?.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="default"
            iconName="ArrowRight"
            iconPosition="right"
            disabled={isLoading || (!selectedAddress && !showNewAddressForm) || (showNewAddressForm && !isFormValid())}
            loading={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue to Delivery'}
          </Button>
        </div>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-600 rounded">
          </div>
        )}
      </form>
    </div>
  );
};

export default ShippingForm;