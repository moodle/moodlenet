import assert from 'assert'
import execa from 'execa'
import { mkdir, readdir } from 'fs/promises'
import { resolve } from 'path'
import { InstallPkgReq } from '../pkg-mng/types.mjs'
import { install } from '../pkg-mng/lib/npm.mjs'
import { IS_DEVELOPMENT, WORKING_DIR } from './env.mjs'
import { getPkgModulePaths } from '../pkg-mng/lib/pkg.mjs'

export const defaultCorePackages = {
  'core': '0.1.0',
  'arangodb': '0.1.0',
  'key-value-store': '0.1.0',
  'crypto': '0.1.0',
  'authentication-manager': '0.1.0',
  'http-server': '0.1.0',
  'organization': '0.1.0',
  'content-graph': '0.1.0',
  'email-service': '0.1.0',
  'react-app': '0.1.0',
  // 'web-user': '0.1.0',
  'extensions-manager': '0.1.0',
  'simple-email-auth': '0.1.0',
  // 'test-extension': '0.1.0',
  // 'test-extension-2': '0.1.0',
  // 'passport-auth': '0.1.0',
}

await mkdir(WORKING_DIR, { recursive: true })
const dir = await readdir(WORKING_DIR, {
  withFileTypes: true,
})
assert(!dir.length, `won't install in not-empty dir ${WORKING_DIR}`)

await execa('npm', ['-y', 'init'], {
  cwd: WORKING_DIR,
  timeout: 15,
})

const myModPaths = getPkgModulePaths(import.meta)
const installPkgReqs = Object.entries(defaultCorePackages).map<InstallPkgReq>(
  ([pkgName, pkgVersion]) =>
    IS_DEVELOPMENT
      ? {
          type: 'symlink',
          fromFolder: resolve(myModPaths.moduleDir, '..', '..', '..', pkgName),
        }
      : { type: 'npm', pkgId: { name: `@moodlenet/${pkgName}`, version: pkgVersion } },
)
await install(installPkgReqs)
