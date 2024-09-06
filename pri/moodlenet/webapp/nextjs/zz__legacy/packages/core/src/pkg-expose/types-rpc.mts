export type RpcRequestBody = any // FIXME: well define with constraints (serializable + `Files` support)

export type RpcQueryParams = any //Record<string, string> // FIXME: well define with REcord<strng,strng>
export type RpcRouteParams = any // FIXME: well define with REcord<strng,strng>
export type RpcResponseBody = any // FIXME: well define with constraints (serializable)
export type RpcResponse = Promise<RpcResponseBody>

export type RpcArgs = [body: RpcRequestBody, routeParams: RpcRouteParams, query: RpcQueryParams]
export type RpcFn = (...rpcArgs: RpcArgs) => RpcResponse
export type RpcFnGuard = (...rpcArgs: RpcArgs) => unknown

export type RpcFnOf<RpcItem extends RpcDefItem> = RpcItem['fn']

export type RpcBodyFieldConfig = {
  maxCount?: number
}
export type RpcBodyWithFilesConfig = {
  fields: {
    [fieldName: string]: number | RpcBodyFieldConfig
  }
  maxSize: number
}
export type RpcDefItem<Fn extends RpcFn = RpcFn> = {
  fn: Fn
  guard: RpcFnGuard
  bodyWithFiles?: RpcBodyWithFilesConfig
}
// export type RpcDefs = Record<string, RpcDefItem>

export type RpcFile = { type: string; name: string; size: number }

// https://dev.to/bytimo/useful-types-extract-route-params-with-typescript-5fhn
// kudos https://dev.to/bytimo
// type ExtractParam<Segment, RestPathExctractParams> = Segment extends `:${infer ParamName}`
//   ? Record<ParamName, string> & RestPathExctractParams
//   : RestPathExctractParams

// export type ExctractParams<
//   Path,
//   Sep extends string = '/',
// > = Path extends `${infer Segment}${Sep}/${infer RestPath}`
//   ? ExtractParam<Segment, ExctractParams<RestPath, Sep>>
//   : ExtractParam<Path, Record<never, never>>

// // TEST

// const ad = x(
//   {
//     abc: {
//       guard: () => void 0,
//       fn: async function <T>(body: { a: T }) {
//         return { s: body }
//       },
//     },
//     def: {
//       guard: () => void 0,
//       fn: async function (body: { d: number }) {
//         return { n: body }
//       },
//     },
//   } /* as const */,
// )

// const ra = await ad.abc({ a: '1' })
// ra.s.a.at
// ra.s.a.toExponential

// const rd = await ad.def({ d: 1 })
// rd.n.d.toExponential
// rd.n.d.at

// declare function x<D extends RpcDefs>(d: D): { [RpcName in keyof D]: RpcFnOf<D[RpcName]> }
