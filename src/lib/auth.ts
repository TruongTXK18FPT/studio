import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// Ensure JWT_SECRET exists and is strong enough
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

if (JWT_SECRET.length < 32) {
  console.warn('JWT_SECRET should be at least 32 characters long for security')
}

const secret = new TextEncoder().encode(JWT_SECRET)

export interface JWTPayload {
  sub: string
  email: string
  name?: string
  role?: string
  iat?: number
  exp?: number
}

// Ký JWT token
export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JWTPayload
  } catch (error) {
    // Log the specific error type for debugging
    if (error instanceof Error) {
      console.warn(`JWT verification failed: ${error.name} - ${error.message}`)
    } else {
      console.warn('JWT verification failed with unknown error:', error)
    }
    return null
  }
}

// Lấy session từ cookie (server-side)
export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value
    
    if (!token) return null
    
    const session = await verifyToken(token)
    
    // If token verification fails, clear the invalid cookie
    if (!session) {
      cookieStore.set('session', '', {
        ...getSessionCookieOptions(),
        maxAge: 0
      })
    }
    
    return session
  } catch (error) {
    console.error('Get session failed:', error)
    return null
  }
}

// Tạo session cookie options
export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  }
}
