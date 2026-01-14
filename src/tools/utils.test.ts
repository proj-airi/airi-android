import { describe, expect, it } from 'bun:test'
import { parseActivities } from './utils'

describe('parseActivities', () => {
  it('parses single activity', () => {
    const input = '    ACTIVITY com.example.app/.MainActivity 12345 pid=6789'
    const result = parseActivities(input)

    expect(result).toEqual([
      {
        package: 'com.example.app',
        class: '.MainActivity',
      },
    ])
  })

  it('parses multiple activities', () => {
    const input = `    ACTIVITY com.example.app/.MainActivity 12345 pid=6789
    ACTIVITY com.another.app/.SecondActivity 23456 pid=7890
    ACTIVITY com.third.app/.ThirdActivity 34567 pid=8901`
    const result = parseActivities(input)

    expect(result).toEqual([
      {
        package: 'com.third.app',
        class: '.ThirdActivity',
      },
      {
        package: 'com.another.app',
        class: '.SecondActivity',
      },
      {
        package: 'com.example.app',
        class: '.MainActivity',
      },
    ])
  })

  it('parses fully qualified class names', () => {
    const input = '    ACTIVITY com.example.app/com.example.app.MainActivity 12345 pid=6789'
    const result = parseActivities(input)

    expect(result).toEqual([
      {
        package: 'com.example.app',
        class: 'com.example.app.MainActivity',
      },
    ])
  })

  it('ignores empty lines', () => {
    const input = `    ACTIVITY com.example.app/.MainActivity 12345 pid=6789

    ACTIVITY com.another.app/.SecondActivity 23456 pid=7890`
    const result = parseActivities(input)

    expect(result).toEqual([
      {
        package: 'com.another.app',
        class: '.SecondActivity',
      },
      {
        package: 'com.example.app',
        class: '.MainActivity',
      },
    ])
  })

  it('ignores invalid lines', () => {
    const input = `    ACTIVITY com.example.app/.MainActivity 12345 pid=6789
    INVALID LINE
    ACTIVITY com.another.app/.SecondActivity 23456 pid=7890`
    const result = parseActivities(input)

    expect(result).toEqual([
      {
        package: 'com.another.app',
        class: '.SecondActivity',
      },
      {
        package: 'com.example.app',
        class: '.MainActivity',
      },
    ])
  })

  it('handles empty input', () => {
    const input = ''
    const result = parseActivities(input)

    expect(result).toEqual([])
  })

  it('parses real dumpsys output', () => {
    const input = `  * ActivityRecord{1a2b3c4 u0 com.android.launcher3/.Launcher t1}
    ACTIVITY com.android.launcher3/.Launcher 5d6e7f8 pid=1234
  * ActivityRecord{9a8b7c6 u0 com.android.settings/.Settings t2}
    ACTIVITY com.android.settings/.Settings 1f2e3d4 pid=5678`
    const result = parseActivities(input)

    expect(result).toEqual([
      {
        package: 'com.android.settings',
        class: '.Settings',
      },
      {
        package: 'com.android.launcher3',
        class: '.Launcher',
      },
    ])
  })
})
