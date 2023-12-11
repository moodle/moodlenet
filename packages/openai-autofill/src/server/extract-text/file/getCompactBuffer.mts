import type { Readable } from 'stream'

export function getCompactBuffer(stream: Readable, nBytes: number) {
  return new Promise<Buffer>((resolve, reject) => {
    let totalLength = 0
    let first: null | Buffer = null
    let middle: null | Buffer = null
    let last = Buffer.alloc(nBytes)
    let middleStart = 0
    let middleEnd = 0
    let isMiddleCaptured = false

    stream.on('data', _chunk => {
      const chunk = _chunk instanceof Buffer ? _chunk : Buffer.from(_chunk)
      totalLength += chunk.length

      // Capture first nBytes bytes
      if (!first) {
        first = chunk.length >= nBytes ? chunk.slice(0, nBytes) : Buffer.concat([chunk], nBytes)
      }

      // Update last nBytes bytes
      if (chunk.length >= nBytes) {
        last = chunk.slice(-nBytes)
      } else {
        last = Buffer.concat([Uint8Array.prototype.slice.bind(last)(chunk.length), chunk], nBytes)
      }

      // Capture middle nBytes bytes
      if (!isMiddleCaptured) {
        middleStart = Math.floor(totalLength / 2 - 5)
        middleEnd = middleStart + nBytes
        if (totalLength >= middleEnd) {
          const middleBuffer = Buffer.concat([last, chunk])
          middle = Buffer.from(
            Uint8Array.prototype.slice.bind(middleBuffer)(
              middleBuffer.length - totalLength + middleStart,
              middleBuffer.length - totalLength + middleEnd,
            ),
          )
          isMiddleCaptured = true
        }
      }
    })

    stream.on('end', () => {
      resolve(Buffer.concat([first ?? Buffer.alloc(0), middle ?? Buffer.alloc(0), last]))
    })

    stream.on('error', err => {
      reject(err)
    })
  })
}

export async function streamToString(stream: Readable) {
  const chunks = []

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks).toString('utf-8')
}
