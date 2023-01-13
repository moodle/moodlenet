import type { PackageJson } from 'type-fest'

type Reboot = () => unknown
type Shutdown = () => unknown
type RootImport = (module: string) => Promise<unknown>
type Configs = { pkgs: { [pkgName in string]: any } }
type PkgListDepOrdered = [string, string | undefined][]
type Ignites = {
  rootDir: string
  rootImport: RootImport
  rootRequire: NodeRequire
  rootPkgJson: PackageJson
  configs: Configs
  reboot: Reboot
  shutdown: Shutdown
}

let _ignites: Ignites

const _pkgListDepOrdered: PkgListDepOrdered = []

export async function reboot() {
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
  console.info('\nInit all packages\n')
  await Promise.all(
    Object.entries(_ignites.rootPkgJson.dependencies ?? {}).map(async pkgEntry => {
      await rootImportLog(pkgEntry, 'init')
      _pkgListDepOrdered.push(pkgEntry)
    }),
  )
  // console.log({ _pkgListDepOrdered })
}

async function startAll() {
  console.info('\nStart all packages\n')
  for (const pkgEntry of _pkgListDepOrdered) {
    await rootImportLog(pkgEntry, 'start')
  }
}

export async function stopAll() {
  console.info('\nStop all packages\n')
  for (const pkgEntry of _pkgListDepOrdered.reverse()) {
    await rootImportLog(pkgEntry, 'stop').catch(() => void 0)
  }
}
export async function stopAllAndExit() {
  await stopAll()
  process.exit(0)
}

async function rootImportLog(
  [pkgName, pkgVersion = '']: [string, string | undefined],
  exp: string,
  ignoreNotFoundError = true,
) {
  // const fullPkgName = `${pkgName}@${pkgVersion}`
  // const fullActionName = `[${exp}] ${fullPkgName}`
  const fullActionName = `[${exp}] ${pkgName}`
  const pkgExportName = exp ? `${pkgName}/${exp}` : pkgName

  console.info(`${fullActionName} --- BEGIN`)

  const endMessageWith = await _ignites.rootImport(pkgExportName).then(
    () => '',
    err => {
      const errMsg = `${fullActionName}@${pkgVersion} : Import Error`

      const isNotFoundErr = ['ERR_PACKAGE_PATH_NOT_EXPORTED', 'ERR_MODULE_NOT_FOUND'].includes(
        err.code,
      )

      if (!(ignoreNotFoundError && isNotFoundErr)) {
        const msgWCode = `
${errMsg}
CODE: ${err.code}
${err.stack}
`
        throw new Error(msgWCode, { cause: err })
      }

      return `"${exp}" export not available for this package, ignoring`
    },
  )
  console.info(`${fullActionName} --- DONE${endMessageWith ? ` [${endMessageWith}]` : ``}`)
}
