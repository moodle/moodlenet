import { fileMeta } from '@moodle/lib-domain-fs'
import type { ok_ko } from '@moodle/lib-types'
import { userProfileId } from '../user-profile'
import { Configs } from './types/configs'
export * from './types'

export default interface StorageDomain {
  event: { storage: unknown }
  service: { storage: unknown }
  primary: {
    storage: {
      session: {
        moduleInfo(): Promise<{ configs: Configs }>
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
        tempMeta(_: { tempId: string }): Promise<ok_ko<{ meta: fileMeta }, { notFound: unknown }>>
      }
      write: {
        deleteStaleTemp(): Promise<void>
      }
    }
  }
}
