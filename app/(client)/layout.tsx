"use client";
import Header from "@/components/header/Header";
import Footer from "@/components/common/Footer";
import CartMenu from "@/components/common/CartMenu";
import { CartProvider } from "@/contexts/CartContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      {children}
      <CartMenu />
      <Footer />
    </CartProvider>
  );
}
