import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Product from '../../../models/Product';
import Category from '../../../models/Category'; // Import Category model
import Brand from '../../../models/Brand';     // Import Brand model

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    const { searchTerm, isFeatured, isOnDeal, debug, category } = req.query;
    let query = {};

    if (searchTerm) {
      query = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ],
      };
    }

    if (isFeatured === 'true') {
      query = { ...query, isFeatured: true };
    }

    if (isOnDeal === 'true') {
      query = { ...query, isOnDeal: true };
    }

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query = { ...query, category: categoryDoc._id };
      } else {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    const products = await Product.find(query).populate('category').populate('brand');
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
})
.post(async (req, res) => {
  await dbConnect();
  try {
    console.log("Product creation request body:", req.body);
    const product = await Product.create(req.body);
    console.log("Product created successfully:", product);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: 'Failed to create product' });
  }
})
.put(async (req, res) => {
  await dbConnect();
  try {
    const { id } = req.query;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(500).end('Something broke!');
  },
  onNoMatch: (req, res) => {
    res.status(404).end('Page is not found');
  },
});