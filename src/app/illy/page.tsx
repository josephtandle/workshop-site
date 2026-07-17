import { createHash, timingSafeEqual } from 'node:crypto'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { GUIDE_HTML } from './content'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

function sha256(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function matchesGuideCookie(value: string | undefined, password: string) {
  if (!value || !/^[a-f0-9]{64}$/i.test(value)) return false

  return timingSafeEqual(Buffer.from(value, 'hex'), Buffer.from(sha256(password), 'hex'))
}

export default async function IllyPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>
}) {
  const password = process.env.ILLY_GUIDE_PASSWORD

  if (!password) {
    return (
      <main className="min-h-screen bg-[#2B1F38] px-6 py-12 text-[#FCF4EB]">
        <p>Guide not configured</p>
      </main>
    )
  }

  const cookieStore = await cookies()
  const isAuthenticated = matchesGuideCookie(cookieStore.get('illy_guide_auth')?.value, password)

  if (isAuthenticated) {
    return (
      <main className="w-full bg-[#FCF4EB] text-[#2B1F38]">
        <div className="w-full" dangerouslySetInnerHTML={{ __html: GUIDE_HTML }} />
      </main>
    )
  }

  const { e } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#2B1F38] px-6 py-12 text-[#FCF4EB]">
      <form action="/api/illy-auth" method="post" className="w-full max-w-sm space-y-5">
        <label className="block space-y-2" htmlFor="password">
          <span className="text-sm font-semibold">Password</span>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-[#FCF4EB]/30 bg-transparent px-4 py-3 text-[#FCF4EB] outline-none transition focus:border-[#7C69C7] focus:ring-2 focus:ring-[#7C69C7]"
          />
        </label>
        {e === '1' && <p className="text-sm text-[#FCF4EB]">Wrong password</p>}
        <button
          type="submit"
          className="w-full rounded-md bg-[#7C69C7] px-4 py-3 font-semibold text-[#FCF4EB] transition hover:bg-[#8D7BD8] focus:outline-none focus:ring-2 focus:ring-[#FCF4EB] focus:ring-offset-2 focus:ring-offset-[#2B1F38]"
        >
          Continue
        </button>
      </form>
    </main>
  )
}
