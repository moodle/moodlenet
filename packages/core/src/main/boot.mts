import { resolve } from 'path'
import { getPackageInfo, getPackageInfoIn } from '../pkg-mng/lib/pkg.mjs'
import { IS_DEVELOPMENT, WORKING_DIR } from './env.mjs'

process.on('error', err => {
  console.error(err)
  err instanceof Error && console.error(err.stack)
  if (!IS_DEVELOPMENT) {
    process.exit()
  }
})

const systemPkgInfo = await getPackageInfoIn({ pkgRootDir: WORKING_DIR })
const imports = Object.entries(systemPkgInfo.packageJson.dependencies ?? {}).map(
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
