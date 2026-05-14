export function toOrigin(value: string | null | undefined): string | null {
  if (!value) return null

  try {
    return new URL(value).origin
  } catch {
    try {
      return new URL(`https://${value.replace(/^\/+|\/+$/g, '')}`).origin
    } catch {
      return null
    }
  }
}
