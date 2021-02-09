// import { ExecutionResult } from 'graphql'
import { ExecutionResult } from 'graphql'
import * as D from '../types'
import { Flow } from '../types/path'

export type ApiBag = {
  flow: Flow
}
export type Api<Req, Res> = (req: Req) => Res

export type ApiLeaves<Domain> = D.Path.Leaves<Domain, Api<any, any>>

export type ApiReplyError = { ___API_REPLY_ERROR: string }
export const apiReplyError = (msg: any): ApiReplyError => ({
  ___API_REPLY_ERROR: String(msg),
})
export const isReplyError = (_: any): _ is ApiReplyError => !!_ && '___API_REPLY_ERROR' in _
export const getReplyError = (_: ApiReplyError) => _.___API_REPLY_ERROR

export const API_CALL_ERROR_TAG: unique symbol = Symbol('API_CALL_ERROR_TAG')
export type ApiCallError = { [API_CALL_ERROR_TAG]: any }
export const apiCallError = (err: any): ApiCallError => ({
  [API_CALL_ERROR_TAG]: err,
})
export const isCallError = (_: any): _ is ApiReplyError => !!_ && API_CALL_ERROR_TAG in _
export const getCallError = (_: ApiCallError) => _[API_CALL_ERROR_TAG]

export type ApiReply<Res> = Res // | ApiReplyError

export type ApiDef<Domain, Path extends string> = D.Path.TypeofPath<Domain, Path> extends infer MaybeApi
  ? MaybeApi extends Api<any, any>
    ? MaybeApi
    : never
  : never

export type ApiReq<Domain, Path extends string> = ApiDef<Domain, Path> extends Api<infer Req, any> ? Req : never

export type ApiRes<Domain, Path extends string> = ApiDef<Domain, Path> extends Api<any, infer Res> ? Res : never

type GraphQLDomainApiReq<Context, RootValue> = {
  context: Context
  root: RootValue
  query: string
  variables: Record<string, any> | undefined
}
type GraphQLDomainApiResp = {
  [K in keyof Required<ExecutionResult>]: ExecutionResult[K]
}

export type GraphQLDomainApi<Context, RootValue> = Api<[GraphQLDomainApiReq<Context, RootValue>], GraphQLDomainApiResp>
