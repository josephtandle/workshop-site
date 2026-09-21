// Supabase calls have no built-in timeout. When the database stalled on
// 2026-09-21 every registration hung on "Preparing..." forever, so any call on
// the registration path that can stall is bounded with this.
export class TimeoutError extends Error {
  constructor(label: string, ms: number) {
    super(`${label} timed out after ${ms}ms`)
    this.name = 'TimeoutError'
  }
}

export function withTimeout<T>(work: PromiseLike<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(label, ms)), ms)
  })
  return Promise.race([Promise.resolve(work), timeout]).finally(() => clearTimeout(timer))
}
