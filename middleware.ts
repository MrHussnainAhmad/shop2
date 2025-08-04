import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//route matcher
const isProtectingRoute = createRouteMatcher([
  "/admin(.*)",
  "/account(.*)",
  "/cart(.*)",
  "/wishlist(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const authObject = await auth();
  if (isProtectingRoute(req) && !authObject.userId) {
    const signInUrl = new URL(
      `/sign-in?redirect_url=${req.nextUrl.pathname}`,
      req.url
    );
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
