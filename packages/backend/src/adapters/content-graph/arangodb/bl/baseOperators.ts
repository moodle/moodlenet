import { BaseOperators, BV, _T } from '@moodlenet/common/lib/content-graph/bl/graph-lang'
import { aqlstr } from '../../../../lib/helpers/arango/query'

export const baseOperators: BaseOperators = {
  and: (...bvals) => {
    return _<boolean>(`${bvals.join(' && ')}`)
  },
  or: (...bvals) => {
    return _<boolean>(`${bvals.join(' || ')}`)
  },
  cmp: (a, cmp, b) => {
    return _<boolean>(`${a} ${cmp} ${b}`)
  },
  cond: (condition, right, left) => {
    return _<_T<typeof right | typeof left>>(`${condition} ? ${right} : ${left}`)
  },
  not: val => {
    return _<boolean>(`! ${val}`)
  },
  _: val => _(`${aqlstr(val)}`),
}

export const _ = <T>(val: string) => `( ${val} )` as BV<T>
