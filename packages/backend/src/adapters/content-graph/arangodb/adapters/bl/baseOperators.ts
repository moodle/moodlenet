import { BaseOperators, _T } from 'my-moodlenet-common/lib/content-graph/bl/graph-lang'
import { aqlstr, getOneResult } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { getBaseOperatorsAdapter } from '../../../../../ports/content-graph/common'
import { aqBV } from '../../aql/helpers'
import { ContentGraphDB } from '../../types'
import { _ } from './_'

export const getBaseOperators =
  (db: ContentGraphDB): SockOf<typeof getBaseOperatorsAdapter> =>
  async () =>
    baseOperators(db)

export const baseOperators = (db: ContentGraphDB): BaseOperators => ({
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
  getBV: bv => {
    const q = aqBV(bv)
    // console.log(`getBV:\n${q}`)
    return getOneResult(q, db) as any
  },
})
