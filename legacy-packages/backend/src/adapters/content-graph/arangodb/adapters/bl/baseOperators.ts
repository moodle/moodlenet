import { aqlstr, getOneResult } from '../../../../../lib/helpers/arango/query'
import { SockOf } from '../../../../../lib/plug'
import { BaseOperators, baseOperators, BV, _T } from '../../../../../ports/content-graph/graph-lang/base'
import { aqBV } from '../../aql/helpers'
import { ContentGraphDB } from '../../types'
export const _aqlBv = <T>(val: string) => `( ${val} )` as BV<T>

export const arangoBaseOperators = (db: ContentGraphDB): SockOf<typeof baseOperators> => {
  const BASE_OPERATORS = getBaseOperators(db)
  return async () => BASE_OPERATORS
}

export const ARANGO_BASE_OPERATORS: Omit<BaseOperators, 'getBV'> = {
  and: (...bvals) => _aqlBv<boolean>(`${bvals.join(' && ')}`),
  or: (...bvals) => _aqlBv<boolean>(`${bvals.join(' || ')}`),
  cmp: (a, cmp, b) => _aqlBv<boolean>(`${a} ${cmp} ${b}`),
  cond: (condition, right, left) => _aqlBv<_T<typeof right | typeof left>>(`${condition} ? ${right} : ${left}`),
  not: bvVal => _aqlBv<boolean>(`! ${bvVal}`),
  bv: val => _aqlBv(`${aqlstr(val)}`),
}

export const getBaseOperators = (db: ContentGraphDB): BaseOperators => ({
  ...ARANGO_BASE_OPERATORS,
  getBV: bv => getOneResult(aqBV(bv), db),
})
