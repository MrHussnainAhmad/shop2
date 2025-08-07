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
import { AccountProvider } from "@/contexts/AccountContext";
import DynamicAccountHeader from "@/components/pages/account/DynamicAccountHeader";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await currentUser();

  // Extract only serializable user data
  const userData = user ? {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    emailAddress: user.emailAddresses?.[0]?.emailAddress,
    createdAt: user.createdAt,
  } : null;

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
    <AccountProvider>
      <div
        className="min-h-screen pt-4 pb-8 bg-custom-body"
      >
        <Container>
          <div className="max-w-6xl mx-auto">
            <Breadcrumb items={breadcrumbItems} />

            {/* Dynamic Account Header with conditional visibility */}
            <DynamicAccountHeader user={userData} />

            {/* Dynamic Account Layout - Account Menu */}
            <AccountMenu />
            {children}
          </div>
        </Container>
      </div>
    </AccountProvider>
  );
};

export default RootLayout;
