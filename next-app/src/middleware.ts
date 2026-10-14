import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE = 'ks_session';

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET || '');
}

async function sessionRole(req: NextRequest): Promise<'owner' | 'cashier' | null> {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role === 'owner' || payload.role === 'cashier') return payload.role;
    return null;
  } catch {
    return null;
  }
}

const OWNER_ONLY = ['/menu', '/shift'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/login' || pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }
  const role = await sessionRole(req);
  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  if (OWNER_ONLY.some((p) => pathname === p || pathname.startsWith(p + '/')) && role !== 'owner') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
