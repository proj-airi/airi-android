import z from "zod";
import { DeviceManager } from "../device";
import { Tool } from "./types";
import { shell } from "../utils/shell";

export const batterystatsTools = [
  (() => {
    const inputSchema = z.object({});
    const outputSchema = z.object({
      level: z.number().nullable(),
    });
    return {
      name: "battery_level",
      config: {
        title: "Get battery level of the device",
        description: "Get battery level of the device",
        inputSchema,
        outputSchema,
      },
      cb: async () => {
        const device = await DeviceManager.getInstance().getDevice();
        const output = await shell(device, "dumpsys battery | grep level");
        const match = output.match(/level: (\d+)/);
        const level = match ? parseInt(match[1], 10) : null;
        console.log("battery_level", level);
        return {
          content: [],
          structuredContent: {
            level,
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
  (() => {
    const inputSchema = z.object({});
    const outputSchema = z.object({
      output: z.string(),
    });
    return {
      name: "battery_stats",
      config: {
        title: "Get detailed battery statistics",
        description: "Get detailed battery statistics",
        inputSchema,
        outputSchema,
      },
      cb: async () => {
        const device = await DeviceManager.getInstance().getDevice();
        const output = await shell(device, "dumpsys batterystats");
        return {
          content: [],
          structuredContent: { output },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
];
