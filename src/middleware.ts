import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE = 'jazz_auth_session'

/** Routes that require authentication */
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/sessions',
  '/scales',
  '/standards',
  '/metronome',
  '/progress',
]

/** Routes that should redirect authed users away (e.g. login) */
const AUTH_ONLY_ROUTES = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authCookie = request.cookies.get(AUTH_COOKIE)?.value
  const isAuthed = Boolean(authCookie)

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  const isAuthOnly = AUTH_ONLY_ROUTES.some((p) => pathname === p)

  // Unauthenticated user trying to access a protected page → /login
  if (isProtected && !isAuthed) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Authenticated user visiting /login → /dashboard
  if (isAuthOnly && isAuthed) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
