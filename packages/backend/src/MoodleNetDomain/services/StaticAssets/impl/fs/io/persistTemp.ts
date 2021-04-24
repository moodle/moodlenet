import { copyFile, mkdir } from 'fs/promises'
import { ulid } from 'ulid'
import { StaticAssetsIO } from '../../types'
import { forceRmTemp, getTempFileDesc, getTempFileFSPaths, newAssetId } from './helpers'
export const makePersistTemp = ({
  tempDir,
  assetDir,
}: {
  tempDir: string
  assetDir: string
}): StaticAssetsIO['persistTemp'] => async ({ tempFileId, rebaseName }) => {
  const fileDesc = await getTempFileDesc(tempDir, tempFileId)
  if (!fileDesc) {
    return null
  }
  const useBasename = rebaseName ?? fileDesc.filename?.base ?? ulid()
  const ext = fileDesc.resizedWebImageExt ?? fileDesc.filename?.ext
  const name = [useBasename, ...(ext ? [ext] : [])].join('.')
  const [assetId, fullAssetFSPath, fullDirFSPath] = await newAssetId({ assetDir, name })
  const [tempFilePath] = getTempFileFSPaths({ tempDir, tempFileId })
  //console.log({ tempFileId, assetPath: fullAssetPath, assetDir, tempFilePath, fileDesc })
  try {
    await mkdir(fullDirFSPath, { recursive: true })
    await copyFile(tempFilePath, fullAssetFSPath)
    await forceRmTemp({ tempDir, tempFileId })
    return {
      originalDesc: fileDesc,
      id: assetId,
    }
  } catch {
    return null
  }
}
