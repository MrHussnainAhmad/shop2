"use client";

import { Product } from "@/sanity.types";
import React from "react";
import { FaPinterest, FaFacebook, FaTwitter } from "react-icons/fa";
import { MdAddToPhotos } from "react-icons/md";
import { RiMessengerFill, RiWhatsappFill } from "react-icons/ri";
import { useAlertModal } from "@/components/ui/alert-modal";

const ShareBadge = ({ product }: { product?: Product }) => {
  const modal = useAlertModal();
  
  // Debug logging
  React.useEffect(() => {
    console.log('ShareBadge product data:', product);
    console.log('Product slug:', product?.slug);
    console.log('Product slug current:', product?.slug?.current);
    console.log('Product _id:', product?._id);
  }, [product]);
  const handleShare = (platform: string) => {
    if (typeof window === 'undefined') return;
    
    const currentUrl = window.location.href;
    const productName = product?.name || 'Amazing Product';
    const productPrice = product?.originalPrice || 0;
    const shareText = `Check out this ${productName} for $${productPrice}!`;
    const shareUrl = encodeURIComponent(currentUrl);
    const shareTextEncoded = encodeURIComponent(shareText);

    let shareLink = '';
    
    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${shareTextEncoded}%20${shareUrl}`;
        break;
      case 'messenger':
        shareLink = `https://m.me/share?link=${shareUrl}`;
        break;
      case 'pinterest':
        shareLink = `https://pinterest.com/pin/create/button/?url=${shareUrl}&description=${shareTextEncoded}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${shareTextEncoded}&url=${shareUrl}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  const handleCompare = () => {
    // Try multiple ways to get the product identifier
    let productId = null;
    
    if (product?.slug?.current) {
      productId = product.slug.current;
    } else if (product?._id) {
      productId = product._id;
    } else {
      // Extract slug from current URL as fallback
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/');
      const slugFromUrl = pathSegments[pathSegments.length - 1];
      
      if (slugFromUrl && slugFromUrl !== 'product') {
        productId = slugFromUrl;
      }
    }
    
    if (!productId) {
      console.error('Product data:', product);
modal.alert("Cannot identify product for comparison. Please try again.");
      return;
    }
    
    // Redirect to compare page with product identifier
    window.location.href = `/compare?products=${productId}`;
  };

  return (
    <div className="bg-white border border-custom-sec3/30 py-4 px-6 mb-6 rounded-2xl flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-4">
        <p className="text-sm font-bold text-custom-navBar">Share:</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleShare('whatsapp')}
            className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 hoverEffect transition-colors text-sm"
            title="Share on WhatsApp"
          >
            <RiWhatsappFill />
          </button>
          <button
            onClick={() => handleShare('messenger')}
            className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 hoverEffect transition-colors text-sm"
            title="Share on Messenger"
          >
            <RiMessengerFill />
          </button>
          <button
            onClick={() => handleShare('pinterest')}
            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 hoverEffect transition-colors text-sm"
            title="Share on Pinterest"
          >
            <FaPinterest />
          </button>
          <button
            onClick={() => handleShare('facebook')}
            className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 hoverEffect transition-colors text-sm"
            title="Share on Facebook"
          >
            <FaFacebook />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 hoverEffect transition-colors text-sm"
            title="Share on Twitter"
          >
            <FaTwitter />
          </button>
        </div>
      </div>
      <div>
        <button
          onClick={handleCompare}
          className="flex items-center gap-2 px-4 py-2 bg-custom-sec1 text-custom-navBar font-semibold rounded-lg hover:bg-custom-sec2 hoverEffect transition-colors border border-custom-navBar/20"
          title="Add to comparison list"
        >
          <MdAddToPhotos className="text-base" />
          <span className="text-sm">Add to Compare</span>
        </button>
      </div>
    </div>
  );
};

export default ShareBadge;
