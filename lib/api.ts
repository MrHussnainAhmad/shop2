
export const getCategories = async () => {
  try {
    const response = await fetch('/api/categories');
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
    const response = await fetch('/api/banners');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const banners = await response.json();
    return banners;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};

export const getMiniBanner = async () => {
  try {
    const response = await fetch('/api/banners?isMiniBanner=true');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const miniBanners = await response.json();
    return miniBanners;
  } catch (error) {
    console.error("Error fetching mini banners:", error);
    return [];
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await fetch('/api/products?isFeatured=true');
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
    const response = await fetch('/api/brands');
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
    const response = await fetch(`/api/products/${slug}`);
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
    const response = await fetch(`/api/products/search?term=${encodeURIComponent(searchTerm)}`);
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
    const response = await fetch('/api/products?debug=true');
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
    const response = await fetch('/api/products');
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?isOnDeal=true`);
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
