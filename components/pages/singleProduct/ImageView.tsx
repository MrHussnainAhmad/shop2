"use client";

import React from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Props {
  images?: string[]; // Changed to string[] as we are storing direct URLs
  isStock?: number;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [active, setActive] = React.useState(images[0]);
  const [showModal, setShowModal] = React.useState(false);
  const [initialSlide, setInitialSlide] = React.useState(0);

  // Helper function to get image URL (now directly from the array)
  const getImageUrl = (image: string) => {
    if (!image || image === "") return '/placeholder-product.svg';
    return image;
  };

  const openModal = (index: number) => {
    setInitialSlide(index);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <div className="w-full md:w-2/5 space-y-2 md:space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active} // Changed key to use the image string directly
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-h-[500px] min-h-[450px] border border-black/10 rounded-md group overflow-hidden cursor-pointer"
            onClick={() =>
              openModal(images.findIndex((img) => img === active)) // Changed findIndex to use image string
            }
          >
            <Image
              src={getImageUrl(active)}
              alt="productImage"
              width={700}
              height={700}
              priority
              className={`w-full h-96 max-h-[500px] min-h-[450px] object-contain group-hover:scale-110 hoverEffect rounded-md ${isStock === 0 ? "opacity-50 group-hover:scale-100" : "group-hover:scale-110"}`}
            />
          </motion.div>
        </AnimatePresence>
        <div className="flex flex-wrap gap-2 items-center justify-center">
          {images?.map((image) => (
            <button
              onClick={() => setActive(image)}
              key={image} // Changed key to use the image string directly
              className={`border rounded-md overflow-hidden ${active === image ? "ring-1 ring-black" : ""}`}
            >
              <Image
                src={getImageUrl(image)}
                alt={`Thumbnail ${image}`} // Changed alt to use image string
                width={100}
                height={100}
                className={`w-full h-full object-contain`}
              />
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full p-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-200 transition-colors"
              >
                <X />
              </button>
              <Carousel className="w-full" opts={{startIndex: initialSlide}}>
                <CarouselContent>
                  {images?.map((image) => (
                    <CarouselItem key={image}> // Changed key to use image string
                      <div className="flex items-center justify-center h-[500px]">
                        <Image
                          src={getImageUrl(image)}
                          alt={`Image ${image}`} // Changed alt to use image string
                          width={800}
                          height={800}
                          className="max-h-full object-contain"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0"/>
                <CarouselNext className="right-0"/>
              </Carousel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageView;
