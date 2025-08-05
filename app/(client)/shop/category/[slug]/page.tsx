import React from 'react';
import Container from '@/components/common/Container';
import DynamicBreadcrumb from '@/components/common/DynamicBreadcrumb';
import { getAllProducts, getCategories, getAllBrands } from '@/sanity/queries';
import ShopPageClient from '../../ShopPageClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const categories = await getCategories();
  const selectedCategory = categories?.find((category: any) => category.slug?.current === slug);
    
    if (!selectedCategory) {
      return {
        title: 'Category Not Found',
        description: 'The requested category could not be found.'
      };
    }
    
    return {
      title: `${selectedCategory.name} Products | Shop`,
      description: `Browse all ${selectedCategory.name} products. Find the best ${selectedCategory.name} items with great deals and fast shipping.`,
      keywords: [`${selectedCategory.name}`, `${selectedCategory.name} products`, 'shop', 'ecommerce'],
    };
  } catch (error) {
    return {
      title: 'Category Shop',
      description: 'Shop by category and find your favorite products.'
    };
  }
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  
  try {
    const [products, categories, brands] = await Promise.all([
      getAllProducts(),
      getCategories(),
      getAllBrands(),
    ]);

    // Find the selected category
  const selectedCategory = categories?.find((category: any) => category.slug?.current === slug);

    if (!selectedCategory) {
      return notFound();
    }

    // Create breadcrumb items
    const breadcrumbItems = [
      { label: 'Shop', href: '/shop' },
      { label: `Category: ${selectedCategory.name}` }
    ];

    return (
      <Container className="py-4">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <ShopPageClient 
          initialProducts={products || []}
          initialCategories={categories || []}
          initialBrands={brands || []}
          preSelectedCategorySlug={slug}
        />
      </Container>
    );
  } catch (error) {
    console.error('Error loading category shop data:', error);
    return (
      <Container className="py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-600">Error loading shop data. Please try again later.</div>
        </div>
      </Container>
    );
  }
};

export default CategoryPage;
