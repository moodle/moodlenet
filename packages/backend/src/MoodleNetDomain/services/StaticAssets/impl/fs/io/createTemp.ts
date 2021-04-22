import { writeFile } from 'fs/promises'
import { ulid } from 'ulid'
import { StaticAssetsIO } from '../../types'
import { forceRmTemp, getTempFileDescPath, getTempFileFullPath, pipeToFile } from './helpers'

export const createTemp = ({ tempDir }: { tempDir: string }): StaticAssetsIO['createTemp'] => async ({
  stream,
  fileDesc,
}) => {
  const tempFileId = ulid()
  const tempFileFullPath = getTempFileFullPath({ tempDir, tempFileId })
  const tempFileDescFullPath = getTempFileDescPath(tempFileFullPath)
  return Promise.all([
    pipeToFile({ filePath: tempFileFullPath, stream }),
    writeFile(tempFileDescFullPath, JSON.stringify(fileDesc)),
  ]).then(
    () => tempFileId,
    err => {
      forceRmTemp(tempFileFullPath)
      return Promise.reject(err)
    },
  )
}
