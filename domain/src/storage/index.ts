import type { blob_meta, ok_ko, path, pretty, url_string } from '@moodle/lib-types'

export type storage_secondary = pretty<StorageSecondary>

export interface StorageSecondary {
  db: {
    saveBlobMeta(_: {
      path: path
      meta: blob_meta
      replace?: boolean
    }): Promise<ok_ko<void, { exists: unknown }>>
    readBlobMeta(_: { path: path }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>>
    deleteBlobMeta(_: { path: path }): Promise<ok_ko<void, { notFound: unknown }>>
  }
  temp: {
    getTempMeta(_: { tmpId: string }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>>
    useTempFile(_: {
      tmpId: string
      destPath: path
    }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>>
  }
  access: {
    deletePath(_: {
      path: path
      type: 'file' | 'dir'
    }): Promise<ok_ko<void, { notFound: unknown; unexpectedType: unknown }>>
    getUrl(_: {
      path: path
      proto: 'http'
    }): Promise<ok_ko<{ url: url_string }, { notFound: unknown; notDeployed: unknown }>>
  }
}

export type StorageLibProvider = (_: { base_path: path }) => StorageLib
export interface StorageLib {
  getTempFileMeta(_: { tmpId: string }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>>
  deletePath(_: {
    path: path
    type: 'file' | 'dir'
  }): Promise<ok_ko<void, { notFound: unknown; unexpectedType: unknown }>>
  mvTempFile(_: {
    tmpId: string
    dest_path: path
  }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>>
}
