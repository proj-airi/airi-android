import z from "zod";
import { DeviceManager } from "../device";
import { shell } from "../utils/shell";
import { Tool } from "./types";

export const shellTools = [
  (() => {
    const inputSchema = z.object({
      command: z.string(),
    });
    const outputSchema = z.object({
      output: z.string(),
    });
    return {
      name: "shell_execute",
      config: {
        title: "Execute a shell command",
        description: "Execute a shell command",
        inputSchema,
        outputSchema,
      },
      cb: async ({ command }) => {
        const device = await DeviceManager.getInstance().getDevice();
        const output = await shell(device, command);
        return {
          content: [],
          structuredContent: { output },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
];
