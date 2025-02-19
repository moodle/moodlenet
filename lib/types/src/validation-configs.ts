import { int } from './data'

export type iMax = { max: int }
export type iMin = { min: int }
export type iMinMax = iMin & iMax
// export type regex<opt extends boolean = true> = opt extends true ? { regex?: regex_parts } : { regex: regex_parts }
