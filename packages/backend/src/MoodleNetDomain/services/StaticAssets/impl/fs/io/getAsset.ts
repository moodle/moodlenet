import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import { resolve } from 'path'
import { StaticAssetsIO } from '../../types'
import {} from './helpers'

export const fn_makeGetAsset = ({ assetDir }: { assetDir: string }): StaticAssetsIO['getAsset'] => async assetId => {
  const assetFullPath = resolve(assetDir, assetId)
  return stat(assetFullPath).then(
    stats => (stats.isFile() ? createReadStream(assetFullPath) : null),
    () => null,
  )
}
