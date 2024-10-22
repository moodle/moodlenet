import type { ok_ko, path } from '@moodle/lib-types'
import { userHomeId } from '../user-home'
import { uploaded_blob_meta } from './types/temp'
import { uploadMaxSizeConfigs } from './types/configs'
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
        createUserHome(_: { userHomeId: userHomeId }): Promise<ok_ko<void>>
      }
      query: {
        tempMeta(_: { tempId: string }): Promise<ok_ko<{ meta: uploaded_blob_meta }, { notFound: unknown }>>
      }
      write: {
        deletePath(_: {
          path: path
          type: 'file' | 'dir'
        }): Promise<ok_ko<void, { notFound: unknown; unexpectedType: unknown }>>
        deleteStaleTemp(): Promise<void>
      }
    }
  }
}
