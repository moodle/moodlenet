import execa from 'execa'
import { run } from 'npm-check-updates'
import {
  coreConfigs,
  ignites,
  MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES,
  patchWdPackageJsonDeps,
} from '../../main/env.mjs'
import { rebootSystem } from '../../main/sys.mjs'
import type { PkgIdentifier } from '../../types.mjs'
import type { InstallPkgReq } from '../types.mjs'

export async function uninstall(pkgIds: PkgIdentifier[]) {
  // TODO @ALE: any check on pkgIds ? (active / version)
  const uninstallPkgsArgs = pkgIds.map(({ name }) => name)
  await execa('npm', ['uninstall', ...uninstallPkgsArgs], {
    cwd: ignites.rootDir,
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
      coreConfigs.npmRegistry,
      ...(MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES ? [] : ['--install-links']),
      ...installPkgsArgs,
    ],
    {
      cwd: ignites.rootDir,
      timeout: 600000,
      stdout: process.stdout,
    },
  )
  rebootSystem()
}

export async function checkUpdates(): Promise<{ updatePkgs: Record<string, string> }> {
  const updatePkgs = ((await run({
    registry: coreConfigs.npmRegistry,
    target: 'minor',
    jsonUpgraded: true,
    cwd: ignites.rootDir,
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
