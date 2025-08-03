import React from 'react'
import Image from 'next/image'
import { urlFor } from "@/sanity/lib/image";
import { getMiniBanner } from "@/sanity/queries";

const MiniBanner = async () => {
  const miniBanners = await getMiniBanner();

  if (!miniBanners || miniBanners.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      {miniBanners.map((item: any, index: number) => (
        <div key={index} className="relative w-full h-full rounded-md overflow-hidden bg-gray-100">
          {item?.image && (
            <Image
              src={urlFor(item.image).url()}
              alt={item?.name || `Mini Banner ${index + 1}`}
              className="object-cover w-full h-full"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          )}
          {item?.imageUrl && !item?.image && (
            <Image
              src={item.imageUrl}
              alt={item?.name || `Mini Banner ${index + 1}`}
              className="object-cover w-full h-full"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          )}
          {/* Overlay content */}
          {(item?.name || item?.description || item?.badge) && (
            <div className="absolute inset-0 bg-black/20 flex flex-col justify-end p-3">
              {item?.badge && (
                <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded mb-1 w-fit">
                  {item.badge}
                </span>
              )}
              {item?.name && (
                <h3 className="text-white font-semibold text-sm mb-1">
                  {item.name}
                </h3>
              )}
              {item?.description && (
                <p className="text-white/90 text-xs">
                  {item.description}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default MiniBanner
