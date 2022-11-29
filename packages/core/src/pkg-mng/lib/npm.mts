import { run } from 'npm-check-updates'
import { patchWdPackageJsonDeps, WORKING_DIR } from '../../main/env.mjs'
import { PkgIdentifier } from '../../types.mjs'
import execa from 'execa'
import { InstallPkgReq } from '../types.mjs'
import { overrideLocalMNLock } from '../../main/MNLock.mjs'
import { rebootSystem } from '../../main/sys.mjs'

export async function uninstall(pkgIds: PkgIdentifier[]) {
  // TODO: any check on pkgIds ? (active / version)
  const uninstallPkgsArgs = pkgIds.map(({ name }) => name)
  await execa('npm', ['uninstall', ...uninstallPkgsArgs], {
    cwd: WORKING_DIR,
    timeout: 600000,
  })
}

export async function install(installPkgReqs: InstallPkgReq[]) {
  const installPkgsArgs = await Promise.all(
    installPkgReqs.map(async instReq => {
      if (instReq.type === 'pack-folder') {
        // const exeResultStr = (
        //   await execa('npm', ['pack', '--json'], {
        //     cwd: instReq.fromFolder,
        //     timeout: 600000,
        //   })
        // ).stdout
        // const exeResult = JSON.parse(exeResultStr)
        // const packFileName = exeResult[0].filename as string
        // return resolve(instReq.fromFolder, packFileName)
        return `file:${instReq.fromFolder}`
      } else if (instReq.type === 'npm') {
        return `${instReq.pkgId.name}@${instReq.pkgId.version}`
      }
      throw new Error(`unexpected installPkgReq type ${(instReq as any).type}`)
    }),
  )
  await execa('npm', ['install', '--registry', NPM_REGISTRY, ...installPkgsArgs], {
    cwd: WORKING_DIR,
    timeout: 600000,
  })
}

export async function checkUpdates(): Promise<{ updatePkgs: Record<string, string> }> {
  const updatePkgs = ((await run({
    registry: NPM_REGISTRY,
    target: 'minor',
    jsonUpgraded: true,
    cwd: WORKING_DIR,
  })) ?? {}) as Record<string, string>

  return { updatePkgs }
}

export async function updateAll(): Promise<{ updatePkgs: Record<string, string> }> {
  const { updatePkgs } = await checkUpdates()
  if (Object.keys(updatePkgs).length === 0) {
    return { updatePkgs }
  }

  await patchWdPackageJsonDeps(updatePkgs)
  await overrideLocalMNLock({ installed: false })
  rebootSystem()
  return { updatePkgs }
}

export const NPM_REGISTRY =
  process.env.npm_config_registry ??
  process.env.NPM_CONFIG_REGISTRY ??
  (() => {
    const randomCasedEnvVarName = Object.keys(process.env).find(
      _ => _.toLowerCase() === 'npm_config_registry',
    )
    return randomCasedEnvVarName ? process.env[randomCasedEnvVarName] : undefined
  })() ??
  ((await execa('npm', ['get', 'registry'], { cwd: WORKING_DIR, timeout: 1000 })).stdout ||
    'https://registry.npmjs.org/')
