import { writeFile } from 'fs/promises'
import { ulid } from 'ulid'
import { SockOf } from '../../../../lib/plug'
import { processTempAssetAdapter } from '../../../../ports/static-assets/asset'
import { createTempAssetAdapter } from '../../../../ports/static-assets/temp'
import { forceRmTemp, getDir, getTempAssetFSPaths, pipeToFile } from './lib'

export const getCreateTempAssetAdapter =
  ({ rootDir }: { rootDir: string }): SockOf<typeof createTempAssetAdapter> =>
  async ({ stream: originalAssetStream, tempFileDesc }) => {
    const tempDir = getDir(rootDir, 'temp')
    const tempAssetId = ulid()
    const [tempAssetFullPath, tempAssetDescFullPath] = getTempAssetFSPaths({ tempDir, tempAssetId })
    const [stream, tempAssetDesc] = await processTempAssetAdapter({ originalAssetStream, tempFileDesc, tempAssetId })
    return Promise.all([
      pipeToFile({ destFilePath: tempAssetFullPath, stream }),
      writeFile(tempAssetDescFullPath, JSON.stringify(tempAssetDesc)),
    ]).then(
      _ => tempAssetDesc,
      err => {
        forceRmTemp({ tempDir, tempAssetId })
        return String(err)
      },
    )
  }
