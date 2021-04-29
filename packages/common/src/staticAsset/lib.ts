import { AssetRef } from '../pub-graphql/types'

export type UploadType = 'icon' | 'image' | 'resource'
export const uploadTypes: UploadType[] = ['icon', 'image', 'resource']
export const isUploadType = (_: any): _ is UploadType => uploadTypes.includes(_)

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
