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
        createStoredAssetTempFileReference(_: {
          expiresSeconds: number
          storedAssetMeta: Pick<storedAssetMeta, 'path' | 'name'>
        }): Promise<{ tempId: string }>
      }
      sync: unknown
      query: unknown
      write: {
        deleteStaleTemp(): Promise<void>
      }
    }
  }
}
