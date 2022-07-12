import { Subject } from 'rxjs'
import { InstalledPackageInfo } from '../pkg-mng/types'
import type { Deploy, DeploymentShell, Ext, ExtDef, ExtDeployable, ExtDeployment, Shell } from './ext'
import { DataMessage } from './message'
// export type PkgInfo = {
//   name: string
//   version: string
// }

export type RegDeployment<Def extends ExtDef = ExtDef> = Shell<Def> &
  ExtDeployable<Def> &
  DeploymentShell &
  ExtDeployment<Def> & {
    ext: Ext<Def>
    $msg$: Subject<DataMessage<any>>
    at: Date
    installedPackageInfo: InstalledPackageInfo
    deployedWith?: Deploy<Def>
  }
