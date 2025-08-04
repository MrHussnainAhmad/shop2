import Container from "@/components/common/Container";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import {
  User,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import AccountMenu from "@/components/pages/account/AccountMenu";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  const accountMenuItems = [
    { icon: "ShoppingBag", label: "Orders", href: "/account/orders" },
    { icon: "ShoppingCart", label: "Cart", href: "/cart" },
    { icon: "Settings", label: "Edit Profile", href: "/account/profile" },
    { icon: "MapPin", label: "Addresses", href: "/account/addresses" },
    { icon: "Heart", label: "Wish List", href: "/account/wishlist" },
    {
      icon: "Receipt",
      label: "Your Transactions",
      href: "/account/transactions",
    },
    { icon: "Settings", label: "Tech Points", href: "/account/points" },
    { icon: "Quote", label: "Quote", href: "/account/quote" },
  ];

  const breadcrumbItems = [{ label: "Account" }];

  return (
    <div
      className="min-h-screen pt-4 pb-8 bg-custom-body"
    >
      <Container>
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />

          {/* User Profile Header */}
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
                      {user?.emailAddresses[0]?.emailAddress}
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

          {/* Dynamic Account Layout - Account Menu */}
          <AccountMenu />
          {children}
        </div>
      </Container>
    </div>
  );
};

export default RootLayout;
