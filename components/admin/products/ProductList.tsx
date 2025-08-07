import React, { useState, useEffect } from 'react';
import { Product } from '@/models/Product';
import Link from 'next/link';

interface ProductListProps {
  onEdit: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onEdit }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    try {
      const response = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }
      fetchProducts(); // Refresh the list
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Price</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Brand</th>
            <th className="py-3 px-6 text-center">Stock</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {products.map((product) => (
            <tr key={product._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                  {product.images && product.images.length > 0 && (
                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-full object-cover mr-2" />
                  )}
                  <span>{product.name}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-left">${product.originalPrice?.toFixed(2)}</td>
              <td className="py-3 px-6 text-left">{product.category?.name}</td>
              <td className="py-3 px-6 text-left">{product.brand?.name}</td>
              <td className="py-3 px-6 text-center">{product.stock}</td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  <button onClick={() => onEdit(product)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    {/* Edit Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(product.slug)} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    {/* Delete Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
