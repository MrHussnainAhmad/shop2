"use client";

import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DynamicBreadcrumbProps {
  items: BreadcrumbItem[];
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600 mb-6">
      <Link 
        href="/" 
        className="flex items-center hover:text-custom-navBar transition-colors"
      >
        <Home size={16} />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-gray-400" />
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-custom-navBar transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-custom-navBar font-medium">
              {item.label.includes(' vs ') ? (
                item.label.split(' vs ').map((part, partIndex, parts) => (
                  <React.Fragment key={partIndex}>
                    {part}
                    {partIndex < parts.length - 1 && (
                      <span className="text-red-500 font-bold mx-1">vs</span>
                    )}
                  </React.Fragment>
                ))
              ) : (
                item.label
              )}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default DynamicBreadcrumb;
