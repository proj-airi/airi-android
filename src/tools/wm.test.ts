import { describe, expect, it } from 'bun:test'

describe('wm size parsing', () => {
  it('parses screen size', () => {
    const size = '1080x1920'
    const [width, height] = size.split('x').map(Number)

    expect(width).toBe(1080)
    expect(height).toBe(1920)
  })

  it('handles trailing newline', () => {
    const size = '1080x1920\n'
    const [width, height] = size.trim().split('x').map(Number)

    expect(width).toBe(1080)
    expect(height).toBe(1920)
  })
})

describe('wm density parsing', () => {
  it('parses density', () => {
    const output = '320'
    const density = Number.parseInt(output.trim(), 10)

    expect(density).toBe(320)
  })

  it('handles whitespace', () => {
    const output = '  320\n'
    const density = Number.parseInt(output.trim(), 10)

    expect(density).toBe(320)
  })

  it('returns NaN for invalid input', () => {
    const output = 'invalid'
    const density = Number.parseInt(output.trim(), 10)

    expect(Number.isNaN(density)).toBe(true)
  })
})
