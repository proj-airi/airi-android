import z from "zod";
import { DeviceManager } from "../device";
import { Tool } from "./types";
import { shell } from "../utils/shell";
import { DeviceClient } from "@devicefarmer/adbkit";

const ActivitySchema = z.object({
  package: z.string(),
  class: z.string(),
});

type Activity = z.infer<typeof ActivitySchema>;

export function parseActivities(shellOutput: string): Activity[] {
  const activities: Activity[] = [];
  const lines = shellOutput.trim().split("\n");
  for (const line of lines) {
    if (!line)
      continue

    const activity = line.trim().split(' ')[1]
    const components = activity.split('/');
    if (components.length === 2) {
      activities.push({
        package: components[0],
        class: components[1],
      });
    }
  }

  return activities.reverse();
}

async function getActivities(device: DeviceClient): Promise<Activity[]> {
  const output = await shell(device, "dumpsys activity top | grep ACTIVITY");
  return parseActivities(output);
}

export const utilsTools = [
  (() => {
    const inputSchema = z.object({});
    const outputSchema = z.object({
      activity: ActivitySchema,
    })
    return {
      name: "utils_top_activity",
      config: {
        title: "Get the top activity on the device",
        description: "Get the top activity on the device",
        inputSchema,
        outputSchema,
      },
      cb: async () => {
        const device = await DeviceManager.getInstance().getDevice();
        const activities = await getActivities(device);
        console.log("utils_top_activity", activities[0]);
        return {
          content: [],
          structuredContent: {
            activity: activities[0],
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
  (() => {
    const inputSchema = z.object({});
    const outputSchema = z.object({
      activities: z.array(ActivitySchema),
    });
    return {
      name: "utils_top_activities",
      config: {
        title: "Get all top activities on the device",
        description: "Get all top activities on the device",
        inputSchema,
        outputSchema,
      },
      cb: async () => {
        const device = await DeviceManager.getInstance().getDevice();
        const activities = await getActivities(device);
        return {
          content: [],
          structuredContent: {
            activities,
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
  (() => {
    const inputSchema = z.object({
      package_name: z.string().describe("Package name"),
    });
    const outputSchema = z.object({
      version: z.string().nullable(),
    });
    return {
      name: "utils_package_version",
      config: {
        title: "Get version name of a package",
        description: "Get version name of a package",
        inputSchema,
        outputSchema,
      },
      cb: async (args) => {
        const device = await DeviceManager.getInstance().getDevice();
        const output = await shell(device, `dumpsys package ${args.package_name} | grep versionName`);
        const match = output.match(/versionName=([^\s]+)/);
        const version = match ? match[1] : null;
        console.log("utils_package_version", args.package_name, version);
        return {
          content: [],
          structuredContent: {
            version,
          },
        };
      },
    } satisfies Tool<typeof outputSchema, typeof inputSchema>;
  })(),
];
