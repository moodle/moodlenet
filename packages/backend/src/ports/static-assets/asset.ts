import { StaticAssetsIO } from '../../adapters/http/staticAssets/impl/types'
import { AssetId } from '../../adapters/staticAssets/types'
import { QMModule, QMQuery } from '../../lib/qmino'

export const get = QMQuery(
  ({ assetId }: { assetId: AssetId }) =>
    async ({ getAsset }: Pick<StaticAssetsIO, 'getAsset'>) => {
      const result = await getAsset(assetId)
      return result
    },
)

export const del = QMQuery(
  ({ assetId }: { assetId: AssetId }) =>
    async ({ delAsset }: Pick<StaticAssetsIO, 'delAsset'>) => {
      const result = await delAsset(assetId)
      return result
    },
)

QMModule(module)
