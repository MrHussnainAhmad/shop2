import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/models/Product'; // Assuming you have a Product type/interface
import { getCategories, getAllBrands } from '@/lib/api'; // Assuming these functions exist

interface ProductFormProps {
  initialData?: Product; // For editing existing products
  onSuccess: () => void; // Callback after successful submission
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSuccess }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Product>>(initialData || {});
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        const fetchedBrands = await getAllBrands();
        setBrands(fetchedBrands);
      } catch (err) {
        console.error("Failed to fetch categories or brands:", err);
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
          images: [...(prev.images || []), result.secure_url],
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
      const url = initialData ? `/api/products/${initialData.slug}` : '/api/products';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      onSuccess();
      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-lg">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
        <input type="text" id="slug" name="slug" value={formData.slug || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
      </div>
      <div>
        <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">Original Price</label>
        <input type="number" id="originalPrice" name="originalPrice" value={formData.originalPrice || 0} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount (%)</label>
        <input type="number" id="discount" name="discount" value={formData.discount || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU</label>
        <input type="text" id="sku" name="sku" value={formData.sku || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images</label>
        <input type="file" id="images" name="images" onChange={handleImageChange} multiple className="mt-1 block w-full" />
        <div className="flex space-x-2 mt-2">
          {formData.images?.map((img, index) => (
            <img key={index} src={img} alt="Product Image" className="w-20 h-20 object-cover rounded-md" />
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select id="category" name="category" value={formData.category || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          <option value="">Select a category</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
        <select id="brand" name="brand" value={formData.brand || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          <option value="">Select a brand</option>
          {brands.map(b => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
        <input type="number" id="stock" name="stock" value={formData.stock || 0} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select id="status" name="status" value={formData.status || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          <option value="">Select status</option>
          <option value="Hot">Hot</option>
          <option value="New">New</option>
          <option value="Sale">Sale</option>
          <option value="Ending">Ending</option>
          <option value="Last Piece">Last Piece</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>
      <div>
        <label htmlFor="variant" className="block text-sm font-medium text-gray-700">Variant</label>
        <input type="text" id="variant" name="variant" value={formData.variant || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div className="flex items-center">
        <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
        <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">Featured Product</label>
      </div>
      <div className="flex items-center">
        <input type="checkbox" id="isOnDeal" name="isOnDeal" checked={formData.isOnDeal || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
        <label htmlFor="isOnDeal" className="ml-2 block text-sm text-gray-900">On Deal</label>
      </div>
      {formData.isOnDeal && (
        <div>
          <label htmlFor="dealPercentage" className="block text-sm font-medium text-gray-700">Deal Percentage (%)</label>
          <input type="number" id="dealPercentage" name="dealPercentage" value={formData.dealPercentage || 0} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
      )}
      {/* Add fields for customAttributes, couponCode, tags if needed */}
      <button type="submit" disabled={loading} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
        {loading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm;
