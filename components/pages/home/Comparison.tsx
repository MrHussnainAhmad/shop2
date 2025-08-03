"use client";

import { Search } from "lucide-react";
import React from "react";

const Comparison = () => {
    const [productOne, setProductOne] = React.useState(null);
    const [productTwo, setProductTwo] = React.useState(null);
    const [searchOne, setSearchOne] = React.useState("");
    const [searchTwo, setSearchTwo] = React.useState("");
    const [productsOne, setProductsOne] = React.useState([]);
    const [productsTwo, setProductsTwo] = React.useState([]);
    const [loadingOne, setLoadingOne] = React.useState(false);
    const [loadingTwo, setLoadingTwo] = React.useState(false);
    const [showResultOne, setShowResultOne] = React.useState(null);
    const [showResultTwo, setShowResultTwo] = React.useState(null);
    const searchRefOne = React.useRef<HTMLInputElement>(null);
    const searchRefTwo = React.useRef<HTMLInputElement>(null);

    
  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-3 flex flex-col gap-2 h-full max-h-full overflow-hidden">
      <div className="text-center flex-shrink-0">
        <h3 className="font-semibold text-gray-800 text-sm">Compare Products</h3>
        <p className="text-xs text-gray-600">Choose Two Products to Compare</p>
      </div>
      <div className="flex flex-col gap-2 w-full flex-1 min-h-0 xl:gap-3">
        {/* Product One */}
        <div className="relative w-full">
          <div className="w-full px-2 py-1 rounded border border-gray-300 bg-white flex items-center focus-within:border-blue-500 transition-colors">
            <input
              type="text"
              placeholder="Product 1"
              ref={searchRefOne}
              value={searchOne}
              onChange={(e) => setSearchOne(e.target.value)}
              className="flex-1 outline-0 text-xs bg-transparent"
            />
            <Search size={12} className="text-gray-400 ml-1" />
          </div>
        </div>
        {/* Product Two */}
        <div className="relative w-full">
          <div className="w-full px-2 py-1 rounded border border-gray-300 bg-white flex items-center focus-within:border-blue-500 transition-colors">
            <input
              type="text"
              placeholder="Product 2"
              ref={searchRefTwo}
              value={searchTwo}
              onChange={(e) => setSearchTwo(e.target.value)}
              className="flex-1 outline-0 text-xs bg-transparent"
            />
            <Search size={12} className="text-gray-400 ml-1" />
          </div>
        </div>
        
        {/* Compare Button */}
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-2 mb-3 sm:mb-2 lg:mb-2 xl:mb-3"
          disabled={!searchOne.trim() || !searchTwo.trim()}
          onClick={() => {
            // Handle comparison logic here
            console.log('Comparing:', searchOne, 'vs', searchTwo);
          }}
        >
          Compare
        </button>
      </div>
    </div>
  );
};

export default Comparison;
