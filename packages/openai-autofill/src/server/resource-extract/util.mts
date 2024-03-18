import type { RpcFile } from '@moodlenet/core'
import { readableRpcFile } from '@moodlenet/core'
import axios from 'axios'
import sharp from 'sharp'
import type { Readable } from 'stream'

export async function urlToRpcFile(imageUrl: string) {
  const headResp = await axios.head(imageUrl)
  const size = Number(headResp.headers['content-length'])
  const type = String(headResp.headers['content-type'])
  const ext = type.split('/')[1]
  const _baseRpcFile: RpcFile = { name: `generated.${ext}`, type, size }
  // console.log({ _baseRpcFile })
  const rpcFile = readableRpcFile(_baseRpcFile, async () => {
    const getResp = await axios.get(imageUrl, { responseType: 'stream' })
    return getResp.data
  })
  return rpcFile
}

export function getCompactBuffer(stream: Readable, nBytes: number) {
  return new Promise<{ compactedFileBuffer: Buffer;/*  fileBuffer: Buffer */ }>((resolve, reject) => {
    let totalLength = 0
    let first: null | Buffer = null
    let middle: null | Buffer = null
    let last = Buffer.alloc(nBytes)
  //  let fileBuffer = Buffer.alloc(0)

    let middleStart = 0
    let middleEnd = 0
    let isMiddleCaptured = false

    stream.on('data', _chunk => {
      const chunk = _chunk instanceof Buffer ? _chunk : Buffer.from(_chunk)
   //   fileBuffer = Buffer.concat([fileBuffer, chunk])
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
      resolve({
        compactedFileBuffer: Buffer.concat([
          first ?? Buffer.alloc(0),
          middle ?? Buffer.alloc(0),
          last,
        ]),
      //  fileBuffer,
      })
    })

    stream.on('error', err => {
      reject(err)
    })
  })
}

export async function streamToBuffer(stream: Readable) {
  const chunks = []

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}

export async function imageResizer(readable: Readable, surface: number) {
  const imagePipeline = sharp({ sequentialRead: true })

  readable.pipe(imagePipeline)
  const originalMeta = await imagePipeline.metadata()
  if (!(originalMeta.height && originalMeta.width)) {
    return { meta: originalMeta, resized: null }
  }
  const ratio = 1 / Math.sqrt((originalMeta.height * originalMeta.width) / surface)
  const width = Math.round(originalMeta.width * ratio)
  const height = Math.round(originalMeta.height * ratio)
  const DEST_FORMAT = 'jpeg'
  // console.log({ meta, width, height, ratio })
  return {
    originalMeta,
    format: DEST_FORMAT,
    resized: imagePipeline
      .resize({
        width,
        height,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat(DEST_FORMAT),
  }
}
