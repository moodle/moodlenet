import { AssetRef } from '../pub-graphql/types'

export type UploadType = 'icon' | 'image' | 'resource'
export const uploadTypes: UploadType[] = ['icon', 'image', 'resource']
export const isUploadType = (_: any): _ is UploadType => uploadTypes.includes(_)

export const getLocalAssetUrl = (_: { baseStaticAssetUrl: string; assetId: string }): string =>
  `${_.baseStaticAssetUrl}/${_.assetId}`

export const getAssetRefUrl = ({
  assetRef,
  baseStaticAssetUrl,
}: {
  baseStaticAssetUrl: string
  assetRef: AssetRef
}): string => {
  const { location, ext } = assetRef
  return ext ? location : getLocalAssetUrl({ baseStaticAssetUrl, assetId: location })
}
