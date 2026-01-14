import Adb, { Client, DeviceClient } from "@devicefarmer/adbkit";

export class DeviceManager {
  #adbClient: Client;
  #device: DeviceClient | null = null;
  #deviceId: string | null = null;
  static #instance: DeviceManager | null = null;

  static getInstance(): DeviceManager {
    if (this.#instance === null) {
      this.#instance = new DeviceManager();
    }
    return this.#instance;
  }

  constructor() {
    const host = process.env.ADB_HOST || "localhost";
    const port = parseInt(process.env.ADB_PORT || "5037", 10);

    this.#adbClient = Adb.createClient({ host, port });
  }

  // TODO: break into connect, and list devices
  async connect(host: string = 'localhost', port: number = 5037): Promise<void> {
    await this.#adbClient.connect(host, port);
    // After connecting, we need to get the device
    const devices = await this.#adbClient.listDevices();
    if (devices.length === 0) {
      throw new Error("No devices available after connection");
    }
    this.#deviceId = devices[0].id;
    if (!this.#deviceId) {
      throw new Error("No device ID available after connection");
    }
    this.#device = this.#adbClient.getDevice(this.#deviceId);
  }

  async getDevice(): Promise<DeviceClient> {
    if (this.#device === null) {
      const devices = await this.#adbClient.listDevices();
      if (devices.length === 0) {
        throw new Error("No devices connected");
      }
      this.#deviceId = devices[0].id;
      if (!this.#deviceId) {
        throw new Error("No device ID available after connection");
      }
      this.#device = this.#adbClient.getDevice(this.#deviceId!);
    }
    return this.#device;
  }

  get client(): Client {
    return this.#adbClient;
  }

  reset(): void {
    this.#device = null;
    this.#deviceId = null;
  }
}

