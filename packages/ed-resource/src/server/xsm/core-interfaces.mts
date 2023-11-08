import type { RpcFile } from '@moodlenet/core'
//import '@moodlenet/core-domain/resource/lifecycle'
import type {
  FileContent,
  ImageUploaded,
  ImageUrl,
  LinkContent,
} from '@moodlenet/ed-resource/server'

declare module '@moodlenet/core-domain/resource/lifecycle' {
  export interface ResourceFileContent {
    ref: FileContent
  }
  export interface ResourceLinkContent {
    ref: LinkContent
  }
  export interface FileImage {
    ref: ImageUploaded
  }
  export interface UrlImage {
    ref: ImageUrl
  }
  export interface ProvidedResourceFileContent {
    rpcFile: RpcFile
  }
  export interface ProvidedFileImage {
    rpcFile: RpcFile
  }
}

// copies from '@moodlenet/ed-resource/server'
// export interface FileContent {
//   kind: 'file'
//   fsItem: FsItem
// }

// export interface LinkContent {
//   kind: 'link'
//   url: string
// }
// export type ImageUploaded = { kind: 'file'; directAccessId: string; credits?: Credits }
// export type ImageUrl = { kind: 'url'; url: string; credits?: Credits | null }
