import { BaseOperators, BLVal } from '@moodlenet/common/lib/lib/bl/common'

export const and: BaseOperators['and'] = (...bvals) => {
  return `( ${bvals.join(' && ')} )` as BLVal<boolean>
}

export const or: BaseOperators['or'] = (...bvals) => {
  return `( ${bvals.join(' || ')} )` as BLVal<boolean>
}

export const cmp: BaseOperators['cmp'] = (a, cmp, b) => {
  return `( ${a} ${cmp} ${b} )` as BLVal<boolean>
}

export const cond: BaseOperators['cond'] = (condition, right, left) => {
  return `( ${condition} ? ${right} : ${left} )` as typeof right | typeof left
}

export const not: BaseOperators['not'] = _ => {
  return `!( ${_} )` as BLVal<boolean>
}

export const baseOperators: BaseOperators = {
  and,
  cond,
  cmp,
  not,
  or,
}
