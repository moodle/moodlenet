export type AssetId = string
export type TempFileId = string
export type InterpolateExpression = string
export type AssetFileDesc = {
  tmpFile: TempFileDesc
  mimetype: string | null
  assetId: AssetId
  //hash:null| {type: 'sha1' | 'md5' | 'sha256',digest:string}
}

export type TempFileDesc = {
  size: number
  filename: { base: string | null; ext: string | null }
  mimetype: string | null
  uploadType: UploadType
}

export type Ulid = string

export type UploadType = 'icon' | 'image' | 'resource'
export const uploadTypes: UploadType[] = ['icon', 'image', 'resource']
export const isUploadType = (_: any): _ is UploadType => uploadTypes.includes(_)

export type PersistTmpFileReqsMap<K extends string> = Record<K, PersistTmpFileReq>
export type PersistTmpFileReq = { uploadType: UploadType; tempFileId: TempFileId }
export type AssetFileDescMap<K extends string> = Record<K, AssetFileDesc>
