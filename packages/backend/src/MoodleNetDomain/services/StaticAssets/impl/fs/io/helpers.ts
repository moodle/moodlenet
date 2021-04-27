import { createWriteStream } from 'fs'
import { readFile, rm } from 'fs/promises'
import { resolve } from 'path'
import { Readable } from 'stream'
import { ulid } from 'ulid'
import { AssetFileDesc, AssetId, TempFileDesc, TempFileId, Ulid } from '../../../types'

type Path = string[]
export const getUlidPath = (ulid: Ulid): Path => {
  const chars = ulid.toUpperCase().split('')
  return [chars.slice(0, 3).join(''), chars[3]!, chars[4]!, chars[5]!, chars[6]!, chars.slice(7).join('')]
}

export const newAssetId = async ({
  assetDir,
  ext,
}: {
  assetDir: string
  ext: string | null
}): Promise<[assetId: AssetId, fullFSPath: string, fullAssetFSPath: string, fullAssetDescFSPath: string]> => {
  const _ulid = ulid()
  const filename = [_ulid, ...(ext ? [ext] : [])].join('.')
  const assetDirRelPath = getUlidPath(_ulid)
  const fullDirFSPath = resolve(assetDir, ...assetDirRelPath)
  const fullAssetFSPath = resolve(fullDirFSPath, filename)
  const fullAssetDescFSPath = resolve(fullDirFSPath, getFileDescName(filename))

  const assetId = [...assetDirRelPath, filename].join('/')
  return [assetId, fullAssetFSPath, fullDirFSPath, fullAssetDescFSPath]
}

export const getFileDescName = (fileName: string) => `${fileName}.desc.json`

export const getTempFileDesc = async (tempDir: string, tempFileId: string) => {
  const fileDescPath = resolve(tempDir, getFileDescName(tempFileId))
  const fileDescString = await readFile(fileDescPath, { encoding: 'utf-8' }).catch(() => null)
  const tempFileDesc: TempFileDesc | null = fileDescString ? JSON.parse(fileDescString) : null
  return tempFileDesc
}
export const getAssetFileDesc = async (assetDir: string, assetId: string) => {
  const fileDescPath = resolve(assetDir, getFileDescName(assetId))
  const fileDescString = await readFile(fileDescPath, { encoding: 'utf-8' }).catch(() => null)
  const assetFileDesc: AssetFileDesc | null = fileDescString ? JSON.parse(fileDescString) : null
  return assetFileDesc
}

export const pipeToFile = async ({ destFilePath, stream }: { stream: Readable; destFilePath: string }): Promise<void> =>
  new Promise((res, rej) => {
    const removeAndReject = async (e: any) => {
      await forceRm(destFilePath)
      rej(e)
    }
    stream.on('error', removeAndReject)
    const ws = createWriteStream(destFilePath, { autoClose: true })
    ws.on('error', removeAndReject)
    ws.on('finish', () => {
      res()
    })
    stream.pipe(ws)
  })

export const forceRm = async (path: string) => rm(path, { force: true }).catch(console.warn)

export const forceRmTemp = async ({ tempDir, tempFileId }: { tempDir: string; tempFileId: TempFileId }) => {
  const [tempFileFSPath, tempFileDescFSPath] = getTempFileFSPaths({ tempDir, tempFileId })
  await forceRm(tempFileFSPath)
  await forceRm(tempFileDescFSPath)
}

export const forceRmAsset = async ({ assetDir, assetId }: { assetDir: string; assetId: AssetId }) => {
  const [assetFileFSPath, assetFileDescFSPath] = getAssetFileFSPaths({ assetDir, assetId })
  await forceRm(assetFileFSPath)
  await forceRm(assetFileDescFSPath)
}

export const getTempFileFSPaths = ({
  tempDir,
  tempFileId,
}: {
  tempDir: string
  tempFileId: string
}): [tempFileFSPath: string, tempFileDescFSPath: string] => [
  resolve(tempDir, tempFileId),
  resolve(tempDir, getFileDescName(tempFileId)),
]

export const getAssetFileFSPaths = ({
  assetDir,
  assetId,
}: {
  assetDir: string
  assetId: string
}): [assetFileFSPath: string, assetFileDescFSPath: string] => [
  resolve(assetDir, assetId),
  resolve(assetDir, getFileDescName(assetId)),
]
