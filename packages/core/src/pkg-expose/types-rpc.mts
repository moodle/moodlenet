type RpcRequestBody = any // FIXME: well define with constraints (serializable + `Files` support)

type RpcResponseBody = any // FIXME: well define with constraints (serializable)
export type RpcResponse = Promise<RpcResponseBody>

type RpcArgs = [
  body: RpcRequestBody,
  // params: Record<string, string>
  // query: Record<string, string | string[]>
  // headers: Record<string, string>
]
export type RpcFn = (...rpcArgs: RpcArgs) => RpcResponse
export type RpcFnGuard = (...rpcArgs: RpcArgs) => unknown

export type RpcFnOf<RpcItem extends RpcDefItem> = RpcItem['fn']

export type RpcDefItem = { fn: RpcFn; guard: RpcFnGuard }
export type RpcDefs = Record<string, RpcDefItem>

// //

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
