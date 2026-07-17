import { createHash, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function matchesPassword(password: string, expected: string) {
  return timingSafeEqual(
    Buffer.from(sha256(password), 'hex'),
    Buffer.from(sha256(expected), 'hex'),
  )
}

export async function POST(request: Request) {
  const expectedPassword = process.env.ILLY_GUIDE_PASSWORD
  const formData = await request.formData()
  const password = formData.get('password')

  if (!expectedPassword || typeof password !== 'string' || !matchesPassword(password, expectedPassword)) {
    return NextResponse.redirect(new URL('/illy?e=1', request.url), 303)
  }

  const response = NextResponse.redirect(new URL('/illy', request.url), 303)
  response.cookies.set('illy_guide_auth', sha256(password), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return response
}
