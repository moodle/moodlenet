import { StaticAssetsIO } from '../../types'
import { forceRmAsset } from './helpers'

export const delAsset = ({ assetDir }: { assetDir: string }): StaticAssetsIO['delAsset'] => async assetId =>
  forceRmAsset({ assetDir, assetId })
