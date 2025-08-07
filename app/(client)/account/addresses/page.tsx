"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin, Check } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useAlertModal } from "@/components/ui/alert-modal";

interface Address {
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

const AddressesPage = () => {
  const { user } = useUser();
  const modal = useAlertModal();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Address>({
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    name: "",
    streetAddress: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
    isDefault: false,
  });

  // Fetch addresses from MongoDB
  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      const userEmail = user?.emailAddresses?.[0]?.emailAddress;
      if (!userEmail) {
        console.error('No user email found');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/addresses?email=${userEmail}`);
      if (response.ok) {
        const result = await response.json();
        setAddresses(result);
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Failed to fetch addresses:', errorData);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch addresses (non-JSON response):', errorText);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingAddress?._id ? 'PUT' : 'POST';
      const addressData = {
        ...formData,
        email: user?.emailAddresses?.[0]?.emailAddress,
      };
      
      if (editingAddress?._id) {
        addressData._id = editingAddress._id;
      }

      const response = await fetch(editingAddress?._id ? `/api/addresses/${editingAddress._id}` : '/api/addresses', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      await fetchAddresses();
      setShowForm(false);
      setEditingAddress(null);
      resetForm();
    } catch (error) {
      console.error("Error saving address:", error);
      modal.alert("Error saving address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (addressId: string) => {
    const confirmed = await modal.confirm("Are you sure you want to delete this address?");
    if (confirmed) {
      try {
        const response = await fetch(`/api/addresses/${addressId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete address');
        }

        await fetchAddresses();
      } catch (error) {
        console.error("Error deleting address:", error);
        modal.alert("Error deleting address. Please try again.");
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch('/api/addresses/set-default', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          addressId,
          email: user?.emailAddresses?.[0]?.emailAddress 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set default address');
      }
      
      await fetchAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      modal.alert("Error setting default address. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      email: user?.emailAddresses?.[0]?.emailAddress || "",
      name: "",
      streetAddress: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
      phone: "",
      isDefault: false,
    });
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Please sign in to manage addresses</h2>
          <p className="text-gray-600">You need to be logged in to manage your addresses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Addresses</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingAddress(null);
            resetForm();
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Address
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading addresses...</p>
        </div>
      ) : (
        <>
          {/* Address List */}
          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-24 h-24 mx-auto text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold mb-2">No addresses found</h3>
              <p className="text-gray-600 mb-6">Add your first address to get started.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`p-4 border rounded-lg ${
                    address.isDefault ? "border-orange-500 bg-orange-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{address.name}</h3>
                    <div className="flex gap-2">
                      {address.isDefault && (
                        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(address._id!)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{address.streetAddress}</p>
                    {address.apartment && <p>{address.apartment}</p>}
                    <p>{address.city}, {address.state} {address.postalCode}</p>
                    <p>{address.country}</p>
                    <p>{address.phone}</p>
                  </div>
                  
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id!)}
                      className="mt-2 text-sm text-orange-500 hover:text-orange-700 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Address Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Home, Office, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apartment/Suite/Unit
                    </label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Set as default address</label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingAddress(null);
                        resetForm();
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Saving..." : editingAddress ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddressesPage;
