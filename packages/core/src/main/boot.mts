import { resolve } from 'path'
import { getPackageInfo, getPackageInfoIn } from '../pkg-mng/lib.mjs'
import { WORKING_DIR } from './env.mjs'

process.on('error', err => {
  console.error(err)
  err instanceof Error && console.error(err.stack)
  process.exit()
})

const systemPkgInfo = await getPackageInfoIn({ pkgRootDir: WORKING_DIR })
const imports = Object.keys(systemPkgInfo.packageJson.dependencies ?? {}).map(async pkgName => {
  const { pkgRootDir, packageJson } = await getPackageInfo({ pkgId: { name: pkgName } })
  console.log(`-- connecting  ${pkgName} ... --`)
  return import(resolve(pkgRootDir, packageJson.main ?? '')).then(() =>
    console.log(`-- CONNECTED ${pkgName}  --\n`),
  )
})

await Promise.all(imports)

console.log('\n------- all packages connected -------', '\n')
