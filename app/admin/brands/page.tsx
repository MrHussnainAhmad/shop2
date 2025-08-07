"use client";
import React, { useState } from 'react';
import BrandList from '@/components/admin/brands/BrandList';
import BrandForm from '@/components/admin/brands/BrandForm';
import { Brand } from '@/models/Brand';

const BrandsAdminPage = () => {
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setEditingBrand(undefined);
    setShowForm(false);
    // You might want to refetch brands here if BrandList doesn't do it automatically
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Brand Management</h1>
      <button
        onClick={() => {
          setEditingBrand(undefined);
          setShowForm(true);
        }}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Add New Brand
      </button>

      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">
            {editingBrand ? 'Edit Brand' : 'Add New Brand'}
          </h2>
          <BrandForm initialData={editingBrand} onSuccess={handleSuccess} />
          <button
            onClick={() => setShowForm(false)}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}

      {!showForm && <BrandList onEdit={handleEdit} />}
    </div>
  );
};

export default BrandsAdminPage;