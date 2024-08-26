import { __removeme_b } from '@moodle/domain'
import { factories, trans_kind } from './types'

export default getApiTransport
async function getApiTransport(kind: trans_kind, cfg: string) {
  const [impl_type, ..._rest] = cfg.split('::')
  const fact_cfg = _rest.join('::')
  const factories: factories = (await import(`./lib/${impl_type}`)).default
  return factories[kind](fact_cfg)
}

export function __removeme_a(a: string) {
  console.log({ a })
  __removeme_b('trnsp')
}
