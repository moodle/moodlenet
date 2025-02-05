import { integer } from './data'

export type iMax = { max: integer }
export type iMin = { min: integer }
export type iMinMax = iMin & iMax
// export type regex<opt extends boolean = true> = opt extends true ? { regex?: regex_parts } : { regex: regex_parts }
