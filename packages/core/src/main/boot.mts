import execa from 'execa'
import { constants as FS_CONST } from 'fs'
import { access, cp, readFile } from 'fs/promises'
import { resolve } from 'path'
import { NPM_REGISTRY } from '../main.mjs'
import { getPackageInfo } from '../pkg-mng/lib/pkg.mjs'
import {
  IS_DEVELOPMENT,
  WORKING_DIR,
  readSysCurrPackagejson,
  WD_PACKAGEJSON_PATH,
  SYS_CURR_PACKAGEJSON_PATH,
} from './env.mjs'

process.on('error', err => {
  console.error(err)
  err instanceof Error && console.error(err.stack)
  if (!IS_DEVELOPMENT) {
    return
  }
  process.exit()
})

await ensureInstallSysPackages()

const systemPkgInfo = await readSysCurrPackagejson()

const imports = Object.entries(systemPkgInfo.dependencies ?? {}).map(
  async ([pkgName, pkgVersion]) => {
    const { pkgRootDir, packageJson } = await getPackageInfo({
      pkgId: { name: pkgName, version: pkgVersion },
    })
    console.log(`-- IMPORTING package ${pkgName}@${pkgVersion} ... --`)
    return import(resolve(pkgRootDir, packageJson.main ?? '')).then(() =>
      console.log(`-- IMPORTED package ${pkgName}@${pkgVersion} --`),
    )
  },
)

await Promise.all(imports)

console.log('\n------- ALL PACKAGES IMPORTED -------', '\n')

async function ensureInstallSysPackages() {
  const wdPackagejsonExists = await access(WD_PACKAGEJSON_PATH, FS_CONST.R_OK).then(
    () => true,
    () => false,
  )

  const [syspkgjsonstr, wdpkgjsonstr] = await Promise.all([
    readSysCurrPackagejson(),
    wdPackagejsonExists ? readFile(WD_PACKAGEJSON_PATH, 'utf-8') : '',
  ])

  if (syspkgjsonstr === wdpkgjsonstr) {
    console.log('no change on system packages ...')
    return
  }
  console.log('installing system packages ...')
  await cp(SYS_CURR_PACKAGEJSON_PATH, WD_PACKAGEJSON_PATH)
  await execa('npm', ['install', '-y', '--registry', NPM_REGISTRY], {
    cwd: WORKING_DIR,
    stdout: process.stdout,
  })
}
