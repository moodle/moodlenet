import execa from 'execa'
import { run } from 'npm-check-updates'
import {
  MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES,
  NPM_REGISTRY,
  patchWdPackageJsonDeps,
  WORKING_DIR,
} from '../../main/env.mjs'
import { rebootSystem } from '../../main/sys.mjs'
import { PkgIdentifier } from '../../types.mjs'
import { InstallPkgReq } from '../types.mjs'

export { NPM_REGISTRY } from '../../main/env.mjs'

export async function uninstall(pkgIds: PkgIdentifier[]) {
  // TODO: any check on pkgIds ? (active / version)
  const uninstallPkgsArgs = pkgIds.map(({ name }) => name)
  await execa('npm', ['uninstall', ...uninstallPkgsArgs], {
    cwd: WORKING_DIR,
    timeout: 600000,
  })
  rebootSystem()
}

export async function install(installPkgReqs: InstallPkgReq[]) {
  const installPkgsArgs = await Promise.all(
    installPkgReqs.flatMap(async instReq => {
      if (instReq.type === 'pack-folder') {
        return `file:${instReq.fromFolder}`
      } else if (instReq.type === 'npm') {
        return `${instReq.pkgId.name}@${instReq.pkgId.version}`
      }
      throw new Error(`unexpected installPkgReq type ${(instReq as any).type}`)
    }),
  )
  await execa(
    MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES ? 'npx' : 'npm',
    [
      ...(MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES ? ['-y', 'npm@8'] : []),
      'install',
      '--registry',
      NPM_REGISTRY,
      ...(MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES ? [] : ['--install-links']),
      ...installPkgsArgs,
    ],
    {
      cwd: WORKING_DIR,
      timeout: 600000,
      stdout: process.stdout,
    },
  )
  rebootSystem()
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
  rebootSystem()
  return { updatePkgs }
}

// export const NPM_REGISTRY = (
//   process.env.npm_config_registry ??
//   process.env.NPM_CONFIG_REGISTRY ??
//   (() => {
//     const randomCasedEnvVarName = Object.keys(process.env).find(
//       _ => _.toLowerCase() === 'npm_config_registry',
//     )
//     return randomCasedEnvVarName ? process.env[randomCasedEnvVarName] : undefined
//   })() ??
//   ((await execa('npm', ['get', 'registry'], { cwd: WORKING_DIR, timeout: 10e3 })).stdout ||
//     'https://registry.npmjs.org/')
// ).replace(/\/$/, '')
