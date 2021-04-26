import { mkdir, rename, writeFile } from 'fs/promises'
import { ulid } from 'ulid'
import { AssetFileDesc } from '../../../types'
import { StaticAssetsIO } from '../../types'
import { forceRmTemp, getFileDescName, getTempFileDesc, getTempFileFSPaths, newAssetId } from './helpers'
export const makePersistTemp = ({
  tempDir,
  assetDir,
}: {
  tempDir: string
  assetDir: string
}): StaticAssetsIO['persistTemp'] => async ({ tempFileId, uploadType }) => {
  const tempFileDesc = await getTempFileDesc(tempDir, tempFileId)
  if (!tempFileDesc || tempFileDesc.uploadType !== uploadType) {
    return null
  }
  const fileBasename = ulid()
  const ext = tempFileDesc.filename.ext

  const name = [fileBasename, ...(ext ? [ext] : [])].join('.')
  const [assetId, fullAssetFSPath, fullDirFSPath] = await newAssetId({ assetDir, name })
  const [tempFilePath] = getTempFileFSPaths({ tempDir, tempFileId })
  //console.log({ tempFileId, assetPath: fullAssetPath, assetDir, tempFilePath, fileDesc })
  const assetFileDesc: AssetFileDesc = {
    assetId,
    mimetype: tempFileDesc.mimetype,
    tmpFile: tempFileDesc,
  }
  const assetDescFilename = getFileDescName(fullAssetFSPath)
  try {
    await mkdir(fullDirFSPath, { recursive: true })
    await rename(tempFilePath, fullAssetFSPath)

    forceRmTemp({ tempDir, tempFileId })
    writeFile(assetDescFilename, JSON.stringify(assetFileDesc))

    return {
      assetFileDesc,
      assetId,
    }
  } catch {
    return null
  }
}
