import { copyFile } from 'fs/promises'
import { StaticAssetsIO } from '../../types'
import { getAssetPath, getTempFileDesc, getTempFileFullPath } from './helpers'
export const persistTemp = ({ tempDir }: { tempDir: string }): StaticAssetsIO['persistTemp'] => async (
  tempFileId,
  path,
) => {
  const assetPath = getAssetPath(path)
  const tempFilePath = getTempFileFullPath({ tempDir, tempFileId })
  const fileDesc = await getTempFileDesc(tempFilePath)
  if (!fileDesc) {
    return null
  }

  return copyFile(tempFilePath, assetPath)
    .catch(() => null)
    .then(() => fileDesc)
}
