import { DocumentMetadata } from '@moodlenet/arangodb/server'
import { RpcFile } from '@moodlenet/core'

<<<<<<< HEAD
export type FSStore = {
  store: (logicalName: string, _rpcFile: RpcFile) => Promise<FsItem>
  get: (logicalName: string) => Promise<undefined | FsItem>
  del: (logicalName: string) => Promise<null | FsItem>
  ls: (pOpts?: Partial<LsOpts> | undefined) => Promise<undefined | FsItem[]>
  getRpcFileByDirectAccessId: (directAccessId: string) => Promise<RpcFile>
  mountStaticHttpServer: (path: string) => Promise<void>
}
=======
// export type FSStore = {
//   store: (logicalName: string, _rpcFile: RpcFile) => Promise<FsItem>
//   get: (logicalName: string) => Promise<undefined | FsItem>
//   del: (logicalName: string) => Promise<null | FsItem>
//   ls: (pOpts?: Partial<LsOpts> | undefined) => Promise<undefined | FsItem[]>
//   getRpcFileByDirectAccessId: (directAccessId: string) => Promise<RpcFile>
//   mountStaticHttpServer: (path: string) => Promise<void>
// }
>>>>>>> origin/fix/resource-review-finalize

export type DbRecordData = FsItem & {
  logicalPath: string[]
  logicalPathLength: number
}

export type DbRecord = DbRecordData & DocumentMetadata

export type FsItem = {
  logicalName: string
  rpcFile: RpcFile
  created: string
  directAccessId: string
}

export type LsOpts = { maxDepth: number; path: string }
