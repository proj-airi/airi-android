import type { Tool } from './types'
import z from 'zod'
import { DeviceManager } from '../device'
import { shell } from '../utils/shell'

export const wmTools = [
  (() => {
    const inputSchema = z.object({})
    const outputSchema = z.object({
      width: z.number(),
      height: z.number(),
    })
    return {
      name: 'wm_size',
      config: {
        title: 'Get the physical size of the device screen',
        description: 'Get the physical size of the device screen',
        inputSchema,
        outputSchema,
      },
      cb: async () => {
        const device = await DeviceManager.getInstance().getDevice()
        const size = await shell(device, 'wm size | sed "s/Physical size: //g"')
        const [width, height] = size.split('x').map(Number)
        console.log('wm_size', width, height)
        return {
          content: [],
          structuredContent: {
            width,
            height,
          },
        }
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>
  })(),
  (() => {
    const inputSchema = z.object({})
    const outputSchema = z.object({
      density: z.number(),
    })
    return {
      name: 'wm_density',
      config: {
        title: 'Get the display density of the device',
        description: 'Get the display density of the device',
        inputSchema,
        outputSchema,
      },
      cb: async () => {
        const device = await DeviceManager.getInstance().getDevice()
        const output = await shell(device, 'wm density | sed "s/Physical density: //g"')
        const density = Number.parseInt(output.trim(), 10)
        console.log('wm_density', density)
        return {
          content: [],
          structuredContent: {
            density,
          },
        }
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>
  })(),
]
