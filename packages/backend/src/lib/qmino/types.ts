export type QMPkgDef = {
  root: string[]
}

export type QMPkg = {
  name: string
  version: string
  dir: string
  qmino: QMPkgDef
}
export type QMPortType = 'mutation' | 'event' | 'query'

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
export type QMDeployerProvider<Port extends AnyQMPort> = () => Promise<QMDeployer<Port>>
export type QMBinderDef<Port extends AnyQMPort> = {
  init: QMDeployerProvider<Port>
  deployment?: {
    at: Date
    //TODO: with resolver pipelines the resolver should get the previous QMActionExecutor<Port> ?
    resolver: QMPortResolver<Port>
    teardown: BinderTeardown
  }
}
export type BinderTeardown = () => Promise<unknown>

export type QMPortResponse<Port extends AnyQMPort> = ReturnType<ReturnType<Port>>

export type QMPortResolver<Port extends AnyQMPort> = (
  action: ReturnType<Port>,
  args: Parameters<Port>,
  port: Port,
) => () => QMPortResponse<Port>

export type QMLink<Port extends AnyQMPort> = {
  path: string[]
  id: string[]
  pkg: QMPkg
  binder?: QMBinderDef<Port>
}

export type AnyQMActionDef = QMActionDef<AnyQMPortDef>
export type QMActionDef<ActDef extends AnyQMPortDef> = {
  args: PortArgs<PortDefPort<ActDef>>
  portDef: ActDef
}

export type PortDefPort<PortDef extends AnyQMPortDef> = PortDef extends QMPortDef<any, infer Port> ? Port : never
export type PortArgs<Port extends AnyQMPort> = Port extends QMPort<infer Args, any, any> ? Args : never

export type ActionResp<Action extends AnyQMAction> = Action extends QMAction<any, infer Res> ? Res : never

export type ActionExtract<Action extends AnyQMAction> = {
  type: QMPortType
  link: QMLink<AnyQMPort>
  port: AnyQMPort
  id: string[]
  path: string[]
  pkg: QMPkg
  args: any[]
  action: Action
  binder: QMBinderDef<AnyQMPort> | undefined
}

export type ActionResolver<Action extends AnyQMAction = AnyQMAction> = (
  actionExtract: ActionExtract<Action>,
) => () => Promise<ActionResp<Action>>

export type QMActionExecutor<Port extends AnyQMPort> = () => QMPortResponse<Port>
