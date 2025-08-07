import CartMenu from "@/components/common/CartMenu";
import { AccountProvider } from "@/contexts/AccountContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AccountProvider>
      {children}
      <CartMenu />
    </AccountProvider>
  );
}
