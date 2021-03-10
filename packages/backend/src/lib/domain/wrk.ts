// import { ExecutionResult } from 'graphql'
import { ExecutionResult } from 'graphql'
import { Acks } from './misc'
import { Leaves, LookupPath } from './path'

const DEFAULT_WRK_TIMEOUT = 3000

type AnyWorker = (...args: any[]) => Promise<any>
export type WorkerService<Worker extends AnyWorker> = [worker: Worker, teardown?: () => void]
export type Wrk<Worker extends AnyWorker> = {
  kind: 'wrk'
  init: WorkerInit<Worker>
  cfg?: Partial<WrkConfig>
}

export type WrkTypes<D, Path extends WrkLeaves<D>> = {
  Api: Path
  Worker: LookupWorker<D, Path>
  Init: WorkerInitImpl<D, Path>
}

export type WorkerInit<Worker extends AnyWorker> = (_: {
  cfg: WrkConfig
}) => WorkerService<Worker> | Promise<WorkerService<Worker>>
//export type WorkerInitImpl<D, Path extends string> = WorkerInit<LookupWorker<D, Path>>
export type WorkerInitImpl<D, Path extends WrkLeaves<D>> = WorkerInit<LookupWorker<D, Path>>

export type WrkLeaves<Domain> = Leaves<Domain, Wrk<any>>

export type LookupWorker<Domain, Path extends string> = LookupPath<Domain, Path> extends infer MaybeWrk
  ? MaybeWrk extends Wrk<infer Worker>
    ? Worker
    : never
  : never

export type LookupWrk<Domain, Path extends string> = LookupPath<Domain, Path> extends infer MaybeWrk
  ? MaybeWrk extends Wrk<infer Worker>
    ? Wrk<Worker>
    : never
  : never

/*export type WrkDef<Domain, Path extends string> = LookupPath<Domain, Path> extends infer MaybeWrk
  ? MaybeWrk extends Wrk<any, any>
    ? MaybeWrk
    : never
  : never*/
//
// Configs
export type CallConfig = {
  rejectionAck: Acks
  timeout: number
}
export const defaultCallConfig = (cfg?: Partial<CallConfig>): CallConfig => ({
  rejectionAck: Acks.Reject,
  timeout: DEFAULT_WRK_TIMEOUT,
  ...cfg,
})

export type EnqueueConfig = {
  rejectionAck: Acks
  delayDeliverSecs?: number
}
export const defaultEnqueueConfig = (cfg?: Partial<EnqueueConfig>): EnqueueConfig => ({
  rejectionAck: Acks.Requeue,
  ...cfg,
})

export type WrkConfig = {
  parallelism: number
  rejectionAck: Acks
}
export const defaultWrkConfig = (cfg?: Partial<WrkConfig>): WrkConfig => ({
  parallelism: 10,
  rejectionAck: Acks.Reject,
  ...cfg,
})

//
// Errors

//Timeout
export const WRK_TIMEOUT_ERROR_TAG: unique symbol = Symbol('WRK_TIMEOUT_ERROR_TAG')
export type WrkTimeoutError = { [WRK_TIMEOUT_ERROR_TAG]: any }
export const wrkTimeoutError = (exp: number): WrkTimeoutError => ({
  [WRK_TIMEOUT_ERROR_TAG]: exp,
})
export const isTimeoutError = (_: any): _ is WrkTimeoutError => !!_ && WRK_TIMEOUT_ERROR_TAG in _
export const getTimeoutError = (_: WrkTimeoutError) => _[WRK_TIMEOUT_ERROR_TAG]

//Reply
export type WrkReplyError = { ___WRK_REPLY_ERROR: string }
export const wrkReplyError = (msg: any): WrkReplyError => ({
  ___WRK_REPLY_ERROR: String(msg),
})
export const isReplyError = (_: any): _ is WrkReplyError => !!_ && typeof _ === 'object' && '___WRK_REPLY_ERROR' in _
export const getReplyError = (_: WrkReplyError) => _.___WRK_REPLY_ERROR

// GraphQL
type GraphQLDomainWrkReq<Context, RootValue> = {
  context: Context
  root: RootValue
  query: string
  variables: Record<string, any> | undefined
}

type GraphQLDomainWrkResp = {
  [K in keyof Required<ExecutionResult>]: ExecutionResult[K]
}

export type GraphQLDomainWrk<Context, RootValue> = Wrk<
  (_: GraphQLDomainWrkReq<Context, RootValue>) => Promise<GraphQLDomainWrkResp>
>
