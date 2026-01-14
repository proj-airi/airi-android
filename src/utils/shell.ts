import type { DeviceClient } from '@devicefarmer/adbkit'

export async function shell(client: DeviceClient, command: string): Promise<string> {
  const result = await client.shell(command)
  return new Promise((resolve, reject) => {
    const chunks: any = []

    result.on('readable', () => {
      let chunk

      do {
        chunk = result.read()
        if (chunk !== null) {
          chunks.push(chunk)
        }
      } while (chunk !== null)
    })

    result.on('error', reject)
    result.on('end', () => {
      resolve(chunks.join(''))
    })
  })
}
