import type { blob_meta, ok_ko, path, pretty, temp_blob_meta } from '@moodle/lib-types'

export * from './domain-files'

export type storage_secondary = pretty<StorageSecondary>

// export interface StoragePrimary {}
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
    readBlobMeta(_: { path: path }): Promise<ok_ko<{ meta: blob_meta }, { notFound: unknown }>>
  }
  // 'stream-in': {
  //   temp(_: {
  //     readable: Readable
  //     meta: blob_meta
  //   }): Promise<ok_ko<{ tmpId: string; meta: blob_meta }, { error: { message: string } }>>
  // }
  // 'stream-out': {
  //   temp(_: {
  //     tmpId: string
  //   }): Promise<ok_ko<{ stream: Readable; meta: blob_meta }, { error: { message: string } }>>
  //   path(_: {
  //     path: string
  //   }): Promise<ok_ko<{ stream: Readable; meta: blob_meta }, { error: { message: string } }>>
  // }
  temp: {
    getTempMeta(_: {
      tempId: string
    }): Promise<ok_ko<{ meta: temp_blob_meta }, { notFound: unknown }>>
    useTempFileAsWebImage(_: {
      tempId: string
      destPath: path
    }): Promise<ok_ko<{ meta: temp_blob_meta }, { notFound: unknown }>>
  }
  access: {
    deletePath(_: {
      path: path
      type: 'file' | 'dir'
    }): Promise<ok_ko<void, { notFound: unknown; unexpectedType: unknown }>>
    // getUrl(_: {
    //   path: path
    //   proto: 'http'
    // }): Promise<ok_ko<{ url: url_string }, { notFound: unknown; notDeployed: unknown }>>
  }
}
