import type { ok_ko, path } from '@moodle/lib-types'
import { userProfileId } from '../user-profile'
import { uploaded_blob_meta } from './types/temp'
import { uploadMaxSizeConfigs } from './types/configs'
export * from './types'

export default interface StorageDomain {
  event: { storage: unknown }
  service: { storage: unknown }
  primary: {
    storage: {
      session: {
        moduleInfo(): Promise<{ uploadMaxSizeConfigs: uploadMaxSizeConfigs }>
      }
    }
  }
  secondary: {
    storage: {
      service?: unknown
      sync: {
        createUserProfile(_: { userProfileId: userProfileId }): Promise<ok_ko<void>>
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
