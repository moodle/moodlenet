import '@moodlenet/core-domain/resource/lifecycle'
import type { Credits, FileContent, ImageUploaded } from '@moodlenet/ed-resource/server'

declare module '@moodlenet/core-domain/resource/lifecycle' {
  export interface ResourceFileContent {
    content: FileContent
  }

  export interface ResourceLinkContent {
    url: string
  }
  export interface FileImage {
    image: ImageUploaded
  }
  export interface UrlImage {
    url: string
    credits?: null | Credits
  }
  export interface ProvidedResourceLinkContent {
    url: string
  }
  export interface ProvidedResourceFileContent {
    tmpFsLocation: string
  }
  export interface ProvidedUrlImage {
    url: string
  }
  export interface ProvidedFileImage {
    tmpFsLocation: string
  }
}
