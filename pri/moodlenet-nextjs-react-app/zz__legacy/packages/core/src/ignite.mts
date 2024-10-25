import { DepGraph } from 'dependency-graph'

import assert from 'assert'
import { execa } from 'execa'
import type { PackageJson } from 'type-fest'
import type { CoreConfigs } from './types.mjs'
export const MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES =
  process.env.MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES === 'true'
export const isDevEnv = process.env.NODE_ENV !== 'production'

type Reboot = () => unknown
type Shutdown = () => unknown
type RootImport = (module: string) => Promise<unknown>
type Configs = { pkgs: { [pkgName in string]: any } }
type Ignites = {
  rootDir: string
  rootImport: RootImport
  rootRequire: NodeRequire
  rootPkgJson: PackageJson
  rootPkgLockJson: { dependencies: Record<string, { requires: Record<string, any> }> }
  configs: Configs
  reboot: Reboot
  shutdown: Shutdown
  isDevEnv: boolean
}

export const pkgDepGraph = new DepGraph()
let _ignites: Ignites

export function reboot() {
  _ignites.reboot()
}

export function getIgnites() {
  return _ignites
}

export async function shutdown() {
  await stopAll()
  _ignites.shutdown()
}

export function getConfigs() {
  return _ignites.configs
}

export function getConfig(pkgName: string) {
  return getConfigs().pkgs[pkgName]
}

export function getCoreConfigs(): CoreConfigs {
  const coreConfigs = getConfig('@moodlenet/core')
  return {
    baseFsFolder: coreConfigs.baseFsFolder,
    npmRegistry: coreConfigs.npmRegistry,
    instanceDomain: coreConfigs.instanceDomain,
    mainLogger: coreConfigs.mainLogger,
  }
}

async function orderDeps() {
  const depgraph = JSON.parse(
    (
      await execa(
        'npm',
        [
          'ls',
          '--all',
          '--json',
          '--depth',
          '1',
          ...(MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES ? [] : ['--package-lock-only']),
        ],
        {
          cwd: _ignites.rootDir,
          stderr: 'ignore',
        },
      )
    ).stdout,
  )
  const pkgjson = _ignites.rootPkgJson
  assert(pkgjson.dependencies)
  const deps = Object.keys(pkgjson.dependencies)

  deps.forEach(pkgName => {
    pkgDepGraph.addNode(pkgName)
    const lockDepItem = depgraph.dependencies[pkgName]
    assert(lockDepItem)
    const lockdeps = Object.keys(lockDepItem.dependencies)
    const filteredLockdeps = lockdeps.filter(lockDep => !!deps.find(_ => _ === lockDep))
    filteredLockdeps.forEach(lockdep => {
      pkgDepGraph.hasNode(lockdep) || pkgDepGraph.addNode(lockdep)
      pkgDepGraph.addDependency(pkgName, lockdep)
    })
  })
}

export let PHASE: 'init' | 'starting' | 'running' | 'stopping'
export default async function ignite(ignites: Ignites) {
  _ignites = ignites
  process.once('SIGTERM', stopAllAndExit)
  process.once('SIGINT', stopAllAndExit)
  await orderDeps()
  await initAll()
  await startAll()
  PHASE = 'running'
}

async function initAll() {
  PHASE = 'init'
  console.info('\nInit all packages\n')
  const pkgList = pkgDepGraph.overallOrder()
  for (const pkgEntry of pkgList) {
    await rootImportLog(pkgEntry, 'init')
  }
  // console.log({ _pkgListDepOrdered: _pkgListDepOrdered.map(([pkgName]) => pkgName) })
  // await Promise.all(
  //   Object.entries(_ignites.rootPkgJson.dependencies ?? {}).map(async pkgEntry => {
  //     await rootImportLog(pkgEntry, 'init')
  //     _pkgListDepOrdered.push(pkgEntry)
  //   }),
  // )
  // console.log({ _pkgListDepOrdered })
}

async function startAll() {
  PHASE = 'starting'
  console.info('\nStart all packages\n')
  for (const pkgEntry of pkgDepGraph.overallOrder()) {
    await rootImportLog(pkgEntry, 'start')
  }
}

export async function stopAll() {
  PHASE = 'stopping'
  console.info('\nStop all packages\n')
  for (const pkgEntry of pkgDepGraph.overallOrder().reverse()) {
    await rootImportLog(pkgEntry, 'stop').catch(() => void 0)
  }
}
export async function stopAllAndExit() {
  await stopAll()
  process.exit(0)
}

async function rootImportLog(pkgName: string, exp: string, ignoreNotFoundError = true) {
  const fullActionName = `[${exp}] ${pkgName}`
  const pkgExportName = exp ? `${pkgName}/${exp}` : pkgName

  console.info(`${fullActionName}`)

  const endMessageWith = await _ignites.rootImport(pkgExportName).then(
    () => 'ok',
    err => {
      const errMsg = `${fullActionName} : Import Error`

      const isNotFoundErr = ['ERR_PACKAGE_PATH_NOT_EXPORTED'].includes(err.code)
      if (!(ignoreNotFoundError && isNotFoundErr)) {
        const msgWCode = `
${errMsg}
CODE: ${err.code}
${err.stack}
`
        throw new Error(msgWCode, { cause: err })
      }

      return `noop`
    },
  )
  console.info(`${fullActionName} --- ${endMessageWith}`)
}
