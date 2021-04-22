import { createWriteStream } from 'fs'
import { readFile, rm } from 'fs/promises'
import { resolve } from 'path'
import { Readable } from 'stream'
import { AssetFileFullPath, FileDesc, Ulid } from '../../types'

export const getUlidPath = (ulid: Ulid | null | undefined): string[] => {
  if (!ulid) {
    return []
  }
  const chars = ulid.toUpperCase().split('')
  return [chars.slice(0, 3).join(''), chars[3]!, chars[4]!, chars[5]!, chars[6]!]
}

export const getAssetPath = ({ name, path, ulid }: AssetFileFullPath) => {
  const ulidPath = getUlidPath(ulid)
  return resolve(...[...path, ...ulidPath, name])
}

export const getTempFileDescPath = (tempFilePath: string) => `${tempFilePath}.desc.json`

export const getTempFileDesc = async (tempFilePath: string) => {
  const fileDescPath = getTempFileDescPath(tempFilePath)
  const fileDescString = await readFile(fileDescPath, { encoding: 'utf-8' }).catch(() => null)
  return fileDescString ? (JSON.parse(fileDescString) as FileDesc) : null
}

export const getTempFileFullPath = ({ tempFileId, tempDir }: { tempFileId: string; tempDir: string }) =>
  resolve(tempDir, tempFileId)

export const getAssetFileFullPath = ({ assetsDir, path }: { path: AssetFileFullPath | string; assetsDir: string }) =>
  resolve(assetsDir, typeof path === 'string' ? path : getAssetPath(path))

export const pipeToFile = ({ filePath, stream }: { stream: Readable; filePath: string }): Promise<void> =>
  new Promise((res, rej) => {
    const removeAndReject = (e: any) => {
      forceRm(filePath)
      rej(e)
    }
    stream.on('error', removeAndReject)
    const ws = createWriteStream(filePath, { autoClose: true })
    ws.on('error', removeAndReject)
    ws.on('finish', () => {
      res()
    })
    stream.pipe(ws)
  })

export const forceRm = (path: string) =>
  Promise.all([rm(path, { force: true }), rm(getTempFileDescPath(path), { force: true })]).catch(console.warn)

export const forceRmTemp = (tempPath: string) =>
  Promise.all([forceRm(tempPath), forceRm(getTempFileDescPath(tempPath))])
