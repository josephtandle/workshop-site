// Shared intake-field rules. The form and the API route both import these so
// client-side validation can never disagree with what the server enforces.

import { isValidPhoneNumber, parsePhoneNumberFromString } from 'libphonenumber-js'

export const BUSINESS_CONTEXT_MIN_LENGTH = 55
export const BUSINESS_CONTEXT_MAX_LENGTH = 4000
export const WHATSAPP_MIN_DIGITS = 8
export const WHATSAPP_MAX_DIGITS = 15
export const WHATSAPP_MAX_LENGTH = 32

export type IntakeFieldErrors = {
  whatsappNumber?: string
  businessContext?: string
}

/** Digits only, so formatting differences never fail a valid number. */
export function countPhoneDigits(value: string): number {
  return (value.match(/\d/g) ?? []).length
}

// The kind, canonical message shown whenever a number is not a valid, dialable
// international number. Kept in one place so the client and server never drift.
const WHATSAPP_INVALID_MESSAGE =
  'Add your full WhatsApp number including country code, like +62 812 3456 7890.'

/**
 * Build the candidate string we hand to libphonenumber-js. Every valid entry is
 * an international number, so we require a leading `+`. If the user omitted it we
 * add one in front of the digits: a number that already carries its country code
 * (`6281234567890`) becomes `+6281234567890` and parses, while a bare national
 * number (`081234567890`, `832305949`) becomes `+081234567890` / `+832305949`,
 * which no country claims, so it is correctly rejected. No default country is
 * ever assumed: this audience is international and guessing one silently mangles
 * everyone else's number.
 */
function toDialableCandidate(value: string): string {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('+')) return trimmed
  return `+${trimmed.replace(/[^\d]/g, '')}`
}

/**
 * Normalise to E.164 (`+` followed by digits) so every stored number is dialable.
 *
 * Uses libphonenumber-js so a number is only normalised when it is a genuinely
 * valid, dialable international number with the correct national length for its
 * country code. Returns null otherwise. On the happy path validation has already
 * accepted the value, so this parses cleanly.
 *
 * We import from the package's main entry, which resolves to its CommonJS build
 * here and works under this repo's tsx test runner (an earlier note claimed the
 * ESM build threw a metadata error; the main-entry import verified clean).
 */
export function toE164(value: string): string | null {
  const candidate = toDialableCandidate(value)
  if (!candidate) return null
  const parsed = parsePhoneNumberFromString(candidate)
  if (!parsed || !parsed.isValid()) return null
  return parsed.number
}

export function normalizeWhatsappNumber(value: string): string {
  // Fall back to the raw trimmed input rather than dropping it. Validation
  // rejects unparseable numbers before this runs on the happy path, and losing
  // a number outright would be worse than storing an odd one.
  return toE164(value) ?? value.trim()
}

export function validateWhatsappNumber(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Please add your WhatsApp number.'
  if (trimmed.length > WHATSAPP_MAX_LENGTH) return 'That number looks too long.'
  if (/[^\d\s+()\-.]/.test(trimmed)) return 'Use digits only, with an optional + for the country code.'

  // A number must parse to a valid, dialable international number: correct
  // country code AND correct national length, not merely a plausible digit
  // count. libphonenumber-js catches the undialable numbers the old digit-range
  // check let through (e.g. "+9177429141" India missing two digits,
  // "+4132689224" Switzerland short a digit, "832305949" with no country code).
  if (!isValidPhoneNumber(toDialableCandidate(trimmed))) {
    return WHATSAPP_INVALID_MESSAGE
  }

  return undefined
}

export function validateBusinessContext(
  value: string,
  minLength: number = BUSINESS_CONTEXT_MIN_LENGTH,
): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Please answer this question.'
  if (trimmed.length < minLength) {
    const remaining = minLength - trimmed.length
    return `A sentence or two is plenty. ${remaining} more character${remaining === 1 ? '' : 's'} to go.`
  }
  if (trimmed.length > BUSINESS_CONTEXT_MAX_LENGTH) return 'That is longer than the form can take. Please trim it down.'

  return undefined
}

export function validateIntakeFields(input: {
  whatsappNumber: string
  businessContext: string
  businessContextMinLength?: number
  aiLevelStep?: boolean
}): IntakeFieldErrors {
  const errors: IntakeFieldErrors = {}

  const whatsappError = validateWhatsappNumber(input.whatsappNumber)
  if (whatsappError) errors.whatsappNumber = whatsappError

  const businessError = validateBusinessContext(input.businessContext, input.businessContextMinLength)
  if ((!input.aiLevelStep || input.businessContext.trim()) && businessError) errors.businessContext = businessError

  return errors
}

export function hasIntakeErrors(errors: IntakeFieldErrors): boolean {
  return Boolean(errors.whatsappNumber || errors.businessContext)
}

export function isValidAiLevel(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 14
}
