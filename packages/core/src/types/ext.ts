import type { Observable, ObservableInput, Subscription } from 'rxjs'
import type * as Core from '../core-lib'
import { PackageInfo } from '../pkg-mng/types'
import type { DataMessage, IMessage, MessagePush } from './message'
import { RegItem } from './reg'
import { MainFolders } from './sys'
import type { PortBinding, PortPathData, PortPaths, Topo } from './topo'

type CoreLib = typeof Core
// export type CoreLib = typeof Core

export type ExtId<Def extends ExtDef = ExtDef> = `${ExtName<Def>}@${ExtVersion<Def>}` //` ;)
export type ExtName<Def extends ExtDef = ExtDef> = Def['name']
export type ExtVersion<Def extends ExtDef = ExtDef> = Def['version']
export type ExtPlug<Def extends ExtDef = ExtDef> = Def['plug']
export type ExtLib<Def extends ExtDef = ExtDef> = Def['lib']
export type ExtTopo<Def extends ExtDef = ExtDef> = Def['topo']

export type ExtDef<
  Name extends string = string,
  Version extends string = string, //`${string}.${string}.${string}`,
  ExtTopo extends Topo = Topo,
  Lib extends any = unknown,
  Plug extends any = unknown,
> = {
  name: Name
  version: Version
  topo: ExtTopo //& { '': Port<PortBinding, any> }
  lib: Lib
  plug: Plug
}

export type BootCfg = {
  mainFolders: MainFolders
  devMode: boolean
}
export type Boot = (cfg: BootCfg) => Promise<{ tearDown(): Promise<unknown> }>
export type BootExt = { boot: Boot }

export type ExtTopoDef<Def extends ExtTopo> = Def

type _Unsafe_ExtId<Def = ExtDef> = Def extends ExtDef ? ExtId<Def> : never
export type Ext<Def extends ExtDef = ExtDef, Requires extends ExtDef[] = ExtDef[]> = {
  name: ExtName<Def>
  version: ExtVersion<Def>
  requires: { [Index in keyof Requires]: _Unsafe_ExtId<Requires[Index]> }
  install?: ExtInstall<Def>
  uninstall?: ExtUninstall<Def>
  wireup: ExtWireup<Def>
}

export type RawExtEnv = any //Record<string, unknown> | undefined

export interface Shell<Def extends ExtDef = ExtDef> {
  _raw: RawShell
  plugin: OnExtInstance
  expose: ExposePointers<Def>
  access<DestDef extends ExtDef>(extId:ExtId<DestDef>): ReturnType<typeof Core.access<DestDef>>
  me: ReturnType<typeof Core.access<Def>>
  provide: ReturnType<typeof Core.provide<Def>>
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
}
export interface RawShell<Def extends ExtDef = ExtDef> {
  msg$: Observable<DataMessage<any>>
  libOf: GetExtLib
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
  onExtDeployment: OnExtDeployment
  onExtInstance: OnExtInstance
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

export type OnExtDeployment = <Def extends ExtDef>(
  id: ExtId<Def>,
  cb: (depl: RegItem<Def>) => void | (() => void),
) => Subscription
export type OnExt = <Def extends ExtDef>(id: ExtId<Def>, cb: (depl: RegItem<Def> | undefined) => void) => Subscription
export type OnExtInstance = <Def extends ExtDef>(
  id: ExtId<Def>,
  cb: (inst: ExtPlug<Def> /* , depl: RegDeployment<Def> */) => void | (() => void),
) => Subscription
export type GetExt = <Def extends ExtDef>(id: ExtId<Def>) => RegItem<Def> | undefined
export type GetExtLib = <Def extends ExtDef>(id: ExtId<Def>) => Promise<ExtPlug<Def> | void>
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
/* $ shell fns */

/* ^ ext life */
type ValueOrPromise<Value> = Value | Promise<Value>
export type ExtInstall<Def extends ExtDef = ExtDef> = (_: Shell<Def>) => ValueOrPromise<unknown>
export type ExtUninstall<Def extends ExtDef = ExtDef> = (_: RegItem<Def>) => ValueOrPromise<unknown>
// export type DeploymentShell<Def extends ExtDef = ExtDef> = Shell<Def> & { tearDown: Subscription }
export type ExtWireup<Def extends ExtDef = ExtDef> = (_: Shell<Def>) => ValueOrPromise<ExtDeployable<Def>>

export type ExtDeploy<Def extends ExtDef = ExtDef> = (
  // dShell: DeploymentShell<Def>,
  shell: Shell<Def>,
) => ValueOrPromise<ExtDeployment<Def>>
export type MWFn = (msg: IMessage, index: number) => ObservableInput<IMessage>
export type ExtDeployable<Def extends ExtDef = ExtDef> = (ExtLib<Def> extends undefined | null | void
  ? void | {
      mw?: MWFn
      lib?(_: { depl: RegItem }): ExtLib<Def>
    }
  : { mw?: MWFn; lib(_: { depl: RegItem }): ExtLib<Def> }) &
  (ExtPlug<Def> extends undefined | null | void
    ? void | {
        deploy?: ExtDeploy<Def>
      }
    : {
        deploy: ExtDeploy<Def>
      })

export type ExtDeployment<Def extends ExtDef = ExtDef> = ExtPlug<Def> extends undefined | null | void
  ? void | { plug?(_: { depl: RegItem }): ExtPlug<Def> }
  : { plug(_: { depl: RegItem }): ExtPlug<Def> }
/* $^  ext life */
