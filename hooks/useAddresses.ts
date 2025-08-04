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
      
      const userEmail = user?.emailAddresses?.[0]?.emailAddress;
      if (!userEmail) {
        console.error('No user email found');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/addresses?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const result = await response.json();
        setAddresses(result);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch addresses');
        console.error('Failed to fetch addresses:', errorData);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      console.error("Error fetching addresses:", error);
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
