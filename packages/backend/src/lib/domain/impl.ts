import { LookupSub, SubLeaves } from './sub'
import { LookupWrk, WrkLeaves } from './wrk'

export type DomainImpl<D> = {
  [SubPath in SubLeaves<D>]: LookupSub<D, SubPath>
} &
  {
    [WrkPath in WrkLeaves<D>]: LookupWrk<D, WrkPath>
  }

export type PickSubDomain<D, Sub extends keyof D> = Pick<D, Sub>
export type SubDomain<D, Sub extends keyof D, SD> = { [sub in Sub]: SD & D[sub] }
