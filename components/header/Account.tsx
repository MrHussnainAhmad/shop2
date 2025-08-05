"use client";
import { User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useUserProfile } from "@/hooks/useUserProfile";

const Account = () => {
  const [mounted, setMounted] = React.useState(false);
  const { isSignedIn, user } = useUser();
  const { getFirstName, loading: profileLoading } = useUserProfile();
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    // Show loading state or default state during hydration
    return (
      <div className="flex items-center gap-2 justify-end group p-1">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-200 rounded-full animate-pulse" />
        <div className="hidden lg:flex flex-col">
          <h4 className="text-base font-bold group-hover:text-orange-500 hoverEffect">
            Account
          </h4>
          <p className="text-xs whitespace-nowrap">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="flex items-center gap-2 justify-end group p-1">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-5 h-5 sm:w-6 sm:h-6",
              userButtonPopoverCard: "bg-white shadow-lg border border-gray-200",
              userButtonPopoverActionButton: "hover:bg-gray-50",
            }
          }}
        />
        <Link href="/account/account" className="hidden lg:flex flex-col hover:cursor-pointer">
          <h4 className="text-base font-bold group-hover:text-orange-500 hoverEffect">
            {profileLoading ? (user?.firstName || 'Account') : (getFirstName() || 'Account')}
          </h4>
          <p className="text-xs whitespace-nowrap">My Account</p>
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/account/account"
      className="flex items-center gap-2 justify-end group p-1"
    >
      <User className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 group-hover:text-pink-100 hoverEffect" />
      <div className="hidden lg:flex flex-col">
        <h4 className="text-base font-bold group-hover:text-orange-500 hoverEffect">
          Account
        </h4>
        <p className="text-xs whitespace-nowrap">Login/Register</p>
      </div>
    </Link>
  );
};

export default Account;
