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
export type QMPortId = [QMPortType, ...string[]]

export type QMAction<Adapter extends Object, Res> = (adapter: Adapter) => Promise<Res>
export type AnyQMAction = QMAction<any, any>
export type QMPort<Args extends any[], Adapter extends Object, Res> = (...args: Args) => QMAction<Adapter, Res>
export type AnyQMPort = QMPort<any[], any, any>
export type AnyQMPortDef = QMPortDef<QMPortType, AnyQMPort>
export type QMPortDef<QMT extends QMPortType, Port extends AnyQMPort> = {
  type: QMT
  port: Port
  link?: QMLink
}

export type QMDeployment<Port extends AnyQMPort> = {
  at: Date
  adapter: QMAdapter<Port>
  port: Port
  teardown: Teardown
}
export type Teardown = () => Promise<unknown>

export type QMPortResponse<Port extends AnyQMPort> = ReturnType<QMPortAction<Port>>
export type QMPortAction<Port extends AnyQMPort> = ReturnType<Port>

export type QMAdapter<Port extends AnyQMPort> = Parameters<QMPortAction<Port>>[0]

export type QMLink = {
  path: string[]
  id: QMPortId
  pkg: QMPkg
}

export type TransportPortHandler = (...args: any[]) => Promise<any>
export type TransportPortDeployment = { teardown: Teardown }
export type WaitsForResponse = {
  timeout: number
}
export type Transport = {
  open(id: QMPortId, handler: TransportPortHandler): Promise<TransportPortDeployment>
  send(id: QMPortId, args: any[], waitsForResponse?: WaitsForResponse): Promise<any>
  // query(id: PortId, args: any[]): Promise<any>
  // enqueue(id: PortId, args: any[]): Promise<void>
  // emit(id: PortId, args: any[]): Promise<void>
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
  link: QMLink
  id: QMPortId
  path: string[]
  pkg: QMPkg
  action: Action
  deployment: QMDeployment<AnyQMPort> | undefined
  transport: Transport
  args: any[]
}

export type ActionResolver<Action extends AnyQMAction = AnyQMAction> = (
  actionExtract: ActionExtract<Action>,
) => () => Promise<QMActionResponse<Action>>

export type QMPortExecutor<Port extends AnyQMPort> = () => Promise<QMPortResponse<Port>>
export type QMActionExecutor<Action extends AnyQMAction> = () => Promise<QMActionResponse<Action>>
export type QMino = {
  open: <P extends AnyQMPort>(port: P, adapter: QMAdapter<P>, teardown?: Teardown) => Promise<void>
  callSync: <Res>(action: QMAction<any, Res>, waitsForResponse: WaitsForResponse) => Promise<Res>
  query: <Res>(action: QMAction<any, Res>, waitsForResponse: WaitsForResponse) => Promise<Res>
}
