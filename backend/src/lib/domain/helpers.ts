import { v1 } from 'uuid'
import { Flow } from './types/path'

export const nodeId = v1().split('-').slice(-1).pop()!

export const newFlow = (pflow?: Partial<Flow>): Flow => ({
  _key: pflow?._key || v1(),
  _route: pflow?._route || nodeId,
})
