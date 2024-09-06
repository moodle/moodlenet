import { mod_id } from '../types'

export function str_ns_mod_v(mod_id: mod_id, sep = '/') {
  return `${mod_id.ns}${sep}${mod_id.mod}${sep}${mod_id.version}`
}
export function str_ns_mod(mod_id: Pick<mod_id, 'ns' | 'mod'>, sep = '/') {
  return `${mod_id.ns}${sep}${mod_id.mod}`
}
