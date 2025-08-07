"use client";
import React, { useState, useEffect } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAccount } from "@/contexts/AccountContext";

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
    title: "Addresses",
    icon: <IoMdBookmarks />,
    href: "/account/addresses",
  },
  {
    title: "WishList",
    icon: <FaRegHeart />,
    href: "/account/wishlist",
  },
  {
    title: "Your Transactions",
    icon: <PiCurrencyDollarSimpleFill />,
    href: "/account/transactions",
  },
];

const AccountMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isAccountMenuVisible, setAccountMenuVisible, currentSection, setCurrentSection, setHideMainMenu } = useAccount();

  // Check if we're on the main account page or a specific section
  const isMainAccountPage = pathname === "/account/account";
  const isAccountSection = pathname.startsWith("/account/") && !isMainAccountPage;

  useEffect(() => {
    if (isAccountSection) {
setAccountMenuVisible(true);
    setHideMainMenu(true);
      const section = pathname.split('/')[2];
      setCurrentSection(section);
    } else {
setAccountMenuVisible(false);
    setHideMainMenu(false);
      setCurrentSection(null);
    }
  }, [pathname, setAccountMenuVisible, setCurrentSection, setHideMainMenu, isAccountSection]);

  const currentPage = accountmenu.find((item) => item.href === pathname);

  // Show account menu only when on account sections (not main account page)
  if (!isAccountSection) {
    return null;
  }

  const handleMenuClick = (item: any, e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    
    // Update URL and context
    router.push(item.href);
    setAccountMenuVisible(true);
    const section = item.href.split('/')[2];
    setCurrentSection(section);
  };

  return (
    <div className="border-b pb-2 mb-4">
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
              <button
                key={index}
                onClick={(e) => handleMenuClick(item, e)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-left",
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
              </button>
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
          <button
            key={index}
            onClick={(e) => handleMenuClick(item, e)}
            className="flex items-center gap-2 group text-left"
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
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountMenu;
