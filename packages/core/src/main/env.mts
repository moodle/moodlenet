import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import { readFile, writeFile } from 'fs/promises'

import { resolve } from 'path'
import { PackageJson } from 'type-fest'

export const DOTENV_PATH = process.env.MOODLENET_CORE_DOTENV_PATH
const base_env = dotenv.config({
  path: DOTENV_PATH,
  debug: true,
})
expand(base_env)

export const WORKING_DIR = process.cwd()
export const NODE_ENV = process.env.NODE_ENV
export const MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES =
  process.env.MOODLENET_CORE_DEV_LOCAL_FOLDER_PACKAGES === 'true'

export const IS_DEVELOPMENT = NODE_ENV === 'development'
export const WD_PACKAGEJSON_PATH = resolve(WORKING_DIR, 'package.json')

export async function readWdPackageJson(): Promise<PackageJson> {
  const wdPackageJsonStr = await readFile(WD_PACKAGEJSON_PATH, { encoding: 'utf8' })
  const wdPackageJson = JSON.parse(wdPackageJsonStr)
  return wdPackageJson
}

export async function writeWdPackageJson(pkgJson: PackageJson): Promise<void> {
  const wdPackageJsonStr = JSON.stringify(pkgJson, null, 2)
  await writeFile(WD_PACKAGEJSON_PATH, wdPackageJsonStr, { encoding: 'utf8' })
}

export async function patchWdPackageJsonDeps(
  dependenciesPatch: PackageJson['dependencies'],
): Promise<void> {
  const wdPackageJson = await readWdPackageJson()
  await writeWdPackageJson({
    ...wdPackageJson,
    dependencies: {
      ...wdPackageJson.dependencies,
      ...dependenciesPatch,
    },
  })
}
