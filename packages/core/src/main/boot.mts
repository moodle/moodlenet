import type { MainFolders } from '../types.mjs'
import { getSys } from './sys.mjs'

process.on('error', err => {
  console.error(err)
  err instanceof Error && console.error(err.stack)
  process.exit()
})
export type BootCfg = {
  mainFolders: MainFolders
  devMode: boolean
}
export async function boot(cfg: BootCfg) {
  const sys = await getSys({ mainFolders: cfg.mainFolders })
  const sysconfig = sys.readSysConfig()

  sysconfig.packages.reduce<Promise<void>>(async (prev, { pkgId }) => {
    await prev
    await sys.pkgMng.getMain({ pkgId })
    return
  }, Promise.resolve())
}
