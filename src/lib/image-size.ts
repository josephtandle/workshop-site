import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Real pixel dimensions for an image in /public, for og:image:width / height.
 *
 * Social cards were declaring a hardcoded 1200x630 for every event while the
 * actual heroes are 1600x900, 1536x1024 and 1200x627. Facebook and LinkedIn
 * lay the card out from the declared numbers, so the preview cropped wrong
 * (Illy, 2026-09-23). Declare what the file actually is.
 *
 * Dependency-free on purpose: only the JPEG SOF and PNG IHDR headers are read,
 * and results are cached for the life of the process.
 */

const FALLBACK = { width: 1200, height: 630 }
const cache = new Map<string, { width: number; height: number }>()

function parsePng(buf: Buffer) {
  if (buf.length < 24) return null
  if (buf.readUInt32BE(0) !== 0x89504e47) return null
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
}

function parseJpeg(buf: Buffer) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null
  let i = 2
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) {
      i += 1
      continue
    }
    const marker = buf[i + 1]
    // SOF0 / SOF1 / SOF2 carry the frame dimensions.
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) }
    }
    // Standalone markers have no length field.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2
      continue
    }
    const length = buf.readUInt16BE(i + 2)
    if (length < 2) return null
    i += 2 + length
  }
  return null
}

export function getPublicImageSize(publicPath: string): { width: number; height: number } {
  const key = publicPath
  const cached = cache.get(key)
  if (cached) return cached

  let size = FALLBACK
  try {
    const clean = publicPath.split('?')[0].replace(/^\/+/, '')
    const buf = readFileSync(join(process.cwd(), 'public', clean))
    size = parsePng(buf) ?? parseJpeg(buf) ?? FALLBACK
  } catch {
    size = FALLBACK
  }
  cache.set(key, size)
  return size
}
