import { integer, regex_parts } from './data'

export type iMax = { max: integer }
export type iMin = { min: integer }
export type iMinMax = iMin & iMax
export type regex = { regex: regex_parts }
