"use client";

import { Search } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/api";
import { Product } from "@/sanity.types";

const Comparison = () => {
    const [searchOne, setSearchOne] = React.useState("");
    const [searchTwo, setSearchTwo] = React.useState("");
    const [searchResults1, setSearchResults1] = React.useState<Product[]>([]);
    const [searchResults2, setSearchResults2] = React.useState<Product[]>([]);
    const [showResults1, setShowResults1] = React.useState(false);
    const [showResults2, setShowResults2] = React.useState(false);
    const [selectedProduct1, setSelectedProduct1] = React.useState<Product | null>(null);
    const [selectedProduct2, setSelectedProduct2] = React.useState<Product | null>(null);
    const router = useRouter();

    const handleSearch1 = async (term: string) => {
        setSearchOne(term);
        if (term.trim().length > 2) {
            try {
                const results = await searchProducts(term.trim());
                setSearchResults1(results || []);
                setShowResults1(true);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults1([]);
            }
        } else {
            setSearchResults1([]);
            setShowResults1(false);
            setSelectedProduct1(null);
        }
    };

    const handleSearch2 = async (term: string) => {
        setSearchTwo(term);
        if (term.trim().length > 2) {
            try {
                const results = await searchProducts(term.trim());
                setSearchResults2(results || []);
                setShowResults2(true);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults2([]);
            }
        } else {
            setSearchResults2([]);
            setShowResults2(false);
            setSelectedProduct2(null);
        }
    };

    const selectProduct1 = (product: Product) => {
        setSelectedProduct1(product);
        setSearchOne(product.name);
        setShowResults1(false);
        setSearchResults1([]);
    };

    const selectProduct2 = (product: Product) => {
        setSelectedProduct2(product);
        setSearchTwo(product.name);
        setShowResults2(false);
        setSearchResults2([]);
    };

    const handleCompare = () => {
        if (selectedProduct1 && selectedProduct2) {
            const slugs = [selectedProduct1.slug?.current, selectedProduct2.slug?.current].filter(Boolean);
            if (slugs.length >= 2) {
                router.push(`/compare?products=${slugs.join(',')}`);
            }
        }
    };

    return (
      <div className="rounded-md border border-gray-200 bg-gray-50 p-3 flex flex-col gap-2 h-full max-h-full overflow-hidden">
        <div className="text-center flex-shrink-0">
          <h3 className="font-semibold text-gray-800 text-sm">Compare Products</h3>
          <p className="text-xs text-gray-600">Search and Choose Products to Compare</p>
        </div>
        
        <div className="flex flex-col gap-2 w-full flex-1 min-h-0">
          {/* Search Inputs */}
          <div className="flex flex-col gap-2">
            {/* Product One */}
            <div className="relative w-full">
              <div className="w-full px-2 py-1 rounded border border-gray-300 bg-white flex items-center focus-within:border-blue-500 transition-colors">
                <input
                  type="text"
                  placeholder="Search Product 1..."
                  value={searchOne}
                  onChange={(e) => handleSearch1(e.target.value)}
                  className="flex-1 outline-0 text-xs bg-transparent"
                />
                <Search size={12} className="text-gray-400 ml-1" />
              </div>
              
              {/* Search Results 1 */}
              {showResults1 && searchResults1.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-32 overflow-y-auto z-10">
                  {searchResults1.slice(0, 5).map((product) => (
                    <div
                      key={product._id}
                      onClick={() => selectProduct1(product)}
                      className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <p className="text-xs font-medium truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">${product.originalPrice?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Two */}
            <div className="relative w-full">
              <div className="w-full px-2 py-1 rounded border border-gray-300 bg-white flex items-center focus-within:border-blue-500 transition-colors">
                <input
                  type="text"
                  placeholder="Search Product 2..."
                  value={searchTwo}
                  onChange={(e) => handleSearch2(e.target.value)}
                  className="flex-1 outline-0 text-xs bg-transparent"
                />
                <Search size={12} className="text-gray-400 ml-1" />
              </div>
              
              {/* Search Results 2 */}
              {showResults2 && searchResults2.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-32 overflow-y-auto z-10">
                  {searchResults2.slice(0, 5).map((product) => (
                    <div
                      key={product._id}
                      onClick={() => selectProduct2(product)}
                      className="p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <p className="text-xs font-medium truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">${product.originalPrice?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!selectedProduct1 || !selectedProduct2}
              onClick={handleCompare}
            >
              Compare
            </button>
          </div>
        </div>
      </div>
    );
};

export default Comparison;
