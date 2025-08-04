import React from "react";
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
import Link from "next/link";

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

const AccountPage = () => {
  return (
    <div className=" bg-white">
      <div className=" grid grid-cols-3 md:grid-cols-4 gap-3">
        {accountmenu?.map((item,index)=>(
          <Link key={index} href={item?.href} className="border flex flex-col justify-center items-center p-4 md:p-10 shadow-md rounded-md hover:border-amber-50 hoverEffect">
          <span className="p-3 text-lg inline-block rounded-full bg-blue-300 text-blue-500">{item?.icon}</span>
          <p className="text-xs md:text-sm font-semibold">{item?.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountPage;
