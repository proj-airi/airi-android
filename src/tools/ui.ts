import type { Tool } from './types'
import z from 'zod'
import { DeviceManager } from '../device'
import { shell } from '../utils/shell'

export const uiTools = [
  (() => {
    const inputSchema = z.object({})
    const outputSchema = z.object({
      hierarchy: z.string(),
    })
    return {
      name: 'ui_get_hierarchy',
      config: {
        title: 'Get UI hierarchy',
        description: 'Get UI hierarchy',
        inputSchema,
        outputSchema,
      },
      cb: async () => {
        const device = await DeviceManager.getInstance().getDevice()
        const dumpResult = await shell(device, 'uiautomator dump')
        const dumpOutput = dumpResult.trim()
        if (
          !dumpOutput.includes('UI hierchary dumped to: /sdcard/window_dump.xml')
        ) {
          throw new Error('Failed to get UI hierarchy')
        }
        const xmlOutput = await shell(device, 'cat /sdcard/window_dump.xml')
        console.log('ui_get_hierarchy', xmlOutput.length, 'chars')
        return {
          content: [],
          structuredContent: {
            hierarchy: xmlOutput,
          },
        }
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>
  })(),
]
