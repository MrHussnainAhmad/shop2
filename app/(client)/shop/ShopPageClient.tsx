"use client";

import React, { useState, useMemo } from 'react';
import ProductCard from '@/components/common/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Filter, X, ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useRouter } from 'next/navigation';

type Product = {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  images?: any[];
  originalPrice: number;
  discount?: number;
  sku: string;
  stock: number;
  status?: string;
  variant?: string;
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
  featured?: boolean;
  customAttributes?: any[];
  tags?: string[];
  couponCode?: {
    code: string;
    discount: number;
  };
  isOnDeal?: boolean;
  dealPercentage?: number;
};

type Category = {
  _id: string;
  name: string;
  slug: { current: string };
  productCount?: number;
};

type Brand = {
  _id: string;
  name: string;
  slug: { current: string };
};

type SortOption = 'newest' | 'oldest' | 'price-low-high' | 'price-high-low' | 'name-a-z' | 'name-z-a';

interface ShopPageClientProps {
  initialProducts: Product[];
  initialCategories: Category[];
  initialBrands: Brand[];
  preSelectedBrandSlug?: string;
  preSelectedCategorySlug?: string;
}

const PRODUCTS_PER_PAGE = 20;

const ShopPageClient = ({ initialProducts, initialCategories, initialBrands, preSelectedBrandSlug, preSelectedCategorySlug }: ShopPageClientProps) => {
  const router = useRouter();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>(() => {
    if (initialProducts.length > 0) {
      const prices = initialProducts.map((p) => p.originalPrice).filter(Boolean);
      return [0, Math.max(...prices)];
    }
    return [0, 5000];
  });
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [showOnlyDeals, setShowOnlyDeals] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(true);
  const [brandFilterOpen, setBrandFilterOpen] = useState(true);
  const [priceFilterOpen, setPriceFilterOpen] = useState(true);
  const [ratingFilterOpen, setRatingFilterOpen] = useState(true);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts.filter((product) => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category?._id || '')) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand?._id || '')) {
        return false;
      }

      // Price filter
      if (product.originalPrice < priceRange[0] || product.originalPrice > priceRange[1]) {
        return false;
      }

      // Stock filter
      if (showOnlyInStock && product.stock <= 0) {
        return false;
      }

      // Featured filter
      if (showOnlyFeatured && !product.featured) {
        return false;
      }

      // Deals filter
      if (showOnlyDeals && !product.isOnDeal) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.originalPrice - b.originalPrice;
        case 'price-high-low':
          return b.originalPrice - a.originalPrice;
        case 'name-a-z':
          return a.name.localeCompare(b.name);
        case 'name-z-a':
          return b.name.localeCompare(a.name);
        case 'oldest':
          return 0; // Since we don't have creation dates, keep original order
        case 'newest':
        default:
          return 0; // Since we don't have creation dates, keep original order
      }
    });

    return filtered;
  }, [initialProducts, searchTerm, selectedCategories, selectedBrands, priceRange, selectedRating, sortBy, showOnlyInStock, showOnlyFeatured, showOnlyDeals]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Filter categories with products > 0
  const availableCategories = useMemo(() => {
    return initialCategories.filter(category => 
      category.productCount && category.productCount > 0
    );
  }, [initialCategories]);

  // Initialize pre-selected brand when component mounts
  React.useEffect(() => {
    if (preSelectedBrandSlug) {
      const preSelectedBrand = initialBrands.find(brand => brand.slug?.current === preSelectedBrandSlug);
      if (preSelectedBrand && !selectedBrands.includes(preSelectedBrand._id)) {
        setSelectedBrands([preSelectedBrand._id]);
      }
    }
  }, [preSelectedBrandSlug, initialBrands, selectedBrands]);

  // Initialize pre-selected category when component mounts
  React.useEffect(() => {
    if (preSelectedCategorySlug) {
      const preSelectedCategory = initialCategories.find(category => category.slug?.current === preSelectedCategorySlug);
      if (preSelectedCategory && !selectedCategories.includes(preSelectedCategory._id)) {
        setSelectedCategories([preSelectedCategory._id]);
      }
    }
  }, [preSelectedCategorySlug, initialCategories, selectedCategories]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedBrands, priceRange, showOnlyInStock, showOnlyFeatured, showOnlyDeals, sortBy]);

  // Clear all filters
  const clearAllFilters = () => {
    // If we're on a brand or category page, redirect to the main shop page
    // to allow completely free filtering
    if (preSelectedBrandSlug || preSelectedCategorySlug) {
      router.push('/shop');
      return;
    }
    
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    if (initialProducts.length > 0) {
      const prices = initialProducts.map((p) => p.originalPrice).filter(Boolean);
      setPriceRange([0, Math.max(...prices)]);
    } else {
      setPriceRange([0, 5000]);
    }
    setSelectedRating(null);
    setShowOnlyInStock(false);
    setShowOnlyFeatured(false);
    setShowOnlyDeals(false);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      // If we're on a category page and the user unchecks the pre-selected category,
      // redirect to the main shop page to allow free filtering
      if (preSelectedCategorySlug) {
        const preSelectedCategory = initialCategories.find(category => category.slug?.current === preSelectedCategorySlug);
        if (preSelectedCategory && preSelectedCategory._id === categoryId) {
          router.push('/shop');
          return;
        }
      }
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brandId]);
    } else {
      // If we're on a brand page and the user unchecks the pre-selected brand,
      // redirect to the main shop page to allow free filtering
      if (preSelectedBrandSlug) {
        const preSelectedBrand = initialBrands.find(brand => brand.slug?.current === preSelectedBrandSlug);
        if (preSelectedBrand && preSelectedBrand._id === brandId) {
          router.push('/shop');
          return;
        }
      }
      setSelectedBrands(selectedBrands.filter(id => id !== brandId));
    }
  };

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + 
    (showOnlyInStock ? 1 : 0) + (showOnlyFeatured ? 1 : 0) + (showOnlyDeals ? 1 : 0) +
    (selectedRating ? 1 : 0);

  // Get the selected brand name for display
  const selectedBrandForDisplay = useMemo(() => {
    if (preSelectedBrandSlug) {
      return initialBrands.find(brand => brand.slug?.current === preSelectedBrandSlug);
    }
    return null;
  }, [preSelectedBrandSlug, initialBrands]);

  // Get the selected category name for display
  const selectedCategoryForDisplay = useMemo(() => {
    if (preSelectedCategorySlug) {
      return initialCategories.find(category => category.slug?.current === preSelectedCategorySlug);
    }
    return null;
  }, [preSelectedCategorySlug, initialCategories]);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedBrandForDisplay 
              ? `${selectedBrandForDisplay.name} Products` 
              : selectedCategoryForDisplay 
                ? `${selectedCategoryForDisplay.name} Products` 
                : 'Shop'
            }
          </h1>
          <p className="text-gray-600 mt-1">
            {selectedBrandForDisplay 
              ? `Browse all ${selectedBrandForDisplay.name} products` 
              : selectedCategoryForDisplay 
                ? `Browse all products in ${selectedCategoryForDisplay.name}` 
                : 'GET THE PRODUCTS AS YOUR NEEDS'
            }
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className={`w-80 space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          {/* Search */}
          <div className="border rounded-lg px-6 py-4 bg-white">
            <h3 className="text-base font-semibold mb-1">Search Products</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="border rounded-lg px-6 py-4 bg-white">
            <h3 className="text-base font-semibold mb-1">Quick Filters</h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={showOnlyInStock}
                  onCheckedChange={(checked) => setShowOnlyInStock(checked as boolean)}
                />
                <Label htmlFor="in-stock" className="text-sm">In Stock Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={showOnlyFeatured}
                  onCheckedChange={(checked) => setShowOnlyFeatured(checked as boolean)}
                />
                <Label htmlFor="featured" className="text-sm">Featured Products</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deals"
                  checked={showOnlyDeals}
                  onCheckedChange={(checked) => setShowOnlyDeals(checked as boolean)}
                />
                <Label htmlFor="deals" className="text-sm">On Deal</Label>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <Card>
            <Collapsible open={categoryFilterOpen} onOpenChange={setCategoryFilterOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Product Categories</CardTitle>
                    {categoryFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="max-h-60 overflow-y-auto">
                  <div className="space-y-3">
                    {availableCategories.map((category) => (
                      <div key={category._id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category._id}`}
                            checked={selectedCategories.includes(category._id)}
                            onCheckedChange={(checked) => handleCategoryChange(category._id, checked as boolean)}
                          />
                          <Label htmlFor={`category-${category._id}`} className="text-sm">
                            {category.name}
                          </Label>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.productCount}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Brands */}
          <Card>
            <Collapsible open={brandFilterOpen} onOpenChange={setBrandFilterOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Brands</CardTitle>
                    {brandFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="max-h-60 overflow-y-auto">
                  <div className="space-y-3">
                    {initialBrands.map((brand) => (
                      <div key={brand._id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand._id}`}
                          checked={selectedBrands.includes(brand._id)}
                          onCheckedChange={(checked) => handleBrandChange(brand._id, checked as boolean)}
                        />
                        <Label htmlFor={`brand-${brand._id}`} className="text-sm">
                          {brand.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Price Range */}
          <Card>
            <Collapsible open={priceFilterOpen} onOpenChange={setPriceFilterOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Price Range</CardTitle>
                    {priceFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      max={Math.max(...initialProducts.map(p => p.originalPrice), 5000)}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Star Ratings (Non-functional placeholder) */}
          <Card>
            <Collapsible open={ratingFilterOpen} onOpenChange={setRatingFilterOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Star Ratings</CardTitle>
                    {ratingFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                        <Checkbox
                          id={`rating-${rating}`}
                          disabled
                        />
                        <Label htmlFor={`rating-${rating}`} className="text-sm flex items-center">
                          {Array.from({ length: rating }, (_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          {Array.from({ length: 5 - rating }, (_, i) => (
                            <Star key={i} className="w-3 h-3 text-gray-300" />
                          ))}
                          <span className="ml-1">& Up</span>
                        </Label>
                      </div>
                    ))}
                    <p className="text-xs text-gray-500 mt-2">Rating system not yet implemented</p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearAllFilters} className="w-full">
              <X className="w-4 h-4 mr-2" />
              Clear All Filters ({activeFiltersCount})
            </Button>
          )}
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort and Results Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              {filteredProducts.length !== initialProducts.length && ` (filtered from ${initialProducts.length})`}
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="text-sm font-medium">Sort by:</Label>
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="name-a-z">Name: A to Z</SelectItem>
                  <SelectItem value="name-z-a">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={clearAllFilters} className="mt-4">
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPageClient;
