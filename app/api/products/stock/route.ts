import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

// Create a server-side client with write permissions
const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // Server-side write token
});

// GET - Check stock levels for products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (productId) {
      // Get specific product stock
      const product = await serverClient.fetch(
        `*[_type == "product" && _id == $productId][0]{ _id, name, stock, status }`,
        { productId }
      );
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ product });
    } else {
      // Get all products with low stock (less than 5)
      const lowStockProducts = await serverClient.fetch(
        `*[_type == "product" && stock < 5]{ _id, name, stock, status } | order(stock asc)`
      );
      
      return NextResponse.json({ 
        lowStockProducts,
        count: lowStockProducts.length 
      });
    }
    
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}

// POST - Update product stock (for testing/admin purposes)
export async function POST(request: NextRequest) {
  try {
    const { productId, newStock, operation } = await request.json();
    
    if (!productId || newStock < 0) {
      return NextResponse.json(
        { error: 'Invalid productId or stock value' },
        { status: 400 }
      );
    }
    
    // Get current product data
    const product = await serverClient.fetch(
      `*[_type == "product" && _id == $productId][0]{ _id, name, stock, status }`,
      { productId }
    );
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    let finalStock = newStock;
    
    // Handle different operations
    if (operation === 'add') {
      finalStock = (product.stock || 0) + newStock;
    } else if (operation === 'subtract') {
      finalStock = Math.max(0, (product.stock || 0) - newStock);
    }
    
    // Update data
    const updateData: any = {
      stock: finalStock,
    };
    
    // Update status based on stock level
    if (finalStock === 0) {
      updateData.status = 'Out of Stock';
    } else if (finalStock <= 5 && product.status === 'Out of Stock') {
      // If stock was 0 and now has items, remove "Out of Stock" status
      updateData.status = 'Low Stock';
    }
    
    // Perform the update
    const result = await serverClient
      .patch(productId)
      .set(updateData)
      .commit();
    
    // Stock updated successfully
    
    return NextResponse.json({
      success: true,
      product: {
        ...product,
        stock: finalStock,
        status: updateData.status || product.status
      },
      previousStock: product.stock,
      newStock: finalStock
    });
    
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    );
  }
}
