import { filePath, imageFilePath, map } from '@moodle/lib-types'

export * from './configs'
export * from './primary-schemas'
export * from './user-profile'

declare module '@moodle/module/storage' {
  export interface DomainFilesystem {
    userProfile: map<{
      profile: {
        avatar: imageFilePath
        background: imageFilePath
      }
      drafts: {
        eduResource: map<{
          image: imageFilePath
          asset: filePath
        }>
        eduCollection: map<{
          image: imageFilePath
        }>
      }
    }>
  }
}
