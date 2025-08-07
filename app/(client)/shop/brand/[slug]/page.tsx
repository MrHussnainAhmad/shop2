import React from 'react';
import Container from '@/components/common/Container';
import DynamicBreadcrumb from '@/components/common/DynamicBreadcrumb';
import { getAllProducts, getCategories, getAllBrands } from '@/lib/api';
import ShopPageClient from '../../ShopPageClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface BrandPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const brands = await getAllBrands();
    const selectedBrand = brands?.find(brand => brand.slug?.current === slug);
    
    if (!selectedBrand) {
      return {
        title: 'Brand Not Found',
        description: 'The requested brand could not be found.'
      };
    }
    
    return {
      title: `${selectedBrand.name} Products | Shop`,
      description: `Browse all ${selectedBrand.name} products. Find the best ${selectedBrand.name} items with great deals and fast shipping.`,
      keywords: [`${selectedBrand.name}`, `${selectedBrand.name} products`, 'shop', 'ecommerce'],
    };
  } catch (error) {
    return {
      title: 'Brand Shop',
      description: 'Shop by brand and find your favorite products.'
    };
  }
}

const BrandPage = async ({ params }: BrandPageProps) => {
  const { slug } = await params;
  
  try {
    const [products, categories, brands] = await Promise.all([
      getAllProducts(),
      getCategories(),
      getAllBrands(),
    ]);

    // Find the selected brand
    const selectedBrand = brands?.find(brand => brand.slug?.current === slug);

    if (!selectedBrand) {
      return notFound();
    }

    // Create breadcrumb items
    const breadcrumbItems = [
      { label: 'Shop', href: '/shop' },
      { label: `Brand: ${selectedBrand.name}` }
    ];

    return (
      <Container className="py-4">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <ShopPageClient 
          initialProducts={products || []}
          initialCategories={categories || []}
          initialBrands={brands || []}
          preSelectedBrandSlug={slug}
        />
      </Container>
    );
  } catch (error) {
    console.error('Error loading brand shop data:', error);
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-600">Error loading shop data. Please try again later.</div>
        </div>
      </Container>
    );
  }
};

export default BrandPage;
