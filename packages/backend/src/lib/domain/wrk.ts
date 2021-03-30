// import { ExecutionResult } from 'graphql'
import { ExecutionResult } from 'graphql'
import { Acks } from './misc'
import { Leaves, LookupPath } from './path'
import { Teardown } from './types'

const DEFAULT_WRK_TIMEOUT = 3000

type AnyWorker = (...args: any[]) => Promise<any>
export type WorkerService<Worker extends AnyWorker> = readonly [worker: Worker, teardown?: Teardown]
export type WrkDef<Worker extends AnyWorker> = {
  kind: 'wrk'
  cfg?: Partial<WrkConfig>
  __$do_not_set_me_Worker_Type_placeholder?: Worker
}

export type WorkerInit<Worker extends AnyWorker> = (_: { cfg: WrkConfig }) => Promise<WorkerService<Worker>>
//export type WorkerInitImpl<D, Path extends string> = WorkerInit<LookupWorker<D, Path>>
export type LookupWorkerInit<D, Path extends WrkPaths<D>> = WorkerInit<LookupWorker<D, Path>>

export type WrkPaths<Domain> = Leaves<Domain, WrkDef<AnyWorker>>

// export type LookupWorker<Domain, Path extends string> = LookupPath<Domain, Path> extends infer MaybeWrkDef
export type LookupWorker<Domain, Path extends WrkPaths<Domain>> = LookupPath<Domain, Path> extends infer MaybeWrkDef
  ? MaybeWrkDef extends WrkDef<infer Worker>
    ? Worker
    : never
  : never

// export type LookupWrkDef<Domain, Path extends string> = LookupPath<Domain, Path> extends infer MaybeWrkDef
export type LookupWrkDef<Domain, Path extends WrkPaths<Domain>> = LookupPath<Domain, Path> extends infer MaybeWrkDef
  ? MaybeWrkDef extends WrkDef<infer Worker>
    ? WrkDef<Worker>
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
  timeout: number
}
export const defaultCallConfig = (cfg?: Partial<CallConfig>): CallConfig => ({
  timeout: DEFAULT_WRK_TIMEOUT,
  ...cfg,
})

export type EnqueueConfig = {
  delayDeliverSecs?: number
}
export const defaultEnqueueConfig = (cfg?: Partial<EnqueueConfig>): EnqueueConfig => ({
  ...cfg,
})

export type WrkConfig = {
  rejectionAck: Acks
  parallelism: number
}
export const defaultWrkConfig = (cfg?: Partial<WrkConfig>): WrkConfig => ({
  rejectionAck: Acks.Reject,
  parallelism: 10,
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
export const wrkReplyError = ({ err, wrk }: { wrk: string; err: any }): WrkReplyError => {
  let errorDetails = ''
  if (err instanceof Error) {
    errorDetails = `Error<${err.name}>:${err.stack ?? ''}`
    console.log(errorDetails)
  }
  return {
    ___WRK_REPLY_ERROR: `${wrk}: ${err} ${errorDetails}`,
  }
}
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

export type GraphQLDomainWrk<Context, RootValue> = WrkDef<
  (_: GraphQLDomainWrkReq<Context, RootValue>) => Promise<GraphQLDomainWrkResp>
>
