import { writeFile } from 'fs/promises'
import { ulid } from 'ulid'
import { StaticAssetsIO } from '../../types'
import { fn_getTempFileFSPaths, io_forceRmTemp, io_pipeToFile } from './helpers'

export const createTemp = ({ tempDir }: { tempDir: string }): StaticAssetsIO['createTemp'] => async ({
  stream,
  fileDesc,
}) => {
  const tempFileId = ulid()
  const [tempFileFullPath, tempFileDescFullPath] = fn_getTempFileFSPaths({ tempDir, tempFileId })
  console.log({ tempFileFullPath, tempFileDescFullPath })
  return Promise.all([
    io_pipeToFile({ destFilePath: tempFileFullPath, stream }),
    writeFile(tempFileDescFullPath, JSON.stringify(fileDesc)),
  ]).then(
    () => tempFileId,
    err => {
      io_forceRmTemp({ tempDir, tempFileId })
      return Promise.reject(err)
    },
  )
}
