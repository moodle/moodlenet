import type { Observable, ObservableInput, Subscription } from 'rxjs'
import type * as Core from '../core-lib'
import { PackageInfo } from '../pkg-mng/types'
import type { DataMessage, IMessage, MessageContext, MessagePush } from './message'
import { RegItem } from './reg'
import { MainFolders } from './sys'
import type { PortBinding, PortPathData, PortPaths, Topo } from './topo'

type CoreLib = typeof Core
// export type CoreLib = typeof Core

export type ExtId<Def extends ExtDef = ExtDef> = `${ExtName<Def>}@${ExtVersion<Def>}` //` ;)
export type ExtName<Def extends ExtDef = ExtDef> = Def['name']
export type ExtVersion<Def extends ExtDef = ExtDef> = Def['version']
export type ExtPlug<Def extends ExtDef = ExtDef> = Def['plug']
// export type ExtLib<Def extends ExtDef = ExtDef> = Def['lib']
export type ExtTopo<Def extends ExtDef = ExtDef> = Def['topo']

export type ExtDef<
  Name extends string = string,
  Version extends string = string, //`${string}.${string}.${string}`,
  Plug extends any = unknown,
  ExtTopo extends Topo = Topo,
  // Lib extends any = unknown,
> = {
  name: Name
  version: Version
  topo: ExtTopo //& { '': Port<PortBinding, any> }
  // lib: Lib
  plug: Plug
}

export type BootCfg = {
  mainFolders: MainFolders
  devMode: boolean
}
export type Boot = (cfg: BootCfg) => Promise<{ tearDown(): Promise<unknown> }>

export type ExtTopoDef<Def extends ExtTopo> = Def

type _Unsafe_ExtId<Def = ExtDef> = Def extends ExtDef ? ExtId<Def> : never
export type Ext<Def extends ExtDef = ExtDef, Requires extends Dependencies = Dependencies> = {
  name: ExtName<Def>
  version: ExtVersion<Def>
  requires: { [Index in keyof Requires]: _Unsafe_ExtId<Requires[Index]> }
  connect: ExtConnect<Def, Requires>
}

export type RawExtEnv = any //Record<string, unknown> | undefined

export type Deps<OfExt extends Ext> = OfExt extends Ext<any, infer Requires> ? DepsOf<Requires> : never
export type DepsOf<Requires extends Dependencies = Dependencies> = {
  [Index in keyof Requires]: Dep<Requires[Index]>
}
export type Dep<Def extends ExtDef = ExtDef> = {
  plug: ExtPlug<Def>
  access: Core.AccessPkg<Def>
}
type Dependencies = readonly ExtDef[]
export type ExtShell<OfExt extends Ext<any, any>> = OfExt extends Ext<infer Def, infer Requires>
  ? Shell<Def, Requires>
  : Shell

export type FullRequires<Requires extends Dependencies> = {
  [index in keyof Requires]: {
    id: ExtId<Requires[index]>
    name: ExtName<Requires[index]>
    version: ExtVersion<Requires[index]>
  }
}

