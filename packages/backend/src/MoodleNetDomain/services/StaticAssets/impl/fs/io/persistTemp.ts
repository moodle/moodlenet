import { mkdir, rename } from 'fs/promises'
import { AssetFileDesc } from '../../../types'
import { StaticAssetsIO } from '../../types'
import { forceRmAsset, forceRmTemp, getTempFileDesc, getTempFileFSPaths, newAssetId } from './helpers'
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

  const ext = tempFileDesc.filename.ext

  const [assetId, fullAssetFSPath, fullDirFSPath, fullAssetDescFSPath] = await newAssetId({ assetDir, ext })
  const [fullTempFileFSPath, fullTempFileDescFSPath] = getTempFileFSPaths({ tempDir, tempFileId })
  //console.log({ tempFileId, assetPath: fullAssetPath, assetDir, tempFilePath, fileDesc })
  const assetFileDesc: AssetFileDesc = {
    assetId,
    mimetype: tempFileDesc.mimetype,
    tmpFile: tempFileDesc,
  }
  try {
    await mkdir(fullDirFSPath, { recursive: true })
    await rename(fullTempFileFSPath, fullAssetFSPath)
    await rename(fullTempFileDescFSPath, fullAssetDescFSPath)

    forceRmTemp({ tempDir, tempFileId })
    return assetFileDesc
  } catch {
    forceRmTemp({ tempDir, tempFileId })
    forceRmAsset({ assetDir, assetId })
    return null
  }
}
