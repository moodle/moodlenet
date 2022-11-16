import { run } from 'npm-check-updates'
import { WORKING_DIR, writeWdPackageJson } from '../../main/env.mjs'
import { PkgIdentifier } from '../../types.mjs'
import execa from 'execa'
import { InstallPkgReq } from '../types.mjs'

export async function uninstall(pkgIds: PkgIdentifier[]) {
  // TODO: any check on pkgIds ? (active / version)
  const uninstallPkgsArgs = pkgIds.map(({ name }) => name)
  await execa('npm', ['uninstall', ...uninstallPkgsArgs], {
    cwd: WORKING_DIR,
    timeout: 600000,
  })
}

export async function install(installPkgReqs: InstallPkgReq[]) {
  const installPkgsArgs = installPkgReqs.map(instReq =>
    instReq.type === 'npm'
      ? `${instReq.pkgId.name}@${instReq.pkgId.version}`
      : `file:${instReq.fromFolder}`,
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

export async function updateAll(): Promise<Record<string, string>> {
  const { updatePkgs: dependencies } = await checkUpdates()

  await writeWdPackageJson({ dependencies })

  return dependencies
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
