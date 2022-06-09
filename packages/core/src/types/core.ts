import { SubTopo } from '../core-lib'
import type { Ext, ExtDef, ExtId } from './ext'
import { PkgInfo } from './reg'
import type { Port } from './topo'

export type CoreExt = ExtDef<
  'moodlenet-core',
  '0.1.10',
  {
    ext: {
      deployed: Port<'out', { extId: ExtId }>
      undeployed: Port<'out', { extId: ExtId }>
      listDeployed: SubTopo<void, ExtInfo[]>
    }
  }
>

export type ExtInfo = {
  ext: Omit<Ext, 'enable'>
  pkgInfo: PkgInfo
}
