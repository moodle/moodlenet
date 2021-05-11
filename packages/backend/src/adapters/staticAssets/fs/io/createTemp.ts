import { writeFile } from 'fs/promises'
import { ulid } from 'ulid'
import { StaticAssetsIO } from '../../types'
import { forceRmTemp, getTempFileFSPaths, pipeToFile } from './helpers'

export const createTemp =
  ({ tempDir }: { tempDir: string }): StaticAssetsIO['createTemp'] =>
  async ({ stream, tempFileDesc }) => {
    const tempFileId = ulid()
    const [tempFileFullPath, tempFileDescFullPath] = getTempFileFSPaths({ tempDir, tempFileId })
    // console.log({ tempFileFullPath, tempFileDescFullPath })
    return Promise.all([
      pipeToFile({ destFilePath: tempFileFullPath, stream }),
      writeFile(tempFileDescFullPath, JSON.stringify(tempFileDesc)),
    ]).then(
      () => tempFileId,
      err => {
        forceRmTemp({ tempDir, tempFileId })
        return Promise.reject(err)
      },
    )
  }
