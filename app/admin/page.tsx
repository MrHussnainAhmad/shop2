import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to the Admin Dashboard!</h1>
      <p className="text-lg text-gray-700 mb-8">
        This is your central hub for managing all aspects of your e-commerce store. Use the navigation 
        sidebar on the left to access various sections and control your website's content and operations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Products Management</h2>
          <p className="text-gray-600">
            Add new products, edit existing ones, manage inventory, prices, images, and product details.
          </p>
          <p className="text-sm text-gray-500 mt-2">Go to: <code className="bg-gray-200 p-1 rounded">/admin/products</code></p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Categories Management</h2>
          <p className="text-gray-600">
            Create, update, and organize product categories to help customers browse your store efficiently.
          </p>
          <p className="text-sm text-gray-500 mt-2">Go to: <code className="bg-gray-200 p-1 rounded">/admin/categories</code></p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Brands Management</h2>
          <p className="text-gray-600">
            Manage your product brands, including adding new brands and updating their details and logos.
          </p>
          <p className="text-sm text-gray-500 mt-2">Go to: <code className="bg-gray-200 p-1 rounded">/admin/brands</code></p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Orders Management</h2>
          <p className="text-gray-600">
            View and manage customer orders, track their status, and process fulfillments.
          </p>
          <p className="text-sm text-gray-500 mt-2">Go to: <code className="bg-gray-200 p-1 rounded">/admin/orders</code></p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Web Data Management</h2>
          <p className="text-gray-600">
            Control static content like About Us, Terms, Privacy Policy, FAQs, Help, social media links, 
            contact information, and website logos.
          </p>
          <p className="text-sm text-gray-500 mt-2">Go to: <code className="bg-gray-200 p-1 rounded">/admin/webdata</code></p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-md">
        <p className="font-semibold">Important:</p>
        <p>Always ensure your data is saved after making changes. For any issues, please consult the documentation or contact support.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
