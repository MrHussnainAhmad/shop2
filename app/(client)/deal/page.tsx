import React from 'react';
import { getDealProducts } from '@/lib/api';
import { ProductCard } from '@/components/common/ProductCard';
import DynamicBreadcrumb from '@/components/common/DynamicBreadcrumb';

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  images?: any[];
  originalPrice: number;
  discount?: number;
  sku: string;
  stock: number;
  status?: string;
  variant?: string;
  category?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  brand?: {
    _id: string;
    name: string;
    slug: { current: string };
  };
  featured?: boolean;
  customAttributes?: any[];
  tags?: string[];
  couponCode?: {
    code: string;
    discount: number;
  };
  isOnDeal?: boolean;
  dealPercentage?: number;
}

const DealPage = async () => {
  const dealProducts: Product[] = await getDealProducts();

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Deals', href: '/deal' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Special Deals
          </h1>
          <p className="text-lg text-gray-600">
            Exclusive deals and discounts on selected products. Deal products cannot be combined with coupon or voucher codes.
          </p>
        </div>

        {dealProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg
                  className="mx-auto w-24 h-24 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Deals Available
              </h3>
              <p className="text-gray-500">
                Check back later for amazing deals and discounts!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Found {dealProducts.length} deal{dealProducts.length !== 1 ? 's' : ''}
                </p>
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  🔥 Limited Time Offers
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dealProducts.map((product) => (
                <div key={product._id} className="relative">
                  {/* Deal Badge */}
                  <div className="absolute top-2 left-2 z-10 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                    DEAL {product.dealPercentage}% OFF
                  </div>
                  
                  <ProductCard
                    _id={product._id}
                    name={product.name}
                    slug={product.slug}
                    description={product.description}
                    images={product.images}
                    originalPrice={product.originalPrice}
                    discount={product.discount}
                    sku={product.sku}
                    stock={product.stock}
                    status={product.status}
                    variant={product.variant}
                    category={product.category}
                    brand={product.brand}
                    featured={product.featured}
                    customAttributes={product.customAttributes}
                    tags={product.tags}
                    couponCode={product.couponCode}
                    isOnDeal={product.isOnDeal}
                    dealPercentage={product.dealPercentage}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DealPage;
