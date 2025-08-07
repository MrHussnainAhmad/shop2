"use client"
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export interface Address {
  _id?: string;
  email: string;
  name: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export const useCartAddresses = () => {
  const { user, isLoaded } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAddresses = async () => {
    // Only fetch if user is authenticated
    if (!isLoaded || !user?.id) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/addresses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        setAddresses(result || []);
      } else if (response.status === 404) {
        // User not found is normal for first-time users
        setAddresses([]);
      } else {
        // Silent fail for cart page - don't show errors
        console.log('Failed to fetch addresses, using empty array');
        setAddresses([]);
      }
    } catch (error) {
      // Silent fail for cart page
      console.log('Error fetching addresses:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchAddresses();
    }
  }, [user?.id, isLoaded]);

  const getDefaultAddress = () => {
    return addresses.find(address => address.isDefault) || addresses[0] || null;
  };

  return {
    addresses,
    loading,
    getDefaultAddress,
    hasAddresses: addresses.length > 0,
    isAuthenticated: !!user?.id,
  };
};
