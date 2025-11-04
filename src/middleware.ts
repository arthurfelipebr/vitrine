import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  // Public paths
  const publicPaths = ['/login', '/registro', '/u']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // If accessing protected route without session
  if (!session && !isPublicPath && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If accessing login/register with session
  if (session && (pathname === '/login' || pathname === '/registro')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
