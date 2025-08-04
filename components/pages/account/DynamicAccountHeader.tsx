"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SignOutButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import Image from "next/image";
import { useAccount } from "@/contexts/AccountContext";
import { usePathname } from "next/navigation";

interface UserData {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  emailAddress: string | undefined;
  createdAt: number;
}

interface DynamicAccountHeaderProps {
  user: UserData | null;
}

const DynamicAccountHeader = ({ user }: DynamicAccountHeaderProps) => {
const { isAccountMenuVisible, hideMainMenu } = useAccount();
  const pathname = usePathname();
  
  // Hide the header when on specific account sections (not on main account page)
const shouldHideHeader = (!hideMainMenu && pathname === "/account/account") || (pathname !== "/account/account" && pathname.startsWith("/account/"));
  
  if (shouldHideHeader && isAccountMenuVisible) {
    return null;
  }

  return (
    <Card className="mb-6 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user?.firstName || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <User size={40} className="text-gray-400" />
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-custom-navBar">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">
                {user?.emailAddress}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Member since{" "}
                {new Date(
                  user?.createdAt || Date.now()
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <SignOutButton>
              <button className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Logout
              </button>
            </SignOutButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicAccountHeader;
