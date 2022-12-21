import { PackageJson } from 'type-fest'

type Reboot = () => unknown
type Shutdown = () => unknown
type RootImport = (module: string) => Promise<unknown>
type PkgConfigs = unknown
type PkgListDepOrdered = [string, string | undefined][]
type Ignites = {
  rootImport: RootImport
  pkgJson: PackageJson
  pkgConfigs: PkgConfigs
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

export function getPkgConfigs() {
  return _ignites.pkgConfigs
}

export default async function ignite(ignites: Ignites) {
  console.log(ignites)
  _ignites = ignites

  await initAll()
  // await startAll()
}

async function initAll() {
  await Promise.all(
    Object.entries(_ignites.pkgJson.dependencies ?? {}).map(async pkgEntry => {
      await rootImportLog(pkgEntry, '')
      // await rootImportLog(pkgEntry, 'init')

      // should this should push on any kind of "connection"?
      _pkgListDepOrdered.push(pkgEntry)
    }),
  )
  console.log({ _pkgListDepOrdered })
}

// async function startAll() {
//   for (const pkgEntry of _pkgListDepOrdered) {
//     await rootImportLog(pkgEntry, 'start')
//   }
// }

export async function stopAll() {
  for (const pkgEntry of _pkgListDepOrdered.reverse()) {
    await rootImportLog(pkgEntry, 'stop')
  }
}

async function rootImportLog(
  [pkgName, pkgVersion = '']: [string, string | undefined],
  exp: string,
) {
  console.info(`-- BEGIN: [${exp}] ${pkgName}@${pkgVersion} --`)
  const pkgModName = exp ? `${pkgName}/${exp}` : pkgName
  await _ignites.rootImport(pkgModName)
  console.info(`---- END: [${exp}] ${pkgName}@${pkgVersion} ----`)
}
