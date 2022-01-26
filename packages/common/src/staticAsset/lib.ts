import { AssetRef } from '../graphql/scalars.graphql'

export type UploadMaxSizes = { [k in `${UploadType}MaxSize`]: number }
export type UploadType = 'icon' | 'image' | 'resource'
export const uploadTypes: UploadType[] = ['icon', 'image', 'resource']
export const isUploadType = (_: any): _ is UploadType => uploadTypes.includes(_)

export const getLocalAssetUrl = (_: { baseStaticAssetUrl: string; assetId: string }): string =>
  `${_.baseStaticAssetUrl}/${_.assetId}`

export const getAssetRefUrl = ({
  assetRef,
  baseStaticAssetUrl,
  noFixProtocol,
}: {
  baseStaticAssetUrl: string
  assetRef: AssetRef
  noFixProtocol?: boolean
}): string => {
  const { location, ext } = assetRef
  return ext
    ? noFixProtocol || /\w+:\/\//.test(location)
      ? location
      : `//${location}`
    : getLocalAssetUrl({ baseStaticAssetUrl, assetId: location })
}
