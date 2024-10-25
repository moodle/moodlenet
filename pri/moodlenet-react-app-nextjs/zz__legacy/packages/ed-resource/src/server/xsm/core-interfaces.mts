import type { RpcFile } from '@moodlenet/core'
//import '@moodlenet/core-domain/resource/lifecycle'
import type * as EdTypes from '@moodlenet/ed-meta/common'
import type * as ResTypes from '@moodlenet/ed-resource/server'

declare module '@moodlenet/core-domain/resource' {
  export interface FileContent {
    ref: ResTypes.FileContent
  }
  export interface LinkContent {
    ref: ResTypes.LinkContent
  }
  export interface FileImage {
    ref: ResTypes.ImageUploaded
  }
  export interface UrlImage {
    ref: ResTypes.ImageUrl
  }
  export interface ProvidedCreationFileContent {
    rpcFile: RpcFile
  }
  export interface ProvidedFileImage {
    rpcFile: RpcFile
  }
  export interface ID {
    resourceKey: string
  }
  export interface LearningOutcome {
    value: EdTypes.LearningOutcome
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
