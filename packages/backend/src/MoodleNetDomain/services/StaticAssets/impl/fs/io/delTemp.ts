import { StaticAssetsIO } from '../../types'
import { forceRmTemp, getTempFileFullPath } from './helpers'

export const delTemp = ({ tempDir }: { tempDir: string }): StaticAssetsIO['delTemp'] => async tempFileId => {
  const delTempFilePath = getTempFileFullPath({ tempDir, tempFileId })
  forceRmTemp(delTempFilePath)
}
