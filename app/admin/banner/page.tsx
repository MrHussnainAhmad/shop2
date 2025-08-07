"use client";

import React, { useState } from 'react';
import BannerList from '@/components/admin/banners/BannerList';
import BannerForm from '@/components/admin/banners/BannerForm';

interface Banner {
  _id: string;
  title: string;
  name?: string;
  description?: string;
  slug?: string;
  badge?: string;
  discountAmount?: number;
  image: string;
  imageUrl?: string;
  link?: string;
  isMiniBanner: boolean;
  createdAt: string;
}

const BannerAdminPage = () => {
  const [editingBanner, setEditingBanner] = useState<Banner | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setEditingBanner(undefined);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Banner Management</h1>
      
      <button
        onClick={() => {
          setEditingBanner(undefined);
          setShowForm(true);
        }}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Add New Banner
      </button>

      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">
            {editingBanner ? 'Edit Banner' : 'Add New Banner'}
          </h2>
          <BannerForm initialData={editingBanner} onSuccess={handleSuccess} />
          <button
            onClick={() => setShowForm(false)}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}

      {!showForm && <BannerList onEdit={handleEdit} />}
    </div>
  );
};

export default BannerAdminPage;
