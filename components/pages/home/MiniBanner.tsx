import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getMiniBanner } from "@/lib/api";
import { Banner } from '@/models/Banner';

const MiniBanner = async () => {
  const miniBanners = await getMiniBanner();

  if (!miniBanners || miniBanners.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      {miniBanners.map((item: Banner, index: number) => {
        const MiniBannerContent = (
          <div className="relative w-full h-full min-h-[160px] rounded-md overflow-hidden bg-gray-100 group">
            {item?.image && (
              <Image
                src={item.image || "/placeholder-banner.svg"}
                alt={item?.name || `Mini Banner ${index + 1}`}
                className={`object-cover w-full h-full transition-transform duration-300 ${
                  item?.link ? 'group-hover:scale-105' : ''
                }`}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            )}
            {console.log("MiniBanner image src:", item.image || "/placeholder-banner.svg")}
            {item?.imageUrl && !item?.image && (
              <Image
                src={item.imageUrl || "/placeholder-banner.svg"}
                alt={item?.name || `Mini Banner ${index + 1}`}
                className={`object-cover w-full h-full transition-transform duration-300 ${
                  item?.link ? 'group-hover:scale-105' : ''
                }`}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            )}
            {console.log("MiniBanner imageUrl src:", item.imageUrl || "/placeholder-banner.svg")}
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
            {/* Link indicator */}
            {item?.link && (
              <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            )}
          </div>
        );

        return (
          <div key={index}>
            {item?.link ? (
              <Link href={item.link} className="block cursor-pointer">
                {MiniBannerContent}
              </Link>
            ) : (
              MiniBannerContent
            )}
          </div>
        );
      })}
    </div>
  )
}

export default MiniBanner