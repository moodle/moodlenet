import type { PackageJson } from 'type-fest'

type Reboot = () => unknown
type Shutdown = () => unknown
type RootImport = (module: string) => Promise<unknown>
type Configs = { pkgs: { [pkgName in string]: any } }
type PkgListDepOrdered = [string, string | undefined][]
type Ignites = {
  rootImport: RootImport
  rootPkgJson: PackageJson
  configs: Configs
  reboot: Reboot
  shutdown: Shutdown
}

let _ignites: Ignites = null as never
const _pkgListDepOrdered: PkgListDepOrdered = []

export async function reboot() {
  await stopAll()
  _ignites.reboot()
}

export async function shutdown() {
  await stopAll()
  _ignites.shutdown()
}

export function getConfigs() {
  return _ignites.configs
}

export function getPkgConfig(pkgName: string) {
  return getConfigs().pkgs[pkgName]
}

export default async function ignite(ignites: Ignites) {
  _ignites = ignites
  process.once('SIGTERM', stopAllAndExit)
  process.once('SIGINT', stopAllAndExit)
  await initAll()
  await startAll()
}

async function initAll() {
  await Promise.all(
    Object.entries(_ignites.rootPkgJson.dependencies ?? {}).map(async pkgEntry => {
      await rootImportLog(pkgEntry, 'init')

      // should this be pushed on any kind of "connection"?
      _pkgListDepOrdered.push(pkgEntry)
    }),
  )
  // console.log({ _pkgListDepOrdered })
}

async function startAll() {
  for (const pkgEntry of _pkgListDepOrdered) {
    await rootImportLog(pkgEntry, 'start')
  }
}

export async function stopAll() {
  for (const pkgEntry of _pkgListDepOrdered.reverse()) {
    await rootImportLog(pkgEntry, 'stop')
  }
}
export async function stopAllAndExit() {
  await stopAll()
  process.exit()
}

async function rootImportLog(
  [pkgName, pkgVersion = '']: [string, string | undefined],
  exp: string,
  ignoreNotFoundError = true,
) {
  console.info(`-- BEGIN: [${exp}] ${pkgName}@${pkgVersion} --`)
  const pkgExportName = exp ? `${pkgName}/${exp}` : pkgName
  await _ignites.rootImport(pkgExportName).catch(err => {
    if (!('code' in err)) {
      throw err
    }
    const msg = `        ROOT IMPORT: ${pkgExportName} ${err?.code ?? 'not found'}`
    if (
      ignoreNotFoundError &&
      ['ERR_PACKAGE_PATH_NOT_EXPORTED', 'ERR_MODULE_NOT_FOUND'].includes(err?.code)
    ) {
      console.info(`${msg} - ignoring`)
      return
    }
    throw new Error(msg, { cause: err })
  })
  console.info(`---- END: [${exp}] ${pkgName}@${pkgVersion} ----`)
}
