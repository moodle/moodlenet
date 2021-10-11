import { Readable } from 'stream'
import { ns } from '../../lib/ns/namespace'
import { plug } from '../../lib/plug'
import { AssetFileDesc, AssetId } from './types'

// get asset

export const getAssetAdapter = plug<(_: { assetId: AssetId }) => Promise<null | [Readable, AssetFileDesc]>>(
  ns(__dirname, 'get-asset-adapter'),
)

export const getAsset = plug(ns(__dirname, 'get-asset'), async ({ assetId }: { assetId: AssetId }) => {
  const result = await getAssetAdapter({ assetId })
  return result
})

// del asset

export const delAssetAdapter = plug<(_: { assetId: AssetId }) => Promise<void>>(ns(__dirname, 'del-asset-adapter'))
export const delAsset = plug(ns(__dirname, 'del-asset'), async ({ assetId }: { assetId: AssetId }) => {
  await delAssetAdapter({ assetId })
})
