import { i_nat, i_pos } from './data'

export type i_natMax = { max: i_nat }
export type i_natMin = { min: i_nat }
export type i_natMinMax = i_natMin & i_natMax

export type i_posMin = { min: i_pos }
export type i_posMax = { max: i_pos }
export type i_posMinMax = i_posMin & i_posMax

export type opt_required = { required: boolean }
// export type regex<opt extends boolean = true> = opt extends true ? { regex?: regex_parts } : { regex: regex_parts }
