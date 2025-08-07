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
      
      const clerkUserId = user?.id;
      if (!clerkUserId) {
        console.error('No Clerk user ID found');
        setLoading(false);
        return;
      }
      
      // Add timeout to fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`/api/addresses?clerkId=${clerkUserId}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        setAddresses(result || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch addresses');
        console.error('Failed to fetch addresses:', errorData);
        // Set empty array as fallback
        setAddresses([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      console.error("Error fetching addresses:", error);
      // Set empty array as fallback
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      fetchAddresses();
    }
  }, [user]);

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
