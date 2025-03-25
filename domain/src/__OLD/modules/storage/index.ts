import { ok_ko } from '@moodle/lib-types'
import { storedAssetMeta } from './types'
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
      service: {
        deleteStaleTemp(): Promise<void>
        createStoredAssetTempFileReference(_: {
          expiresSeconds: number
          storedAssetMeta: Pick<storedAssetMeta, 'path' | 'name'>
        }): Promise<ok_ko<{ tempId: string }, { notFoundInStorage: unknown; error: { error: unknown } }>>
      }
      sync: unknown
      query: unknown
      write: unknown
    }
  }
}
