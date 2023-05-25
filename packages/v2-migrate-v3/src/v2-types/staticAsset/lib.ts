export type UploadMaxSizes = { [k in `${UploadType}MaxSize`]: number | null }
export type UploadType = 'icon' | 'image' | 'resource'
