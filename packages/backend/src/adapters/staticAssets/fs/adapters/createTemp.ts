import { writeFile } from 'fs/promises'
import { ulid } from 'ulid'
import { CreateTempAdapter } from '../../../../ports/static-assets/temp'
import { processTempAsset } from '../../processTempAsset'
import { forceRmTemp, getDir, getTempAssetFSPaths, pipeToFile } from './lib'

export const createTempAdapter = ({ rootDir }: { rootDir: string }): CreateTempAdapter => {
  return {
    createTempAsset: async ({ stream: originalAssetStream, tempFileDesc }) => {
      const tempDir = getDir(rootDir, 'temp')
      const tempAssetId = ulid()
      const [tempAssetFullPath, tempAssetDescFullPath] = getTempAssetFSPaths({ tempDir, tempAssetId })
      const [stream, tempAssetDesc] = processTempAsset({ originalAssetStream, tempFileDesc, tempAssetId })
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
    },
  }
}
