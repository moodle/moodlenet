export type QMPkgDef = {
  root: string[]
}

export type QMPkg = {
  name: string
  version: string
  dir: string
  qmino: QMPkgDef
}
export type QMPortType = 'command' | 'event' | 'query'

export type QMAction<Adapter extends Object, Res> = (adapter: Adapter) => Promise<Res>
export type AnyQMAction = QMAction<any, any>
export type QMPort<Args extends any[], Adapter extends Object, Res> = (...args: Args) => QMAction<Adapter, Res>
export type AnyQMPort = QMPort<any[], any, any>
export type AnyQMPortDef = QMPortDef<QMPortType, AnyQMPort>
export type QMPortDef<QMT extends QMPortType, Port extends AnyQMPort> = {
  type: QMT
  port: Port
  link?: QMLink<Port>
}

export type QMDeployment<Port extends AnyQMPort> = {
  at: Date
  adapter: QMAdapter<Port>
  teardown?: Teardown
}
export type Teardown = () => Promise<unknown>

export type QMPortResponse<Port extends AnyQMPort> = ReturnType<QMPortAction<Port>>
export type QMPortAction<Port extends AnyQMPort> = ReturnType<Port>

export type QMAdapter<Port extends AnyQMPort> = Parameters<QMPortAction<Port>>[0]

export type QMLink<Port extends AnyQMPort> = {
  path: string[]
  id: string[]
  pkg: QMPkg
  // be it an array, for multiple transport deployment support
  deployment?: QMDeployment<Port>
}

export type Transport = {
  enqueue(args: any[]): Promise<unknown>
  callSync(args: any[]): Promise<unknown>
  emit(args: any[]): Promise<unknown>
  query(args: any[]): Promise<unknown>
}

export type AnyQMActionDef = QMActionDef<AnyQMPortDef>
export type QMActionDef<PortDef extends AnyQMPortDef> = {
  args: PortArgs<PortDefPort<PortDef>>
  portDef: PortDef
}
export type PortDefPort<PortDef extends AnyQMPortDef> = PortDef extends QMPortDef<any, infer Port> ? Port : never
export type PortArgs<Port extends AnyQMPort> = Port extends QMPort<infer Args, any, any> ? Args : never

export type QMActionResponse<Action extends AnyQMAction> = Action extends QMAction<any, infer Res> ? Res : never

export type ActionExtract<Action extends AnyQMAction> = {
  type: QMPortType
  link: QMLink<AnyQMPort>
  id: string[]
  path: string[]
  pkg: QMPkg
  action: Action
  deployment: QMDeployment<AnyQMPort> | undefined
  // port: AnyQMPort
  // args: any[]
}

export type ActionResolver<Action extends AnyQMAction = AnyQMAction> = (
  actionExtract: ActionExtract<Action>,
) => () => Promise<QMActionResponse<Action>>

export type QMPortExecutor<Port extends AnyQMPort> = () => Promise<QMPortResponse<Port>>
export type QMActionExecutor<Action extends AnyQMAction> = () => Promise<QMActionResponse<Action>>
