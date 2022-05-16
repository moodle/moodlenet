import type { Observable, Subscription } from 'rxjs'
import type * as K from '../k'
import type { DataMessage, MessagePush } from './message'
import { PkgInfo, RegDeployment } from './reg'
import type { PortBinding, PortPathData, PortPaths, Topo } from './topo'

type KLib = typeof K
// export type KernelLib = typeof K
export type ExtVersion = string

export type ExtId<Def extends ExtDef = ExtDef> = `${Def['name']}@${Def['version']}` //` ;)
export type ExtName<Def extends ExtDef = ExtDef> = `${Def['name']}` //` ;)
export type ExtInst<Def extends ExtDef = ExtDef> = Def['inst']
export type ExtLib<Def extends ExtDef = ExtDef> = Def['lib']
export type ExtTopo<Def extends ExtDef = ExtDef> = Def['topo']

export type ExtDef<
  Name extends string = string,
  Version extends ExtVersion = ExtVersion,
  ExtTopo extends Topo = Topo,
  Lib extends any = any,
  Instance extends any = any,
> = {
  name: Name
  version: Version
  topo: ExtTopo //& { '': Port<PortBinding, any> }
  inst: Instance
  lib: Lib
}

export type ExtTopoDef<Def extends ExtTopo> = Def

type _Unsafe_ExtId<Def = ExtDef> = Def extends ExtDef ? ExtId<Def> : never
export type Ext<Def extends ExtDef = ExtDef, Requires extends ExtDef[] = ExtDef[]> = {
  id: ExtId<Def>
  displayName: string
  requires: { [Index in keyof Requires]: _Unsafe_ExtId<Requires[Index]> }
  enable: ExtEnable<Def>
  description?: string
}

export type RawExtEnv = Record<string, unknown> | undefined

export interface Shell<Def extends ExtDef = ExtDef> {
  msg$: Observable<DataMessage<any>>
  libOf: GetExtLib
  onExtDeployment: OnExtDeployment
  onExtInstance: OnExtInstance
  onExt: OnExt
  getExt: GetExt
  push: PushMessage<Def>
  emit: EmitMessage<Def>
  send: SendMessage
  env: RawExtEnv
  extId: ExtId<Def>
  pkgInfo: PkgInfo
  expose: ExposePointers<Def>
  lib: KLib
}

export type OnExtDeployment = <Def extends ExtDef>(
  id: ExtId<Def>,
  cb: (depl: RegDeployment<Def>) => void | (() => void),
) => Subscription

export type OnExt = <Def extends ExtDef>(
  id: ExtId<Def>,
  cb: (depl: RegDeployment<Def> | undefined) => void,
) => Subscription

export type OnExtInstance = <Def extends ExtDef>(
  id: ExtId<Def>,
  cb: (inst: ExtInst<Def> /* , depl: RegDeployment<Def> */) => void | (() => void),
) => Subscription

export type GetExt = <Def extends ExtDef>(id: ExtId<Def>) => RegDeployment<Def> | undefined

// export type OnExtDeployment<Def extends ExtDef> = OnExtDeployable<Def> & { inst: ExtInst<Def> }
// export type OnExtDeployable<Def extends ExtDef> = { version: Version; at: Date; pkgInfo: PkgInfo; lib: ExtLib<Def> }
export type GetExtLib = <Def extends ExtDef>(id: ExtId<Def>) => ExtInst<Def> | void

//<Def extends ExtDef = ExtDef> {
export interface DeploymentShell {
  tearDown: Subscription
}

export type MWFn = (msg: DataMessage<any>, index: number) => Observable<DataMessage<any>>

export type ExtEnable<Def extends ExtDef = ExtDef> = (_: Shell<Def>) => ExtDeployable<Def>
export type ExtDeployable<Def extends ExtDef = ExtDef> = {
  deploy: (_: DeploymentShell) => ExtDeployment<Def>
  mw?: MWFn
} & (ExtLib<Def> extends undefined | null | void
  ? { lib?(_: { depl: RegDeployment }): ExtLib<Def> }
  : { lib(_: { depl: RegDeployment }): ExtLib<Def> })

export type ExtDeployment<Def extends ExtDef = ExtDef> = {} & (ExtInst<Def> extends undefined | null | void
  ? { inst?(_: { depl: RegDeployment }): ExtInst<Def> }
  : { inst(_: { depl: RegDeployment }): ExtInst<Def> })

export type EmitMessage<SrcDef extends ExtDef = ExtDef> = <Path extends PortPaths<SrcDef, 'out'>>(
  path: Path,
) => (data: PortPathData<SrcDef, Path, 'out'>, opts?: Partial<PushOptions>) => MessagePush<'out', SrcDef, SrcDef, Path>

export type SendMessage = <DestDef extends ExtDef = ExtDef>(
  extId: ExtId<DestDef>,
) => <Path extends PortPaths<DestDef, 'in'>>(
  path: Path,
) => (data: PortPathData<DestDef, Path, 'in'>, opts?: Partial<PushOptions>) => MessagePush<'in', DestDef, DestDef, Path>

export type PushMessage<SrcDef extends ExtDef = ExtDef> = <Bound extends PortBinding = PortBinding>(
  bound: Bound,
) => <DestDef extends ExtDef = SrcDef>(
  destExtId: ExtId<DestDef>,
) => <Path extends PortPaths<DestDef, Bound>>(
  path: Bound extends 'in' ? Path : SrcDef extends DestDef ? Path : never,
) => (
  data: PortPathData<DestDef, Path, Bound>,
  opts?: Partial<PushOptions>,
) => MessagePush<Bound, SrcDef, DestDef, Path>

export type PushOptions = {
  parent: DataMessage<any> | null
  primary: boolean
  sub: boolean
}

export type ExposedPointer = {
  validate(data: unknown): ValidationMessage
}

type ValidationMessage = {
  valid: boolean
  msg?: string
}

export type ExposePointers<Def extends ExtDef = ExtDef> = (p: Partial<ExposedPointerMap<Def>>) => void

export type ExposedPointerMap<Def extends ExtDef = ExtDef> = {
  [path in PortPaths<Def, 'in'>]: ExposedPointer
}
