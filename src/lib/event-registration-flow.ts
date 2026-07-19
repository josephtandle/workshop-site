export function resolveAcquisitionRef(searchInput: string | URLSearchParams | null | undefined) {
  const params =
    typeof searchInput === 'string'
      ? new URLSearchParams(searchInput)
      : searchInput ?? new URLSearchParams()

  return params.get('ref')?.trim().toLowerCase() || 'joe-che'
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
}) {
  const acquisitionRef =
    resolveAcquisitionRef(input.search) || 'joe-che'

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
  }
}
