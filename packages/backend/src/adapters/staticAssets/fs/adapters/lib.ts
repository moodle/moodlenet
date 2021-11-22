import { createReadStream, createWriteStream, ReadStream } from 'fs'
import { mkdir, readdir, readFile, rename, rm, stat } from 'fs/promises'
import { resolve } from 'path'
import { Readable } from 'stream'
import { ulid } from 'ulid'
import { AssetFileDesc, AssetId, TempAssetDesc, TempAssetId, Ulid } from '../../../../ports/static-assets/types'

type Path = string[]

export const getUlidPath = (ulid: Ulid): Path => {
  const chars = ulid.toUpperCase().split('')
  return [chars.slice(0, 3).join(''), chars[3]!, chars[4]!, chars[5]!, chars[6]!, chars.slice(7).join('')]
}

//TODO: all exported functions should get rootFolder
// and use getDir to get specific ones
// then remove use of getDir from adapters
export const getDir = (rootFolder: string, dir: 'temp' | 'assets') =>
  resolve(rootFolder, dir === 'temp' ? '.temp' : 'assets')

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

export const getTempAssetDesc = async (tempDir: string, tempAssetId: string) => {
  const fileDescPath = resolve(tempDir, getFileDescName(tempAssetId))
  const fileDescString = await readFile(fileDescPath, { encoding: 'utf-8' }).catch(() => null)
  const tempAssetDesc: TempAssetDesc | null = fileDescString ? JSON.parse(fileDescString) : null
  return tempAssetDesc
}

export const getAssetFileDesc = async (assetDir: string, assetId: string) => {
  const fileDescPath = resolve(assetDir, getFileDescName(assetId))
  const fileDescString = await readFile(fileDescPath, { encoding: 'utf-8' }).catch(() => null)
  const assetFileDesc: AssetFileDesc | null = fileDescString ? JSON.parse(fileDescString) : null
  return assetFileDesc
}

export const pipeToFile = async ({
  destFilePath,
  stream,
}: {
  stream: Readable
  destFilePath: string
}): Promise<{ filesize: number }> =>
  new Promise((resolve, reject) => {
    const removeAndReject = async (e: any) => {
      reject(e)
      forceRm(destFilePath).catch()
    }
    let filesize = 0
    const ws = createWriteStream(destFilePath, { autoClose: true })
    stream.on('error', removeAndReject)
    stream.on('data', chunk => (filesize += chunk.length))
    ws.on('close', () => resolve({ filesize }))
    stream.pipe(ws)
  })

export const forceRm = async (path: string) => rm(path, { force: true }).catch(console.warn)

export const forceRmTemp = async ({ tempDir, tempAssetId }: { tempDir: string; tempAssetId: TempAssetId }) => {
  const [tempAssetFSPath, tempAssetDescFSPath] = getTempAssetFSPaths({ tempDir, tempAssetId: tempAssetId })
  await forceRm(tempAssetFSPath)
  await forceRm(tempAssetDescFSPath)
}

export const forceRmAsset = async ({ assetDir, assetId }: { assetDir: string; assetId: AssetId }) => {
  const [assetFileFSPath, assetFileDescFSPath] = getAssetFileFSPaths({ assetDir, assetId })
  await forceRm(assetFileFSPath)
  await forceRm(assetFileDescFSPath)
}

export const getTempAssetFSPaths = ({
  tempDir,
  tempAssetId,
}: {
  tempDir: string
  tempAssetId: string
}): [tempAssetFSPath: string, tempAssetDescFSPath: string] => [
  resolve(tempDir, tempAssetId),
  resolve(tempDir, getFileDescName(tempAssetId)),
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

export const getAssetStreamAndDesc = async ({ assetId, assetDir }: { assetId: AssetId; assetDir: string }) => {
  const [assetFullPath] = getAssetFileFSPaths({ assetDir, assetId })
  try {
    const assetFileDesc = await getAssetFileDesc(assetDir, assetId)
    if (!assetFileDesc) {
      return null
    }
    const stream = createReadStream(assetFullPath)
    const response: [ReadStream, AssetFileDesc] = [stream, assetFileDesc]
    return response
  } catch {
    return null
  }
}

export const persistTemp = async ({
  rootDir,
  tempAssetId,
  uploadType,
}: {
  rootDir: string
  tempAssetId: string
  uploadType: string
}) => {
  const tempDir = getDir(rootDir, 'temp')
  const assetDir = getDir(rootDir, 'assets')
  const tempAssetDesc = await getTempAssetDesc(tempDir, tempAssetId)
  // console.log({ tempAssetDesc, uploadType })

  if (!tempAssetDesc || tempAssetDesc.uploadType !== uploadType) {
    return null
  }

  const ext = tempAssetDesc.filename.ext

  const [assetId, fullAssetFSPath, fullDirFSPath, fullAssetDescFSPath] = await newAssetId({ assetDir, ext })
  const [fullTempAssetFSPath, fullTempAssetDescFSPath] = getTempAssetFSPaths({ tempDir, tempAssetId })
  //console.log({ tempAssetId, assetPath: fullAssetPath, assetDir, tempAssetPath, fileDesc })
  const assetFileDesc: AssetFileDesc = {
    assetId,
    mimetype: tempAssetDesc.mimetype,
    tempAssetDesc: tempAssetDesc,
  }
  try {
    await mkdir(fullDirFSPath, { recursive: true })
    await rename(fullTempAssetFSPath, fullAssetFSPath)
    await rename(fullTempAssetDescFSPath, fullAssetDescFSPath)

    forceRmTemp({ tempDir, tempAssetId: tempAssetId })
    return assetFileDesc
  } catch {
    forceRmTemp({ tempDir, tempAssetId: tempAssetId })
    forceRmAsset({ assetDir, assetId })
    return null
  }
}

export const delOldTemps = async ({ tempDir, olderThanSecs }: { tempDir: string; olderThanSecs: number }) => {
  console.log(`deleting old temp assets`)

  const tempAssets = await readdir(tempDir)
  const tempStats = await Promise.all(
    tempAssets.map(async tempAssetId => {
      const [filePath] = getTempAssetFSPaths({ tempDir, tempAssetId })
      return { filePath, stat: await stat(filePath) }
    }),
  )

  const now = new Date().valueOf()
  const toDelete = tempStats
    .filter(({ stat: { birthtimeMs } }) => olderThanSecs < (now - birthtimeMs) / 1000)
    .map(({ filePath }) => forceRm(filePath))

  return toDelete.length
}
