import execa from 'execa'
import { resolve } from 'path'
import { NPM_REGISTRY } from '../main.mjs'
import { getPackageInfo } from '../pkg-mng/lib/pkg.mjs'
import { IS_DEVELOPMENT, WORKING_DIR, readWdPackageJson } from './env.mjs'
import { overrideLocalMNLock, readLocalMNLock } from './MNLock.mjs'

process.on('error', err => {
  console.error(err)
  err instanceof Error && console.error(err.stack)
  if (!IS_DEVELOPMENT) {
    return
  }
  process.exit()
})

await ensureInstallPackages()

const systemPkgInfo = await readWdPackageJson()

const imports = Object.entries(systemPkgInfo.dependencies ?? {}).map(
  async ([pkgName, pkgVersion]) => {
    const { pkgRootDir, packageJson } = await getPackageInfo({
      pkgId: { name: pkgName, version: pkgVersion },
    })
    console.log(`-- IMPORTING package ${pkgName}@${pkgVersion} --`)
    return import(resolve(pkgRootDir, packageJson.main ?? '')).then(() =>
      console.log(`-- IMPORTED package ${pkgName}@${pkgVersion} --`),
    )
  },
)

await Promise.all(imports)

console.log('\n------- ALL PACKAGES IMPORTED -------\n')

process.send?.('ready')

async function ensureInstallPackages() {
  if ((await readLocalMNLock()).installed) {
    return
  }

  console.log('installing system packages ...')
  await execa('npm', ['install', '-y', '--registry', NPM_REGISTRY], {
    cwd: WORKING_DIR,
    stdout: process.stdout,
  })
  await overrideLocalMNLock({ installed: true })
}
