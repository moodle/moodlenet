import { Credits } from '@moodlenet/common/dist/graphql/scalars.graphql'
import { UploadType } from '@moodlenet/common/dist/staticAsset/lib'

export type AssetId = string
export type TempAssetId = string
export type InterpolateExpression = string
export type AssetFileDesc = {
  tempAssetDesc: TempAssetDesc
  mimetype: string
  assetId: AssetId
  //hash:null| {type: 'sha1' | 'md5' | 'sha256',digest:string}
}

export type TempFileDesc = {
  size: number
  name: string | null
  mimetype: string
  lastModifiedDate?: Date | null
  uploadType: UploadType
}

export type TempAssetDesc = {
  tempAssetId: TempAssetId
  tempFileDesc: TempFileDesc
  size: number
  filename: { base: string | null; ext: string | null }
  mimetype: string
  // todo: make uploadType an array,
  // so a single uploaded file can be stored as different
  // assets (eg. when a resource is of image format, that image may be the icon and the image too)
  uploadType: UploadType
}

export type Ulid = string

export type PersistTmpFileReq = {
  uploadType: UploadType
  tempAssetId: TempAssetId
  credits?: Credits | null
}
