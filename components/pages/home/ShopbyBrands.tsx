import Container from '@/components/common/Container'
import Title from '@/components/common/Title'
import Link from 'next/link'
import React from 'react'
import { getAllBrands } from '@/sanity/queries'
import { GitCompareArrows, Headset, ShieldCheck, Truck } from 'lucide-react'
import Image from 'next/image'
import { Brand } from '@/sanity.types'
import { urlFor } from '@/sanity/lib/image'

const extraData = [
    {
        title: "Free Delivery",
        description: "Free delivery on all orders over $100",
        icon: <Truck size={45} />
    },
    {
        title: "Free Return",
        description: "Free return on all orders over $100",
        icon: <GitCompareArrows size={45} />
    },
    {
        title: "24/7 Customer Support",
        description: "Available 24/7 to help you.",
        icon: <Headset size={45} />
    },
    {
        title: "Secure Payment",
        description: "Secure and Protected payment methods",
        icon: <ShieldCheck size={45} />
    }
]
const ShopbyBrands = async () => {
    const brands =  await getAllBrands();
  return (
    <Container className="mt-10 lg:mt-20 p-5 lg:p-7 rounded-md">
      <div className="flex items-center gap-5 justify-between mb-10">
        <Title>Shop by Brands</Title>
        <Link
          href={"/shop"}
          className="text-sm font-semibold tracking-wide hover:text-red-600 hoverEffect"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-5">
        {brands?.map((brand: Brand) => (
          <Link
            key={brand._id}
            href={`/shop/brands/${brand.slug?.current}`}
className="p-4 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-red-500 hover:shadow-md w-36 h-24 flex items-center justify-center overflow-hidden hoverEffect transition-all duration-300"
          >
            {brand?.logo && (
              <Image
                src={urlFor(brand?.logo).url()}
                className="w-32 h-32 object-contain"
                alt="brand"
                width={250}
                height={250}
              />
            )}
          </Link>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16 p-2">
        {extraData?.map((Item, index) => (
          <div
            key={index}
className="flex items-center gap-3 border border-gray-300 px-5 py-3 rounded-md hover:border-red-500 hover:bg-gray-50 hover:shadow-md hoverEffect transition-all duration-300"
          >
            <span>{Item?.icon}</span>
            <div className="text-sm">
              <p className="text-black font-bold capitalize">{Item?.title}</p>
              <p className="text-black">{Item?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default ShopbyBrands