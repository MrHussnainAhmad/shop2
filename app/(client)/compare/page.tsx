"use client";

import React from "react";
import Container from "@/components/common/Container";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import Link from "next/link";
import { getProductBySlugClient, searchProductsClient } from "../../../sanity/queries/client";
import { Product } from "@/sanity.types";
import AddToCart from "@/components/common/AddToCart";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

// Define the comparison properties
const comparisonProperties = [
  { key: 'images', label: 'Product Image' },
  { key: 'name', label: 'Product Name' },
  { key: 'originalPrice', label: 'Original Price' },
  { key: 'finalPrice', label: 'Final Price' },
  { key: 'discount', label: 'Discount (%)' },
  { key: 'brand', label: 'Brand' },
  { key: 'category', label: 'Category' },
  { key: 'sku', label: 'SKU' },
  { key: 'stock', label: 'Stock Quantity' },
  { key: 'status', label: 'Product Status' },
  { key: 'variant', label: 'Product Variant' },
  { key: 'featured', label: 'Featured Product' },
  { key: 'description', label: 'Description' },
  { key: 'customAttributes', label: 'Custom Attributes' },
  { key: 'tags', label: 'Tags' },
];

const ComparePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [isSearching, setIsSearching] = React.useState(false);

  // Load products from URL params on mount
  React.useEffect(() => {
    const productsParam = searchParams.get('products');
    if (productsParam) {
      const productSlugs = productsParam.split(',');
      const fetchProducts = async () => {
        const fetchedProducts = await Promise.all(
          productSlugs.map(slug => getProductBySlug(slug.trim()))
        );
        setProducts(fetchedProducts.filter((product): product is Product => product !== null));
      };
      fetchProducts();
    }
  }, [searchParams]);

  // Update URL when products change
  React.useEffect(() => {
    if (products.length > 0) {
      const slugs = products.map(p => p.slug?.current).filter(Boolean).join(',');
      const newUrl = `/compare?products=${slugs}`;
      router.replace(newUrl, { scroll: false });
    } else {
      router.replace('/compare', { scroll: false });
    }
  }, [products, router]);

  // Generate dynamic breadcrumb
  const breadcrumbItems = React.useMemo(() => {
    if (products.length === 0) {
      return [{ label: "Compare" }];
    }
    
    const productNames = products.map(p => p.name).join(" vs ");
    return [
      { label: "Compare", href: "/compare" },
      { label: productNames }
    ];
  }, [products]);

  // Search products
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.trim().length > 2) {
      setIsSearching(true);
      try {
        const results = await searchProducts(term.trim());
        setSearchResults(results || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Add product to comparison
  const addProductToCompare = (product: Product) => {
    if (products.length < 3 && !products.find(p => p._id === product._id)) {
      setProducts(prev => [...prev, product]);
    }
    setSearchTerm("");
    setShowSearchResults(false);
    setSearchResults([]);
  };

  // Remove product from comparison
  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p._id !== productId));
  };

  return (
    <div className="bg-custom-body py-10 min-h-screen">
      <Container>
        <DynamicBreadcrumb items={breadcrumbItems} />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-custom-navBar mb-8">
            Product Comparison
          </h1>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {/* Add Product Search */}
            {products.length < 3 && (
              <div className="mb-6">
                <div className="max-w-md mx-auto relative">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products by name to add to comparison..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-navBar focus:border-transparent"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                      {isSearching ? (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((product) => (
                          <div
                            key={product._id}
                            onClick={() => addProductToCompare(product)}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0">
                                {product.images?.[0] && (
                                  <img 
                                    src={getImageUrl(product.images[0])}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded"
                                  />
                                )}
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-gray-800">{product.name}</p>
                                <p className="text-sm text-gray-500">
                                  ${product.originalPrice?.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">No products found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Comparison Table */}
            {products.length > 0 ? (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 bg-gray-100"></th>
                      {products.map((product, index) => (
                        <th key={product._id} className="text-center py-3 px-4 font-medium text-gray-700 bg-blue-50 border-l border-gray-300 relative">
                          <div className="flex items-center justify-center">
                            <span>Product {index + 1}</span>
                            <button
                              onClick={() => removeProduct(product._id)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm"
                              title="Remove product"
                            >
                              <X size={12} className="stroke-2" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonProperties.map((property, index) => (
                      <tr key={property.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-3 px-4 font-medium text-gray-700 border-b border-gray-200 bg-gray-100">
                          {property.label}
                        </td>
                        {products.map((product) => (
                          <td key={product._id} className="py-3 px-4 text-center border-b border-l border-gray-200">
                            {getProductValue(product, property.key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    
                    {/* Add to Cart Row */}
                    <tr className="bg-blue-50 border-t-2 border-blue-200">
                      <td className="py-4 px-4 font-bold text-gray-800 border-b border-gray-200 bg-blue-100">
                        Add to Cart
                      </td>
                      {products.map((product) => (
                        <td key={product._id} className="py-4 px-4 text-center border-b border-l border-gray-200">
                          <div className="flex justify-center">
                            <AddToCart 
                              product={product} 
                              variant="default" 
                              className="text-sm px-3 py-2 w-full max-w-[150px]"
                            />
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No products selected for comparison.</p>
                <p className="text-sm text-gray-500">
                  Search and add products above to start comparing.
                </p>
              </div>
            )}
            
            <div className="mt-8">
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-custom-sec1 text-custom-navBar font-semibold rounded-lg hover:bg-custom-sec2 transition-colors border border-custom-navBar/20"
              >
                Back to Shopping
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

// Helper functions
const getImageUrl = (image: any): string => {
  if (image._type === 'image') {
    return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${image.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`;
  } else if (image._type === 'imageUrl' && image.url) {
    return image.url;
  }
  return '/placeholder-product.jpg';
};

const getProductValue = (product: Product, key: string) => {
  if (!product) return '-';
  
  switch (key) {
    case 'images':
      if (product.images && product.images.length > 0) {
        return (
          <div className="flex justify-center">
            <img 
              src={getImageUrl(product.images[0])}
              alt={product.name || 'Product'}
              className="w-16 h-16 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-product.jpg';
              }}
            />
          </div>
        );
      }
      return (
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        </div>
      );
      
    case 'brand':
      return (product.brand as unknown as ResolvedReference)?.name || '-';
      
    case 'category':
      return (product.category as unknown as ResolvedReference)?.name || '-';
      
    case 'originalPrice':
      return product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : '-';
      
    case 'finalPrice':
      if (product.originalPrice) {
        const discount = product.discount || 0;
        const finalPrice = product.originalPrice - (product.originalPrice * discount / 100);
        return `$${finalPrice.toFixed(2)}`;
      }
      return '-';
      
    case 'discount':
      return product.discount ? `${product.discount}%` : '0%';
      
    case 'stock':
      return product.stock !== undefined ? product.stock.toString() : '-';
      
    case 'featured':
      return product.featured ? 'Yes' : 'No';
      
    case 'description':
      return product.description ? (
        <div className="max-w-xs">
          <p className="text-xs truncate" title={product.description}>
            {product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}
          </p>
        </div>
      ) : '-';
      
    case 'customAttributes':
      if (product.customAttributes && product.customAttributes.length > 0) {
        return (
          <div className="max-w-xs">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-center font-medium">Attribute</th>
                  <th className="px-2 py-1 text-center font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {product.customAttributes.map((attr, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 py-1 font-medium text-gray-700 text-center">
                      {attr.name}
                    </td>
                    <td className="px-2 py-1 text-gray-600 text-center">
                      {attr.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return '-';
      
    case 'tags':
      if (product.tags && product.tags.length > 0) {
        return (
          <div className="max-w-xs">
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            {product.tags.length > 3 && (
              <div className="text-xs text-gray-500 mt-1">+{product.tags.length - 3} more</div>
            )}
          </div>
        );
      }
      return '-';
      
    case 'status':
      return product.status || '-';
      
    case 'variant':
      return product.variant || '-';
      
    case 'sku':
      return product.sku || '-';
      
    case 'name':
      return (
        <div className="max-w-xs">
          <p className="font-medium text-sm truncate" title={product.name}>
            {product.name}
          </p>
        </div>
      );
      
    default:
      const value = (product as unknown as Record<string, unknown>)[key];
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value).substring(0, 50) + '...';
      }
      return value?.toString() || '-';
  }
};

interface ResolvedReference {
  _id: string;
  name: string;
  slug?: {
    current: string;
  };
}

export default ComparePage;
