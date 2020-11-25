import * as D from '../types'

export type Api<Req extends object, Res extends object> = { req: Req; res: Res }

export type ApiLeaves<Domain> = D.Path.Leaves<Domain, Api<any, any>>

export type ReplyError = { ___ERROR: { msg: string } }
export type Reply<Res extends object> = ReplyError | (Res & { ___ERROR: null })

export type ApiDef<Domain, Path extends string> = D.Path.TypeofPath<
  Domain,
  Path
> extends infer MaybeApi
  ? MaybeApi extends Api<any, any>
    ? MaybeApi
    : never
  : never

export type ApiReq<Domain, Path extends string> = ApiDef<Domain, Path> extends Api<infer Req, any>
  ? Req
  : never
export type ApiRes<Domain, Path extends string> = ApiDef<Domain, Path> extends Api<any, infer Res>
  ? Res
  : never
