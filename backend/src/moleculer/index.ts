import { ActionSchema, CallingOptions, Context, ServiceBroker, ServiceSchema } from 'moleculer'

export type Service<
  Name extends string = string,
  ActSignMap extends ActionsSignMap = ActionsSignMap
> = PickedServiceSchema & {
  name: Name
  actions: ActionsMap<ActSignMap>
}
export type PickedServiceSchema = Pick<
  ServiceSchema,
  | 'version'
  | 'settings'
  | 'dependencies'
  | 'metadata'
  | 'mixins'
  | 'methods'
  | 'hooks'
  | 'events' // strip later
  | 'created'
  | 'started'
  | 'stopped'
>
/**
 * Actions
 */
export interface SignedActionSchema<Sign extends ActionSignature = ActionSignature>
  extends Pick<
    ActionSchema,
    | 'name'
    | 'visibility'
    | 'params'
    | 'service'
    | 'cache'
    | 'tracing'
    | 'bulkhead'
    | 'circuitBreaker'
    | 'retryPolicy'
    | 'fallback'
    | 'hooks'
  > {
  handler: ActionHandler<Sign>
  [key: string]: any
}
export type ActionSignature<In = any, Out = any> = [In, Out]
export type ActionIn<Sign extends ActionSignature> = Sign[0]
export type ActionOut<Sign extends ActionSignature> = Sign[1]
export type ActionOutOrProm<Sign extends ActionSignature> =
  | ActionOut<Sign>
  | Promise<ActionOut<Sign>>

export type ActionHandler<Sign extends ActionSignature = ActionSignature> = ((
  ctx: Context<ActionIn<Sign>>
) => ActionOutOrProm<Sign>) &
  ThisType<Service>

export type ActionsMap<ActSignMap extends ActionsSignMap = ActionsSignMap> = {
  [ActName in keyof ActSignMap]: SignedActionSchema<ActSignMap[ActName]>
}
export type ActionsSignMap = {
  [serviceName: string]: ActionSignature
}

export type ServiceActionSignature<
  Srv extends Service,
  ActName extends SrvActionName<Srv>
> = Srv['actions'][ActName]['handler'] extends ActionHandler<infer Sign> ? Sign : never

export type SrvActionName<Srv extends Service> = keyof Srv['actions']

/**
 * helpers
 */

export const srv_call = <S extends Service, ActName extends keyof S['actions']>(
  brk: ServiceBroker,
  service: S['name'],
  actName: ActName,
  params: ActionIn<ServiceActionSignature<S, ActName>>,
  opts?: CallingOptions
): Promise<ActionOut<ServiceActionSignature<S, ActName>>> =>
  brk.call(`${service}.${actName}`, params, opts)
