import type { ok_ko, path } from '@moodle/lib-types'
import { user_home_id } from '../userHome'
import { uploaded_blob_meta, uploadMaxSizeConfigs } from './types/fs'
export * from './lib'
export * from './types'

export default interface StorageDomain {
  event: { storage: unknown }
  primary: {
    storage: {
      session: {
        moduleInfo(): Promise<{ uploadMaxSizeConfigs: uploadMaxSizeConfigs }>
      }
    }
  }
  secondary: {
    storage: {
      queue: unknown
      service: unknown
      sync: {
        createUserHome(_: { userHomeId: user_home_id }): Promise<ok_ko<void>>
      }
      query: {
        tempMeta(_: {
          tempId: string
        }): Promise<ok_ko<{ meta: uploaded_blob_meta }, { notFound: unknown }>>
      }
      write: {
        //REVIEW - should this be in service? for simple use for every module e.g. useImageInProfile() ?
        // useTempFileAsWebImage(_: { tempId: string; destPath: path }): Promise<void>
        //
        deletePath(_: {
          path: path
          type: 'file' | 'dir'
        }): Promise<ok_ko<void, { notFound: unknown; unexpectedType: unknown }>>
        deleteStaleTemp(): Promise<void>
      }
    }
  }
}
