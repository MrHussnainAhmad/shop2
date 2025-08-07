import { createRouter } from 'next-connect';
import dbConnect from '../../../lib/db';
import Brand from '../../../models/Brand';

const router = createRouter();

router.get(async (req, res) => {
  await dbConnect();
  try {
    // Find brands that have voucher codes
    const brandsWithVouchers = await Brand.find({
      'voucher.name': { $exists: true, $ne: '' },
      'voucher.value': { $exists: true, $gt: 0 }
    }).select('name voucher');

    // Create a simple voucher code to discount mapping
    const vouchers = {};
    brandsWithVouchers.forEach(brand => {
      if (brand.voucher && brand.voucher.name && brand.voucher.value) {
        vouchers[brand.voucher.name.toUpperCase()] = {
          discount: brand.voucher.value,
          brandName: brand.name,
          brandId: brand._id
        };
      }
    });

    res.status(200).json(vouchers);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ error: 'Failed to fetch vouchers' });
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
