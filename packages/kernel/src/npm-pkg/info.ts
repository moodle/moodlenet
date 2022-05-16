import { dirname, resolve } from 'path'
import { sync as packageDirectorySync } from 'pkg-dir'
import type { PackageJson as NodePackageJson } from 'type-fest'
import type { PkgDiskInfo } from '../types'

export function pkgDiskInfoOf(mainModPath: string): PkgDiskInfo {
  const main_mod_dir = dirname(mainModPath)
  try {
    const rootDir = packageDirectorySync(main_mod_dir)
    if (!rootDir) {
      throw new Error(`couldn't find or invalid package.json for main_mod_dir:${main_mod_dir}`)
    }

    const pkgJson: NodePackageJson = require(resolve(rootDir, 'package.json'))
    const name = pkgJson.name
    const version = pkgJson.version
    if (!name) {
      throw new Error(`package.json for module ${rootDir} has no name set`)
    }
    if (!version) {
      throw new Error(`package.json for module ${rootDir} has no version set`)
    }
    const pkgInfo: PkgDiskInfo = { rootDir, mainModPath, name, version }
    return pkgInfo
  } catch (e) {
    const cause = e instanceof Error ? e : new Error(String(e))
    throw new Error(`couldn't get PkgDiskInfo for mainModPath:${mainModPath}`, { cause })
  }
}
