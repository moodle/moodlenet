import { readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import { resolve } from 'path'
import { BareMetalHandle } from './types'

reboot().then(console.log, console.error)

async function reboot() {
  const cwd = process.env.BARE_METAL_CWD ?? process.cwd()
  const kernel_mod_file = resolve(cwd, 'KERNEL_MOD')
  const kernel_mod_path = get_kernel_mod()

  console.log(`BARE_METAL :`, { cwd, kernel_mod_path })
  const modRequire = createRequire(resolve(cwd, 'node_modules'))

  const handle: BareMetalHandle = {
    set_kernel_mod,
    get_kernel_mod,
    reboot,
    modRequire,
    cwd,
  }

  return modRequire(kernel_mod_path).boot(handle)

  function set_kernel_mod(kernelMod: string) {
    return writeFileSync(kernel_mod_file, kernelMod, 'utf-8')
  }
  function get_kernel_mod() {
    return readFileSync(kernel_mod_file, 'utf-8')
  }
}
