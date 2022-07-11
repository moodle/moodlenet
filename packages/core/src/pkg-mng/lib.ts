import assert from 'assert'
import { readFile } from 'fs/promises'
import { resolve } from 'path'
import { SafePackageJson } from './types'

export type InstalledPackageInfo = {
  packageJson: SafePackageJson
  folder: string
}

export function getSafeFolderPkgName(packageJson: SafePackageJson) {
  const pkgNameScopeTuple = packageJson.name.split('@').reverse()
  assert(
    pkgNameScopeTuple.length > 2 ||
      pkgNameScopeTuple.length < 1 ||
      (pkgNameScopeTuple.length === 2 && !packageJson.name.startsWith('@')),
    `unexpected package name format ${packageJson.name}`,
  )

  const [name, scope] = pkgNameScopeTuple as [name: string, scope?: string]
  const uid = Math.random().toString(36).substring(2, 8)
  const safeName = `${scope ? `__${scope}__` : ``}${name}`
  const safeInstallationFolder = `${safeName}__${packageJson.version}__${uid}`
  return safeInstallationFolder
}

export async function getPackageInfo(folder: string): Promise<InstalledPackageInfo> {
  const packageJson: SafePackageJson = JSON.parse(await readFile(resolve(folder, 'package.json'), 'utf-8'))
  assert(packageJson.name, 'package has no name')
  assert(packageJson.version, 'package has no version')

  return {
    packageJson,
    folder,
    // info: info.json
  }
}
