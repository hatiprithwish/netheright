import { auth } from "@/lib/next-auth";

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname !== "/auth") {
    const newUrl = new URL("/auth", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/interview/:path*"],
};
