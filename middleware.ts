import { NextResponse, type NextRequest } from "next/server";
import { ROLES, Role } from "./lib/permissions";

export async function middleware(request: NextRequest) {
  // Better Auth sessions can be retrieved by making a request to the auth API
  const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const path = request.nextUrl.pathname;
  
  // No need to decode json if fetch fails or user is unauthenticated
  if (!res.ok) {
    if (path.startsWith('/evaluator') || path.startsWith('/admin') || path.startsWith('/records')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  const data = await res.json().catch(() => null);
  const session = data?.session || null;
  const user = data?.user || null;

  if (!session) {
    if (path.startsWith('/evaluator') || path.startsWith('/admin') || path.startsWith('/records')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Handle protected routes
  const userRole = user.role as Role;

  if (path.startsWith("/evaluator") && userRole !== ROLES.EVALUATOR) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path.startsWith("/admin") && userRole !== ROLES.ADMIN) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path.startsWith("/records") && userRole !== ROLES.RECORD_OFFICE) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
