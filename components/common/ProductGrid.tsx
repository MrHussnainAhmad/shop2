import React from 'react'
import { getFeaturedProducts } from "@/lib/api";
import Container from './Container';
import Title from './Title';
import ProductCard from './ProductCard';
import { FEATURED_PRODUTSResult } from '@/sanity.types';

const ProductGrid = async () => {
  const products = await getFeaturedProducts();
  return (
    <Container className='mt-10 lg:mt-20 p-5 lg:p-7 rounded-md bg-custom-sec1'>
      <div className="text-center">
        <Title className="font-semibold">Featured Products</Title>
        <p className="text-sm font-medium">Check & Get Your Desired Product</p>
      </div>
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mt-5'>
        {products?.map((product: FEATURED_PRODUTSResult[0]) => (
          <ProductCard key={product?._id} product={product} />
        ))}
      </div>
    </Container>
  );
}

export default ProductGrid 