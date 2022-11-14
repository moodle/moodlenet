import assert from 'assert'
import execa from 'execa'
import { mkdir, readdir } from 'fs/promises'
import { resolve } from 'path'
import { InstallPkgReq } from '../pkg-mng/types.mjs'
import { install } from '../pkg-mng/lib/npm.mjs'
import { IS_DEVELOPMENT, WORKING_DIR } from './env.mjs'
import { getPkgModulePaths } from '../pkg-mng/lib/pkg.mjs'
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
  // 'web-user',
  'extensions-manager',
  'simple-email-auth',
  // 'test-extension',
  // 'test-extension-2',
  // 'passport-auth',
]
const removePkgFields = ['description', 'main', 'scripts', 'keywords', 'author', 'license']

await mkdir(WORKING_DIR, { recursive: true })
const dir = await readdir(WORKING_DIR, {
  withFileTypes: true,
})
assert(!dir.length, `won't install in not-empty dir ${WORKING_DIR}`)

await execa('npm', ['-y', 'init'], {
  cwd: WORKING_DIR,
  timeout: 5000,
})

await Promise.all(
  removePkgFields.map(unsetKey =>
    execa('npm', ['pkg', 'delete', unsetKey], {
      cwd: WORKING_DIR,
      timeout: 5000,
    }),
  ),
)

const myModPaths = getPkgModulePaths(import.meta)
const installPkgReqs = defaultCorePackages.map<InstallPkgReq>(pkgName =>
  IS_DEVELOPMENT && process.env.USE_LOCAL_REPO
    ? {
        type: 'symlink',
        fromFolder: resolve(myModPaths.moduleDir, '..', '..', '..', pkgName),
      }
    : { type: 'npm', pkgId: { name: `@moodlenet/${pkgName}`, version: 'latest' } },
)
await install(installPkgReqs)
