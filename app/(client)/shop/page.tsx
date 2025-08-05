import React from 'react';
import Container from '@/components/common/Container';
import DynamicBreadcrumb from '@/components/common/DynamicBreadcrumb';
import { getAllProducts, getCategories, getAllBrands } from '@/sanity/queries';
import ShopPageClient from './ShopPageClient';

const ShopPage = async () => {
  try {
    const [products, categories, brands] = await Promise.all([
      getAllProducts(),
      getCategories(),
      getAllBrands(),
    ]);

    return (
      <Container className="py-4">
        <DynamicBreadcrumb items={[{ label: 'Shop' }]} />
        <ShopPageClient 
          initialProducts={products || []}
          initialCategories={categories || []}
          initialBrands={brands || []}
        />
      </Container>
    );
  } catch (error) {
    console.error('Error loading shop data:', error);
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-600">Error loading shop data. Please try again later.</div>
        </div>
      </Container>
    );
  }
};

export default ShopPage;
