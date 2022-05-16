import { ExtDef, ExtTopo, Port, TopoNode, TopoPaths, TypeofPath } from '../../types'

// export declare const RPC_TOPO_SYM: symbol
// export type RPC_TOPO_SYM = typeof RPC_TOPO_SYM

export type RpcFn = (...rpcTopoReqArgs: any) => Promise<any>
//export type RpcTopoPaths<Topo extends Topology> = TopoPaths<Topo, RPC_TOPO_SYM>
export type ExtRpcTopoPaths<Def extends ExtDef> = TopoPaths<Def, RpcTopo> & TopoPaths<Def>
export type ExtPathRpcFn<Def extends ExtDef, Path extends ExtRpcTopoPaths<Def>> = TypeofPath<
  ExtTopo<Def>,
  Path
> extends RpcTopo<infer Afn>
  ? Afn
  : never

export type RpcFnOf<RpcT> = RpcT extends RpcTopo<infer Afn> ? Afn : never

export type RpcTopoRequestPort<Afn extends RpcFn> = Port<'in', { rpcTopoReqArgs: Parameters<Afn> }>
export type RpcTopoResponsePort<Afn extends RpcFn> = Port<
  'out',
  { rpcTopoRespValue: Awaited<ReturnType<Afn>> } | { rpcTopoRespError: { cause: unknown } }
>

export type RpcTopo<Afn extends RpcFn = RpcFn> = TopoNode<{
  rpcTopoRequest: RpcTopoRequestPort<Afn>
  rpcTopoResponse: RpcTopoResponsePort<Afn>
}>

export type RpcTopoFnOf<RpcT> = RpcT extends RpcTopo ? RpcFnOf<RpcT> : never
