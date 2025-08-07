import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

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

interface BannerListProps {
  onEdit: (banner: Banner) => void;
}

const BannerList: React.FC<BannerListProps> = ({ onEdit }) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/banners');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setBanners(data);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch banners:", e);
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeleting(id);
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      setBanners(banners.filter(banner => banner._id !== id));
      toast.success('Banner deleted successfully!');
    } catch (e: any) {
      console.error("Failed to delete banner:", e);
      toast.error(`Failed to delete banner: ${e.message}`);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading banners...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={fetchBanners}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No banners found.</p>
        <p className="text-sm text-gray-400">Create your first banner using the form above.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Banner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {banners.map((banner) => (
              <tr key={banner._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-24">
                      <img
                        className="h-16 w-24 object-cover rounded-md border border-gray-200"
                        src={banner.image}
                        alt={banner.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-banner.svg';
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {banner.title}
                      </div>
                      {banner.name && (
                        <div className="text-sm text-gray-500">
                          {banner.name}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {banner.description && (
                      <p className="truncate max-w-xs" title={banner.description}>
                        {banner.description}
                      </p>
                    )}
                    {banner.badge && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                        {banner.badge}
                      </span>
                    )}
                    {banner.discountAmount && (
                      <p className="text-green-600 font-semibold text-sm mt-1">
                        {banner.discountAmount}% OFF
                      </p>
                    )}
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    banner.isMiniBanner 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {banner.isMiniBanner ? 'Mini Banner' : 'Main Banner'}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(banner)}
                      className="text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded bg-indigo-50 hover:bg-indigo-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id, banner.title)}
                      disabled={deleting === banner._id}
                      className="text-red-600 hover:text-red-900 px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === banner._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannerList;
