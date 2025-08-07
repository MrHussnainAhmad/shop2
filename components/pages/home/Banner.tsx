import Container from "@/components/common/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getBanner, getMiniBanner } from "@/lib/api";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Comparison from "./Comparison";
import MiniBanner from "./MiniBanner";

const Banner = async () => {
  const banners = await getBanner();
  const miniBanners = await getMiniBanner();
  
  // Handle case when no banners are available
  if (!banners || banners.length === 0) {
    return (
      <Container className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="w-full lg:col-span-3">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-500">No banners available</span>
          </div>
        </div>
        <div className="hidden lg:flex flex-col gap-5 h-full">
          <div className="flex-1">
            <Comparison />
          </div>
          <div className="flex-1">
            <MiniBanner miniBanners={miniBanners} />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5">
      <div className="w-full lg:col-span-3">
        <Carousel className="relative w-full rounded-md overflow-hidden">
          <CarouselContent>
            {banners.map((item, index) => {
              const BannerContent = (
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9] group">
                  {item?.image ? (
                    <Image
                      src={item.image || "/placeholder-banner.svg"}
                      alt={item?.name || `Banner ${index + 1}`}
                      className={`object-cover w-full h-full transition-transform duration-300 ${
                        item?.link ? 'group-hover:scale-105' : ''
                      }`}
                      fill
                      priority={index === 0}
                    />
                  ) : item?.imageUrl ? (
                    <Image
                      src={item.imageUrl || "/placeholder-banner.svg"}
                      alt={item?.name || `Banner ${index + 1}`}
                      className={`object-cover w-full h-full transition-transform duration-300 ${
                        item?.link ? 'group-hover:scale-105' : ''
                      }`}
                      fill
                      priority={index === 0}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  {/* Overlay content */}
                  {(item?.name || item?.description || item?.badge) && (
                    <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
                      {item?.badge && (
                        <span className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded mb-2 w-fit">
                          {item.badge}
                        </span>
                      )}
                      {item?.name && (
                        <h2 className="text-white font-bold text-xl md:text-2xl mb-2">
                          {item.name}
                        </h2>
                      )}
                      {item?.description && (
                        <p className="text-white/90 text-sm md:text-base">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                  {/* Link indicator */}
                  {item?.link && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  )}
                </div>
              );

              return (
                <CarouselItem key={index}>
                  {item?.link ? (
                    <Link href={item.link} className="block cursor-pointer">
                      {BannerContent}
                    </Link>
                  ) : (
                    BannerContent
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
      <div className="hidden lg:flex flex-col gap-5 h-full">
        <div className="flex-1">
          <Comparison />
        </div>
        <div className="flex-1">
          <MiniBanner miniBanners={miniBanners} />
        </div>
      </div>
    </Container>
  );
};

export default Banner;