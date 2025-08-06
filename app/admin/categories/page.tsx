"use client";
import React, { useState } from 'react';
import CategoryList from '@/components/admin/categories/CategoryList';
import CategoryForm from '@/components/admin/categories/CategoryForm';
import { Category } from '@/models/Category';

const CategoriesAdminPage = () => {
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setEditingCategory(undefined);
    setShowForm(false);
    // You might want to refetch categories here if CategoryList doesn't do it automatically
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      <button
        onClick={() => {
          setEditingCategory(undefined);
          setShowForm(true);
        }}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Add New Category
      </button>

      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h2>
          <CategoryForm initialData={editingCategory} onSuccess={handleSuccess} />
          <button
            onClick={() => setShowForm(false)}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}

      {!showForm && <CategoryList onEdit={handleEdit} />}
    </div>
  );
};

export default CategoriesAdminPage;