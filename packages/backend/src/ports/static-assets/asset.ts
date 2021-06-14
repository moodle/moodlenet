import { Readable } from 'stream'
import { QMModule, QMQuery } from '../../lib/qmino'
import { AssetFileDesc, AssetId } from './types'

// get asset

export type GetAssetAdapter = {
  getAsset: (_: { assetId: AssetId }) => Promise<null | [Readable, AssetFileDesc]>
}
export const get = QMQuery(({ assetId }: { assetId: AssetId }) => async ({ getAsset }: GetAssetAdapter) => {
  const result = await getAsset({ assetId })
  return result
})

// del asset

export type DelAssetAdapter = {
  delAsset: (_: { assetId: AssetId }) => Promise<void>
}
export const del = QMQuery(({ assetId }: { assetId: AssetId }) => async ({ delAsset }: DelAssetAdapter) => {
  await delAsset({ assetId })
})

QMModule(module)
