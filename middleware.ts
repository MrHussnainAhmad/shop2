import { clerkMiddleware } from "@clerk/nextjs/server";

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your middleware
export default clerkMiddleware({
  // Add any routes that should be publicly accessible.
  publicRoutes: [
    "/",
    "/shop/(.*)", 
    "/product/(.*)",
    "/api/banners",
    "/api/banners/(.*)",
    "/api/categories/(.*)",
    "/api/brands/(.*)", 
    "/api/products/(.*)",
    "/api/webhooks/(.*)",
    "/api/upload/(.*)",
    "/api/test/(.*)",
    "/test-upload",
    "/aboutus",
    "/contactus",
    "/faqs",
    "/help",
    "/privacy",
    "/terms"
  ],
});

export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    "/((?!.+\.[\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have been excluded above.
    "/(api|trpc)(.*)",
  ],
};
