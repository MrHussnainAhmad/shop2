import React from "react";
import { getProductBySlug, getAllProductsDebug, getFeaturedProducts } from "@/sanity/queries";
import Container from "@/components/common/Container";
import Breadcrumb from "@/components/common/Breadcrumb";
import ShareBadge from "@/components/pages/singleProduct/ShareBadge";
import { Product } from "@/sanity.types";
import ImageView from "@/components/pages/singleProduct/ImageView";
import ProductDetails from "@/components/pages/singleProduct/ProductDetails";

const singleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product:Product = await getProductBySlug(slug);

  // Debug logging
  console.log('Product slug:', slug);
  console.log('Product data:', product);
  console.log('Product images:', product?.images);
  console.log('Product name:', product?.name);

  // Also fetch and log available products for debugging
  const allProducts = await getAllProductsDebug();
  const featuredProducts = await getFeaturedProducts();
  console.log('All available products:', allProducts);
  console.log('Featured products:', featuredProducts);

  if (!product) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found for slug: {slug}</h1>
        <div className="text-left max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-2">Available products:</h2>
          <ul className="list-disc pl-5">
            {allProducts?.map((p: any) => (
              <li key={p._id}>
                <strong>{p.name}</strong> - slug: {p.slug?.current || 'No slug'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  const breadcrumbItems = [
    { label: "Products", href: "/" },
    { label: product.name }
  ];
  
  return (
    <div className="bg-custom-body py-10">
      <Container>
        <Breadcrumb items={breadcrumbItems} />
        <ShareBadge product={product} />
        <div className="flex flex-col gap-5 md:flex-row">
            {product?.images && product.images.length > 0 ? (
              <ImageView images={product?.images} isStock={product?.stock}/>
            ) : (
              <div className="w-full md:w-2/5 space-y-2 md:space-y-4">
                <div className="w-full max-h-[500px] min-h-[450px] border border-black/10 rounded-md bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">No images available</p>
                </div>
              </div>
            )}
            <div className="w-full md:w-3/5">
              <ProductDetails product={product} />
            </div>
        </div>
      </Container>
    </div>
  );
};

export default singleProductPage;
