import { SignJWT, jwtVerify } from 'jose'
import { createHash } from 'crypto'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_please_change_in_prod'
)

// Use SHA-256 for password hashing (simple and effective for this use case)
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export async function signParentToken(payload: { pupilId: string; isFirstLogin: boolean }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyParentToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256']
    })
    return payload as { pupilId: string; isFirstLogin: boolean }
  } catch (error) {
    return null
  }
}
