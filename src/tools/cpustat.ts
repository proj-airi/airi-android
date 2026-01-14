import z from "zod";
import { DeviceManager } from "../device";
import { Tool } from "./types";
import { shell } from "../utils/shell";

interface TotalCPUStat {
  user: number;
  nice: number;
  system: number;
  idle: number;
  iowait: number;
  irq: number;
  softirq: number;
}

async function parseProcStat(output: string): Promise<TotalCPUStat | undefined> {
  const match = output.match(
    /cpu\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/
  );
  if (match) {
    return {
      user: parseInt(match[1], 10),
      nice: parseInt(match[2], 10),
      system: parseInt(match[3], 10),
      idle: parseInt(match[4], 10),
      iowait: parseInt(match[5], 10),
      irq: parseInt(match[6], 10),
      softirq: parseInt(match[7], 10),
    };
  }
}

export const cpustatTools = [
  (() => {
    const inputSchema = z.object({
      interval: z.number().default(1.0).describe("Interval in seconds"),
    });
    const outputSchema = z.object({
      percent: z.number(),
    });
    return {
      name: "cpu_percent",
      config: {
        title: "Get CPU usage percentage",
        description: "Get CPU usage percentage",
        inputSchema,
        outputSchema,
      },
      cb: async (args) => {
        const device = await DeviceManager.getInstance().getDevice();
        const interval = args.interval || 1.0;
        const output1 = await shell(device, "cat /proc/stat | head -1");
        await new Promise((resolve) => setTimeout(resolve, interval * 1000));
        const output2 = await shell(device, "cat /proc/stat | head -1");
        const stat1 = await parseProcStat(output1);
        const stat2 = await parseProcStat(output2);
        if (stat1 && stat2) {
          const total1 =
            stat1.user +
            stat1.nice +
            stat1.system +
            stat1.idle +
            stat1.iowait +
            stat1.irq +
            stat1.softirq;
          const total2 =
            stat2.user +
            stat2.nice +
            stat2.system +
            stat2.idle +
            stat2.iowait +
            stat2.irq +
            stat2.softirq;
          const idle = stat2.idle - stat1.idle;
          const total = total2 - total1;
          const percent = ((total - idle) / total) * 100;
          console.log("cpu_percent", percent.toFixed(2));
          return {
            content: [],
            structuredContent: {
              percent: parseFloat(percent.toFixed(2)),
            },
          };
        }
        console.log("cpu_percent", 0);
        return {
          content: [],
          structuredContent: {
            percent: 0,
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
  (() => {
    const inputSchema = z.object({});
    const outputSchema = z.object({
      count: z.number(),
    });
    return {
      name: "cpu_count",
      config: {
        title: "Get the number of CPU cores",
        description: "Get the number of CPU cores",
        inputSchema,
        outputSchema,
      },
      cb: async () => {
        const device = await DeviceManager.getInstance().getDevice();
        const output = await shell(device, "nproc");
        const count = parseInt(output.trim(), 10);
        console.log("cpu_count", count);
        return {
          content: [],
          structuredContent: {
            count,
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
];
