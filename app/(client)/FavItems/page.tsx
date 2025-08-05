"use client";
import React from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import useWishlistStore from "@/store/wishlistStore";
import useCartStore from "@/store";
import toast from "react-hot-toast";
import { useAlertModal } from "@/components/ui/alert-modal";

const FavItemsPage = () => {
  const [mounted, setMounted] = React.useState(false);
  const { items, removeFromWishlist, clearWishlist, getTotalItems } = useWishlistStore();
  const { addItem } = useCartStore();
  const modal = useAlertModal();
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success(`${product?.name?.substring(0, 15)}... added to cart!`, {
      duration: 2000,
    });
  };

  const handleRemoveFromWishlist = (productId: string, productName?: string) => {
    removeFromWishlist(productId);
    toast.success(`${productName?.substring(0, 15)}... removed from wishlist!`, {
      duration: 2000,
    });
  };

const handleClearAll = async () => {
    const confirmed = await modal.confirm("Are you sure you want to remove all items from your wishlist?");
    if (confirmed) {
      clearWishlist();
      toast.success("Wishlist cleared!");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-pulse">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-pink-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love to your wishlist and shop them later!
            </p>
            <Link
              href="/"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors font-medium inline-flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const product = item.product;
            const originalPrice = product?.originalPrice || 0;
            const discount = product?.discount || 0;
            const finalPrice = originalPrice - (originalPrice * discount / 100);

            return (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="relative aspect-square">
                  <Link href={`/product/${product.slug?.current}`}>
                    {product.images && product.images.length > 0 ? (
                      <>
                        {product.images[0]._type === 'image' && product.images[0].asset ? (
                          <Image
                            src={urlFor(product.images[0]).url()}
                            alt={product.name || 'Product'}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : product.images[0]._type === 'imageUrl' && product.images[0].url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name || 'Product'}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <ShoppingCart className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ShoppingCart className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </Link>
                  
                  {/* Remove from wishlist button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id, product.name)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      -{discount}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/product/${product.slug?.current}`}>
                    <h3 className="font-medium text-gray-900 mb-2 hover:text-orange-500 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      ${finalPrice.toFixed(2)}
                    </span>
                    {discount > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        ${originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-3">
                    {product.stock === 0 ? (
                      <span className="text-sm text-red-500 font-medium">Out of Stock</span>
                    ) : (
                      <span className="text-sm text-green-600 font-medium">
                        {product.stock} in stock
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      product.stock === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors font-medium"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FavItemsPage;
