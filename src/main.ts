import type { AnySchema } from '@modelcontextprotocol/sdk/server/zod-compat.js'
import { serve } from 'bun'
import process from 'node:process'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import packageJson from '../package.json' with { type: 'json' }
import { moduleTools } from './tools'

// Start the server
async function main() {
  const useStdio = process.env.USE_STDIO === 'true'

  const mcpServer = new McpServer({
    name: packageJson.name,
    version: packageJson.version,
  })

  moduleTools.forEach((module) => {
    module.forEach((tool) => {
      mcpServer.registerTool<AnySchema, AnySchema>(tool.name, tool.config, tool.cb)
    })
  })

  if (useStdio) {
    const transport = new StdioServerTransport()
    await mcpServer.connect(transport)
    console.log('Server is running on stdio')

    return
  }

  const transport = new WebStandardStreamableHTTPServerTransport()

  const app = new Hono()
    .use('*', cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'mcp-session-id', 'Last-Event-ID', 'mcp-protocol-version'],
      exposeHeaders: ['mcp-session-id', 'mcp-protocol-version'],
    }))
    .get('/health', c => c.json({ status: 'ok' }))
    .all('/mcp', c => transport.handleRequest(c.req.raw))

  await mcpServer.connect(transport)

  const httpServer = serve({
    fetch: app.fetch,
    port: 3000,
  })

  console.log(`Server is running on http://localhost:3000`)

  process.once('SIGINT', () => {
    console.log('Server is shutting down...')
    httpServer.stop()
  })
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
