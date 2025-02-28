import { any_ } from '@moodle/lib-types'


export type NOT_FOUND = typeof NOT_FOUND
export const NOT_FOUND = 'NOT_FOUND'

export type TEMP_FILE_NOT_FOUND = typeof TEMP_FILE_NOT_FOUND
export const TEMP_FILE_NOT_FOUND = 'TEMP_FILE_NOT_FOUND'

export type CONDITIONS_NOT_MET = typeof CONDITIONS_NOT_MET
export const CONDITIONS_NOT_MET = 'CONDITIONS_NOT_MET'

export type SUBMITTED = typeof SUBMITTED
export const SUBMITTED = 'SUBMITTED'

export type NEVER = typeof NEVER
export const NEVER = void 0 as never

export type NO_JOB_HERE = typeof NO_JOB_HERE
export const NO_JOB_HERE = void 0 as any_

export type NO_DATA = typeof NO_DATA
export const NO_DATA = NEVER
