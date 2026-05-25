import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import AppMiddleware from "@/lib/middleware/app";

import { BLOCKED_PATHNAMES } from "./lib/constants";

export const config = {
  matcher: [
    "/((?!api/|_next/|_static|vendor|_icons|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};

// Self-host single-tenant: every non-view path is the app. No host-based routing.
export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const path = req.nextUrl.pathname;

  if (
    !path.startsWith("/view/") &&
    !path.startsWith("/verify") &&
    !path.startsWith("/unsubscribe")
  ) {
    return AppMiddleware(req);
  }

  if (
    path.startsWith("/view/") &&
    (BLOCKED_PATHNAMES.some((b) => path.includes(b)) || path.includes("."))
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/404";
    return NextResponse.rewrite(url, { status: 404 });
  }

  return NextResponse.next();
}
