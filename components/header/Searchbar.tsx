"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Search, X } from "lucide-react";

const Searchbar = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<{ _id: string; name: string; originalPrice: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const mobileInputRef = React.useRef<HTMLInputElement>(null);

  const toggleMobileSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearch("");
      setShowResults(true);
    }
  };
  return (
    <>
      {/* Mobile Search Toggle */}
      <div className="relative lg:w-full">
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
                  {products.map((product: { _id: string; name: string; originalPrice: number }) => (
                    <div key={product._id} className="p-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">${product.originalPrice}</p>
                    </div>
                  ))}
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
