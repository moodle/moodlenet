import { LookupSubDef, LookupSubInit, SubPaths } from './sub'
import { LookupWorkerInit, LookupWrkDef, WrkPaths } from './wrk'

export type Teardown = () => void | Promise<void>

export type DomainSetup<D> = {
  [Path in SubPaths<D> | WrkPaths<D>]: Path extends WrkPaths<D>
    ? LookupWrkDef<D, Path>
    : Path extends SubPaths<D>
    ? LookupSubDef<D, Path>
    : never
}

export type DomainStart<D> = Partial<
  {
    [Path in SubPaths<D> | WrkPaths<D>]: Path extends WrkPaths<D>
      ? DomainStartWrk<D, Path>
      : Path extends SubPaths<D>
      ? DomainStartSub<D, Path>
      : never
  }
>
export type DomainStartSub<D, SubPath extends SubPaths<D>> = { init: LookupSubInit<D, SubPath> }
export type DomainStartWrk<D, WrkPath extends WrkPaths<D>> = { init: LookupWorkerInit<D, WrkPath> }

export type PickSubDomain<D, Sub extends keyof D> = Pick<D, Sub>
export type SubDomain<D, Sub extends keyof D, SD> = { [sub in Sub]: SD & D[sub] }
