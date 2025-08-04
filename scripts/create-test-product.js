const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'nw39ce7j',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-08-02',
  token: process.env.SANITY_API_TOKEN, // You'll need to set this
});

async function createTestProduct() {
  try {
    const product = {
      _type: 'product',
      name: 'Test Product',
      slug: {
        _type: 'slug',
        current: 'test-product'
      },
      description: 'This is a test product to verify the product detail page functionality.',
      originalPrice: 99.99,
      discount: 10,
      sku: 'TEST-001',
      stock: 25,
      status: 'New',
      variant: 'Standard',
      featured: true,
      tags: ['test', 'sample', 'demo']
    };

    const result = await client.create(product);
    console.log('Test product created successfully:', result);
  } catch (error) {
    console.error('Error creating test product:', error);
  }
}

createTestProduct();
