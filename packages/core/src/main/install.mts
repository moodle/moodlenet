import { mkdir } from 'fs/promises'
import { resolve } from 'path'
import { SYSTEM_DIR, WORKING_DIR, writeSysCurrPackagejson } from './env.mjs'
import { getPkgModulePaths } from '../pkg-mng/lib/pkg.mjs'
import execa from 'execa'
import { NPM_REGISTRY } from '../pkg-mng/lib/npm.mjs'
export const defaultCorePackages = [
  'core',
  'arangodb',
  'key-value-store',
  'crypto',
  'authentication-manager',
  'http-server',
  'organization',
  'content-graph',
  'email-service',
  'react-app',
  'extensions-manager',
  'simple-email-auth',
  // 'web-user',
  // 'passport-auth',
  // 'test-extension',
  // 'test-extension-2',
]

await mkdir(WORKING_DIR, { recursive: true })

// assert(
//   !(await readdir(SYSTEM_DIR, { withFileTypes: true })).length,
//   `won't install system in not-empty dir ${SYSTEM_DIR}`,
// )

await mkdir(SYSTEM_DIR, { recursive: true })
// assert(
//   !(await readdir(WORKING_DIR, { withFileTypes: true })).length,
//   `won't install deployment in not-empty dir ${WORKING_DIR}`,
// )
const sysPkgJson = await freshInstallPkgJson()

await writeSysCurrPackagejson(sysPkgJson)

async function freshInstallPkgJson() {
  const myModPaths = getPkgModulePaths(import.meta)
  const defaultCorePackageWithVersion = await Promise.all(
    defaultCorePackages.map(async pkgName => {
      const fullPkgName = `@moodlenet/${pkgName}`
      const version = process.env.USE_LOCAL_REPO
        ? `file:${resolve(myModPaths.moduleDir, '..', '..', '..', pkgName)}`
        : (
            await execa('npm', [
              'view',
              fullPkgName,
              'dist-tags.latest',
              '--registry',
              NPM_REGISTRY,
            ])
          ).stdout
      return {
        fullPkgName,
        version,
      }
    }),
  )

  const dependencies = defaultCorePackageWithVersion.reduce<Record<string, string>>(
    (_, { fullPkgName, version }) => {
      return {
        ..._,
        [fullPkgName]: version,
      }
    },
    {},
  )
  return {
    dependencies,
  }
}
