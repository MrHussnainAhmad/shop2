"use client";

import React, { useState } from 'react';
import { useAddressesByEmail } from '@/hooks/useAddressesByEmail';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from 'react-hot-toast';

export default function TestAddressesPage() {
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
    isDefault: false
  });

  const { 
    addresses, 
    loading, 
    error, 
    createAddress, 
    deleteAddress 
  } = useAddressesByEmail(email || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      await createAddress({
        ...formData,
        email: email
      });
      
      // Reset form
      setFormData({
        name: '',
        streetAddress: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        phone: '',
        isDefault: false
      });
      
      toast.success('Address created successfully!');
    } catch (error) {
      toast.error('Failed to create address');
    }
  };

  const handleDelete = async (addressId: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      try {
        await deleteAddress(addressId);
        toast.success('Address deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Test Email-Based Address System</h1>
      
      {/* Email Input */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Email Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Enter Email to Test:</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Address Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="apartment">Apartment/Suite (Optional)</Label>
                <Input
                  id="apartment"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading || !email}>
                {loading ? 'Creating...' : 'Create Address'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Addresses List */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Addresses {email && `for ${email}`}</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="text-red-500 mb-4">Error: {error}</p>
            )}
            
            {loading && (
              <p className="text-gray-500">Loading addresses...</p>
            )}
            
            {!loading && addresses.length === 0 && (
              <p className="text-gray-500">
                {email ? 'No addresses found for this email.' : 'Enter an email to view addresses.'}
              </p>
            )}
            
            {!loading && addresses.length > 0 && (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{address.name}</h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(address._id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>{address.streetAddress}</p>
                      {address.apartment && <p>{address.apartment}</p>}
                      <p>{address.city}, {address.state} {address.postalCode}</p>
                      <p>{address.country}</p>
                      <p>Phone: {address.phone}</p>
                      <p>Email: {address.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Enter an email address in the field above (e.g., "test@example.com")</li>
            <li>Fill out the address form and click "Create Address"</li>
            <li>The address will be automatically saved and linked to that email</li>
            <li>Try different emails to see how addresses are isolated per email</li>
            <li>Delete addresses using the "Delete" button</li>
            <li>This same system will work in your checkout form automatically!</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
