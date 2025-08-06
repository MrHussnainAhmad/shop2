import React from 'react';
import Link from 'next/link';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/admin/products" className="block hover:bg-gray-700 p-2 rounded">
                Products
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/categories" className="block hover:bg-gray-700 p-2 rounded">
                Categories
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/brands" className="block hover:bg-gray-700 p-2 rounded">
                Brands
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/orders" className="block hover:bg-gray-700 p-2 rounded">
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
