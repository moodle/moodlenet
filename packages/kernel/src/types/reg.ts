import { Subject } from 'rxjs'
import type { Deploy, DeploymentShell, Ext, ExtDef, ExtDeployable, ExtDeployment, Shell } from './ext'
import { DataMessage } from './message'
export type { ExtLocalDeploymentRegistry as ExtLocalDeploymentRegistry } from '../registry/node'
export type PkgInfo = {
  name: string
  version: string
}

export type RegDeployment<Def extends ExtDef = ExtDef> = Shell<Def> &
  ExtDeployable<Def> &
  DeploymentShell &
  ExtDeployment<Def> & {
    ext: Ext<Def>
    $msg$: Subject<DataMessage<any>>
    at: Date
    pkgInfo: PkgInfo
    deployedWith?: Deploy<Def>
  }
