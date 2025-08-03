import Container from "@/components/common/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { urlFor } from "@/sanity/lib/image";
import { getBanner } from "@/sanity/queries";
import React from "react";
import Image from "next/image";
import Comparison from "./Comparison";
import MiniBanner from "./MiniBanner";

const Banner = async () => {
  const banner = await getBanner();
  
  // Handle case when no banners are available
  if (!banner || banner.length === 0) {
    return (
      <Container className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5">
        <div className="w-full lg:col-span-3">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-gray-200 rounded-md flex items-center justify-center">
            <span className="text-gray-500">No banners available</span>
          </div>
        </div>
        <div className="hidden lg:flex flex-col gap-5 h-full">
          <Comparison />
          <MiniBanner />
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5">
      <div className="w-full lg:col-span-3">
        <Carousel className="relative w-full rounded-md overflow-hidden">
          <CarouselContent>
            {banner.map((item, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                  {item?.image ? (
                    <Image
                      src={urlFor(item.image).url()}
                      alt={item?.name || `Banner ${index + 1}`}
                      className="object-cover w-full h-full"
                      fill
                      priority={index === 0}
                    />
                  ) : item?.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item?.name || `Banner ${index + 1}`}
                      className="object-cover w-full h-full"
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
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>
      <div className="hidden lg:flex flex-col gap-5 h-full">
        <Comparison />
        <MiniBanner />
      </div>
    </Container>
  );
};

export default Banner;
