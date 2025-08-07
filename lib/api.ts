const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const getCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getBanner = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/banners/simple`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allBanners = await response.json();
    // Filter to get only main banners (not mini banners)
    const mainBanners = allBanners.filter((banner: any) => !banner.isMiniBanner);
    return mainBanners;
  } catch (error) {
    console.error("Error fetching main banners:", error);
    return [];
  }
};

export const getMiniBanner = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/banners/simple`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const allBanners = await response.json();
    // Filter to get only mini banners
    const miniBanners = allBanners.filter((banner: any) => banner.isMiniBanner === true);
    return miniBanners;
  } catch (error) {
    console.error("Error fetching mini banners:", error);
    return [];
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/products?isFeatured=true`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

export const getAllBrands = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/brands`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const brands = await response.json();
    return brands;
  } catch (error) {
    console.error("Error fetching all brands:", error);
    return [];
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/products/${slug}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const product = await response.json();
    return product;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

export const searchProducts = async (searchTerm: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/products/search?term=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

export const getAllProductsDebug = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/products?debug=true`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching all products for debug:", error);
    return [];
  }
};

export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};

export const getDealProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/products?isOnDeal=true`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching deal products:", error);
    return [];
  }
};

export const getWebData = async () => {
  try {
    console.log("Fetching web data from /api/webdata...");
    const response = await fetch(`${BASE_URL}/api/webdata`);
    console.log("Web data API response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonResponse = await response.json();
    console.log("Web data API JSON response:", jsonResponse);
    const { data } = jsonResponse;
    return data;
  } catch (error) {
    console.error("Error fetching web data:", error);
    return null;
  }
};