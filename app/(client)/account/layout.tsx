import Container from "@/components/common/Container";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { SignOutButton } from "@clerk/nextjs";
import {
  User,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import AccountMenu from "@/components/pages/account/AccountMenu";
import { AccountProvider } from "@/contexts/AccountContext";
import DynamicAccountHeader from "@/components/pages/account/DynamicAccountHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ClientAccountLayout from "@/components/pages/account/ClientAccountLayout";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const breadcrumbItems = [{ label: "Account" }];

  return (
    <ProtectedRoute>
      <AccountProvider>
        <div className="min-h-screen pt-4 pb-8 bg-custom-body">
          <Container>
            <div className="max-w-6xl mx-auto">
              <Breadcrumb items={breadcrumbItems} />
              
              {/* Client-side Account Layout with proper auth handling */}
              <ClientAccountLayout>
                {children}
              </ClientAccountLayout>
            </div>
          </Container>
        </div>
      </AccountProvider>
    </ProtectedRoute>
  );
};

export default RootLayout;
