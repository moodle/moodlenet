import { Subject } from 'rxjs'
import { PackageInfo } from '../pkg-mng/types'
import type { Ext, ExtDef, ExtDeploy, ExtDeployable, ExtDeployment, Shell } from './ext'
import { DataMessage } from './message'
// export type PkgInfo = {
//   name: string
//   version: string
// }

export type RegItem<Def extends ExtDef = ExtDef> = ExtDeployment<Def> &
  ExtDeployable<Def> & {
    shell: Shell<Def>
    ext: Ext<Def>
    $msg$: Subject<DataMessage<any>>
    at: Date
    pkgInfo: PackageInfo
    deployer?: ExtDeploy<Def>
  }
