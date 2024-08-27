// import { __removeme_b } from '@moodle/core/domain'
import { factories, trans_kind } from './types'

export default getTransport
async function getTransport<k extends trans_kind>(
  kind: k,
  cfg: string,
): Promise<Awaited<ReturnType<factories[k]>>> {
  const [impl_type, ..._rest] = cfg.split('::')
  const fact_cfg = _rest.join('::')
  const factories: factories = (await import(`./impl/${impl_type}`)).default
  return factories[kind](fact_cfg) as any
}

// export function __removeme_a(a: string) {
//   console.log({ a })
//   __removeme_b('trnsp')
// }
