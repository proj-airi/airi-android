import { describe, expect, it } from 'bun:test'
import { parseProcStat } from './cpustat'

describe('parseProcStat', () => {
  it('parses standard /proc/stat output', async () => {
    const input = 'cpu  1234 5678 9012 3456 7890 1234 5678'
    const result = await parseProcStat(input)

    expect(result).toEqual({
      user: 1234,
      nice: 5678,
      system: 9012,
      idle: 3456,
      iowait: 7890,
      irq: 1234,
      softirq: 5678,
    })
  })

  it('parses output with multiple spaces', async () => {
    const input = 'cpu   100   200   300   400   500   600   700'
    const result = await parseProcStat(input)

    expect(result).toEqual({
      user: 100,
      nice: 200,
      system: 300,
      idle: 400,
      iowait: 500,
      irq: 600,
      softirq: 700,
    })
  })

  it('parses multiline output', async () => {
    const input = `cpu  1000 2000 3000 4000 5000 6000 7000
cpu0 100 200 300 400 500 600 700
cpu1 100 200 300 400 500 600 700`
    const result = await parseProcStat(input)

    expect(result).toEqual({
      user: 1000,
      nice: 2000,
      system: 3000,
      idle: 4000,
      iowait: 5000,
      irq: 6000,
      softirq: 7000,
    })
  })

  it('returns undefined for invalid format', async () => {
    const input = 'invalid format'
    const result = await parseProcStat(input)

    expect(result).toBeUndefined()
  })

  it('returns undefined for insufficient fields', async () => {
    const input = 'cpu  1000 2000 3000'
    const result = await parseProcStat(input)

    expect(result).toBeUndefined()
  })
})
