import { copyFile, mkdir } from 'fs/promises'
import { ulid } from 'ulid'
import { StaticAssetsIO } from '../../types'
import { fn_getTempFileFSPaths, io_forceRmTemp, io_getTempFileDesc, io_newAssetId } from './helpers'
export const fn_makePersistTemp = ({
  tempDir,
  assetDir,
}: {
  tempDir: string
  assetDir: string
}): StaticAssetsIO['persistTemp'] =>
  async function io_persistTemp({ tempFileId, rebaseName }) {
    const fileDesc = await io_getTempFileDesc(tempDir, tempFileId)
    if (!fileDesc) {
      return null
    }
    const useBasename = rebaseName ?? fileDesc.filename?.base ?? ulid()
    const ext = fileDesc.resizedWebImageExt ?? fileDesc.filename?.ext
    const name = [useBasename, ...(ext ? [ext] : [])].join('.')
    const [assetId, fullAssetFSPath, fullDirFSPath] = io_newAssetId({ assetDir, name })
    const [tempFilePath] = fn_getTempFileFSPaths({ tempDir, tempFileId })
    //console.log({ tempFileId, assetPath: fullAssetPath, assetDir, tempFilePath, fileDesc })
    try {
      await mkdir(fullDirFSPath, { recursive: true })
      await copyFile(tempFilePath, fullAssetFSPath)
      io_forceRmTemp({ tempDir, tempFileId })
      return {
        originalDesc: fileDesc,
        id: assetId,
      }
    } catch {
      return null
    }
  }
