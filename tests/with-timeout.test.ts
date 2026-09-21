import assert from 'node:assert/strict'
import test from 'node:test'
import { TimeoutError, withTimeout } from '../src/lib/with-timeout'

test('withTimeout resolves fast work and rejects stalled work', async () => {
  assert.equal(await withTimeout(Promise.resolve(7), 50, 'fast'), 7)
  await assert.rejects(withTimeout(new Promise(() => {}), 30, 'stalled'), TimeoutError)
})
