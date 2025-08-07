"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  ShoppingCart,
  Settings,
  MapPin,
  Heart,
  Receipt,
  Quote,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  ShoppingBag,
  ShoppingCart,
  Settings,
  MapPin,
  Heart,
  Receipt,
  Quote,
};

interface AccountMenuItem {
  icon: string; // Changed from LucideIcon to string
  label: string;
  href: string;
}

interface DynamicAccountLayoutProps {
  menuItems: AccountMenuItem[];
  children: React.ReactNode;
}

const DynamicAccountLayout: React.FC<DynamicAccountLayoutProps> = ({
  menuItems,
  children,
}) => {
  const pathname = usePathname();
  
  // Check if we're on a specific account page (not just /account)
  const isOnSpecificPage = pathname !== "/account" && pathname.startsWith("/account");
  
  // Find the active menu item
  const activeMenuItem = menuItems.find(item => pathname === item.href);

  if (isOnSpecificPage && activeMenuItem) {
    // Show horizontal menu with content below
    return (
      <div>
        {/* Horizontal Menu Bar */}
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white rounded-lg shadow-sm">
          {menuItems.map((item, index) => {
            const IconComponent = iconMap[item.icon];
            const isActive = pathname === item.href;
            
            return (
              <Link key={index} href={item.href}>
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-custom-navBar text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div
                    className={`p-1 rounded-full ${
                      isActive ? "bg-white/20" : ""
                    }`}
                    style={
                      !isActive
                        ? { backgroundColor: "var(--color-custom-sec2)" }
                        : {}
                    }
                  >
                    {IconComponent && (
                      <IconComponent
                        size={16}
                        className={isActive ? "text-white" : "text-custom-navBar"}
                      />
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Content Area */}
        <div>{children}</div>
      </div>
    );
  }

  // Show grid layout for main account page
  return (
    <div>
      {/* Account Menu Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {menuItems.map((item, index) => {
          const IconComponent = iconMap[item.icon];
          return (
            <Link key={index} href={item.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[120px]">
                  <div
                    className="mb-3 p-3 rounded-full"
                    style={{ backgroundColor: "var(--color-custom-sec2)" }}
                  >
                    {IconComponent && (
                      <IconComponent
                        size={24}
                        className="text-custom-navBar group-hover:scale-110 transition-transform"
                      />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-custom-navBar transition-colors">
                    {item.label}
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Additional Action Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: "var(--color-custom-sec2)" }}
              >
                <span className="text-custom-navBar font-bold">+</span>
              </div>
              <span className="font-medium text-gray-700">Add +</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: "var(--color-custom-sec2)" }}
              >
                <span className="text-custom-navBar font-bold">+</span>
              </div>
              <span className="font-medium text-gray-700">Add +</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children Content for main account page */}
      <div className="mt-8">{children}</div>
    </div>
  );
};

export default DynamicAccountLayout;
