import type { BootCfg } from '../types.mjs'
import { getSys } from './sys.mjs'

process.on('error', err => {
  console.error(err)
  err instanceof Error && console.error(err.stack)
  process.exit()
})

export async function boot(cfg: BootCfg) {
  const sys = await getSys({ mainFolders: cfg.mainFolders })
  const sysconfig = sys.readSysConfig()

  for (const sysInstalledPkg of sysconfig.packages) {
    const { pkgId } = sysInstalledPkg
    console.log(`-- connecting  ${pkgId.name}@${pkgId.version} ... --`)
    await sys.pkgMng.getMain({ pkgId })
    console.log(`-- CONNECTED ${pkgId.name}@${pkgId.version}  --\n`)
  }
  console.log('\n------- all packages connected -------', '\n')
}
