import { sys } from '../cfg.mjs'

process.on('error', err => {
  console.error(err)
  err instanceof Error && console.error(err.stack)
  process.exit()
})

export async function boot() {
  const _sys = await sys()
  const sysconfig = _sys.readSysConfig()

  for (const sysInstalledPkg of sysconfig.packages) {
    const { pkgId } = sysInstalledPkg
    console.log(`-- connecting  ${pkgId.name}@${pkgId.version} ... --`)
    await _sys.pkgMng.getMain({ pkgId })
    console.log(`-- CONNECTED ${pkgId.name}@${pkgId.version}  --\n`)
  }
  console.log('\n------- all packages connected -------', '\n')
}
