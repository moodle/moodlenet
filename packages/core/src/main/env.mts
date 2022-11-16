import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'
import { readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { PackageJson } from 'type-fest'

export const DOTENV_PATH = process.env.MOODLENET_CORE_DOTENV_PATH ?? process.cwd()
const base_env = dotenv.config({
  path: DOTENV_PATH,
  debug: true,
})
expand(base_env)

export const WORKING_DIR = resolve(process.cwd(), process.env.MOODLENET_CORE_WORKING_DIR ?? '.')
export const SYSTEM_DIR = resolve(WORKING_DIR, process.env.MOODLENET_CORE_SYSTEM_DIR ?? 'system')
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

export const SYS_CURR_PACKAGEJSON_PATH = resolve(SYSTEM_DIR, 'current-package.json')
export const WD_PACKAGEJSON_PATH = resolve(WORKING_DIR, 'package.json')

export async function readSysCurrPackagejson(): Promise<PackageJson> {
  const sysCurrPackagejson = JSON.parse(
    await readFile(SYS_CURR_PACKAGEJSON_PATH, { encoding: 'utf8' }),
  )
  // TODO: ¿ checks on sysCurrPackagejson ?
  return sysCurrPackagejson
}

export async function writeSysCurrPackagejson(pkgJson: PackageJson): Promise<void> {
  writeFile(SYS_CURR_PACKAGEJSON_PATH, JSON.stringify(pkgJson, null, 2), {
    encoding: 'utf8',
  })
}