export interface Shell<Def extends ExtDef = ExtDef, Requires extends Dependencies = Dependencies> {
  _raw: RawShell
  // baseFolder: string
  requires: FullRequires<Requires>
  deps: DepsOf<Requires>
  expose: ExposePointers<Def>
  me: Core.AccessPkg<Def>
  pkg<DestDef extends ExtDef>(extId: ExtId<DestDef>): Core.AccessPkg<DestDef>
  provide: Core.Provide<Def>
  // me: Me<Def>
  // access: Access //<DestDef extends ExtDef>(extId:ExtId<DestDef>): ReturnType<typeof Core.access<DestDef>>
  // provide: Provide<Def>
  extId: ExtId<Def>
  extName: ExtName<Def>
  extVersion: ExtVersion<Def>
  lib: CoreLib
  rx: CoreLib['rx']
  env: RawExtEnv
  getExt: GetExt
  msg$: Observable<DataMessage<any>>
  emit: EmitMessage<Def>
  tearDown: Subscription
  onExtInstalled: OnExtInstalled
  onExtUninstalled: OnExtUninstalled
}
export interface RawShell<Def extends ExtDef = ExtDef> {
  msg$: Observable<DataMessage<any>>
  // libOf: GetExtLib
  getExt: GetExt
  push: PushMessage<Def>
  emit: EmitMessage<Def>
  send: SendMessage
  env: RawExtEnv
  lib: CoreLib
  extId: ExtId<Def>
  extName: ExtName<Def>
  extVersion: ExtVersion<Def>
  tearDown: Subscription
  // onExtDeployment: OnExtDeployment
  // onExtInstance: OnExtInstance
  onExtInstalled: OnExtInstalled
  onExtUninstalled: OnExtUninstalled
  onExt: OnExt

  expose: ExposePointers<Def>
  pkgInfo: PackageInfo
}

/* ^ shell fns */

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

// export type OnExtDeployment = <Def extends ExtDef>(
//   id: ExtId<Def>,
//   cb: (depl: RegItem<Def>) => void | (() => void),
// ) => Subscription
export type OnExt = <Def extends ExtDef>(id: ExtId<Def>, cb: (depl: RegItem<Def> | undefined) => void) => Subscription
// export type OnExtInstance = <Def extends ExtDef>(
//   id: ExtId<Def>,
//   cb: (inst: ExtPlug<Def> /* , depl: RegDeployment<Def> */) => void | (() => void),
// ) => Subscription
export type OnExtInstalled = (
  cb: (_: { extName: ExtName<any>; extVersion: ExtVersion<any>; extId: ExtId<any> }) => void,
) => Subscription
export type OnExtUninstalled = (
  cb: (_: { extName: ExtName<any>; extVersion: ExtVersion<any>; extId: ExtId<any> }) => void,
) => Subscription
export type GetExt = <Def extends ExtDef>(id: ExtId<Def>) => RegItem<Def> | undefined
// export type GetExtLib = <Def extends ExtDef>(id: ExtId<Def>) => Promise<ExtPlug<Def> | void>
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
  context?: MessageContext
}
/* $ shell fns */

/* ^ ext life */
type ValueOrPromise<Value> = Value | Promise<Value>
export type ExtInstall = () => ValueOrPromise<unknown>
export type ExtUninstall = () => ValueOrPromise<unknown>
export type ExtDeploy<Def extends ExtDef = ExtDef> = () => ValueOrPromise<ExtDeployment<Def>>

export type ExtConnection<Def extends ExtDef = ExtDef> = {
  install?: ExtInstall
  uninstall?: ExtUninstall
  deploy: ExtDeploy<Def>
}
export type ExtConnect<Def extends ExtDef = ExtDef, Requires extends Dependencies = Dependencies> = (
  _: Shell<Def, Requires>,
) => ValueOrPromise<ExtConnection<Def>>

export type MWFn = (msg: IMessage, index: number) => ObservableInput<IMessage>

// type _WithMaybeLib<Def extends ExtDef> = ExtLib<Def> extends undefined | null | void
//   ? { lib?(_: { depl: RegItem }): ExtLib<Def> }
//   : { lib(_: { depl: RegItem }): ExtLib<Def> }
type _WithMaybePlug<Def extends ExtDef> = ExtPlug<Def> extends undefined | null | void
  ? void | { plug?: PluginFn<Def> }
  : { plug: PluginFn<Def> }
export type PluginFn<Def extends ExtDef = ExtDef> = (_: { shell: Shell }) => ExtPlug<Def>
export type ExtDeployment<Def extends ExtDef = ExtDef> = { mw?: MWFn } & _WithMaybePlug<Def> //& _WithMaybeLib<Def>
/* $^  ext life */
