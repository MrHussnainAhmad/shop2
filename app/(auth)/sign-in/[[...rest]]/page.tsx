import Logo from "@/components/common/Logo";
import { SignIn } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
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
              <h2 className="text-2xl text-white">Welcom Back!</h2>
              <p className="text-sm text-white">Please select the method to proceed.</p>
            </div>
          </div>
          <div className="p-6">
            <SignIn path="/sign-in" signUpUrl="/sign-up?redirect_url=/account/account"/>
          </div>
        </div>
      </div>
    </div>
  );
}
