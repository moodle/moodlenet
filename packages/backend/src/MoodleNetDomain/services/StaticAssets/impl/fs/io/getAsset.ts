import { createReadStream } from 'fs'
import { StaticAssetsIO } from '../../types'
import { getAssetFileFullPath } from './helpers'

export const getAsset = ({ assetsDir }: { assetsDir: string }): StaticAssetsIO['getAsset'] => async path => {
  const assetFullPath = getAssetFileFullPath({ assetsDir, path })
  return createReadStream(assetFullPath)
}
