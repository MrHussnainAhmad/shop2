import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Banner {
  _id?: string;
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
  createdAt?: string;
}

interface BannerFormProps {
  initialData?: Banner;
  onSuccess: () => void;
}

const BannerForm: React.FC<BannerFormProps> = ({ initialData, onSuccess }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Banner>>(initialData || {
    title: '',
    image: '',
    isMiniBanner: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setError(null);

      try {
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const result = await response.json();
        setFormData(prev => ({
          ...prev,
          image: result.imageUrl,
        }));
        toast.success('Image uploaded successfully!');
      } catch (err: any) {
        setError(err.message);
        toast.error(`Image upload failed: ${err.message}`);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title || !formData.image) {
        throw new Error('Title and image are required');
      }

      const isEditing = !!formData._id;
      const apiUrl = isEditing ? `/api/banners/${formData._id}` : '/api/banners';
      const httpMethod = isEditing ? 'PUT' : 'POST';

      const response = await axios({
        url: apiUrl,
        method: httpMethod,
        data: formData,
      });

      toast.success(isEditing ? 'Banner updated successfully!' : 'Banner created successfully!');
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save banner';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="badge" className="block text-sm font-medium text-gray-700 mb-1">
            Badge
          </label>
          <input
            type="text"
            id="badge"
            name="badge"
            value={formData.badge || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Discount Amount
          </label>
          <input
            type="number"
            id="discountAmount"
            name="discountAmount"
            value={formData.discountAmount || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
            Link
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Banner Image *
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
          className="mt-1 block w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={uploading}
        />
        {formData.image && (
          <div className="mt-2">
            <img
              src={formData.image}
              alt="Banner Preview"
              className="w-32 h-20 object-cover rounded border border-gray-200 shadow-sm"
            />
          </div>
        )}
        {uploading && <p className="text-blue-500 text-sm mt-1">Uploading image...</p>}
      </div>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="isMiniBanner"
          name="isMiniBanner"
          checked={formData.isMiniBanner || false}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isMiniBanner" className="ml-2 block text-sm text-gray-900">
          Mini Banner
        </label>
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : initialData ? 'Update Banner' : 'Add Banner'}
      </button>
    </form>
  );
};

export default BannerForm;
