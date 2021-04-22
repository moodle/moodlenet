// import { Flow } from '../../../lib/domain/flow'
// import { WrkDef } from '../../../lib/domain/wrk'

import { WrkDef } from '../../../lib/domain/wrk'
import { AssetFileFullPath, FileDesc } from './impl/types'

export type StaticAssets = {
  PersistTempFile: WrkDef<(tempFileId: string, path: AssetFileFullPath) => Promise<FileDesc | null>>
}
