// Shared intake-field rules. The form and the API route both import these so
// client-side validation can never disagree with what the server enforces.

export const BUSINESS_CONTEXT_MIN_LENGTH = 80
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

export function normalizeWhatsappNumber(value: string): string {
  const trimmed = value.trim()
  const digits = trimmed.replace(/\D/g, '')
  // Preserve an explicit country-code marker; otherwise store bare digits.
  return trimmed.startsWith('+') ? `+${digits}` : digits
}

export function validateWhatsappNumber(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Please add your WhatsApp number.'
  if (trimmed.length > WHATSAPP_MAX_LENGTH) return 'That number looks too long.'
  if (/[^\d\s+()\-.]/.test(trimmed)) return 'Use digits only, with an optional + for the country code.'

  const digits = countPhoneDigits(trimmed)
  if (digits < WHATSAPP_MIN_DIGITS) return 'That number looks too short. Include your country code.'
  if (digits > WHATSAPP_MAX_DIGITS) return 'That number looks too long.'

  return undefined
}

export function validateBusinessContext(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Please tell me a little about your business.'
  if (trimmed.length < BUSINESS_CONTEXT_MIN_LENGTH) {
    const remaining = BUSINESS_CONTEXT_MIN_LENGTH - trimmed.length
    return `A sentence or two is plenty. ${remaining} more character${remaining === 1 ? '' : 's'} to go.`
  }
  if (trimmed.length > BUSINESS_CONTEXT_MAX_LENGTH) return 'That is longer than the form can take. Please trim it down.'

  return undefined
}

export function validateIntakeFields(input: {
  whatsappNumber: string
  businessContext: string
}): IntakeFieldErrors {
  const errors: IntakeFieldErrors = {}

  const whatsappError = validateWhatsappNumber(input.whatsappNumber)
  if (whatsappError) errors.whatsappNumber = whatsappError

  const businessError = validateBusinessContext(input.businessContext)
  if (businessError) errors.businessContext = businessError

  return errors
}

export function hasIntakeErrors(errors: IntakeFieldErrors): boolean {
  return Boolean(errors.whatsappNumber || errors.businessContext)
}
