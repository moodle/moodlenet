import { createWriteStream } from 'fs'
import { readFile, rm } from 'fs/promises'
import { resolve } from 'path'
import { Readable } from 'stream'
import { ulid } from 'ulid'
import { AssetId, TempFileDesc, TempFileId, Ulid } from '../../types'

type Path = string[]
export const fn_getUlidPath = (ulid: Ulid): Path => {
  const chars = ulid.toUpperCase().split('')
  return [chars.slice(0, 3).join(''), chars[3]!, chars[4]!, chars[5]!, chars[6]!, chars.slice(7).join('')]
}

export const io_newAssetId = ({
  assetDir,
  name,
}: {
  assetDir: string
  name: string
}): [assetId: AssetId, fullFSPath: string, fullAssetFSPath: string] => {
  const _ulid = ulid()
  const assetDirRelPath = fn_getUlidPath(_ulid)
  const fullDirFSPath = resolve(assetDir, ...assetDirRelPath)
  const fullAssetFSPath = resolve(fullDirFSPath, name)

  const assetId = [...assetDirRelPath, name].join('/')
  return [assetId, fullAssetFSPath, fullDirFSPath]
}

export const fn_getTempFileDescName = (tempFileId: string) => `${tempFileId}.desc.json`

export const io_getTempFileDesc = async (tempDir: string, tempFileId: string) => {
  const fileDescPath = resolve(tempDir, fn_getTempFileDescName(tempFileId))
  const fileDescString = await readFile(fileDescPath, { encoding: 'utf-8' }).catch(() => null)
  return fileDescString ? (JSON.parse(fileDescString) as TempFileDesc) : null
}

export const io_pipeToFile = ({ destFilePath, stream }: { stream: Readable; destFilePath: string }): Promise<void> =>
  new Promise((res, rej) => {
    const removeAndReject = (e: any) => {
      io_forceRm(destFilePath)
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

export const io_forceRm = (path: string) => rm(path, { force: true })

export const io_forceRmTemp = ({ tempDir, tempFileId }: { tempDir: string; tempFileId: TempFileId }) => {
  const [tempFileFSPath, tempFileDescFSPath] = fn_getTempFileFSPaths({ tempDir, tempFileId })
  Promise.all([io_forceRm(tempFileFSPath), io_forceRm(tempFileDescFSPath)])
}

export const fn_getTempFileFSPaths = ({
  tempDir,
  tempFileId,
}: {
  tempDir: string
  tempFileId: string
}): [tempFileFSPath: string, tempFileDescFSPath: string] => [
  resolve(tempDir, tempFileId),
  resolve(tempDir, fn_getTempFileDescName(tempFileId)),
]
