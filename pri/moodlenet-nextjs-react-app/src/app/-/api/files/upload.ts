import { createTempFile, createUploadedTempFile } from '@moodle/lib-temp-dir'
import { createReadStream, createWriteStream } from 'fs'
import { writeFile } from 'fs/promises'
import { NextRequest } from 'next/server'
import { pipeline } from 'stream'

export async function POST(req: NextRequest) {
  // TODO: check for authentication
  const formData = await req.formData()
  const file = formData.get('file') as File
  // @ts-expect-error TODO ---------------------
  await pipeline(createReadStream(file.stream()), createWriteStream('filePath'))
  // @ts-expect-error TODO ---------------------
  await pipeline(file.stream(), createWriteStream('filePath'))
  // @ts-expect-error TODO ---------------------
  createUploadedTempFile({ tempDir: '', expiresSeconds: 1, fileName: '', readable: file.stream() })
  // @ts-expect-error TODO ---------------------
  writeFile('tempPaths.file', new ReadableStream(file.stream()))
  // @ts-expect-error TODO ---------------------
  writeFile('tempPaths.file', file.stream())

  // @ts-expect-error TODO ---------------------
  createTempFile({ readable: file.stream(), fileName: file.name, expiresSeconds: 1, tempDir: process.env.MOODLE_TEMP_ })
  // @ts-expect-error TODO ---------------------
  createTempFile({ readable: new ReadableStream(file.stream()), fileName: file.name, expiresSeconds: 1, tempDir: process.env.MOODLE_TEMP_ })
}
