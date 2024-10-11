import type { ok_ko, path, pretty } from '@moodle/lib-types'
import { temp_blob_meta, uploadMaxSizeConfigs, useTempFileAsWebImageResult } from './types'

export * from './domain-filesystem'
export * from './primary-schemas'
export * from './types'

export type storage_secondary = pretty<StorageSecondary>
export type storage_primary = pretty<StoragePrimary>

export interface StoragePrimary {
  session: {
    moduleInfo(): Promise<{ uploadMaxSizeConfigs: uploadMaxSizeConfigs }>
  }
}
export interface StorageSecondary {
  db: {
    // TODO: do this stuff using watchers !
    //   saveBlobMeta(_: {
    //     path: path
    //     meta: blob_meta
    //     replace?: boolean
    //   }): Promise<ok_ko<void, { exists: unknown }>>
    //   deleteBlobMeta(_: {
    //     path: path
    //     recursive: boolean
    //   }): Promise<ok_ko<void, { notFound: unknown }>>
    // readBlobMeta(_: { path: path }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>>
  }
  temp: {
    getTempMeta(_: {
      tempId: string
    }): Promise<ok_ko<{ meta: temp_blob_meta }, { notFound: unknown }>>
    useTempFileAsWebImage(_: {
      tempId: string
      destPath: path
    }): Promise<useTempFileAsWebImageResult>
  }
  access: {
    deletePath(_: {
      path: path
      type: 'file' | 'dir'
    }): Promise<ok_ko<void, { notFound: unknown; unexpectedType: unknown }>>
  }
}
