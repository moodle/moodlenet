import { readdir, stat } from 'fs/promises'
import { StaticAssetsIO } from '../../types'
import { forceRm, forceRmTemp, getTempFileFSPaths } from './helpers'

export const delOldTemps =
  ({ tempDir }: { tempDir: string }): StaticAssetsIO['delOldTemps'] =>
  async ({ olderThanSecs }) => {
    const tempFiles = await readdir(tempDir)
    const tempStats = await Promise.all(
      tempFiles.map(async tempFileId => {
        const [filePath] = getTempFileFSPaths({ tempDir, tempFileId })
        return { filePath, stat: await stat(filePath) }
      }),
    )

    const now = new Date().valueOf()
    const toDelete = tempStats
      .filter(({ stat: { birthtimeMs } }) => olderThanSecs < (now - birthtimeMs) / 1000)
      .map(({ filePath }) => forceRm(filePath))
    return toDelete.length
  }

export const delTemp =
  ({ tempDir }: { tempDir: string }): StaticAssetsIO['delTemp'] =>
  async tempFileId =>
    forceRmTemp({ tempDir, tempFileId })
