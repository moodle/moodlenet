import { writeFile } from 'fs/promises'
import { ulid } from 'ulid'
import { SockOf } from '../../../../lib/plug'
import { processTempAssetAdapter } from '../../../../ports/static-assets/asset'
import { createTempAssetAdapter } from '../../../../ports/static-assets/temp'
import { TempAssetDesc } from '../../../../ports/static-assets/types'
import { forceRmTemp, getDir, getTempAssetFSPaths, pipeToFile } from './lib'

export const getCreateTempAssetAdapter =
  ({ rootDir }: { rootDir: string }): SockOf<typeof createTempAssetAdapter> =>
  async ({ stream: originalAssetStream, tempFileDesc }) => {
    const tempDir = getDir(rootDir, 'temp')
    const tempAssetId = ulid()
    const [tempAssetFullPath, tempAssetDescFullPath] = getTempAssetFSPaths({ tempDir, tempAssetId })
    const [stream, tempAssetDesc] = await processTempAssetAdapter({ originalAssetStream, tempFileDesc, tempAssetId })
    return pipeToFile({ destFilePath: tempAssetFullPath, stream })
      .then(async ({ filesize }) => {
        const _tempAssetDesc: TempAssetDesc = { ...tempAssetDesc, size: filesize }
        await writeFile(tempAssetDescFullPath, JSON.stringify(_tempAssetDesc))
        return _tempAssetDesc
      })
      .catch(err => {
        forceRmTemp({ tempDir, tempAssetId })
        return String(err)
      })
  }
