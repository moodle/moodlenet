import { factories, transport_layer } from './types'

export async function getTransport<layer extends transport_layer>(
  layer: layer,
  cfg: string,
): Promise<Awaited<ReturnType<factories[layer]>>> {
  const [impl_type, ..._rest] = cfg.split('::')
  const fact_cfg = _rest.join('::')
  const factories: factories = (await import(`./impl/${impl_type}`)).default
  return factories[layer](fact_cfg) as any
}
