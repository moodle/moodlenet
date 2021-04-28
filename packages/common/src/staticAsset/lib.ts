import { AssetRef } from '../pub-graphql/types'

export const getLocalAssetUrl = (_: { baseStaticcAssetUrl: string; assetId: string }): string =>
  `${_.baseStaticcAssetUrl}/${_.assetId}`
export const getAssetRefUrl = ({
  assetRef,
  baseStaticcAssetUrl,
}: {
  baseStaticcAssetUrl: string
  assetRef: AssetRef | null | undefined
}): string | null => {
  if (!assetRef) {
    return null
  }
  const { location, ext } = assetRef
  return ext ? location : getLocalAssetUrl({ baseStaticcAssetUrl, assetId: location })
}
