import { getSys } from './main/sys.mjs'
import { BootCfg } from './types.mjs'

export const cfgResolver: {
  resolve(cfg: BootCfg): void
  reject(err: any): void
} = {
  resolve() {},
  reject() {},
}

const cfg: Promise<BootCfg> = new Promise((resolve, reject) => {
  cfgResolver.resolve = resolve
  cfgResolver.reject = reject
})

export async function sys() {
  return __sys ?? (__sys = await getSys(await cfg))
}
let __sys: any = null
