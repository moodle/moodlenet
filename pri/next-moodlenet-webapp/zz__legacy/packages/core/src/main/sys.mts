import { reboot } from '../ignite.mjs'

export function rebootSystem(to = 500) {
  setTimeout(() => reboot(), to)
}
