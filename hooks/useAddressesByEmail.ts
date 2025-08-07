import { useState, useEffect } from 'react';

interface Address {
  _id: string;
  name: string;
  email: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export const useAddressesByEmail = (email: string | null) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    if (!email) {
      setAddresses([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching addresses for email:', email);
      const response = await fetch(`/api/addresses/email?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched addresses:', data);
      setAddresses(data || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch addresses');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const createAddress = async (addressData: Omit<Address, '_id'>) => {
    if (!email) {
      throw new Error('Email is required to create address');
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Creating address for email:', email);
      const response = await fetch('/api/addresses/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...addressData,
          email: email // Ensure email is always included
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const newAddress = await response.json();
      console.log('Created address:', newAddress);
      
      // Refresh the addresses list
      await fetchAddresses();
      
      return newAddress;
    } catch (err) {
      console.error('Error creating address:', err);
      setError(err instanceof Error ? err.message : 'Failed to create address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (addressId: string, addressData: Partial<Address>) => {
    if (!email) {
      throw new Error('Email is required to update address');
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Updating address:', addressId);
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...addressData,
          email: email // Ensure email is always included
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const updatedAddress = await response.json();
      console.log('Updated address:', updatedAddress);
      
      // Refresh the addresses list
      await fetchAddresses();
      
      return updatedAddress;
    } catch (err) {
      console.error('Error updating address:', err);
      setError(err instanceof Error ? err.message : 'Failed to update address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Deleting address:', addressId);
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      console.log('Deleted address successfully');
      
      // Refresh the addresses list
      await fetchAddresses();
    } catch (err) {
      console.error('Error deleting address:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [email]);

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  };
};
