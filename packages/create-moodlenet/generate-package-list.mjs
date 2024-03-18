import { readFileSync, writeFileSync } from 'fs'
const defaultCorePackagesModuleFileName = 'bin/defaultCorePackages.mjs'

const defaultCorePackagesNames = [
  'core',
  'arangodb',
  'crypto',
  'http-server',
  'organization',
  'system-entities',
  'email-service',
  'react-app',
  'extensions-manager',
  'simple-email-auth',
  'openid',
  'ed-resource',
  'collection',
  'web-user',
  'ed-meta',
  'moodle-lms-integration',
]

export const defaultCorePackagesLinesString = defaultCorePackagesNames.reduce((_, pkgName) => {
  const pkgJson = JSON.parse(readFileSync(`../${pkgName}/package.json`, 'utf8'))
  const pkgVersion = `^${pkgJson.version}`
  return `${_}
  '${pkgName}': '${pkgVersion}',`
}, '')

writeFileSync(
  defaultCorePackagesModuleFileName,
  `export const defaultCorePackages = {${defaultCorePackagesLinesString}
}
`,
  'utf-8',
)
