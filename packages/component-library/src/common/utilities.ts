import { defaultsDeep } from 'lodash'
import { PartialDeep } from 'type-fest'

export const overrideDeep = <T>(base: T, overrides: PartialDeep<T> | undefined): T => {
  return defaultsDeep(overrides, base)
}
