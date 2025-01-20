import { Readable } from 'stream'

export async function readableToBuffer(stream: Readable) {
  const chunks = []

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}
