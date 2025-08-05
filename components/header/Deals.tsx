import { ZapIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

const Deals = () => {
  return (
    <Link
      href="/deal"
      className="flex items-center gap-2 justify-end group p-1"
    >
      <ZapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 group-hover:text-pink-100 hoverEffect" />
      <div className="hidden lg:flex flex-col">
        <h4 className="text-base font-bold group-hover:text-orange-500 hoverEffect">
          Deals
        </h4>
        <p className="text-xs whitespace-nowrap">Latest Deals</p>
      </div>
    </Link>
  );
};

export default Deals;
