import React from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import { getWebData } from '@/lib/api';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const webData = await getWebData();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-gray-800 text-white p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/admin/products" className="block hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
                Products
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/categories" className="block hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
                Categories
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/brands" className="block hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
                Brands
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/banner" className="block hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
                Banner
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/orders" className="block hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
                Orders
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/webdata" className="block hover:bg-gray-700 p-2 rounded-md transition-colors duration-200">
                Web Data
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <AdminHeader headerLogo={webData?.headerLogo} />
        <div className="p-6 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
