import type { Tool } from './types'
import z from 'zod'
import { DeviceManager } from '../device'

export const deviceTools = [
  (() => {
    const inputSchema = z.object({
      host: z.string().describe('The host address of the device'),
      port: z.number().describe('The port number of the device'),
    })
    const outputSchema = z.object({
      message: z.string(),
    })
    return {
      name: 'device_connect',
      config: {
        title: 'Connect to a device at the specified host and port',
        description: 'Connect to a device at the specified host and port',
        inputSchema,
        outputSchema,
      },
      cb: async (args) => {
        console.log('device_connect', typeof args.host, typeof args.port)
        await DeviceManager.getInstance().connect(args.host, args.port)
        console.log('device_connect', args.host, args.port)
        return {
          content: [],
          structuredContent: {
            message: 'Device connected successfully',
          },
        }
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>
  })(),
  (() => {
    const inputSchema = z.object({})
    const outputSchema = z.object({})
    return {
      name: 'device_reset',
      config: {
        title: 'Reset the device connection',
        description: 'Reset the device connection',
        inputSchema,
        outputSchema,
      },
      cb: async () => {
        DeviceManager.getInstance().reset()
        console.log('device_reset')
        return {
          content: [],
          structuredContent: {},
        }
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>
  })(),
]
