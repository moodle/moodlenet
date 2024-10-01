import type { blob_meta, ok_ko, path, pretty, url_string } from '@moodle/lib-types'

export type storage_primary = pretty<StoragePrimary>
export type storage_secondary = pretty<StorageSecondary>

export interface StoragePrimary {
  read: {
    getUrl(_: {
      path: path
      proto: 'http'
    }): Promise<ok_ko<{ url: url_string }, { notFound: unknown; notDeployed: unknown }>>
  }
  write: {
    deletePath(_: { path: path; type: 'file' | 'dir' }): Promise<ok_ko<void, { notFound: unknown }>>
  }
  temp: {
    useTemp(_: {
      tmpId: string
      destPath: path
    }): Promise<ok_ko<void, { notFound: unknown; exists: unknown }>>
  }
}

export interface StorageSecondary {
  db: {
    saveMeta(_: {
      path: path
      meta: blob_meta
      replace?: boolean
    }): Promise<ok_ko<void, { exists: unknown }>>
    readMeta(_: { path: path }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>>
    deleteMeta(_: { path: path }): Promise<ok_ko<void, { notFound: unknown }>>
  }
  store: {
    getTempMeta(_: { tmpId: string }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>>
    mvTempFile(_: {
      tmpId: string
      destFullPath: path
    }): Promise<ok_ko<void, { notFound: unknown }>>
    deletePath(_: { path: path; type: 'file' | 'dir' }): Promise<ok_ko<void>>
  }
}
