import { StaticAssetsIO } from '../../types'
import { io_forceRmTemp } from './helpers'

export const delTemp = ({ tempDir }: { tempDir: string }): StaticAssetsIO['delTemp'] => async tempFileId =>
  io_forceRmTemp({ tempDir, tempFileId })
