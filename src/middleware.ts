import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth(function middleware(req) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protect /submit — members only
  if (pathname.startsWith("/submit") && !session?.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect /admin — ADMIN or SUPER_ADMIN only
  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const role = (session?.user as any)?.role;
    if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/submit", "/admin/:path*"],
};
