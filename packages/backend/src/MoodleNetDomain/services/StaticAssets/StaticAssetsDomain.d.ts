import { WrkDef } from '../../../lib/domain/wrk'
import { AssetId, TempFileDesc } from './impl/types'

export type StaticAssets = {
  PersistTempFile: WrkDef<
    (_: {
      tempFileId: string
      rebaseName?: string
    }) => Promise<{ assetId: AssetId; fileDesc: TempFileDesc; done: true } | { reason: string; done: false }>
  >
}
