import Logo from "@/components/common/Logo";
import { SignUp } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br  from-white to text-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-custom-body rounded-2xl shadow-xl overflow-hidden">
          <div className="relative">
            <div className="absolute top-5 left-4 z-10">
              <Link href="/">
                <button className="p-2 rounded-full bg-custom-body hover:bg-gray-200 transition-colors hoverEffect shadow-md">
                  <ArrowLeft />
                </button>
              </Link>
            </div>
            <div className="bg-custom-navBar p-0 text-center">
              <div className="flex items-center justify-center mb-4">
                <Logo />
              </div>
              <h2 className="text-2xl text-white">Let's Create An Account!</h2>
              <p className="text-sm text-white">
                Your Shopping Matters...              </p>
            </div>
          </div>
          <div className="p-6">
            <SignUp
              path="/sign-up"
              signInUrl="/sign-in?redirect_url=/account/account"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
