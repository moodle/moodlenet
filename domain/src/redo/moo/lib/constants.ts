export const NOT_FOUND = 'NOT_FOUND'
export const CONDITIONS_NOT_MET = 'CONDITIONS_NOT_MET'
export const SUBMITTED = 'SUBMITTED'
export const NO_JOB_HERE = void 0 as never

const OPS = Symbol('TypeModel operations impl symbol')
export type OPS = typeof OPS
const MODEL_TRAITS = Symbol('TypeModel Traits symbol')
export type MODEL_TRAITS = typeof MODEL_TRAITS
