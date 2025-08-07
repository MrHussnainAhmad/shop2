"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Category } from '@/models/Category'; // Assuming you have a Category type/interface
import { getCategories } from '@/lib/api'; // Assuming this function exists

interface CategoryFormProps {
  initialData?: Category; // For editing existing categories
  onSuccess: () => void; // Callback after successful submission
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSuccess }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Category>>(initialData || {});
  const [parentCategories, setParentCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await getCategories();
        setParentCategories(fetchedCategories);
      } catch (err) {
        console.error("Failed to fetch parent categories:", err);
        setError("Failed to load form data.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLoading(true);
      setError(null);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const result = await response.json();
        setFormData(prev => ({
          ...prev,
          image: result.secure_url,
        }));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? `/api/categories/${initialData.slug}` : '/api/categories';

      await axios({
        method,
        url,
        data: formData,
      });

      toast.success(initialData ? 'Category updated.' : 'Category created.');
      onSuccess();
      router.push('/admin/categories');
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to save category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <input type="text" id="slug" name="slug" value={formData.slug || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
        <input type="file" id="image" name="image" onChange={handleImageUpload} className="mt-1 block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        {formData.image && (
          <div className="mt-2">
            <img src={formData.image} alt="Category Image" className="w-32 h-32 object-cover rounded-md border border-gray-200 shadow-sm" />
          </div>
        )}
      </div>
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL (Alternative)</label>
        <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
      </div>
      <div>
        <label htmlFor="parent" className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
        <select id="parent" name="parent" value={formData.parent || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">No Parent</option>
          {parentCategories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center mt-4">
        <input type="checkbox" id="featured" name="featured" checked={formData.featured || false} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">Featured Category</label>
      </div>
      <button type="submit" disabled={loading} className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed">
        {loading ? 'Saving...' : initialData ? 'Update Category' : 'Add Category'}
      </button>
    </form>
  );
};
export default CategoryForm;
