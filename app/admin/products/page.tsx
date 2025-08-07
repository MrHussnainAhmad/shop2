"use client";
import React, { useState } from 'react';
import ProductList from '@/components/admin/products/ProductList';
import ProductForm from '@/components/admin/products/ProductForm';
import { Product } from '@/models/Product';

const ProductsAdminPage = () => {
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setEditingProduct(undefined);
    setShowForm(false);
    // You might want to refetch products here if ProductList doesn't do it automatically
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Product Management</h1>
      <button
        onClick={() => {
          setEditingProduct(undefined);
          setShowForm(true);
        }}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Add New Product
      </button>

      {showForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <ProductForm initialData={editingProduct} onSuccess={handleSuccess} />
          <button
            onClick={() => setShowForm(false)}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}

      {!showForm && <ProductList onEdit={handleEdit} />}
    </div>
  );
};

export default ProductsAdminPage;