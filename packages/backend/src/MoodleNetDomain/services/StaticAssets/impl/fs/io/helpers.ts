import { createWriteStream } from 'fs'
import { readFile, rm } from 'fs/promises'
import { resolve } from 'path'
import { Readable } from 'stream'
import { ulid } from 'ulid'
import { AssetId, TempFileDesc, TempFileId, Ulid } from '../../types'

type Path = string[]
export const getUlidPath = (ulid: Ulid): Path => {
  const chars = ulid.toUpperCase().split('')
  return [chars.slice(0, 3).join(''), chars[3]!, chars[4]!, chars[5]!, chars[6]!, chars.slice(7).join('')]
}

export const newAssetId = async ({
  assetDir,
  name,
}: {
  assetDir: string
  name: string
}): Promise<[assetId: AssetId, fullFSPath: string, fullAssetFSPath: string]> => {
  const _ulid = ulid()
  const assetDirRelPath = getUlidPath(_ulid)
  const fullDirFSPath = resolve(assetDir, ...assetDirRelPath)
  const fullAssetFSPath = resolve(fullDirFSPath, name)

  const assetId = [...assetDirRelPath, name].join('/')
  return [assetId, fullAssetFSPath, fullDirFSPath]
}

export const getTempFileDescName = (tempFileId: string) => `${tempFileId}.desc.json`

export const getTempFileDesc = async (tempDir: string, tempFileId: string) => {
  const fileDescPath = resolve(tempDir, getTempFileDescName(tempFileId))
  const fileDescString = await readFile(fileDescPath, { encoding: 'utf-8' }).catch(() => null)
  return fileDescString ? (JSON.parse(fileDescString) as TempFileDesc) : null
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

export const getTempFileFSPaths = ({
  tempDir,
  tempFileId,
}: {
  tempDir: string
  tempFileId: string
}): [tempFileFSPath: string, tempFileDescFSPath: string] => [
  resolve(tempDir, tempFileId),
  resolve(tempDir, getTempFileDescName(tempFileId)),
]
