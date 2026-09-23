// 'joe-che' is a real channel: it is the ref on the plain task-you-hate short
// link. Using it as the no-ref default too made untagged traffic and that link
// indistinguishable, so 13 of the first 14 free-workshop sign-ups could not be
// attributed to a channel at all (Illy, 2026-09-23). Untagged now says so.
export const UNTAGGED_ACQUISITION_REF = 'untagged'

export function resolveAcquisitionRef(searchInput: string | URLSearchParams | null | undefined) {
  const params =
    typeof searchInput === 'string'
      ? new URLSearchParams(searchInput)
      : searchInput ?? new URLSearchParams()

  return params.get('ref')?.trim().toLowerCase() || UNTAGGED_ACQUISITION_REF
}

export function buildEventCheckoutRequestBody(input: {
  slug: string
  attendeeName: string
  attendeeEmail: string
  promoCode?: string
  journeyId?: string
  acquisitionRoute?: string
  acquisitionQuery?: string
  search?: string | URLSearchParams | null
  referrer?: string
  checkoutMode?: string
  donationAmount?: number
  whatsappNumber?: string
  businessContext?: string
}) {
  const acquisitionRef =
    resolveAcquisitionRef(input.search) || UNTAGGED_ACQUISITION_REF

  return {
    slug: input.slug,
    attendeeName: input.attendeeName,
    attendeeEmail: input.attendeeEmail,
    promoCode: input.promoCode ?? '',
    journeyId: input.journeyId ?? '',
    acquisitionRoute: input.acquisitionRoute ?? '/events',
    acquisitionQuery: input.acquisitionQuery ?? '',
    acquisitionRef,
    referrer: input.referrer,
    checkoutMode: input.checkoutMode,
    ...(input.donationAmount !== undefined ? { donationAmount: input.donationAmount } : {}),
    ...(input.whatsappNumber !== undefined ? { whatsappNumber: input.whatsappNumber } : {}),
    ...(input.businessContext !== undefined ? { businessContext: input.businessContext } : {}),
  }
}
