function getInsightCollectorUrl() {
  if (process.env.INSIGHT_TO_FIX_COLLECTOR_URL) return process.env.INSIGHT_TO_FIX_COLLECTOR_URL
  return process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000/api/insight-to-fix/event'
}

export async function trackInsightEvent(eventType: string, payload: {
  route: string
  email?: string | null
  contactId?: string | null
  checkoutId?: string | null
  sessionId?: string | null
  properties?: Record<string, unknown>
}) {
  const collectorUrl = getInsightCollectorUrl()
  if (!collectorUrl) return

  try {
    await fetch(collectorUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(1200),
      body: JSON.stringify({
        project: 'mastermind-workshop',
        event_type: eventType,
        route: payload.route,
        source: 'mastermind-workshop-site',
        email: payload.email || undefined,
        contact_id: payload.contactId || undefined,
        checkout_id: payload.checkoutId || undefined,
        session_id: payload.sessionId || undefined,
        properties: payload.properties || {},
      }),
    })
  } catch (error) {
    console.warn('[insight-to-fix] event skipped:', error)
  }
}
