import { writeFile } from 'fs/promises'

import { resolve } from 'path'
import type { PackageJson } from 'type-fest'
import {
  MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES as _MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES,
  getCoreConfigs,
  getIgnites,
} from '../ignite.mjs'

export const MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES = _MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES

export const ignites = getIgnites()

export const coreConfigs = getCoreConfigs()

export async function writeWdPackageJson(pkgJson: PackageJson): Promise<void> {
  const wdPackageJsonStr = JSON.stringify(pkgJson, null, 2)
  await writeFile(resolve(ignites.rootDir, 'package.json'), wdPackageJsonStr, { encoding: 'utf8' })
}

export async function patchWdPackageJsonDeps(
  dependenciesPatch: PackageJson['dependencies'],
): Promise<void> {
  await writeWdPackageJson({
    ...ignites.rootPkgJson,
    dependencies: {
      ...ignites.rootPkgJson.dependencies,
      ...dependenciesPatch,
    },
  })
}
