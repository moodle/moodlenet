import { newUuid } from '../helpers/misc'
import { Flow } from './types/path'

export const newFlow = (pflow?: Partial<Flow>): Flow => ({
  _key: pflow?._key || newUuid(),
  _route: pflow?._route || newUuid(),
})
