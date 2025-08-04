"use client";
import React, { useState } from "react";
import { IoBookmarks } from "react-icons/io5";
import {
  FaClipboardList,
  FaRegHeart,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import { IoMdBookmarks } from "react-icons/io";
import { PiCurrencyDollarSimpleFill } from "react-icons/pi";
import { MdStars } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const accountmenu = [
  {
    title: "Orders",
    icon: <IoBookmarks />,
    href: "/account/orders",
  },
  {
    title: "Cart",
    icon: <FaShoppingCart />,
    href: "/account/cart",
  },
  {
    title: "Edit Profile",
    icon: <FaUser />,
    href: "/account/edit",
  },
  {
    title: "Adresses",
    icon: <IoMdBookmarks />,
    href: "/account/adresses",
  },
  {
    title: "WishList",
    icon: <FaRegHeart />,
    href: "/account/wishlist",
  },
  {
    title: "Your Transection",
    icon: <PiCurrencyDollarSimpleFill />,
    href: "/account/transactions",
  },
  {
    title: " Tech Points",
    icon: <MdStars />,
    href: "/account/points",
  },
  {
    title: "Quote",
    icon: <FaCirclePlus />,
    href: "/account/quotes",
  },
  {
    title: "Add+",
    icon: <FaCirclePlus />,
    href: "/account/add",
  },
];

const AccountMenu = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  //   if (pathname === "/account/account") return null;

  const currentPage = accountmenu.find((item) => item.href === pathname);

  return (
    <div className="border-b pb-2">
      {/* Mobile and Medium View*/}
      <div className="lg:hidden relative">
        {/* Custom Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 shadow-sm flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {currentPage ? (
              <>
                <span className="text-orange-500 text-lg">{currentPage.icon}</span>
                <span className="text-sm font-semibold text-gray-800">{currentPage.title}</span>
              </>
            ) : (
              <span className="text-sm font-medium text-gray-500">Select Menu Item</span>
            )}
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-gray-500 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )} />
        </button>

        {/* Custom Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {accountmenu.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0",
                  item.href === pathname ? "bg-orange-50" : ""
                )}
              >
                <span className={cn(
                  "text-lg",
                  item.href === pathname ? "text-orange-500" : "text-gray-600"
                )}>
                  {item.icon}
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  item.href === pathname ? "text-orange-500" : "text-gray-800"
                )}>
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        )}
        
        {/* Overlay to close dropdown when clicking outside */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Large View */}
      <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-5">
        {accountmenu?.map((item, index) => (
          <Link
            key={index}
            href={item?.href}
            className="flex items-center gap-2 group"
          >
            <span
              className={cn(
                "text-lg hoverEffect",
                item?.href === pathname
                  ? "text-red-500"
                  : "text-black group-hover:text-red-500"
              )}
            >
              {item?.icon}
            </span>
            <span
              className={cn(
                "text-lg hoverEffect",
                item?.href === pathname
                  ? "text-red-500"
                  : "text-black group-hover:text-red-500"
              )}
            >
              {" "}
              {item?.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountMenu;
