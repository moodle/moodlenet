import { __removeme_c } from '@moodle/t-utils'
export * from './auth'
export * from './domain'
export * from './types'

__removeme_c('dom')
export function __removeme_b(b: string) {
  __removeme_c('dom ' + b)
  console.log({ b })
}
