import { satisfies } from 'semver'
import type { AllPaths, ExtDef, ExtId, Pointer, Version } from '../../types'

export function baseSplitPointer<Ext extends ExtDef, Path extends AllPaths<Ext>>(pointer: Pointer<Ext, Path>) {
  const [extId, path] = pointer.split('::') as [ExtId<Ext>, Path]
  return { extId, path }
}
export function splitExtId<Ext extends ExtDef>(extId: ExtId<Ext>) {
  const [extName, version] = extId.split('@') as [Ext['name'], Ext['version']]
  return { extName, version }
}

export function splitPointer<Ext extends ExtDef, Path extends AllPaths<Ext>>(pointer: Pointer<Ext, Path>) {
  const baspl = baseSplitPointer(pointer)
  const idspl = splitExtId(baspl.extId)
  return { ...baspl, ...idspl }
}

export function joinPointer<Def extends ExtDef, Path extends AllPaths<Def>>(
  extId: ExtId<Def>,
  path: Path,
): Pointer<Def, Path> {
  return `${extId}::${path}`
}

// export function joinSemanticPointer<Ext extends ExtDef, Path extends AllPaths<Ext>>(
//   a: Pointer<Ext, Path>,
// ): SemanticPointer<Ext, Path> {
//   const aSplit = splitPointer(a)
//   return `${aSplit.extName}::${aSplit.path}`
// }

export function isVerBWC(target: Version, requested: Version) {
  return satisfies(target, `^${requested}`)
}
export function isExtIdBWC(target: ExtId, requested: ExtId) {
  const targetSplit = splitExtId(target)
  const requestedSplit = splitExtId(requested)
  return (
    targetSplit.extName === requestedSplit.extName && satisfies(requestedSplit.version, `^${requestedSplit.version}`)
  )
}

export function isBWCSemanticallySamePointers(target: Pointer, requested: Pointer) {
  const pointerSplits = areSemanticallySamePointers(target, requested)
  if (!pointerSplits) {
    return false
  }
  const [reqSplit, trgSplit] = pointerSplits
  return isVerBWC(trgSplit.version, reqSplit.version)
}

export function areSemanticallySamePointers(a: Pointer, b: Pointer) {
  const aSplit = splitPointer(a)
  const bSplit = splitPointer(b)
  return areSameExtName(aSplit.extId, bSplit.extId) && aSplit.path === bSplit.path && ([aSplit, bSplit] as const)
}

export function areSameExtName(a: ExtId, b: ExtId) {
  const aSplit = splitExtId(a)
  const bSplit = splitExtId(b)
  return aSplit.extName === bSplit.extName
}

//
//
//
//
//
//
//
//
//
//
//
//
// type D = ExtensionDef<
//   'xxxx',
//   '1.4.3',
//   {
//     a: {
//       c: Port<number>
//       d: Port<string>
//       q: {
//         w: Port<number>
//         y: Port<string>
//       }
//     }
//     e: Port<boolean>
//   }
// >

// type x = ExtTopoPaths<D> extends ExtPortPaths<D> ? 1 : 0
// type y = ExtPortPaths<D> extends ExtTopoPaths<D> ? 1 : 0
// // type x =TOPO_NODE_SYM  extends TOPO_BASE_SYM&TOPO_NODE_SYM ? 1 :0

// type z = PortPathPayload<D, 'e'>
// const pooooooooooooooo: ExtPortPaths<D> = 'a.q.y'
// const tooooo: ExtTopoPaths<D> = ''
// const ccc: ExtTopoNodePaths<D> = ''

// const d: Pointer<D> = 'xxxx@1.4.3::a.q'
