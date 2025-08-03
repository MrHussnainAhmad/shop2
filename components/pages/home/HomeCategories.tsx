import Container from "@/components/common/Container";
import Title from "@/components/common/Title";
import { Category } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  categories: Category[];
}

const HomeCategories = ({ categories }: Props) => {
  
  if (!categories || categories.length === 0) {
    return (
      <Container className="mt-10 lg:mt-20">
        <div className="text-center space-y-1.5 mb-5 md:mb-10">
          <Title>Featured Categories</Title>
          <p className="text-gray-600">No categories available</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-10 lg:mt-20">
      <div className="text-center space-y-1.5 mb-5 md:mb-10">
        <Title>Featured Categories</Title>
        <p className="text-gray-600">Shop from Featured Categories!</p>
      </div>
      <div className="mt-10 grid grid-cols-4 md:grid-cols-5 gap-2.5">
        {categories.map((category) => (
          <Link key={category._id} href={`/category/${category?.slug?.current}`}>
            <div className="p-3 flex flex-col items-center gap-3 border border-transparent hover:border-orange-500 hover:shadow-md transition-all duration-200 cursor-pointer bg-custom-text">
              {category?.image ? (
                <div className="w-12 h-12 md:w-16 md:h-16 overflow-hidden ">
                  <Image
                    src={urlFor(category.image).url()}
                    alt={category?.name || "Category"}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : category?.imageUrl ? (
                <div className="w-12 h-12 md:w-16 md:h-16 overflow-hidden rounded-full">
                  <Image
                    src={category.imageUrl}
                    alt={category?.name || "Category"}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No Image</span>
                </div>
              )}
              <p className="text-xs md:text-sm font-medium text-center line-clamp-1 text-gray-800">
                {category?.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default HomeCategories;
