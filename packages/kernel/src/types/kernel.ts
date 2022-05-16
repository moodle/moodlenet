import type { ExtDef, ExtId } from './ext'
import type { Port } from './topo'

export type KernelExt = ExtDef<
  'kernel.core',
  '0.1.10',
  {
    ext: {
      // enabled: Port<'out', {}>
      // disabled: Port<'out', {}>
      deployed: Port<'out', { extId: ExtId }>
      undeployed: Port<'out', { extId: ExtId }>
    }
  }
>
