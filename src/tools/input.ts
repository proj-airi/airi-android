import z from "zod";
import { DeviceManager } from "../device";
import { Tool } from "./types";
import { shell } from "../utils/shell";

export const inputTools = [
  (() => {
    const inputSchema = z.object({
      x: z.number().describe("X coordinate"),
      y: z.number().describe("Y coordinate"),
    });
    const outputSchema = z.object({
      message: z.string(),
    });
    return {
      name: "input_tap",
      config: {
        title: "Tap on the screen at the given coordinates",
        description: "Tap on the screen at the given coordinates",
        inputSchema,
        outputSchema,
      },
      cb: async (args) => {
        const device = await DeviceManager.getInstance().getDevice();
        await shell(device, `input tap ${args.x} ${args.y}`);
        console.log("input_tap", args.x, args.y);
        return {
          content: [],
          structuredContent: {
            message: "Tap executed",
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
  (() => {
    const inputSchema = z.object({
      x1: z.number().describe("Start X coordinate"),
      y1: z.number().describe("Start Y coordinate"),
      x2: z.number().describe("End X coordinate"),
      y2: z.number().describe("End Y coordinate"),
      duration: z.number().default(500).describe("Swipe duration in milliseconds"),
    });
    const outputSchema = z.object({
      message: z.string(),
    });
    return {
      name: "input_swipe",
      config: {
        title: "Swipe from the given coordinates to the given coordinates",
        description: "Swipe from the given coordinates to the given coordinates",
        inputSchema,
        outputSchema,
      },
      cb: async (args) => {
        const device = await DeviceManager.getInstance().getDevice();
        const duration = args.duration || 500;
        await shell(device, `input swipe ${args.x1} ${args.y1} ${args.x2} ${args.y2} ${duration}`);
        console.log("input_swipe", args.x1, args.y1, "->", args.x2, args.y2, duration);
        return {
          content: [],
          structuredContent: {
            message: "Swipe executed",
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
  (() => {
    const inputSchema = z.object({
      text: z.string().describe("Text to input"),
    });
    const outputSchema = z.object({
      message: z.string(),
    });
    return {
      name: "input_text",
      config: {
        title: "Input text on the device",
        description: "Input text on the device",
        inputSchema,
        outputSchema,
      },
      cb: async (args) => {
        const device = await DeviceManager.getInstance().getDevice();
        const text = args.text.replace(/ /g, "%s");
        await shell(device, `input text "${text}"`);
        console.log("input_text", args.text);
        return {
          content: [],
          structuredContent: {
            message: "Text input executed",
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
  (() => {
    const inputSchema = z.object({
      keycode: z.number().describe("Key code"),
      longpress: z.boolean().default(false).describe("Whether to long press"),
    });
    const outputSchema = z.object({
      message: z.string(),
    });
    return {
      name: "input_keyevent",
      config: {
        title: "Send a key event to the device",
        description: "Send a key event to the device",
        inputSchema,
        outputSchema,
      },
      cb: async (args) => {
        const device = await DeviceManager.getInstance().getDevice();
        const longpress = args.longpress ? "--longpress" : "";
        await shell(device, `input keyevent ${longpress} ${args.keycode}`);
        console.log("input_keyevent", args.keycode, args.longpress ? "(longpress)" : "");
        return {
          content: [],
          structuredContent: {
            message: "Key event executed",
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
  (() => {
    const inputSchema = z.object({});
    const outputSchema = z.object({
      message: z.string(),
    });
    return {
      name: "input_press",
      config: {
        title: "Press the current key",
        description: "Press the current key",
        inputSchema,
        outputSchema,
      },
      cb: async () => {
        const device = await DeviceManager.getInstance().getDevice();
        await shell(device, "input press");
        console.log("input_press");
        return {
          content: [],
          structuredContent: {
            message: "Press executed",
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
  (() => {
    const inputSchema = z.object({
      dx: z.number().describe("Delta X"),
      dy: z.number().describe("Delta Y"),
    });
    const outputSchema = z.object({
      message: z.string(),
    });
    return {
      name: "input_roll",
      config: {
        title: "Roll the trackball",
        description: "Roll the trackball",
        inputSchema,
        outputSchema,
      },
      cb: async (args) => {
        const device = await DeviceManager.getInstance().getDevice();
        await shell(device, `input roll ${args.dx} ${args.dy}`);
        console.log("input_roll", args.dx, args.dy);
        return {
          content: [],
          structuredContent: {
            message: "Roll executed",
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
];
