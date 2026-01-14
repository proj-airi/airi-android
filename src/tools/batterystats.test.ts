import { describe, expect, it } from 'bun:test'

describe('battery level parsing', () => {
  it('parses battery level from dumpsys output', () => {
    const output = '  level: 85'
    const match = output.match(/level: (\d+)/)
    const level = match ? Number.parseInt(match[1], 10) : null

    expect(level).toBe(85)
  })

  it('parses multiline output', () => {
    const output = `Current Battery Service state:
  AC powered: false
  USB powered: true
  level: 42
  scale: 100
  voltage: 3850`
    const match = output.match(/level: (\d+)/)
    const level = match ? Number.parseInt(match[1], 10) : null

    expect(level).toBe(42)
  })

  it('returns null when level not found', () => {
    const output = 'AC powered: false\nUSB powered: true'
    const match = output.match(/level: (\d+)/)
    const level = match ? Number.parseInt(match[1], 10) : null

    expect(level).toBeNull()
  })

  it('matches first occurrence', () => {
    const output = `level: 50
some other text
level: 75`
    const match = output.match(/level: (\d+)/)
    const level = match ? Number.parseInt(match[1], 10) : null

    expect(level).toBe(50)
  })
})
