// DONE_PRITH

import { auth } from "@/lib/next-auth";

const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth");

  if (!isLoggedIn && !isAuthRoute) {
    const newUrl = new URL("/auth", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  if (isLoggedIn && isAuthRoute) {
    const newUrl = new URL("/dashboard", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  // DEV_NOTE: This matcher is used to define the routes that should be protected by the middleware.
  matcher: [
    "/dashboard/:path*",
    "/interview/:path*",
    "/architecture/:path*",
    "/auth/:path*",
  ],
};

export default proxy;
