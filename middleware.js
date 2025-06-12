import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Rutas públicas
  const publicPaths = ['/login', '/api/auth', '/_next'];
  
  // Si el usuario está autenticado y trata de acceder al login
  if (token && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Si no está autenticado y trata de acceder a una ruta protegida
  if (!token && !publicPaths.some(path => pathname.startsWith(path))) {
    const loginUrl = new URL('/login', request.url);
    // Solo agregamos callbackUrl si no es la ruta home
    if (pathname !== '/home') {
      loginUrl.searchParams.set('callbackUrl', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};