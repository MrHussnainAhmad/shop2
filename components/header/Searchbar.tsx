"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";
import { searchProductsClient } from "../../sanity/queries/client";
import { useRouter } from "next/navigation";

interface SearchProduct {
  _id: string;
  name: string;
  slug: { current: string };
  originalPrice: number;
  discount?: number;
  images?: Array<{ asset: { url: string } }>;
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
}

const Searchbar = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const mobileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Search products function
  const searchProducts = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const results = await searchProductsClient(searchTerm);
      console.log('Search results:', results); // Debug log
      setProducts(results);
    } catch (error) {
      console.error('Search error:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts(search);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, searchProducts]);

  const handleProductClick = (product: SearchProduct) => {
    router.push(`/product/${product.slug.current}`);
    setShowResults(false);
    setShowSearch(false);
    setSearch("");
  };

  const handleClearSearch = () => {
    setSearch("");
    setProducts([]);
    setShowResults(false);
  };

  const toggleMobileSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearch("");
      setShowResults(true);
    }
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showResults && !event.target?.closest?.('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showResults]);
  return (
    <>
      {/* Mobile Search Toggle */}
      <div className="relative lg:w-full search-container">
        <button onClick={toggleMobileSearch} className="lg:hidden p-1">
          {showSearch ? (
            <X className="w-5 h-5 text-white hover:text-orange-500 hoverEffect" />
          ) : (
            <Search className="w-5 h-5 text-white hover:text-orange-500 hoverEffect" />
          )}
        </button>
        
        {/* Desktop Search Form */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative hidden lg:flex items-center"
        >
          <Input
            placeholder="Search products..."
            className="flex-1 rounded-md py-5 focus-visible:ring-0 focus-visible:-custom-searchBorder bg-amber-50 text-black placeholder:font-semibold placeholder:tracking-wide pr-16"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setShowResults(true)}
          />
          {search ? (
            <X
              onClick={() => setSearch("")}
              className="w-5 h-5 absolute right-3 top-2.5 text-black hover:text-red-600 cursor-pointer"
            />
          ) : (
            <Search className="w-5 h-5 absolute right-3 top-2.5 text-black hover:text-red-600 cursor-pointer" />
          )}
        </form>
        
        {/* Desktop Search Results */}
        {showResults && (
          <div className="hidden lg:block absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border shadow-lg max-h-64 overflow-y-auto z-50">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : products.length > 0 ? (
              <div className="p-2">
                {products.map((product) => {
                  const discountedPrice = product.discount ? product.originalPrice * (1 - product.discount / 100) : product.originalPrice;
                  return (
                    <div key={product._id} className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0" onClick={() => handleProductClick(product)}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 mb-1">{product.name || 'Unnamed Product'}</p>
                          {product.category && (
                            <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
                          )}
                          {product.brand && (
                            <p className="text-xs text-blue-600">{product.brand.name}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {product.discount ? (
                            <div>
                              <p className="text-sm font-semibold text-green-600">${discountedPrice.toFixed(2)}</p>
                              <p className="text-xs text-gray-400 line-through">${product.originalPrice}</p>
                            </div>
                          ) : (
                            <p className="text-sm font-semibold text-gray-900">${product.originalPrice}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : search.length > 0 ? (
              <div className="p-4 text-center text-gray-500">No products found</div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p className="font-medium mb-2">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">Electronics</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">Fashion</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">Home & Garden</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Mobile Search Form - Full Width Overlay */}
      {showSearch && (
        <div className="lg:hidden fixed top-20 left-0 right-0 bg-white border-b shadow-md z-50 p-4">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative flex items-center"
          >
            <Input
              ref={mobileInputRef}
              placeholder="Search products..."
              className="flex-1 rounded-md py-3 focus-visible:ring-0 focus-visible:ring-orange-500 bg-gray-50 text-black placeholder:font-medium pr-12"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowResults(true)}
              autoFocus
            />
            {search ? (
              <X
                onClick={() => setSearch("")}
                className="w-5 h-5 absolute right-3 top-3 text-gray-600 hover:text-red-600 cursor-pointer"
              />
            ) : (
              <Search className="w-5 h-5 absolute right-3 top-3 text-gray-600 cursor-pointer" />
            )}
          </form>
          
          {/* Search Results for Mobile */}
          {showResults && (
            <div className="mt-4 bg-white rounded-lg border max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Searching...</div>
              ) : products.length > 0 ? (
                <div className="p-2">
                  {products.map((product) => {
                    const discountedPrice = product.discount ? product.originalPrice * (1 - product.discount / 100) : product.originalPrice;
                    return (
                      <div key={product._id} className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0" onClick={() => handleProductClick(product)}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900 mb-1">{product.name || 'Unnamed Product'}</p>
                            {product.category && (
                              <p className="text-xs text-gray-500 mb-1">{product.category.name}</p>
                            )}
                            {product.brand && (
                              <p className="text-xs text-blue-600">{product.brand.name}</p>
                            )}
                          </div>
                          <div className="text-right">
                            {product.discount ? (
                              <div>
                                <p className="text-sm font-semibold text-green-600">${discountedPrice.toFixed(2)}</p>
                                <p className="text-xs text-gray-400 line-through">${product.originalPrice}</p>
                              </div>
                            ) : (
                              <p className="text-sm font-semibold text-gray-900">${product.originalPrice}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : search.length > 0 ? (
                <div className="p-4 text-center text-gray-500">No products found</div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p className="font-medium mb-2">Popular Searches</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">Electronics</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">Fashion</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs">Home & Garden</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Searchbar;
