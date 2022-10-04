import { ExtDef, ExtId, RawShell } from '../types'
import { joinPointer } from './pointer'
import { fetch, pubAll, SubcriptionPaths } from './sub'

export * as rx from 'rxjs'
export * from './message'
export * from './pointer'
export * from './sub'

export type AccessPkg<DestDef extends ExtDef>=ReturnType<typeof access<DestDef>>
export function access<DestExtDef extends ExtDef>(targetExtId: ExtId<DestExtDef>, shell: RawShell<any>) {
  const _fetch = <Path extends SubcriptionPaths<DestExtDef>>(path: Path) => {
    const pointer = joinPointer(targetExtId, path)
    return fetch<DestExtDef>(shell)<Path>(pointer)
  }
  return {
    _target: targetExtId,
    fetch: _fetch,
  }
}

export type Provide<Def extends ExtDef>= ReturnType<typeof provide<Def>>
export function provide<Def extends ExtDef>(targetExtId: ExtId<Def>, shell: RawShell<any>) {
  const services = pubAll<Def>(targetExtId, shell)
  return {
    _target: targetExtId,
    services,
  }
}


