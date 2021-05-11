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

export type QMAction<Adapters extends any[], Res> = (...adapters: Adapters) => Promise<Res>
export type AnyQMAction = QMAction<any[], any>
export type QMPort<Args extends any[], Adapters extends any[], Res> = (...args: Args) => QMAction<Adapters, Res>
export type AnyQMPort = QMPort<any[], any[], any>
export type AnyQMPortDef = QMPortDef<QMPortType, AnyQMPort>
export type QMPortDef<QMT extends QMPortType, Port extends AnyQMPort> = {
  type: QMT
  port: Port
  link?: QMLink<Port>
}

export type QMDeployer<Port extends AnyQMPort> = [resolver: QMPortResolver<Port>, teardown: BinderTeardown]
export type QMDeployment<Port extends AnyQMPort> = {
  at: Date
  //TODO: with resolver pipelines the resolver should get the previous QMActionExecutor<Port> ?
  resolver: QMPortResolver<Port>
  teardown: BinderTeardown
}
export type BinderTeardown = () => Promise<unknown>

export type QMPortResponse<Port extends AnyQMPort> = ReturnType<QMPortAction<Port>>
export type QMPortAction<Port extends AnyQMPort> = ReturnType<Port>

export type QMPortResolver<Port extends AnyQMPort> = (
  action: ReturnType<Port>,
  args: Parameters<Port>,
  port: Port,
) => QMPortResponse<Port>

export type QMLink<Port extends AnyQMPort> = {
  path: string[]
  id: string[]
  pkg: QMPkg
  // be it an array, for multiple transport deployment
  deployment?: QMDeployment<Port>
}

export type AnyQMActionDef = QMActionDef<AnyQMPortDef>
export type QMActionDef<ActDef extends AnyQMPortDef> = {
  args: PortArgs<PortDefPort<ActDef>>
  portDef: ActDef
}

export type PortDefPort<PortDef extends AnyQMPortDef> = PortDef extends QMPortDef<any, infer Port> ? Port : never
export type PortArgs<Port extends AnyQMPort> = Port extends QMPort<infer Args, any, any> ? Args : never

export type QMActionResponse<Action extends AnyQMAction> = Action extends QMAction<any, infer Res> ? Res : never

export type ActionExtract<Action extends AnyQMAction> = {
  type: QMPortType
  link: QMLink<AnyQMPort>
  port: AnyQMPort
  id: string[]
  path: string[]
  pkg: QMPkg
  args: any[]
  action: Action
  deployment: QMDeployment<AnyQMPort> | undefined
}

export type ActionResolver<Action extends AnyQMAction = AnyQMAction> = (
  actionExtract: ActionExtract<Action>,
) => () => Promise<QMActionResponse<Action>>

export type QMPortExecutor<Port extends AnyQMPort> = () => Promise<QMPortResponse<Port>>
export type QMActionExecutor<Action extends AnyQMAction> = () => Promise<QMActionResponse<Action>>
