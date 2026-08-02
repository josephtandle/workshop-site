// Shared intake-field rules. The form and the API route both import these so
// client-side validation can never disagree with what the server enforces.

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

// Country calling codes, longest first so matching is unambiguous. Not the full
// ITU list, just enough to recognise a leading code and spot a doubled one.
const CALLING_CODES = [
  '1', '7', '20', '27', '30', '31', '32', '33', '34', '36', '39', '40', '41', '43', '44',
  '45', '46', '47', '48', '49', '51', '52', '53', '54', '55', '56', '57', '58', '60', '61',
  '62', '63', '64', '65', '66', '81', '82', '84', '86', '90', '91', '92', '93', '94', '95',
  '98', '212', '213', '216', '218', '220', '221', '233', '234', '250', '251', '254', '255',
  '256', '260', '263', '264', '265', '266', '267', '268', '269', '351', '352', '353', '354',
  '355', '356', '357', '358', '359', '370', '371', '372', '373', '374', '375', '376', '377',
  '378', '380', '381', '382', '385', '386', '387', '389', '420', '421', '423', '501', '502',
  '503', '504', '505', '506', '507', '509', '590', '591', '593', '595', '598', '673', '674',
  '675', '676', '677', '679', '680', '682', '685', '686', '687', '689', '852', '853', '855',
  '856', '880', '886', '960', '961', '962', '963', '964', '965', '966', '967', '968', '970',
  '971', '972', '973', '974', '975', '976', '977', '992', '993', '994', '995', '996', '998',
].sort((a, b) => b.length - a.length)

const E164_MIN_DIGITS = 8
const E164_MAX_DIGITS = 15

function leadingCallingCode(digits: string): string | null {
  return CALLING_CODES.find((code) => digits.startsWith(code)) ?? null
}

/**
 * Normalise to E.164 (`+` followed by digits) so every stored number is dialable.
 *
 * The old version only stripped punctuation. Someone whose number already
 * carried its country code, typing an extra leading 1, was stored as
 * 116462092333: a doubled country code no dialler can use. Seen on a real
 * registration 2026-08-02, which is why the doubling check below exists.
 *
 * No default country is assumed. This audience is international and defaulting
 * to one country silently mangles everyone else's number, so the field asks for
 * the country code and a bare number is read as international.
 *
 * Deliberately not libphonenumber-js: its ESM build throws a metadata error
 * under this repo's tsx test runner, and it would add ~145KB to a client bundle
 * for one form field.
 *
 * Returns null when the input cannot be read as a valid international number.
 */
export function toE164(value: string): string | null {
  const cleaned = String(value ?? '').trim().replace(/[^\d]/g, '')
  if (!cleaned) return null

  const code = leadingCallingCode(cleaned)
  if (!code) return null

  // Collapse an accidentally doubled country code, but only when dropping one
  // copy still leaves a plausible number. Never guess beyond that.
  let digits = cleaned
  if (digits.startsWith(code + code)) {
    const collapsed = digits.slice(code.length)
    if (collapsed.length >= E164_MIN_DIGITS && collapsed.length <= E164_MAX_DIGITS) {
      digits = collapsed
    }
  }

  if (digits.length < E164_MIN_DIGITS || digits.length > E164_MAX_DIGITS) return null
  // A country code alone is not a phone number.
  if (digits.length <= code.length) return null

  return `+${digits}`
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

  const digits = countPhoneDigits(trimmed)
  if (digits < WHATSAPP_MIN_DIGITS) return 'That number looks too short. Include your country code.'
  if (digits > WHATSAPP_MAX_DIGITS) return 'That number looks too long.'

  // Deliberately NOT rejecting numbers that fail E.164 parsing. Plenty of this
  // audience types a national format such as 081234567890 in Indonesia, and
  // blocking a real registration is worse than storing a number that needs a
  // human to read the country off. toE164 upgrades what it can; the rest is
  // stored verbatim.

  return undefined
}

export function validateBusinessContext(value: string): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) return 'Please tell us a little about your business.'
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
