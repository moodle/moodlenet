export type RpcRequestBody = any // FIXME: well define with constraints (serializable + `Files` support)

export type RpcResponseBody = any // FIXME: well define with constraints (serializable)
export type RpcResponse = Promise<RpcResponseBody>

export type RpcArgs = [
  body: RpcRequestBody,
  //params: {
  //  route: Record<string, string>
  //  query: Record<string, string | string[]>
  //}
  //header: Record<string, string>
]
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
  maxFileSize?: number | undefined
}
export type RpcDefItem = { fn: RpcFn; guard: RpcFnGuard; bodyWithFiles?: RpcBodyWithFilesConfig }
export type RpcDefs = Record<string, RpcDefItem>

export type RpcFile = { type: string; name: string; size: number }

// https://dev.to/bytimo/useful-types-extract-route-params-with-typescript-5fhn
// kudos https://dev.to/bytimo
// type ExtractParam<Path, NextPart> = Path extends `:${infer Param}`
//   ? Record<Param, string> & NextPart
//   : NextPart

// export type ExctractParams<Path> = Path extends `${infer Segment}/${infer Rest}`
//   ? ExtractParam<Segment, ExctractParams<Rest>>
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
