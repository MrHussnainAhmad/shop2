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

export const useAddresses = () => {
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!user?.id) {
        console.log('No authenticated user found');
        setAddresses([]);
        setLoading(false);
        return;
      }

      const email = user?.emailAddresses?.[0]?.emailAddress;
      if (!email) {
        console.log('No user email found');
        setAddresses([]);
        setLoading(false);
        return;
      }
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // Use the main addresses API which handles authentication internally
      const response = await fetch('/api/addresses', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        setAddresses(result || []);
      } else if (response.status === 404) {
        // User not found is not an error, just means no addresses yet
        console.log('User profile not found, setting empty addresses');
        setAddresses([]);
      } else {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || 'Failed to fetch addresses' };
        }
        
        // Don't treat user not found as an error
        if (errorData.error === 'User not found') {
          console.log('User profile not found, this is normal for first-time users');
          setAddresses([]);
        } else {
          setError(errorData.error || 'Failed to fetch addresses');
          console.error('Failed to fetch addresses:', errorData);
          setAddresses([]);
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Address fetch request was aborted');
        setError('Request timeout');
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        console.error("Error fetching addresses:", error);
      }
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAddresses();
    } else {
      // Clear addresses if user is not authenticated
      setAddresses([]);
      setLoading(false);
      setError(null);
    }
  }, [user?.id]);

  const getDefaultAddress = () => {
    return addresses.find(address => address.isDefault) || addresses[0] || null;
  };

  const refetch = () => {
    fetchAddresses();
  };

  return {
    addresses,
    loading,
    error,
    refetch,
    getDefaultAddress,
  };
};
