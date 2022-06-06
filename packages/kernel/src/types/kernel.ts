import { SubTopo } from '../k-lib'
import type { Ext, ExtDef, ExtId } from './ext'
import { PkgInfo } from './reg'
import type { Port } from './topo'

export type KernelExt = ExtDef<
  'moodlenet.kernel',
  '0.1.10',
  {
    ext: {
      deployed: Port<'out', { extId: ExtId }>
      undeployed: Port<'out', { extId: ExtId }>
    }
    pkgs: {
      all: SubTopo<void, ExtPkgInfo[]>
    }
  }
>

export type ExtPkgInfo = {
  pkgInfo: PkgInfo
  exts: Omit<Ext, 'enable'>[]
}
