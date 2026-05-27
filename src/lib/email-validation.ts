export const EMAIL_RE = /^[^\s@]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,63}$/

export function normaliseEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string) {
  return EMAIL_RE.test(normaliseEmail(email))
}
