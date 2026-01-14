import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { AnySchema, ZodRawShapeCompat } from '@modelcontextprotocol/sdk/server/zod-compat.js'
import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js'
import type z from 'zod'
import type { DeviceManager } from '../device'

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: z.ZodType
}

export type ToolHandler = (
  deviceManager: DeviceManager,
  args: z.ZodType,
) => Promise<{
  content: Array<{ type: string, text: string }>
}>

export interface ToolModule<InputSchema extends z.ZodSchema> {
  tools: ToolDefinition[]
  handleTool: (
    name: string,
    deviceManager: DeviceManager,
    args: z.infer<InputSchema>,
  ) => Promise<{
    content: Array<{ type: string, text: string }>
  }>
}

export interface Tool<OutputArgs extends ZodRawShapeCompat | AnySchema, InputArgs extends undefined | ZodRawShapeCompat | AnySchema = undefined> {
  name: string
  config: {
    title?: string
    description?: string
    inputSchema?: InputArgs
    outputSchema?: OutputArgs
    annotations?: ToolAnnotations
    _meta?: Record<string, unknown>
  }
  cb: ToolCallback<InputArgs>
}
