import type { TypeofPath, TypePaths } from './crawl-path'
import type { ExtDef, ExtId, ExtTopo } from './ext'

/*
 * Port Topology
 */

export type TopoPath = string

export type PortBinding = 'out' | 'in'
export type Port<Bind extends PortBinding = PortBinding, Data = any> = {
  _data: Data
  _bound: Bind
}

export type Topo = {
  [topoElementName in string]: Port | Topo
}

export type PortPathBinding<Def extends ExtDef, Path extends PortPaths<ExtDef>> = TypeofPath<
  ExtTopo<Def>,
  Path
> extends Port<infer Bind>
  ? Bind
  : PortBinding

export type PortPaths<Def extends ExtDef, Bound extends PortBinding = PortBinding> = TypePaths<
  ExtTopo<Def>,
  Port<Bound>,
  Port
>
export type TopoNode<T extends Topo> = T

export type TopoPaths<Def extends ExtDef, TargetTopo extends Topo = Topo> = TypePaths<ExtTopo<Def>, TargetTopo, Port>

export type AllPaths<Def extends ExtDef> = TopoPaths<Def> | PortPaths<Def>

// export type SemanticPointer<
//   Def extends ExtDef = ExtDef,
//   Path extends AllPaths<Def> = AllPaths<Def>,
// > = `${Def['name']}::${Path}` //`;)

export type Pointer<Def extends ExtDef = ExtDef, Path extends AllPaths<Def> = AllPaths<Def>> = `${ExtId<Def>}::${Path}` // & {  def?: Def; path?: Path } //`;)

export type Version = string

export type PortData<P extends Port> = P extends Port<infer PL> ? PL : unknown

export type PortPathData<
  Def extends ExtDef,
  Path extends PortPaths<ExtDef>,
  Bind extends PortBinding = PortBinding,
> = TypeofPath<ExtTopo<Def>, Path> extends Port<Bind, infer Data> ? Data : unknown

export type PointerData<P, Bind extends PortBinding = PortBinding> = P extends Pointer<infer Def, infer Path>
  ? PortPathData<Def, Path, Bind>
  : unknown
